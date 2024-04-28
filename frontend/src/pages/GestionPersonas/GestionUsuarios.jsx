import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { UsuariosForm } from "../../components/GestionPersonas/GestionUsuarios/UsuariosForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { toast, Toaster } from "react-hot-toast"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { obtenerUsuarios, signup, actualizarUsuario, eliminarUsuario } from "../../api/gestionUsuarios"
import { useNavigate, useParams } from "react-router-dom"
import { ReportButton } from "../../utils/ReportButton";

export const GestionUsuarios = () => {
    let {id} = useParams()
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [reload, setReload] = useState(false)
    const [usuarios, setUsuarios] = useState([])
    const [data, setData] = useState([])
    const [usuario, setUsuario] = useState(null)
    const [cargado, setCargado] = useState(false)
    const [error, setError] = useState(false)
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const columns = ['Correo', 'Rol']
    const dataKeys = ['correo', 'groups']
    user.groups[0] !== "administrador" ? setError(true) : null
    useEffect(() => { loadUsuarios() }, [reload])
    async function loadUsuarios() {
        try {
            const res = await obtenerUsuarios(localStorage.getItem('token'))
            setData(res.data)
            setUsuarios(res.data)
            setCargado(true)
        } catch (error) {

        }
    }
    
    useEffect(()=>{
        if(id && data.length > 0){
            const idNum = parseInt(id, 10);
            const elemento = data.find(e => e.id === idNum);
            if(elemento){
                setUsuario(elemento)
                setEdit(true)
                setAddClick(false)
            }else{
                navigate('/gestion-usuarios')
            }
        }
    },[data,id])
    
    const success = () => {
        window.location.href = '/gestion-usuarios'
    }

    const addUsuario = async (formData) => {
        try {
            const Datos = JSON.parse(formData)
            var toastId = toast.loading('Agregando...', {
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                    fontSize: '18px',
                },
            });
            await signup(Datos, localStorage.getItem('token'))
            toast.success('Usuario agregado correctamente', {
                id: toastId,
                duration: 7000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                    fontSize: '18px',
                    height: '60px',
                    width: '300px',
                },
            })
            setAddClick(false)
            success()
        } catch (error) {
            toast.dismiss(toastId)
        }

    }
    const editUsuario = async (formData) => {
        try {
            const Datos = JSON.parse(formData)
            var toastId = toast.loading('Editando...', {
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                    fontSize: '18px',
                },
            });
            await actualizarUsuario(Datos.id, Datos, localStorage.getItem('token'))
            toast.success('Usuario actualizado correctamente', {
                id: toastId,
                duration: 7000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                    fontSize: '18px',
                    height: '60px',
                    width: '300px',
                },
            })
            setEdit(false)
            success()
        } catch (error) {
            toast.dismiss(toastId)
        }
    }
    const deleteUsuario = async (id) => {
        try {
            var toastId = toast.loading('Eliminando...', {
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                    fontSize: '18px',
                },
            });
            await eliminarUsuario(id, localStorage.getItem('token'))
            toast.success('Usuario eliminado correctamente', {
                id: toastId,
                duration: 7000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                    fontSize: '20px',
                    height: '68px',
                    width: '320px%',
                },
            })
            setEdit(false)
            success()
        } catch (error) {
            toast.dismiss(toastId)
        }
    }

    // ==============================================================================================================================
    // Parte que cada uno debe crear para su reporte:
    // ==============================================================================================================================

        // Json que almacena la información que debe recibir el componente ReportButton:  
        const [JsonForReport, setJsonForReport] = useState({ reportData: {}, reportTitle: {}, colNames: {}, dataKeys: {}, idKey: {} })

        // Variable que mide cuando el Json está listo para ser enviado al ReportButton:
        const [JsonIsReady, setJsonIsReady] = useState(false)

        // Funcion auxiliar para jalar producto dada una versión de proyecto
        const createJsonForReport = () => {

            // Titulo del reporte a mostrar en PDF
            JsonForReport.reportTitle = "Usuario"

            // LLave para acceder al id del objeto del reporte
            JsonForReport.idKey = "correo"

            // Llaves para acceder a los datos (incluye tabla extra)
            JsonForReport.dataKeys = [
                'correo',
                'groups.0'
            ]

            // Nombres de las columnas o titulos de los items (incluye tabla extra)
            JsonForReport.colNames = [
                'Correo',
                'Tipo'
            ]

            JsonForReport.reportData = usuarios
            setJsonIsReady(false)

            // Función auxiliar particular para configurar data del reporte
            setJsonIsReady(true)
        }

        // Use effect para cada vez que hay un cambio en la data (contemplando filtrado [Search]), se actualice el JSON
        useEffect(() => {
            setJsonIsReady(false)
            createJsonForReport()
        }, [usuarios])

    // ==============================================================================================================================

    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
        navigate('/gestion-usuarios')
    }
    const addClicked = () => {
        setAddClick(true)
        setEdit(false)
    }

    const elementClicked = (user) => {
        navigate(`/gestion-usuarios/${user.id}`)
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

        setUsuarios(matches)
        setJsonIsReady(false)

    }
    return (
        <main >
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <div className="d-flex flex-row"><h1>Gestión de usuarios</h1>{(!cargado) && (<div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}</div>
                    <div className="d-flex mt-4">
                    <div className="col">
                        <Add onClick={addClicked}></Add>
                    </div>
                        {/* ---------> Añadir la siguiente linea de codigo en el div del search. Posiblemente requiera ajustes de CSS <-----------*/}
                        {(JsonIsReady && (<ReportButton reportData={JsonForReport.reportData} reportTitle={JsonForReport.reportTitle} colNames={JsonForReport.colNames} dataKeys={JsonForReport.dataKeys} idKey={JsonForReport.idKey}></ReportButton>))}
                                {/* ----------------------------------------------------------------------------------------------------------------------*/}
                        <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
                    </div>
                    <Table columns={columns} data={usuarios} dataKeys={dataKeys} onDoubleClick ={elementClicked}></Table>
                    {addClick && (<Modal ><UsuariosForm onSubmit={addUsuario} onCancel={onCancel} mode={1}></UsuariosForm></Modal>)}
                    {edit &&
                        (
                            <Modal>
                                <UsuariosForm
                                    mode={2}
                                    onSubmit={editUsuario}
                                    onCancel={onCancel}
                                    onDelete={() => deleteUsuario(usuario.id)}
                                    usuario={usuario}
                                >
                                </UsuariosForm>
                            </Modal>
                        )
                    }
                    <Toaster></Toaster>
                </div>
            ) : (
                <PermisoDenegado></PermisoDenegado>
            )}
        </main>)
} 