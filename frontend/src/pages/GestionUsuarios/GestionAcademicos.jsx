import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import {Modal} from "../../utils/Modal"
import { AcademicosForm } from "../../components/GestionUsuarios/GestionAcademicos/AcademicosForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { eliminarAcademico } from "../../api/gestionAcademicos"
import { obtenerAcademicos } from "../../api/gestionAcademicos"

export const GestionAcademicos = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [academicos, setAcademicos] = useState([]) //Aca van a estar los academicos que se muestran, se hace as]i para que si se busca los
    //no se pierdan todo los academicos al usar el filter.
    const [data,setData] = useState([])//Aca van a estar todos los academicos
    const [academico, setAcademico] = useState(null) //Este va a ser el usuario que se clickea en la tabla para editar.
    const [error, setError] = useState(false) //Si el usuario no es un admin no puede ver la pagina y se va a mostrar otra pagina de error.
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true);
    if(user.groups[0] != "administrador"){
        setError(true)
    }
    //Aqui se va a hacer la primera solicitud al servidor para los academicos.
    useEffect(() => {
        async function carga() {
            try {
                const res = await obtenerAcademicos(localStorage.getItem('token'));
                setData(res.data)
                setAcademicos(res.data)
            } catch (error) {
                console.error("Error al cargar los Academicos:", error);
            }
        }
        carga(); 
    }, []);
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
    const addAcademico = (e) => {
        console.log(e)
        setAddClick(false)
    }

    //Manjeo de las funciones para el formulario cuando se quiere editar un academico
    //funcion para cuando se hace click en una tabla.
    const elementClicked = (user) =>{
        console.log(user)
        setAcademico(user)
        setEdit(true)
    }
    //manejo de los datos del form de editar academico
    const editAcademico = (e) => {
        console.log(e)
        setEdit(false)
    }
    //se maneja el borrar academico.
    const eliminarAcademicos = async (id) => {
        try {
            await eliminarAcademico(id, localStorage.getItem('token'));
            const updatedAcademicos = academicos.filter(academico => academico.id_academico !== id);
            setData(updatedAcademicos);
            setAcademicos(updatedAcademicos);
            console.log("Académico eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar el académico:", error);
        }
    
        setEdit(false);
    }
    


    //se filtra
    const search = (col, filter) =>{
        const matches = data.filter((e) => e[col].toString().includes(filter));
        setAcademicos(matches)
    }
    const columns = ['ID', 'Nombre', 'Correo','Universidad'];
    const dataKeys = ['id_academico','id_nombre_completo_fk.nombre','correo', 'universidad_fk.nombre']
    return(
    <main >
        {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
            <h1>Gestión de académicos</h1>
            <div className="d-flex justify-content-between mt-4">
                <Add onClick={addClicked}></Add>
            <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
            </div>
            <Table columns={columns} data={academicos} dataKeys={dataKeys} onClick={elementClicked}></Table>
            {addClick && (<Modal ><AcademicosForm onSubmit={addAcademico} onCancel={onCancel} mode={1}></AcademicosForm></Modal>)}
            {edit && 
                (
                    <Modal >
                        <AcademicosForm 
                        mode={2}
                        onSubmit={editAcademico} 
                        onCancel={onCancel} 
                        onDelete={() => eliminarAcademicos(academico.id_academico)}
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