import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { PresupuestoForm } from "../../components/GestionPresupuestos/PresupuestoForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import {toast, Toaster} from "react-hot-toast"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { agregarPresupuesto, obtenerPresupuestos, eliminarPresupuesto, actualizarPresupuesto, buscaEnteFinanciero, agregarEnte } from "../../api/gestionPresupuestos"


export const GestionPresupuestos = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [reload, setReload] = useState(false)
    const [presupuestos, setPresupuestos] = useState([]) //Presupuestos que se muestran
    const [data,setData] = useState([])//Todos los Presupuestos
    const [presupuesto, setPresupuesto] = useState(null) //Presupuesto al que se le da click en la tabla para editar
    const [cargado, setCargado] = useState(false)
    const [error, setError] = useState(false) //Si hay un error se muestra una página para eso. Este es para el error de permisos.
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const columns = ['Proyecto','Año de aprobación','Tipo','Ente financiero','Oficio','Documento','Codigo Financiero']
    const dataKeys = ['id_codigo_vi.id_codigo_vi','anio_aprobacion','id_tipo_presupuesto_fk.tipo','id_ente_financiero_fk.nombre','id_oficio_fk.id_oficio','id_oficio_fk.ruta_archivo','codigo_financiero']
    user.groups[0] !== "administrador" ? setError(true) : null  //Si no es administrador, pone el error en true
     // Detecta cambios y realiza la solicitud nuevamente  ** FALTA: que la haga constantemente y no solo al inicio **
    useEffect(() => {loadPresupuestos()}, [reload])
    async function loadPresupuestos() {
        try {
            const res = await obtenerPresupuestos(localStorage.getItem('token'))
            setData(res.data)
            setPresupuestos(res.data)
            setCargado(true)
        } catch (error) {
            toast.error('Error al cargar los datos de Presupuestos', {
                duration: 4000, // Duración en milisegundos (4 segundos en este caso)
                position: 'bottom-right', // Posición en la pantalla
                style: {
                  background: '#670000',
                  color: '#fff',
                },
              })
        }
    }
    // Manejo de datos que se van a enviar para agregar
    const addPresupuesto = async (formData) => {
        try{

            const Data = JSON.parse(formData.get('json'))
            formData.delete('json')
            //Re estructuracion y creacion del objeto presupuesto
            delete Data.presupuesto.id_presupuesto
            Data.presupuesto.id_codigo_vi = Data.proyecto.id_codigo_vi
            delete Data.proyecto.id_codigo_vi
            Data.presupuesto.id_tipo_presupuesto_fk = Data.tipoPresupuesto.id_tipo_presupuesto
            let ente = await buscaEnteFinanciero(Data.ente_financiero_fk.nombre, localStorage.getItem('token'))
            if(ente){
              delete Data.ente_financiero_fk
              Data.presupuesto.id_ente_financiero_fk = ente.id_ente_financiero
            }else{
              //Se crea un nuevo ente financiero.
              console.log('se crea un nuevo ente')
              delete Data.ente_financiero_fk.id_ente_financiero 
              ente = await agregarEnte(Data.ente_financiero_fk, localStorage.getItem('token'))
              Data.presupuesto.id_ente_financiero_fk = ente.data.id_ente_financiero
            }
            formData.append('detalle',Data.oficio.detalle)
            delete Data.oficio
            await agregarPresupuesto(Data.presupuesto,formData,localStorage.getItem('token'))
            toast.success('Presupuesto agregado correctamente', {
                duration: 4000, // Duración en milisegundos (4 segundos en este caso)
                position: 'bottom-right', // Posición en la pantalla
                style: {
                  background: 'var(--celeste-ucr)',
                  color: '#fff',
                },
              })
            setAddClick(false)
            setReload(!reload)
        }catch(error){
            toast.error('Error al agregar el Presupuesto', {
                duration: 4000, // Duración en milisegundos (4 segundos en este caso)
                position: 'bottom-right', // Posición en la pantalla
                style: {
                  background: '#670000',
                  color: '#fff',
                },
              })
        }
        
    }
    // Manejo de los datos del formulario de editar 
    const editPresupuesto = async (formData) => {
        try{
            const Data = JSON.parse(formData.get('json'))
            formData.delete('json')
            //Re estructuracion y creacion del objeto presupuesto
            delete Data.presupuesto.id_presupuesto
            Data.presupuesto.id_codigo_vi = Data.proyecto.id_codigo_vi
            delete Data.proyecto.id_codigo_vi
            Data.presupuesto.id_tipo_presupuesto_fk = Data.tipoPresupuesto.id_tipo_presupuesto
            let ente = await buscaEnteFinanciero(Data.ente_financiero_fk.nombre, localStorage.getItem('token'))
            if(ente){
              delete Data.ente_financiero_fk
              Data.presupuesto.id_ente_financiero_fk = ente.id_ente_financiero
            }else{
              //Se crea un nuevo ente financiero.
              delete Data.ente_financiero_fk.id_ente_financiero 
              ente = await agregarEnte(Data.ente_financiero_fk, localStorage.getItem('token'))
              Data.presupuesto.id_ente_financiero_fk = ente.data.id_ente_financiero
            }
            formData.append('detalle',Data.oficio.detalle)
            formData.append('id_oficio',Data.oficio.id_oficio_fk)
            delete Data.oficio
            await actualizarPresupuesto(presupuesto.id_presupuesto,Data.presupuesto,formData,localStorage.getItem('token'))
            toast.success('Presupuesto actualizado correctamente', {
                duration: 4000, // Duración en milisegundos (4 segundos en este caso)
                position: 'bottom-right', // Posición en la pantalla
                style: {
                  background: 'var(--celeste-ucr)',
                  color: '#fff',
                },
              })
            setEdit(false)
            setReload(!reload)
        }catch(error){
            toast.error('Error al actualizar el Presupuesto', {
                duration: 4000, // Duración en milisegundos (4 segundos en este caso)
                position: 'bottom-right', // Posición en la pantalla
                style: {
                  background: '#670000',
                  color: '#fff',
                },
              })
        }
    }
    // Manejo del eliminar
    const deletePresupuesto = async (id) => {
        try{
            await eliminarPresupuesto(id,localStorage.getItem('token'))
            toast.success('Presupuesto eliminado correctamente', {
                duration: 4000, // Duración en milisegundos (4 segundos en este caso)
                position: 'bottom-right', // Posición en la pantalla
                style: {
                  background: 'var(--celeste-ucr)',
                  color: '#fff',
                },
              })
            setEdit(false)
            setReload(!reload)
        }catch(error){
            toast.error('Error al eliminar el Presupuesto', {
                duration: 4000, // Duración en milisegundos (4 segundos en este caso)
                position: 'bottom-right', // Posición en la pantalla
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
        setPresupuesto(user)
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
        setPresupuestos(matches)
      }
    return(
    <main >
        {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
            <div className="d-flex flex-row"><h1>Gestión de Presupuestos</h1>{(!cargado) && (<div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}</div>
            <div className="d-flex justify-content-between mt-4">
                <Add onClick={addClicked}></Add>
            <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
            </div>
            <Table columns={columns} data={presupuestos} dataKeys={dataKeys} onClick={elementClicked}></Table>
            {addClick && (<Modal ><PresupuestoForm onSubmit={addPresupuesto} onCancel={onCancel} mode={1}></PresupuestoForm></Modal>)}
            {edit && 
                (
                    <Modal>
                        <PresupuestoForm 
                            mode={2}
                            onSubmit={editPresupuesto} 
                            onCancel={onCancel} 
                            onDelete={() => deletePresupuesto(presupuesto.id_presupuesto)}
                            presupuesto={presupuesto}
                        >
                        </PresupuestoForm>
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
