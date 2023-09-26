import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import {Modal} from "../../utils/Modal"
import { AcademicosForm } from "../../components/GestionUsuarios/GestionAcademicos/AcademicosForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"


export const GestionAcademicos = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [academicos, setAcademicos] = useState([]) //Aca van a estar los academicos que se muestran
    const [data,setData] = useState([])//Aca van a estar todos los academicos
    const [academico, setAcademico] = useState(null) //Este va a ser el usuario que se clickea en la tabla para editar.
    const [error, setError] = useState(false)
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true);
    if(user.groups[0] != 1){
        setError(true)
    }
    //Aqui se va a hacer la primera solicitud al servidor para los academicos.
    useEffect(() => {
        if (isLoadingData) {
            //Prueba de tabla
            const datos = [
                { id: '1234', nombre: 'Gorki', correo: 'gorkir6@gmail.com', universidad: 'UNA' },
                { id: '9634', nombre: 'Brandon', correo: 'Brandon@gmail.com', universidad: 'UCR' },
                { id: '2234', nombre: 'Priscila', correo: 'Priscila@gmail.com', universidad: 'UNED' },
                { id: '5234', nombre: 'Wendy', correo: 'Wendy@gmail.com', universidad: 'UNA' },
                { id: '9234', nombre: 'Ariel', correo: 'Ariel@gmail.com', universidad: 'UNA' },
                // Agrega más filas según sea necesario
            ];
            setData(datos);
            setAcademicos(datos);
            setIsLoadingData(false); // Desactiva la carga después de la primera vez
        }
    }, [isLoadingData]);
    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
    }
    //Manejo de las funciones para el formulario de agregar academico
    const addClicked = () => {
        setAddClick(true)
    }
    const addAcademico = (e) => {
        console.log(e)
        
        setAddClick(false)
    }

    //Manjeo de las funciones para el formulario cuando se quiere editar un academico
    const elementClicked = (user) =>{
        console.log(user)
        setAcademico(user)
        setEdit(true)
    }
    const editAcademico = (e) => {
        console.log(e)
        setEdit(false)
    }
    const eliminarAcademico = (id) => {
        //Se pide la confirmacion primero si se confirma se hace.
        //Si se eliminar se pone el setEdit(false) y se recarga la pagina, para recargar la lista de academicos
        console.log(id)
        setEdit(false)
    }
    const search = (col, filter) =>{
        const matches = data.filter((e) => e[col].toString().includes(filter));
        setAcademicos(matches)
    }
    const columns = ['ID', 'Nombre', 'Correo','Universidad'];
    
    return(
    <main >
        {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
            <h1>Gestión de académicos</h1>
            <div className="d-flex justify-content-between mt-4">
                <Add onClick={addClicked}></Add>
            <Search colNames={columns} columns={academicos.length > 0? Object.keys(academicos[0]): null} onSearch={search}></Search>
            </div>
            <Table columns={columns} data={academicos} onClick={elementClicked}></Table>
            {addClick && (<Modal ><AcademicosForm onSubmit={addAcademico} onCancel={onCancel} mode={1}></AcademicosForm></Modal>)}
            {edit && 
                (
                    <Modal >
                        <AcademicosForm 
                        mode={2}
                        onSubmit={editAcademico} 
                        onCancel={onCancel} 
                        onDelete={() => eliminarAcademico(academico.id)}
                        user={academico}
                        >
                        </AcademicosForm>
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