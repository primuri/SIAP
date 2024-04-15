import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Add } from "../../../utils/Add"
import { Modal } from "../../../utils/Modal"
import { Table } from "../../../utils/Table"
import { Search } from "../../../utils/Search"
import { PermisoDenegado } from "../../../utils/PermisoDenegado"
import { Back } from "../../../utils/Back"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerSesiones, obtenerNumeroAcuerdos, agregarSesion, editarSesion, eliminarSesion} from "../../../api/gestionOrganosColegiados"
import { OrganosColegiadosSesionesForm  } from "../../../components/GestionOrganosColegiados/OrganosColegiadosSesionesForm"

export const GestionSesionesOrganosColegiados= () => {
                                                             
    const user = JSON.parse(localStorage.getItem('user'))  
    
    const {IdOrganoC} = useParams() 
    const location = useLocation()
    const navigate = useNavigate()

    const [data, setData] = useState([]) 
    const [reload, setReload] = useState(false)   
    const [cargado, setCargado] = useState(false)   
    const [sesion, setSesion] = useState(null)                                
    const [sesiones, setSesiones] = useState([])   
                        
    const [addClick, setAddClick] = useState(false)                              
    const [edit, setEdit] = useState(false)                                      
    const [error, setError] = useState(false)

    const columns = ['Identificador', 'Fecha', 'N acta', 'N Acuerdos', 'Acuerdos']
    const dataKeys = ['id_sesion','fecha', 'id_acta_fk.id_acta', 'n_acuerdos', '']

    user.groups[0] !== "administrador" ? setError(true) : null                   

    useEffect(() => {                                                            
        async function fetchData() {
            loadSesiones()
            setCargado(true);
        }
        fetchData();
    }, [reload]);

    async function loadSesiones() {
        try {
            const response = await obtenerSesiones(localStorage.getItem('token'));
            
            // Filtrar sesiones por IdOrganoC
            const sesionesFiltradas = response.data.filter(sesion => sesion.id_organo_colegiado_fk.id_organo_colegiado == IdOrganoC);
    
            // Añadir n_acuerdos a cada sesión filtrada
            for (const sesion of sesionesFiltradas) {
                const n_acuerdos = await obtenerNumeroAcuerdos(sesion.id_sesion);
                sesion.n_acuerdos = n_acuerdos;
            }
    
            setData(sesionesFiltradas);                                                                 
            setSesiones(sesionesFiltradas);                                                              
            setCargado(true);                                                                        
        } catch (error) {
            console.error(error);
        }
    }

    const addSesiones = async (formData) => {
        
        var toastId = toastProcesando("Agregando...")
        
        try {
            console.log(formData);

            await agregarSesion(formData, IdOrganoC)

            setAddClick(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');

            toastExito("Sesion agregada correctamente", toastId)

        } catch (error) {
            console.error("Error: \n" + error)
            toast.dismiss(toastId)
        }
    }


    const editaSesion = async (formData) => {
    
        var toastId = toastProcesando("Editando...")

        try {
    
            const Data = JSON.parse(formData)
            await editarSesion(Data.id_organo_colegiado, Data, localStorage.getItem("token"))

            setEdit(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');

            toastExito("Evaluación editada correctamente", toastId)

        } catch (error) {
            console.error("Error: \n" + error)
            toast.dismiss(toastId)
        }
    }

    const deleteSesion = async (sesion) => {

        var toastId = toastProcesando("Eliminando...")

        try {
            await eliminarSesion(sesion.id_sesion)

            setEdit(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');

            toast.success('Órgano colegiado eliminado correctamente', {
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

    const elementClicked = (selectedSesion) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            navigate(`${location.pathname}/${selectedSesion.id_sesion}/gestion-acuerdos`)
        } else {
            setSesion(selectedSesion);
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
        setSesiones(matches)
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
                    <div className=" flex-row">
                        <h1>Gestión de Sesiones del Órgano Colegiado</h1>
                    </div>

                    {(!cargado) && (
                        <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                    )}             

                    <div className="d-flex justify-content-between mt-4">
                        <Add onClick={addClicked}></Add>
                        <Search colNames={columns.slice(0, -2)} columns={dataKeys.slice(0, -2)} onSearch={search}></Search>
                    </div>
                    <Table columns={columns} data={sesiones} dataKeys={dataKeys} onDoubleClick ={elementClicked} hasButtonColumn={true} hasButtonColumn2={false} buttonText="Gestionar" />
                    {addClick && (
                        <Modal><OrganosColegiadosSesionesForm onSubmit={addSesiones} onCancel={onCancel} mode={1} organoColegiado={IdOrganoC}></OrganosColegiadosSesionesForm></Modal>
                    )}
                    {edit && (
                        <Modal>
                            <OrganosColegiadosSesionesForm
                                mode={2}
                                onSubmit={editaSesion}
                                onCancel={onCancel}
                                onDelete={() => deleteSesion(sesion)}
                                sesion={sesion}
                                organoColegiado={IdOrganoC}
                            >
                            </OrganosColegiadosSesionesForm>
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
