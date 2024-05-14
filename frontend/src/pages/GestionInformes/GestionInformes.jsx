import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { Back } from "../../utils/Back"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerInforme, agregarInforme, editarInforme, eliminarInforme, buscarVersionProyecto, obtenerInformesProyecto, obtenerInformePorId } from "../../api/gestionInformes"
import { InformesForm } from "../../components/GestionInformes/InformesForm"
import { GestionVersionInforme } from "./GestionVersionInforme"
import { obtenerVersionProyectos } from '../../api/gestionProyectos';

export const GestionInformes = () => {

    const { proyectoID } = useParams();
    const user = JSON.parse(localStorage.getItem('user'))
    const location = useLocation()
    const navigate = useNavigate()
    const [reload, setReload] = useState(false)
    const [informes, setInformes] = useState([])
    const [cargado, setCargado] = useState(false)
    const [data, setData] = useState([])
    const [informe, setInforme] = useState(null)
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const [error, setError] = useState(false)
    const [numVersion, setNumVersion] = useState(null)
    const [id_proyecto, setIdProyecto] = useState(null)
    const columns = ['Identificador', 'Estado', 'Tipo', 'Versiones']
    const dataKeys = ['id_informe', 'estado', 'tipo', 'Versiones']

    const isInvestigador = user.groups.some((grupo) => {
        return grupo === 'investigador';
    });


    useEffect(() => {
        async function fetchData() {
            loadInformes()
            setCargado(true);
            const id_version_proyecto = await loadInformeById(proyectoID);

            setIdProyecto(id_version_proyecto[2]);
            setNumVersion(id_version_proyecto[1]);
        }
        fetchData();
    }, [reload]);

    async function loadInformes() {
        try {
            const response = await obtenerInformesProyecto(localStorage.getItem('token'), proyectoID)
            setData(response.data)
            setInformes(response.data)
            setCargado(true)
        } catch (error) {

        }
    }

    const addInforme = async (formData) => {
        try {

            const Data = JSON.parse(formData)

            Data.id_version_proyecto_fk = proyectoID;
            await agregarInforme(Data, localStorage.getItem("token"))

            toast.success('Informe agregado correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setAddClick(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');

        } catch (error) {
        }
    }

    const editInforme = async (formData) => {
        try {
            const Data = JSON.parse(formData)
            Data.id_version_proyecto_fk = proyectoID;

            await editarInforme(informe.id_informe, Data, localStorage.getItem("token"))
            toast.success('Informe editado correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setEdit(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');
        } catch (error) {

        }
    }

    const deleteInforme = async (informe) => {
        try {
            await eliminarInforme(informe.id_informe, localStorage.getItem('token'))

            toast.success('Informe eliminado correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setEdit(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');
        } catch (error) {

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

    const elementClicked = (selectedInforme) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            navigate(`${location.pathname}/${selectedInforme.id_informe}/gestion-versiones`)
        } else {
            setInforme(selectedInforme);
            setEdit(true);
            setAddClick(false);
            document.body.classList.add('modal-open');
        }
    };

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
        setInformes(matches)
    }


    const volver = () => {
        const pathParts = location.pathname.split('/').filter(part => part !== '');
        const newPathParts = pathParts.slice(0, -2);
        const newPath = `/${newPathParts.join('/')}`;
        navigate(newPath);
    }


    async function loadInformeById(informeId) {
        try {
            const versiones = await obtenerVersionProyectos(localStorage.getItem('token'));
            let idCodigoVi = null;
            let numVersion = null;
            let descripcion = null;

            for (let version of versiones.data) {
                if (version.id_version_proyecto == informeId) {
                    idCodigoVi = version.id_codigo_vi_fk.id_codigo_vi;
                    numVersion = version.numero_version;
                    descripcion = version.id_codigo_vi_fk.id_codigo_cimpa_fk.descripcion;
                    break;
                }
            }

            if (idCodigoVi && numVersion && descripcion) {
                return [idCodigoVi, numVersion, descripcion];
            } else {
                throw new Error('No se encontró una versión de proyecto que coincida con el informe');
            }

        } catch (error) {

            return null;
        }
    }


    return (
        <main>
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <div className=" flex-row">
                        <h1>Gestión de informes de la versión {numVersion} de: </h1>
                        <br></br>
                        <h3>{id_proyecto}</h3>
                    </div>

                    {(!cargado) && (
                        <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                    )}

                    <div className="d-flex justify-content-between mt-4">
                        <div className="col">
                            {!isInvestigador && (<Add onClick={addClicked}></Add>)}
                        </div>
                        <Search colNames={columns.slice(0, -1)} columns={dataKeys.slice(0, -1)} onSearch={search}></Search>
                    </div>
                    <Table columns={columns} data={informes} dataKeys={dataKeys} onDoubleClick={elementClicked} onClickButton2={elementClicked} hasButtonColumn={true} buttonText="Gestionar" />
                    {addClick && (
                        <Modal><InformesForm onSubmit={addInforme} onCancel={onCancel} mode={1}></InformesForm></Modal>
                    )}
                    {edit && (
                        <Modal>
                            <InformesForm
                                mode={2}
                                onSubmit={editInforme}
                                onCancel={onCancel}
                                onDelete={() => deleteInforme(informe)}
                                informe={informe}
                            >
                            </InformesForm>
                        </Modal>
                    )}
                    <Toaster></Toaster>
                    <div className="d-flex justify-content-start">
                        <Back onClick={volver}>Regresar a versión de proyecto</Back>
                    </div>
                </div>
            ) : (
                <PermisoDenegado></PermisoDenegado>
            )}
        </main>
    );

}    
