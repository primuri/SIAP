import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { Back } from "../../utils/Back"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerOrganosColegiados, agregarOrganoColegiado, editarOrganoColegiado, eliminarOrganoColegiado } from "../../api/gestionOrganosColegiados"
import { OrganosColegiadosForm } from "../../components/GestionOrganosColegiados/OrganosColegiadosForm"

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

                if (rol === "administrador") {
                    navigate(`${location.pathname}/o_id=${selectedOrganoColegiado.id_organo_colegiado}/gestion-integrantes`)
                }    
                if (rol === "invitado") {
                    navigate(`${location.pathname}/o_id=${selectedOrganoColegiado.id_organo_colegiado}/integrantes`)
                }
        }
    }

    const elementClickedBtnSesiones = (selectedOrganoColegiado) => {
        setOrganoColegiado(selectedOrganoColegiado);
        console.log(selectedOrganoColegiado.id_organo_colegiado)
        if (event.target.tagName.toLowerCase() === 'button') {
                if (rol === "administrador") {
                    navigate(`${location.pathname}/o_id=${selectedOrganoColegiado.id_organo_colegiado}/gestion-sesiones`)
                }    
                if (rol === "invitado") {
                    navigate(`${location.pathname}/o_id=${selectedOrganoColegiado.id_organo_colegiado}/sesiones`)
                }
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
                        <div className="d-flex justify-content-between mt-4">
                            <Add onClick={addClicked}></Add> 
                            <Search colNames={columns.slice(0, -2)} columns={dataKeys.slice(0, -2)} onSearch={search} />                         
                        </div>
                    )}
                    
                    {user.groups[0] === "invitado" && (
                        <div className="d-flex justify-content-between mt-4">
                            <Search colNames={columns.slice(0, -2)} columns={dataKeys.slice(0, -2)} onSearch={search} />                         
                        </div>
                    )}             

                    {user.groups[0] === "administrador" && (
                        <Table columns={columns} data={OrganosColegiados} dataKeys={dataKeys} onDoubleClick ={elementClicked} hasButtonColumn={true} hasButtonColumn2={true} onClickButton1={elementClickedBtnIntegrantes} onClickButton2={elementClickedBtnSesiones} buttonText="Gestionar" />
                    )}

                    {user.groups[0] === "invitado" && (
                        <Table columns={columns} data={OrganosColegiados} dataKeys={dataKeys} onDoubleClick ={elementClicked} hasButtonColumn={true} hasButtonColumn2={true} onClickButton1={elementClickedBtnIntegrantes} onClickButton2={elementClickedBtnSesiones} buttonText="Visualizar" />
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
