import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { PresupuestoForm } from "../../components/GestionPresupuestos/PresupuestoForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { Back } from "../../utils/Back"
import { toast, Toaster } from "react-hot-toast"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { agregarPresupuesto, obtenerPresupuestos, eliminarPresupuesto, actualizarPresupuesto, buscaEnteFinanciero, agregarEnte, buscaCodigoFinanciero, agregarCodigosFinancieros, obtenerVersionesProyectos } from "../../api/gestionPresupuestos"
import { useNavigate, useParams } from "react-router-dom"


export const GestionPresupuestos = () => {
  const { proyectoID } = useParams();
  const user = JSON.parse(localStorage.getItem('user'))
  const [reload, setReload] = useState(false)
  const navigate = useNavigate();
  const [presupuestos, setPresupuestos] = useState([]) //Presupuestos que se muestran
  const [data, setData] = useState([])//Todos los Presupuestos
  const [presupuesto, setPresupuesto] = useState(null) //Presupuesto al que se le da click en la tabla para editar
  const [version, setVersion] = useState(null) //Se carga la version del proyecto a la que pertenece el presupuesto, ya sea para agregar o no.
  const [cargado, setCargado] = useState(false)
  const [error, setError] = useState(false) //Si hay un error se muestra una página para eso. Este es para el error de permisos.
  const [addClick, setAddClick] = useState(false)
  const [edit, setEdit] = useState(false)
  const columns = ['Proyecto', 'Año de aprobación', 'Tipo', 'Ente financiero', 'Oficio', 'Documento', 'Código Financiero']
  const dataKeys = ['id_codigo_vi.id_codigo_vi', 'anio_aprobacion', 'id_tipo_presupuesto_fk.tipo', 'id_ente_financiero_fk.nombre', 'id_oficio_fk.id_oficio', 'id_oficio_fk.ruta_archivo', 'id_codigo_financiero_fk.codigo']
  user.groups[0] !== "administrador" ? setError(true) : null  //Si no es administrador, pone el error en true
  // Detecta cambios y realiza la solicitud nuevamente  ** FALTA: que la haga constantemente y no solo al inicio **
  useEffect(() => {
    loadPresupuestos(proyectoID)
    loadVersiones(proyectoID)
  }, [reload, proyectoID])
  async function loadPresupuestos(proyectoID) {
    try {
      const res = await obtenerPresupuestos(proyectoID, localStorage.getItem('token'))
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

  async function loadVersiones(proyectoID) {
    try {
      const res = await obtenerVersionesProyectos(proyectoID, localStorage.getItem('token'))
      setVersion(res.data)
    } catch (error) {

    }
  }

  // Manejo de datos que se van a enviar para agregar
  const addPresupuesto = async (formData) => {
    try {
      const Data = JSON.parse(formData.get('json'))
      var toastId = toast.loading('Agregando...', {
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
          fontSize: '18px',
        },
      });
      formData.delete('json')
      //Re estructuracion y creacion del objeto presupuesto
      delete Data.presupuesto.id_presupuesto
      Data.presupuesto.id_codigo_vi = Data.proyecto.id_codigo_vi
      delete Data.proyecto.id_codigo_vi
      Data.presupuesto.id_tipo_presupuesto_fk = Data.tipoPresupuesto.id_tipo_presupuesto
      let ente = await buscaEnteFinanciero(Data.ente_financiero_fk.nombre, localStorage.getItem('token'))
      if (ente) {
        delete Data.ente_financiero_fk
        Data.presupuesto.id_ente_financiero_fk = ente.id_ente_financiero
      } else {
        //Se crea un nuevo ente financiero.
        delete Data.ente_financiero_fk.id_ente_financiero
        ente = await agregarEnte(Data.ente_financiero_fk, localStorage.getItem('token'))
        Data.presupuesto.id_ente_financiero_fk = ente.data.id_ente_financiero
      }
      let codigo_financiero = await buscaCodigoFinanciero(Data.id_codigo_financiero_fk.codigo, localStorage.getItem('token'))
      if (codigo_financiero) {
        delete Data.id_codigo_financiero_fk
        Data.presupuesto.id_codigo_financiero_fk = codigo_financiero.id_codigo_financiero
      } else {
        //Se crea un nuevo ente financiero.
        delete Data.id_codigo_financiero_fk.id_codigo_financiero
        codigo_financiero = await agregarCodigosFinancieros(Data.id_codigo_financiero_fk, localStorage.getItem('token'))
        Data.presupuesto.id_codigo_financiero_fk = codigo_financiero.data.id_codigo_financiero
      }
      formData.append('detalle', Data.oficio.detalle)
      delete Data.oficio
      await agregarPresupuesto(Data.presupuesto, formData, localStorage.getItem('token'))
      toast.success('Presupuesto agregado correctamente', {
        id: toastId,
        duration: 4000, // Duración en milisegundos (4 segundos en este caso)
        position: 'bottom-right', // Posición en la pantalla
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
        },
      })
      setAddClick(false)
      document.body.classList.remove('modal-open');
      setReload(!reload)
    } catch (error) {
      toast.dismiss(toastId)
    }

  }
  // Manejo de los datos del formulario de editar 
  const editPresupuesto = async (formData) => {
    try {
      const Data = JSON.parse(formData.get('json'))
      var toastId = toast.loading('Editando...', {
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
          fontSize: '18px',
        },
      });
      formData.delete('json')
      //Re estructuracion y creacion del objeto presupuesto
      delete Data.presupuesto.id_presupuesto
      Data.presupuesto.id_codigo_vi = Data.proyecto.id_codigo_vi
      delete Data.proyecto.id_codigo_vi
      Data.presupuesto.id_tipo_presupuesto_fk = Data.tipoPresupuesto.id_tipo_presupuesto
      let ente = await buscaEnteFinanciero(Data.ente_financiero_fk.nombre, localStorage.getItem('token'))
      if (ente) {
        delete Data.ente_financiero_fk
        Data.presupuesto.id_ente_financiero_fk = ente.id_ente_financiero
      } else {
        //Se crea un nuevo ente financiero.
        delete Data.ente_financiero_fk.id_ente_financiero
        ente = await agregarEnte(Data.ente_financiero_fk, localStorage.getItem('token'))
        Data.presupuesto.id_ente_financiero_fk = ente.data.id_ente_financiero
      }
      let codigo_financiero = await buscaCodigoFinanciero(Data.id_codigo_financiero_fk.codigo, localStorage.getItem('token'))
      if (codigo_financiero) {
        delete Data.id_codigo_financiero_fk
        Data.presupuesto.id_codigo_financiero_fk = codigo_financiero.id_codigo_financiero
      } else {
        //Se crea un nuevo ente financiero.
        delete Data.id_codigo_financiero_fk.id_codigo_financiero
        codigo_financiero = await agregarCodigosFinancieros(Data.id_codigo_financiero_fk, localStorage.getItem('token'))
        Data.presupuesto.id_codigo_financiero_fk = codigo_financiero.data.id_codigo_financiero
      }
      formData.append('detalle', Data.oficio.detalle)
      formData.append('id_oficio', Data.oficio.id_oficio_fk)
      delete Data.oficio
      await actualizarPresupuesto(presupuesto.id_presupuesto, Data.presupuesto, formData, localStorage.getItem('token'))
      toast.success('Presupuesto actualizado correctamente', {
        id: toastId,
        duration: 4000, // Duración en milisegundos (4 segundos en este caso)
        position: 'bottom-right', // Posición en la pantalla
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
        },
      })
      setEdit(false)
      document.body.classList.remove('modal-open');

      setReload(!reload)
    } catch (error) {
      toast.dismiss(toastId)
    }
  }
  // Manejo del eliminar
  const deletePresupuesto = async (id) => {
    try {
      var toastId = toast.loading('Eliminando...', {
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
          fontSize: '18px',
        },
      });
      await eliminarPresupuesto(id, localStorage.getItem('token'))
      toast.success('Presupuesto eliminado correctamente', {
        id: toastId,
        duration: 4000, // Duración en milisegundos (4 segundos en este caso)
        position: 'bottom-right', // Posición en la pantalla
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
        },
      })
      setEdit(false)
      setReload(!reload)
      document.body.classList.remove('modal-open');

    } catch (error) {
      toast.dismiss(toastId)
    }
  }
  // Al darle click a cancelar, se cierra el modal
  const onCancel = () => {
    setAddClick(false)
    setEdit(false)
    document.body.classList.remove('modal-open');
  }
  // Al darle click a agregar, muestra el modal
  const addClicked = () => {
    setAddClick(true)
    setEdit(false)
    document.body.classList.add('modal-open');

  }

  // Al hacer click en la tabla
  const elementClicked = (presupuesto) => {
    setPresupuesto(presupuesto)
    setEdit(true)
    setAddClick(false)
    document.body.classList.add('modal-open');
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

  const volver = () => {
    sessionStorage.setItem('isBackNavigation', 'true');
    navigate(-1);
  }

  return (
    <main >
      {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
          <div className="d-flex flex-row"><h1>Gestión de presupuesto del proyecto {version ? version[0].id_codigo_vi_fk.id_codigo_vi : ""} versión {version ? version[0].numero_version : ""}</h1>{(!cargado) && (<div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}</div>
          <div className={`d-flex ${data.length < 1 ? "justify-content-between" : "justify-content-end"} mt-4`}>
            {data.length < 1 ? <Add onClick={addClicked}></Add> : ''}
            <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
          </div>
          <Table columns={columns} data={presupuestos} dataKeys={dataKeys} onClick={elementClicked}></Table>
          {addClick && (<Modal ><PresupuestoForm onSubmit={addPresupuesto} version={version[0]} onCancel={onCancel} mode={1}></PresupuestoForm></Modal>)}
          {edit &&
            (
              <Modal>
                <PresupuestoForm
                  mode={2}
                  onSubmit={editPresupuesto}
                  onCancel={onCancel}
                  onDelete={() => deletePresupuesto(presupuesto.id_presupuesto)}
                  presupuesto={presupuesto}
                  version={version[0]}
                >
                </PresupuestoForm>
              </Modal>
            )
          }
          <Toaster></Toaster>
          <div className="d-flex justify-content-start">
            <Back onClick={volver}>Regresar</Back>
          </div>
        </div>
      ) : (
        <PermisoDenegado></PermisoDenegado>
      )}
    </main>)
} 
