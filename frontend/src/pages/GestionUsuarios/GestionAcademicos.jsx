import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import {Modal} from "../../utils/Modal"
import { AcademicosForm } from "../../components/GestionUsuarios/GestionAcademicos/AcademicosForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import {toast, Toaster} from 'react-hot-toast'
import { obtenerAcademicos,agregarAcademico,editarAcademico,eliminarAcademico} from "../../api/gestionAcademicos"
import {editarNombre,editarArea,editarUniversidad} from "../../api/utils/usuariosUtils"
import { PermisoDenegado } from "../../utils/PermisoDenegado"

export const GestionAcademicos = () => {

    const user = JSON.parse(localStorage.getItem('user'))
    const [reload, setReload] = useState(false)                           // Se usa para definir cuando se debe de actualizr la pagina.
    const [academicos, setAcademicos] = useState([])                      // Académicos que se muestran
    const [data, setData] = useState([])                                  // Todos los académicos
    const [academico, setAcademico] = useState(null)                      // Usuario al que se le da click en la tabla para editar
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false)
    const [error, setError] = useState(false)                             // Si hay error, se muestra una página para eso
    const columns = ['Cedula', 'Nombre', ,'Apellido', 'Correo','Universidad']
    const dataKeys = ['cedula','id_nombre_completo_fk.nombre','id_nombre_completo_fk.apellido' ,'correo', 'universidad_fk.nombre']

    user.groups[0] !== "administrador" ? setError(true) : null           // Si no es administrador, pone el error en true
    useEffect(() => { loadAcademicos() }, [reload])

    // Detecta cambios y realiza la solicitud nuevamente  
    async function loadAcademicos() {
        try {
            const res = await obtenerAcademicos(localStorage.getItem('token'))
            setData(res.data)
            setAcademicos(res.data)
        } catch (error) {
            toast.error('Error al cargar los datos de academicos', {
                duration: 4000,
                position: 'bottom-right', 
                style: {
                  background: '#670000',
                  color: '#fff',
                },
              })
        }
    }

    // Manejo de datos que se van a enviar para agregar
    const addAcademico = async (formData) => {       
        try {
            const Datos = JSON.parse(formData)
            await agregarAcademico(Datos, localStorage.getItem("token"))
            toast.success('Académico agregado correctamente', {
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                  background: 'var(--celeste-ucr)',
                  color: '#fff',
                },
              })
            setAddClick(false)
            setReload(!reload)
        } catch (error) {
            toast.error('Error al agregar el académico', {
                duration: 4000, 
                position: 'bottom-right',
                style: {
                  background: '#670000',
                  color: '#fff',
                },
              })
        }
    }

    // Manejo de los datos del formulario de editar 
    const editAcademico = async (formData) => {       
        try {
            const Datos = JSON.parse(formData)

            const id_nom = Datos.id_nombre_completo_fk.id_nombre_completo
            await editarNombre(id_nom,Datos.id_nombre_completo_fk, localStorage.getItem("token"))
            const id_nombre_editado = Datos.id_nombre_completo_fk.id_nombre_completo
            delete Datos.id_nombre_completo_fk
            Datos.id_nombre_completo_fk = id_nombre_editado

            const id_are = Datos.id_area_especialidad_fk.id_area_especialidad
            await editarArea(id_are,Datos.id_area_especialidad_fk, localStorage.getItem("token"))
            const id_area_editada = Datos.id_area_especialidad_fk.id_area_especialidad
            delete Datos.id_area_especialidad_fk
            Datos.id_area_especialidad_fk = id_area_editada

            const id_univ = Datos.universidad_fk.id_universidad
            await editarUniversidad(id_univ,Datos.universidad_fk, localStorage.getItem("token"))
            const id_universidad_editada = Datos.universidad_fk.id_universidad
            delete Datos.universidad_fk
            Datos.universidad_fk = id_universidad_editada

            await editarAcademico(academico.id_academico, Datos, localStorage.getItem("token"))
            toast.success('Académico editado correctamente', {
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                  background: 'var(--celeste-ucr)',
                  color: '#fff',
                },
              })
            setEdit(false)
            setReload(!reload)
        } catch (error) {
            toast.error('Error al editar el académico', {
                duration: 4000, 
                position: 'bottom-right',
                style: {
                  background: '#670000',
                  color: '#fff',
                },
              })
        }
    }

    // Manejo del eliminar
    const deleteAcademicos = async (id) => {
        try {
            
            await eliminarAcademico(id, localStorage.getItem('token'))
            toast.success('Académico eliminado correctamente', {
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                  background: 'var(--celeste-ucr)',
                  color: '#fff',
                },
              })
            setEdit(false)
            setReload(!reload)
        } catch (error) {
            toast.error('Error al eliminar el académico', {
                duration: 4000, 
                position: 'bottom-right',
                style: {
                  background: '#670000',
                  color: '#fff',
                },
              })
        }

        setEdit(false)
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
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }

    // Búsqueda filtrada
    const search = (col, filter) => {
        const matches = data.filter((e) => {
        if (col.includes('.')) {
            const value = getValueByPath(e, col)
            return value && value.toString().includes(filter)
        }
        return e[col].toString().includes(filter)
        })
        setAcademicos(matches)
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
                        <Modal>
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
                <Toaster></Toaster>
        </div>
        ):(
            <PermisoDenegado></PermisoDenegado>
        )}
    </main>)
} 