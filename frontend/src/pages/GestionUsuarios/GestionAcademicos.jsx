import { useState } from "react"
import { Add } from "../../utils/Add"
import {Modal} from "../../utils/Modal"
import { AcademicosForm } from "../../components/GestionUsuarios/GestionAcademicos/AcademicosForm"


export const GestionAcademicos = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [usuario, setUsuario] = useState(null) //Este va a ser el usuario que se clickea en la tabla para editar.
    const [error, setError] = useState(false)
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    if(user.groups[0] != 1){
        setError(true)
    }
    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
    }
    //Manejo de las funciones para el formulario de agregar academico
    const addClicked = () => {
        setAddClick(true)
    }
    const addAcademico = (e) => {
        e.preventeDefault()
        alert("Holas")
        setAddClick(false)
    }

    //Manjeo de las funciones para el formulario cuando se quiere editar un academico
    const elementClicked = () =>{
        setEdit(true)
    }
    const editAcademico = (e) => {
        e.preventeDefault()
        alert("modo editar")
        setEdit(false)
    }
    const eliminarAcademico = (id) => {
        //Se pide la confirmacion primero si se confirma se hace.
        //Si se eliminar se pone el setEdit(false) y se recarga la pagina, para recargar la lista de academicos
        setEdit(false)
    }


    return(
    <main>
        {!error ? (
        <div>
            <h1>Gestión de académicos</h1>
            <Add onClick={addClicked}></Add>
            {addClick && (<Modal mode={1}><AcademicosForm onSubmit={addAcademico} onCancel={onCancel}></AcademicosForm></Modal>)}
            {edit && 
                (
                    <Modal mode={2}>
                        <AcademicosForm 
                        onSubmit={editAcademico} 
                        onCancel={onCancel} 
                        onDelete={() => eliminarAcademico(usuario.id)}
                        user={usuario}
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