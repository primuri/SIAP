import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Add } from "../../../utils/Add"
import { Modal } from "../../../utils/Modal"
import { Table } from "../../../utils/Table"
import { Search } from "../../../utils/Search"
import { PermisoDenegado } from "../../../utils/PermisoDenegado"
import { Back } from "../../../utils/Back"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerAcuerdos, editarSesion, eliminarSesion} from "../../../api/gestionOrganosColegiados"
import { OrganosColegiadosAcuerdosForm } from '../../../components/GestionOrganosColegiados/OrganosColegiadosAcuerdosForm';

export const GestionAcuerdos = () => {
                                                             
    const user = JSON.parse(localStorage.getItem('user'))  
    
    const {idSesion} = useParams() 
    const location = useLocation()
    const navigate = useNavigate()

    const [data, setData] = useState([]) 
    const [reload, setReload] = useState(false)   
    const [cargado, setCargado] = useState(false)   
    const [acuerdo, setAcuerdo] = useState(null)                                
    const [acuerdos, setAcuerdos] = useState([])   
                        
    const [addClick, setAddClick] = useState(false)                              
    const [edit, setEdit] = useState(false)                                      
    const [error, setError] = useState(false)

    const columns = ['Identificador', 'Descripción', 'Estado', 'Encargado']
    const dataKeys = ['id_acuerdo','descripcion', 'estado', 'encargado']

    user.groups[0] !== "administrador" ? setError(true) : null                   

    useEffect(() => {                                                            
        async function fetchData() {
            loadAcuerdos()
            setCargado(true);
        }
        fetchData();
    }, [reload]);

    async function loadAcuerdos() {
        try {
            const response = await obtenerAcuerdos();
            // Filtrar sesiones por IdOrganoC
            const acuerdosFiltrados = response.data.filter(acuerdo => acuerdo.id_sesion_fk.id_sesion == idSesion);
    
            // Añadir n_acuerdos a cada sesión filtrad
            setData(acuerdosFiltrados);                                                                 
            setAcuerdos(acuerdosFiltrados);                                                              
            setCargado(true);                                                                        
        } catch (error) {
            console.error(error);
        }
    }

    const addSesiones = async (formData) => {
        
        var toastId = toastProcesando("Agregando...")
        
        try {
            console.log(formData);

            

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

    const elementClicked = (selectedAcuerdo) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            navigate(`${location.pathname}/${selectedAcuerdo.id_sesion}/gestion-acuerdos`)
        } else {
            setAcuerdo(selectedAcuerdo);
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
        setAcuerdos(matches)
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
                        <h1>Gestión de acuerdos de la sesion</h1>
                    </div>

                    {(!cargado) && (
                        <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                    )}             

                    <div className="d-flex justify-content-between mt-4">
                        <Add onClick={addClicked}></Add>
                        <Search colNames={columns.slice(0, -2)} columns={dataKeys.slice(0, -2)} onSearch={search}></Search>
                    </div>
                    <Table columns={columns} data={acuerdos} dataKeys={dataKeys} onDoubleClick ={elementClicked} hasButtonColumn={false} hasButtonColumn2={false} buttonText="Gestionar" />
                    {addClick && (
                        <Modal><OrganosColegiadosAcuerdosForm onSubmit={addSesiones} onCancel={onCancel} mode={1} sesion={idSesion}></OrganosColegiadosAcuerdosForm></Modal>
                    )}
                    {edit && (
                        <Modal>
                            <OrganosColegiadosAcuerdosForm
                                mode={2}
                                onSubmit={editaSesion}
                                onCancel={onCancel}
                                onDelete={() => deleteSesion(acuerdo)}
                                acuerdo={acuerdo}
                                sesion={idSesion}
                            >
                            </OrganosColegiadosAcuerdosForm>
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
