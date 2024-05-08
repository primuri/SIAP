import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { Back } from "../../utils/Back"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerSesiones, obtenerNumeroAcuerdos, agregarSesion, editarSesion, agregarDocumento, addActa, addConvocatoria, addAgenda, editarDocumento, editarAgenda, eliminarActa, eliminarDocumento} from "../../api/gestionOrganosColegiados"
import { obtenerOrganosColegiados, agregarOrganoColegiado, editarOrganoColegiado, eliminarOrganoColegiado } from "../../api/gestionOrganosColegiados"
import { agregarIntegrante, obtenerIntegrantes, eliminarIntegrante, editarIntegrante, agregarVigencia, editarVigencia, eliminarVigencia, agregarOficio, editarOficio, eliminarOficio } from "../../api/gestionIntegranteOrganoColegiado"
import { OrganosColegiadosForm } from "../../components/GestionOrganosColegiados/OrganosColegiadosForm"
import { ReportButton } from "../../utils/ReportButton";

export const GestionOrganosColegiados = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const location = useLocation()
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [reload, setReload] = useState(false)
    const [cargado, setCargado] = useState(false)
    const [OrganoColegiado, setOrganoColegiado] = useState(null)
    const [OrganosColegiados, setOrganosColegiados] = useState([])
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const [error, setError] = useState(false)
    const columns = ['Nombre', 'Quorum', 'Cantidad de integrantes', 'Acuerdo en firme', 'Integrantes', 'Sesiones']
    const dataKeys = ['nombre', 'quorum', 'numero_miembros', 'acuerdo_firme', '', '']
    const rol = user.groups[0]

    const [JsonForReport, setJsonForReport] = useState({ reportData: {}, reportTitle: {}, colNames: {}, dataKeys: {}, idKey: {} })
    const [JsonIsReady, setJsonIsReady] = useState(false)


    const createJsonForReport = async () => {
        JsonForReport.reportTitle = "Órgano colegiado"
        JsonForReport.idKey = "id_organo_colegiado"

        JsonForReport.dataKeys = [
            'id_organo_colegiado',
            'nombre',
            'numero_miembros',
            'quorum',
            'acuerdo_firme',
            ['nombre_integrante', 'inicio_funciones', 'puesto', 'id_oficio_fk.id_oficio', 'normativa_reguladora'],
            ['fecha', 'medio', 'id_acta_fk.id_documento_acta_fk.detalle', 'n_acuerdos']
        ]

        JsonForReport.colNames = [
            'ID órgano colegiado',
            'Nombre',
            'Numero miembros',
            'Quorum',
            'Acuerdo firme',
            { 'tableName': 'Integrantes', 'colNames': ['Integrante', 'Inicio', 'Puesto', 'Número oficio', 'Normativa reguladora'] },
            { 'tableName': 'Sesiones', 'colNames': ['Fecha', 'Medio','Detalle acta', 'Cantidad acuerdos'] }
        ]

        JsonForReport.reportData = OrganosColegiados
        
        await configureReportData()
        setJsonIsReady(true)
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split('T')[0];
      }

      function formatearFecha(sesiones) {
        return sesiones.map(sesion => {
            const fechaISO = sesion.fecha;
            if (!fechaISO) {
                return { ...sesion, fecha: "" }; 
            }
            const dateObj = new Date(fechaISO);
            
            const fechaFormateada = dateObj.toLocaleDateString('en-CA', { timeZone: 'UTC' });
            return { ...sesion, fecha: fechaFormateada };
        });
    }

    const configureReportData = async () => {
        
        if (JsonForReport.reportData.length > 0) {
            try {
                const promises = OrganosColegiados.map(async (organo) => {
                    const response1 = await obtenerIntegrantes(localStorage.getItem('token'));
                    const formattedAndFilteredData = response1.data.map(item => ({
                        ...item,
                        inicio_funciones: item.inicio_funciones ? formatDate(item.inicio_funciones) : 'No especificado'
                    })).filter(item => {
                        return Number(item.id_organo_colegiado_fk.id_organo_colegiado) === Number(organo.id_organo_colegiado);
                    });

                    const response2 = await obtenerSesiones(localStorage.getItem('token'));
                    const sesionesFiltradas = response2.data.filter(sesion => sesion.id_organo_colegiado_fk.id_organo_colegiado == parseInt(organo.id_organo_colegiado));
                    const sesionesConFechaFormateada = formatearFecha(sesionesFiltradas);
                    for (const sesion of sesionesConFechaFormateada) {
                        const n_acuerdos = await obtenerNumeroAcuerdos(sesion.id_sesion);
                        sesion.n_acuerdos = n_acuerdos;
                    }

                    organo[JsonForReport.colNames.length - 2] = formattedAndFilteredData;
                    organo[JsonForReport.colNames.length - 1] = sesionesConFechaFormateada;

                    return organo;
                });

                const organosCompletos = await Promise.all(promises);

                JsonForReport.reportData = organosCompletos;

                return true
            } catch (error) {
                console.log(error)
                return false
            }
        }else{
            return false
        }

    }

    useEffect(() => {
        setJsonIsReady(false)
        createJsonForReport()
    }, [OrganosColegiados])


    if (rol !== "administrador" && rol !== "invitado") {
        setError(true);
    }

    useEffect(() => {
        async function fetchData() {
            loadOrganosColegiados()
            setCargado(true);
        }
        fetchData();
    }, [reload]);

    async function loadOrganosColegiados() {
        try {
            const response = await obtenerOrganosColegiados(localStorage.getItem('token'))
            setData(response.data)
            setOrganosColegiados(response.data)
            setCargado(true)
        } catch (error) {
        }
    }

    const addOrganoColegiado = async (formData) => {

        var toastId = toastProcesando("Agregando...")

        try {

            const Data = JSON.parse(formData)

            await agregarOrganoColegiado(Data, localStorage.getItem("token"))

            setAddClick(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');

            toastExito("Órgano colegiado agregado correctamente", toastId)

        } catch (error) {
            console.error("Error: \n" + error)
            toast.dismiss(toastId)
        }
    }


    const editOrganoColegiado = async (formData) => {

        var toastId = toastProcesando("Editando...")

        try {
            const Data = JSON.parse(formData)
            await editarOrganoColegiado(Data.id_organo_colegiado, Data, localStorage.getItem("token"))

            setEdit(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');

            toastExito("Órgano colegiado editado correctamente", toastId)

        } catch (error) {
            console.error("Error: \n" + error)
            toast.dismiss(toastId)
        }
    }

    const deleteOrganoColegiado = async (organo_colegiado) => {

        var toastId = toastProcesando("Eliminando...")

        try {
            await eliminarOrganoColegiado(organo_colegiado.id_organo_colegiado, localStorage.getItem('token'))

            setEdit(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');

            toast.success('Órgano colegiado eliminado correctamente', {
                id: toastId,
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })

        } catch (error) {
            console.error("Error: \n" + error)
            toast.dismiss(toastId)
        }
        setEdit(false)
    }

    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
        document.body.classList.remove('modal-open');
    }

    const addClicked = () => {
        setAddClick(true)
        setEdit(false)
        document.body.classList.add('modal-open');
    }

    const elementClicked = (selectedOrganoColegiado) => {
        setOrganoColegiado(selectedOrganoColegiado);
        setEdit(true);
        setAddClick(false);
        document.body.classList.add('modal-open');
    };

    const elementClickedBtnIntegrantes = (selectedOrganoColegiado) => {
        setOrganoColegiado(selectedOrganoColegiado);
        console.log(selectedOrganoColegiado)
        if (event.target.tagName.toLowerCase() === 'button') {
            navigate(`${location.pathname}/o_id=${selectedOrganoColegiado.id_organo_colegiado}/gestion-integrantes`)
        }
    }

    const elementClickedBtnSesiones = (selectedOrganoColegiado) => {
        setOrganoColegiado(selectedOrganoColegiado);
        console.log(selectedOrganoColegiado.id_organo_colegiado)
        if (event.target.tagName.toLowerCase() === 'button') {
            navigate(`${location.pathname}/o_id=${selectedOrganoColegiado.id_organo_colegiado}/gestion-sesiones`)
        }
    }

    function getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }
    const search = (col, filter) => {
        const matches = data.filter((e) => {
            if (col.includes('.')) {
                const value = getValueByPath(e, col)
                return value && value.toString().includes(filter)
            }
            return e[col].toString().includes(filter)
        })
        setJsonIsReady(false)
        setOrganosColegiados(matches)
    }

    function toastProcesando(mensaje) {
        var toastId = toast.loading(mensaje, {
            position: 'bottom-right',
            style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
                fontSize: '18px',
            },
        });

        return toastId
    }

    function toastExito(mensaje, toastId) {
        toast.success(mensaje, {
            id: toastId,
            duration: 1000,
            position: 'bottom-right',
            style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
            },
        })
    }

    return (
        <main>
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">

                    {user.groups[0] === "administrador" && (
                        <div className=" flex-row">
                            <h1>Gestión de órganos colegiados</h1>
                        </div>
                    )}

                    {user.groups[0] === "invitado" && (
                        <div className=" flex-row">
                            <h1>Órganos colegiados</h1>
                        </div>
                    )}

                    {(!cargado) && (
                        <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                    )}


                    {user.groups[0] === "administrador" && (
                        <div className="d-flex mt-4">
                            <div className="col">
                                <Add onClick={addClicked}></Add>
                            </div>
                            {(JsonIsReady && (<ReportButton reportData={JsonForReport.reportData} reportTitle={JsonForReport.reportTitle} colNames={JsonForReport.colNames} dataKeys={JsonForReport.dataKeys} idKey={JsonForReport.idKey}></ReportButton>))}
                            <Search colNames={columns.slice(0, -2)} columns={dataKeys.slice(0, -2)} onSearch={search} />
                        </div>
                    )}

                    {user.groups[0] === "invitado" && (
                        <div className="d-flex justify-content-between mt-4">
                            <Search colNames={columns.slice(0, -2)} columns={dataKeys.slice(0, -2)} onSearch={search} />
                        </div>
                    )}

                    {user.groups[0] === "administrador" && (
                        <Table columns={columns} data={OrganosColegiados} dataKeys={dataKeys} onDoubleClick={elementClicked} hasButtonColumn={true} hasButtonColumn2={true} onClickButton1={elementClickedBtnIntegrantes} onClickButton2={elementClickedBtnSesiones} buttonText="Gestionar" />
                    )}

                    {user.groups[0] === "invitado" && (
                        <Table columns={columns} data={OrganosColegiados} dataKeys={dataKeys} onDoubleClick={elementClicked} hasButtonColumn={true} hasButtonColumn2={true} onClickButton1={elementClickedBtnIntegrantes} onClickButton2={elementClickedBtnSesiones} buttonText="Visualizar" />
                    )}

                    {addClick && (
                        <Modal><OrganosColegiadosForm onSubmit={addOrganoColegiado} onCancel={onCancel} mode={1} rol={rol}></OrganosColegiadosForm></Modal>
                    )}

                    {edit && (
                        <Modal>
                            <OrganosColegiadosForm
                                mode={2}
                                onSubmit={editOrganoColegiado}
                                onCancel={onCancel}
                                onDelete={() => deleteOrganoColegiado(OrganoColegiado)}
                                organo_colegiado={OrganoColegiado}
                                rol={rol}
                            >
                            </OrganosColegiadosForm>
                        </Modal>
                    )}
                    <Toaster></Toaster>
                </div>
            ) : (
                <PermisoDenegado></PermisoDenegado>
            )}
        </main>
    );

}    