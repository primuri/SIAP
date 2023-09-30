import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import {Modal} from "../../utils/Modal"
import { UsuariosForm } from "../../components/GestionUsuarios/GestionUsuarios/UsuariosForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"


export const GestionUsuarios = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [usuarios, setUsuarios] = useState([]) //Aca van a estar los academicos que se muestran, se hace as]i para que si se busca los
    //no se pierdan todo los academicos al usar el filter.
    const [data,setData] = useState([])//Aca van a estar todos los academicos
    const [usuario, setUsuario] = useState(null) //Este va a ser el usuario que se clickea en la tabla para editar.
    const [error, setError] = useState(false) //Si el usuario no es un admin no puede ver la pagina y se va a mostrar otra pagina de error.
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true);
    if(user.groups[0] != "administrador"){
        setError(true)
    }
    //Aqui se va a hacer la primera solicitud al servidor para los academicos.
    useEffect(() => {
        if (isLoadingData) {
            //Prueba de tabla, esto es un ejemplo datos va a ser innecesario para el caso real, se pide la lista al backend y se mete la 
            //respuesta en setData y en setAcademicos.

            const datos = [
                { id: '1234', correo: 'gorkir6@gmail.com', rol: 'Admin' },
                { id: '9634', correo: 'Brandon@gmail.com', rol: 'Evaluador' },
                { id: '2234', correo: 'Priscila@gmail.com', rol: 'Investigador' },
                { id: '5234', correo: 'Wendy@gmail.com', rol: 'Admin' },
                { id: '9234', correo: 'Ariel@gmail.com', rol: 'Investigador' },
            ];
            setData(datos);
            setUsuarios(datos);
            setIsLoadingData(false); // Desactiva la carga después de la primera vez
        }
    }, [isLoadingData]);
    //cierra culaquier modal
    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
    }
    //Manejo de las funciones para el formulario de agregar academico
    //muestra el modal de agregar
    const addClicked = () => {
        setAddClick(true)
    }
    //aqui se manejan los datos que se van a enviar para agregar el academico. e es un json con los datos del form
    const addUsuario = (e) => {
        console.log(e)
        
        setAddClick(false)
    }

    //Manjeo de las funciones para el formulario cuando se quiere editar un academico
    //funcion para cuando se hace click en una tabla.
    const elementClicked = (user) =>{
        console.log(user)
        setUsuario(user)
        setEdit(true)
    }
    //manejo de los datos del form de editar academico
    const editUsuario = (e) => {
        console.log(e)
        setEdit(false)
    }
    //se maneja el borrar academico.
    const eliminarUsuario = (id) => {
        //Se pide la confirmacion primero si se confirma se hace.
        //Si se eliminar se pone el setEdit(false) y se recarga la pagina, para recargar la lista de academicos
        console.log(id)
        setEdit(false)
    }
    //se filtra
    const search = (col, filter) =>{
        const matches = data.filter((e) => e[col].toString().includes(filter));
        setUsuarios(matches)
    }
    const columns = ['ID', 'Correo','Rol'];
    const dataKeys = ['id', 'correo', 'rol']
    return(
    <main >
        {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
            <h1>Gestión de usuarios</h1>
            <div className="d-flex justify-content-between mt-4">
                <Add onClick={addClicked}></Add>
            <Search colNames={columns} columns={usuarios.length > 0? Object.keys(usuarios[0]): null} onSearch={search}></Search>
            </div>
            <Table columns={columns} data={usuarios} dataKeys={dataKeys} onClick={elementClicked}></Table>
            {addClick && (<Modal ><UsuariosForm onSubmit={addUsuario} onCancel={onCancel} mode={1}></UsuariosForm></Modal>)}
            {edit && 
                (
                    <Modal >
                        <UsuariosForm 
                        mode={2}
                        onSubmit={editUsuario} 
                        onCancel={onCancel} 
                        onDelete={() => eliminarUsuario(usuario.id)}
                        user={usuario}
                        >
                        </UsuariosForm>
                    </Modal>
                )
            }
        </div>
        ):(
            <div>
                Error no tiene los permisos necesarios para ver esta página.
            </div>
        )}
    </main>)
} 