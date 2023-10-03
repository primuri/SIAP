import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import {Modal} from "../../utils/Modal"
import { EvaluadoresForm } from "../../components/GestionUsuarios/GestionEvaluadores/EvaluadoresForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { obtenerEvaluadores,agregarEvaluador,editarEvaluador,eliminarEvaluador } from "../../api/gestionEvaluadores"
import {toast, Toaster} from 'react-hot-toast'
import { PermisoDenegado } from "../../utils/PermisoDenegado"

export const GestionEvaluadores = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [reload, setReload] = useState(false)
    const [evaluadores, setEvaluadores] = useState([]) // Evaluadores que se muestran
    const [data,setData] = useState([])//Todos los evaluadores
    const [evaluador, setEvaluador] = useState(null) //Usuario al que se le da click en la tabla para editar
    const [error, setError] = useState(false) //Si hay un error se muestra una página para eso. Este es para el error de permisos.
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const columns = ['Nombre','Correo','Tipo','Universidad']
    const dataKeys = ['id_nombre_completo_fk.nombre','correo','tipo','universidad_fk.nombre']
    user.groups[0] !== "administrador" ? setError(true) : null  //Si no es administrador, pone el error en true
     // Detecta cambios y realiza la solicitud nuevamente  
    useEffect(() => {loadEvaluadores()}, [reload])
    async function loadEvaluadores() {
        try {
            const res = await obtenerEvaluadores(localStorage.getItem('token'))
            setData(res.data)
            setEvaluadores(res.data)
        } catch (error) {
            toast.error('Error al cargar los datos de evaluadores', {
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
    const addEvaluador = async (formData) => {
        try{
            const Datos = JSON.parse(formData)
            await agregarEvaluador(Datos,localStorage.getItem('token'))
            toast.success('Evaluador agregado correctamente', {
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
            toast.error('Error al agregar el evaluador', {
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
    const editEvaluador = async (formData) => {
        try{
            const Datos = JSON.parse(formData)
            await editarEvaluador(Datos.correo,Datos,localStorage.getItem('token'))
            toast.success('Evaluador actualizado correctamente', {
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
            toast.error('Error al actualizar el evaluador', {
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
    const deleteEvaluador = async (correo) => {
        try{
            await eliminarEvaluador(correo,localStorage.getItem('token'))
            toast.success('Evaluador eliminado correctamente', {
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
            toast.error('Error al eliminar el evaluador', {
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
        setEvaluador(user)
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
        setEvaluadores(matches)
      }
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
                        onDelete={() => deleteEvaluador(evaluador.id)}
                        user={evaluador}
                        >
                        </EvaluadoresForm>
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