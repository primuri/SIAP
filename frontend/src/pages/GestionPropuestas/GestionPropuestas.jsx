import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import {Modal} from "../../utils/Modal"
import { PropuestasForm } from "../../components/GestionPropuestas/PropuestasForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import {toast, Toaster} from 'react-hot-toast'
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { obtenerPropuestas } from "../../api/gestionPropuestas"
export const GestionPropuestas = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [reload, setReload] = useState(false)
    const [propuestas, setPropuestas] = useState([]) // Propuestas que se muestran
    const [data,setData] = useState([])//Todas las propuestas
    const [propuesta, setPropuesta] = useState(null) //Propuesta al que se le da click en la tabla para editar
    const [error, setError] = useState(false) //Si hay un error se muestra una página para eso. Este es para el error de permisos.
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const columns = ['Correo','Rol']
    const dataKeys = ['correo','rol']
    user.groups[0] !== "administrador" ? setError(true) : null  //Si no es administrador, pone el error en true
     // Detecta cambios y realiza la solicitud nuevamente  
    useEffect(() => {loadEvaluadores()}, [reload])
    async function loadEvaluadores() {
        try {
            const res = await obtenerPropuestas(localStorage.getItem('token'))
            setData(res.data)
            setPropuestas(res.data)
        } catch (error) {
            toast.error('Error al cargar los datos de propuestas', {
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
    const addPropuesta = async (formData) => {
        try{
            const Datos = JSON.parse(formData)
            await agregarPropuesta(Datos,localStorage.getItem('token'))
            toast.success('Propuesta agregada correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setAddClick(false)
            setReload(!reload)
        }catch(error){
            toast.error('Error al agregar la propuesta', {
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
    const editPropuesta = async (formData) => {
        try{
            const Datos = JSON.parse(formData)
            await editarPropuesta(Datos.correo,Datos,localStorage.getItem('token'))
            toast.success('Propuesta actualizada correctamente', {
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                  background: 'var(--celeste-ucr)',
                  color: '#fff',
                },
              })
            setEdit(false)
            setReload(!reload)
        }catch(error){
            toast.error('Error al actualizar la propuesta', {
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
    const deletePropuesta = async (correo) => {
        try{
            await eliminarPropuesta(correo,localStorage.getItem('token'))
            toast.success('Propuesta eliminada correctamente', {
                duration: 4000, 
                position: 'bottom-right',
                style: {
                  background: 'var(--celeste-ucr)',
                  color: '#fff',
                },
              })
            setEdit(false)
            setReload(!reload)
        }catch(error){
            toast.error('Error al eliminar la propuesta', {
                duration: 4000,
                position: 'bottom-right', 
                style: {
                  background: '#670000',
                  color: '#fff',
                },
              })
        }
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
    const elementClicked = (user) =>{
        console.log(user)
        setPropuesta(user)
        setEdit(true)
        setAddClick(false)
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
        setPropuestas(matches)
      }
    return(
    <main >
        {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
            <h1>Gestión de propuestas</h1>
            <div className="d-flex justify-content-between mt-4">
                <Add onClick={addClicked}></Add>
            <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
            </div>
            <Table columns={columns} data={propuestas} dataKeys={dataKeys} onClick={elementClicked}></Table>
            {addClick && (<Modal ><PropuestasForm onSubmit={addPropuesta} onCancel={onCancel} mode={1}></PropuestasForm></Modal>)}
            {edit && 
                (
                    <Modal >
                        <PropuestasForm 
                        mode={2}
                        onSubmit={editPropuesta} 
                        onCancel={onCancel} 
                        onDelete={() => deletePropuesta(propuesta.id)}
                        user={propuesta}
                        >
                        </PropuestasForm>
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