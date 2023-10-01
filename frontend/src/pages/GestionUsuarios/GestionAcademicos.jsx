import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import {Modal} from "../../utils/Modal"
import { AcademicosForm } from "../../components/GestionUsuarios/GestionAcademicos/AcademicosForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { eliminarAcademico } from "../../api/gestionAcademicos"
import { obtenerAcademicos } from "../../api/gestionAcademicos"
import { agregarAcademico } from "../../api/gestionAcademicos"
import { editarAcademico } from "../../api/gestionAcademicos"
import { editarNombre } from "../../api/gestionAcademicos"
import { editarArea } from "../../api/gestionAcademicos"
import { editarUniversidad } from "../../api/gestionAcademicos"
import { eliminarArea } from "../../api/gestionAcademicos"
import { eliminarNombre } from "../../api/gestionAcademicos"
import { eliminarUniversidad } from "../../api/gestionAcademicos"

export const GestionAcademicos = () => {

    const user = JSON.parse(localStorage.getItem('user'))
    const [academicos, setAcademicos] = useState([])                      // Académicos que se muestran
    const [data, setData] = useState([])                                  // Todos los académicos
    const [academico, setAcademico] = useState(null)                      // Usuario al que se le da click en la tabla para editar
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(false)                             // Si hay error, se muestra una página para eso
    const columns = ['ID', 'Nombre', 'Correo','Universidad'];
    const dataKeys = ['id_academico','id_nombre_completo_fk.nombre','correo', 'universidad_fk.nombre']

    user.groups[0] !== "administrador" ? setError(true) : null;           // Si no es administrador, pone el error en true
    useEffect(() => { loadAcademicos(); }, []);

    // Detecta cambios y realiza la solicitud nuevamente  ** FALTA: que la haga constantemente y no solo al inicio **
    async function loadAcademicos() {
        try {
            const res = await obtenerAcademicos(localStorage.getItem('token'));
            setData(res.data)
            setAcademicos(res.data)
        } catch (error) {
            console.error("Error al cargar los Académicos:", error);
        }
    }

    // Manejo de datos que se van a enviar para agregar
    const addAcademico = async (formData) => {       
        try {
            const Datos = JSON.parse(formData);
            const response = await agregarAcademico(Datos, localStorage.getItem("token"));
            console.log("Académico agregado con éxito:", response.data);
            setAddClick(false);
        } catch (error) {
            console.error("Error al agregar académico:", error);
        }
    }

    // Manejo de los datos del formulario de editar 
    const editAcademico = async (formData) => {       
        try {
            const Datos = JSON.parse(formData);

            const id_nom = Datos.id_nombre_completo_fk.id_nombre_completo;
            await editarNombre(id_nom,Datos.id_nombre_completo_fk, localStorage.getItem("token"));
            const id_nombre_editado = Datos.id_nombre_completo_fk.id_nombre_completo;
            delete Datos.id_nombre_completo_fk;
            Datos.id_nombre_completo_fk = id_nombre_editado;

            const id_are = Datos.id_area_especialidad_fk.id_area_especialidad;
            await editarArea(id_are,Datos.id_area_especialidad_fk, localStorage.getItem("token"));
            const id_area_editada = Datos.id_area_especialidad_fk.id_area_especialidad;
            delete Datos.id_area_especialidad_fk;
            Datos.id_area_especialidad_fk = id_area_editada;

            const id_univ = Datos.universidad_fk.id_universidad;
            await editarUniversidad(id_univ,Datos.universidad_fk, localStorage.getItem("token"));
            const id_universidad_editada = Datos.universidad_fk.id_universidad;
            delete Datos.universidad_fk;
            Datos.universidad_fk = id_universidad_editada;

            const response = await editarAcademico(academico.id_academico, Datos, localStorage.getItem("token"));
            console.log("Académico editado con éxito:", response.data);
            const updatedAcademico = response.data;
            const updatedAcademicos = academicos.map(acade => 
                acade.id_academico === updatedAcademico.id_academico ? updatedAcademico : acade
            );
            setData(updatedAcademicos);
            setAcademicos(updatedAcademicos);
            setEdit(false);
        } catch (error) {
            console.error("Error al editar el académico:", error);
        }
    }

    // Manejo del eliminar
    const deleteAcademicos = async (id) => {
        try {
            
            await deleteAcademicos(id, localStorage.getItem('token'));
            const updatedAcademicos = academicos.filter(academico => academico.id_academico !== id);
            setData(updatedAcademicos);
            setAcademicos(updatedAcademicos);
            console.log("Académico eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar el académico:", error);
        }

        setEdit(false);
    }

    // Al darle click a cancelar, se cierra el modal
    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
    }

    // Al darle click a agregar, muestra el modal
    const addClicked = () => {
        setAddClick(true)
        setEdit(false)
    }

    // Al hacer click en la tabla
    const elementClicked = (selectedAcademico) =>{
        setAcademico(selectedAcademico)
        setEdit(true)
        setAddClick(false)
    }

    // Obtener atributo de un objeto 
    function getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    // Búsqueda filtrada
    const search = (col, filter) => {
        const matches = data.filter((e) => {
        if (col.includes('.')) {
            const value = getValueByPath(e, col);
            return value && value.toString().includes(filter);
        }
        return e[col].toString().includes(filter);
        });
        setAcademicos(matches);
    }

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
                { edit && 
                    (
                        <Modal >
                            <AcademicosForm 
                                mode={2}
                                onSubmit={editAcademico} 
                                onCancel={onCancel} 
                                onDelete={() => deleteAcademicos(academico.id_academico)}
                                academico={academico}
                            >
                            </AcademicosForm>
                        </Modal>
                    )
                }
        </div>
        ):(
            <div>
                Error: no tiene los permisos necesarios para ver esta página.
            </div>
        )}
    </main>)
} 