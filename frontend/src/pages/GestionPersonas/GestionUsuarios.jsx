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


export const GestionUsuarios = () => {
    let {id} = useParams()
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [reload, setReload] = useState(false)
    const [usuarios, setUsuarios] = useState([]) //Usuarios que se muestran
    const [data, setData] = useState([])//Todos los usuarios
    const [usuario, setUsuario] = useState(null) //Usuario al que se le da click en la tabla para editar
    const [cargado, setCargado] = useState(false)
    const [error, setError] = useState(false) //Si hay un error se muestra una página para eso. Este es para el error de permisos.
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const columns = ['Correo', 'Rol']
    const dataKeys = ['correo', 'groups']
    user.groups[0] !== "administrador" ? setError(true) : null  //Si no es administrador, pone el error en true
    // Detecta cambios y realiza la solicitud nuevamente  ** FALTA: que la haga constantemente y no solo al inicio **
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
    
    //Uso de id en url
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
        const timer = setTimeout(() => {
          navigate(-1);
        }, 1000);
    }
    
    // Manejo de datos que se van a enviar para agregar
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
                    height: '60px', // Aumentar la altura
                    width: '300px',  // Aumentar el ancho
                },
            })
            setAddClick(false)
            success()
        } catch (error) {
            toast.dismiss(toastId)
        }

    }
    // Manejo de los datos del formulario de editar 
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
                    height: '60px', // Aumentar la altura
                    width: '300px',  // Aumentar el ancho
                },
            })
            setEdit(false)
            success()
        } catch (error) {
            toast.dismiss(toastId)
        }
    }
    // Manejo del eliminar
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
                    height: '68px', // Aumentar la altura
                    width: '320px%',  // Aumentar el ancho
                },
            })
            setEdit(false)
            success()
        } catch (error) {
            toast.dismiss(toastId)
        }
    }
    // Al darle click a cancelar, se cierra el modal
    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
        navigate('/gestion-usuarios')
    }
    // Al darle click a agregar, muestra el modal
    const addClicked = () => {
        setAddClick(true)
        setEdit(false)
    }

    // Al hacer click en la tabla
    const elementClicked = (user) => {
        console.log(user)
        navigate(`/gestion-usuarios/${user.id}`)
    }

    //se filtra
    function getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }

    //se filtra
    const search = (col, filter) => {
        const matches = data.filter((e) => {
            if (col.includes('.')) {
                const value = getValueByPath(e, col)
                return value && value.toString().includes(filter)
            }
            return e[col].toString().includes(filter)
        })
        setUsuarios(matches)
    }
    return (
        <main >
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <div className="d-flex flex-row"><h1>Gestión de usuarios</h1>{(!cargado) && (<div class="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}</div>
                    <div className="d-flex justify-content-between mt-4">
                        <Add onClick={addClicked}></Add>
                        <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
                    </div>
                    <Table columns={columns} data={usuarios} dataKeys={dataKeys} onClick={elementClicked}></Table>
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