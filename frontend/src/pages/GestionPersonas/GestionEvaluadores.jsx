import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { EvaluadoresForm } from "../../components/GestionPersonas/GestionEvaluadores/EvaluadoresForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { obtenerEvaluadores, agregarEvaluador, editarEvaluador, eliminarEvaluador } from "../../api/gestionEvaluadores"
import { toast, Toaster } from 'react-hot-toast'
import { buscarUniversidad, obtenerUniversidadCompleta } from "../../api/gestionAcademicos"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { useNavigate, useParams } from "react-router-dom"

export const GestionEvaluadores = () => {
  let {id_evaluador} = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [reload, setReload] = useState(false)
  const [evaluadores, setEvaluadores] = useState([]) // Evaluadores que se muestran
  const [data, setData] = useState([])//Todos los evaluadores
  const [evaluador, setEvaluador] = useState(null) //Usuario al que se le da click en la tabla para editar
  const [cargado, setCargado] = useState(false)
  const [error, setError] = useState(false) //Si hay un error se muestra una página para eso. Este es para el error de permisos.
  const [addClick, setAddClick] = useState(false)
  const [edit, setEdit] = useState(false)
  const columns = ['Nombre', 'Correo', 'Tipo', 'Universidad']
  const dataKeys = ['id_nombre_completo_fk.nombre', 'correo', 'tipo', 'universidad_fk.nombre']
  user.groups[0] !== "administrador" ? setError(true) : null  //Si no es administrador, pone el error en true
  // Detecta cambios y realiza la solicitud nuevamente  
  useEffect(() => { loadEvaluadores() }, [reload])
  async function loadEvaluadores() {
    try {
      const res = await obtenerEvaluadores(localStorage.getItem('token'))
      setData(res.data)
      setEvaluadores(res.data)
      setCargado(true)

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

  //Uso de id_evaluador para urls
  useEffect(()=>{
    if(id_evaluador && data.length > 0){
        const idNum = parseInt(id_evaluador, 10);
        const elemento = data.find(e => e.id_evaluador === idNum);
        if(elemento){
            setEvaluador(elemento)
            setEdit(true)
            setAddClick(false)
        }else{
            navigate('/gestion-evaluadores')
        }
    }
  },[data,id_evaluador])

  // Manejo de datos que se van a enviar para agregar
  const addEvaluador = async (formData) => {
    try {
      const Datos = JSON.parse(formData)
      var toastId = toast.loading('Agregando...', {
        position: 'bottom-right',
        style: {
            background: 'var(--celeste-ucr)',
            color: '#fff',
            fontSize: '18px',
        },
    });
      let nombre = Datos.universidad_fk.nombre;
      let pais = Datos.universidad_fk.pais;

      var responseUniversidad = await buscarUniversidad(nombre, pais, localStorage.getItem("token"));

      var id_univ = {};

      if (responseUniversidad !== undefined) {
        id_univ = responseUniversidad.id_universidad;
      } else {
        id_univ = await obtenerUniversidadCompleta(Datos.universidad_fk, localStorage.getItem("token"));
        id_univ = id_univ.id_universidad;
      }

      responseUniversidad = id_univ;
      delete Datos.universidad_fk;
      Datos.universidad_fk = responseUniversidad;
      await agregarEvaluador(Datos, localStorage.getItem('token'))
      toast.success('Evaluador agregado correctamente', {
        id: toastId,
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
      toast.dismiss(toastId)
    }

  }
  // Manejo de los datos del formulario de editar 
  const editEvaluador = async (formData) => {
    try {
      const Datos = JSON.parse(formData)
      var toastId = toast.loading('Editando...', {
        position: 'bottom-right',
        style: {
            background: 'var(--celeste-ucr)',
            color: '#fff',
            fontSize: '18px',
        },
    });
      await editarEvaluador(evaluador.id_evaluador, Datos, localStorage.getItem('token'))
      toast.success('Evaluador actualizado correctamente', {
        id: toastId,
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
      toast.dismiss(toastId)
    }
  }
  // Manejo del eliminar
  const deleteEvaluador = async (correo) => {
    try {
      var toastId = toast.loading('Eliminando...', {
        position: 'bottom-right',
        style: {
            background: 'var(--celeste-ucr)',
            color: '#fff',
            fontSize: '18px',
        },
    });
      await eliminarEvaluador(correo, localStorage.getItem('token'))
      toast.success('Evaluador eliminado correctamente', {
        id: toastId,
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
      toast.dismiss(toastId)
    }
  }
  // Al darle click a cancelar, se cierra el modal
  const onCancel = () => {
    setAddClick(false)
    setEdit(false)
    navigate('/gestion-evaluadores')
  }
  // Al darle click a agregar, muestra el modal
  const addClicked = () => {
    setAddClick(true)
    setEdit(false)
  }

  // Al hacer click en la tabla
  const elementClicked = (user) => {
    navigate(`/gestion-evaluadores/${user.id_evaluador}`)
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
  return (
    <main >
      {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
          <div className="d-flex flex-row"><h1>Gestión de evaluadores</h1>{(!cargado) && (<div class="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}</div>
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
                  onDelete={() => deleteEvaluador(evaluador.id_evaluador)}
                  evaluador={evaluador}
                >
                </EvaluadoresForm>
              </Modal>
            )
          }
          <Toaster></Toaster>
        </div>
      ) : (
        <PermisoDenegado></PermisoDenegado>
      )}
    </main>)
} 