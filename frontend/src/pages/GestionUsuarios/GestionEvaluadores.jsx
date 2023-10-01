import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import {Modal} from "../../utils/Modal"
import { EvaluadoresForm } from "../../components/GestionUsuarios/GestionEvaluadores/EvaluadoresForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"


export const GestionEvaluadores = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [evaluadores, setEvaluadores] = useState([]) //Aca van a estar los academicos que se muestran, se hace as]i para que si se busca los
    //no se pierdan todo los academicos al usar el filter.
    const [data,setData] = useState([])//Aca van a estar todos los academicos
    const [evaluador, setEvaluador] = useState(null) //Este va a ser el usuario que se clickea en la tabla para editar.
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
                { id: '1234', nombre: 'Gorki', correo: 'gorkir6@gmail.com', universidad: 'UNA' },
                { id: '9634', nombre: 'Brandon', correo: 'Brandon@gmail.com', universidad: 'UCR' },
                { id: '2234', nombre: 'Priscila', correo: 'Priscila@gmail.com', universidad: 'UNED' },
                { id: '5234', nombre: 'Wendy', correo: 'Wendy@gmail.com', universidad: 'UNA' },
                { id: '9234', nombre: 'Ariel', correo: 'Ariel@gmail.com', universidad: 'UNA' },
            ];
            setData(datos);
            setEvaluadores(datos);
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
    const addEvaluador = (e) => {
        console.log(e)
        
        setAddClick(false)
    }

    //Manjeo de las funciones para el formulario cuando se quiere editar un academico
    //funcion para cuando se hace click en una tabla.
    const elementClicked = (user) =>{
        console.log(user)
        setEvaluador(user)
        setEdit(true)
    }
    //manejo de los datos del form de editar academico
    const editEvaluador = (e) => {
        console.log(e)
        setEdit(false)
    }
    //se maneja el borrar academico.
    const eliminarEvaluador = (id) => {
        //Se pide la confirmacion primero si se confirma se hace.
        //Si se eliminar se pone el setEdit(false) y se recarga la pagina, para recargar la lista de academicos
        console.log(id)
        setEdit(false)
    }
    function getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }
    //se filtra
    const search = (col, filter) => {
        const matches = data.filter((e) => {
          if (col.includes('.')) {
            const value = getValueByPath(e, col);
            return value && value.toString().includes(filter);
          }
          return e[col].toString().includes(filter);
        });
        setEvaluadores(matches);
      };
    const columns = ['ID', 'Nombre', 'Correo','Universidad'];
    const dataKeys = ['id','nombre','correo', 'universidad']
    return(
    <main >
        {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
            <h1>Gestión de evaluadores</h1>
            <div className="d-flex justify-content-between mt-4">
                <Add onClick={addClicked}></Add>
            <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
            </div>
            <Table columns={columns} data={evaluadores} dataKeys={dataKeys} onClick={elementClicked}></Table>
            {addClick && (<Modal ><EvaluadoresForm onSubmit={addEvaluador} onCancel={onCancel} mode={1}></EvaluadoresForm></Modal>)}
            {edit && 
                (
                    <Modal >
                        <EvaluadoresForm 
                        mode={2}
                        onSubmit={editEvaluador} 
                        onCancel={onCancel} 
                        onDelete={() => eliminarEvaluador(evaluador.id)}
                        user={evaluador}
                        >
                        </EvaluadoresForm>
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