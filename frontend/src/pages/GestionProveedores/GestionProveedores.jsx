import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { ProveedoresForm } from "../../components/GestionProveedores/ProveedoresForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { obtenerProveedores, agregarProveedor, editarProveedor, eliminarProveedor, agregarCuentasBancarias, actualizarCuentasBancarias, eliminarCuentasBancarias} from "../../api/gestionProveedores"
import { toast, Toaster } from 'react-hot-toast'
import { PermisoDenegado } from "../../utils/PermisoDenegado"

export const GestionProveedores = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [reload, setReload] = useState(false)
  const [proveedores, setProveedores] = useState([]) // Proveedores que se muestran
  const [data, setData] = useState([])//Todos los Proveedores
  const [proveedor, setProveedor] = useState(null) //Usuario al que se le da click en la tabla para editar
  const [cargado, setCargado] = useState(false)
  const [error, setError] = useState(false) //Si hay un error se muestra una página para eso. Este es para el error de permisos.
  const [addClick, setAddClick] = useState(false)
  const [edit, setEdit] = useState(false)
  const columns = ['Cédula', 'Tipo', 'Correo', 'Nombre', 'Teléfono']
  const dataKeys = ['id_cedula_proveedor', 'tipo', 'correo', 'nombre', 'telefono']

  user.groups[0] !== "administrador" ? setError(true) : null  //Si no es administrador, pone el error en true
  useEffect(() => { loadProveedores() }, [reload])

  // Detecta cambios y realiza la solicitud nuevamente
  async function loadProveedores() {
    try {
      const res = await obtenerProveedores(localStorage.getItem('token'))
      setData(res.data)
      setProveedores(res.data)
      setCargado(true)

    } catch (error) {
      toast.error('Error al cargar los datos de proveedores', {
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
  const addProveedor = async (formData) => {
    try {

      await agregarProveedor(formData, localStorage.getItem('token'))
      toast.success('Proveedor agregado correctamente', {
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
      toast.error('Error al agregar el proveedor', {
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
  const editProveedor = async (formData) => {
    try {
      const Datos = JSON.parse(formData.get('json'))
      formData.delete('json')

      const cuentasBancarias = Datos?.cuentaBancaria;
      delete proveedor.cuentaBancaria;
        if(typeof cuentasBancarias.id_proveedor_fk === 'undefined'){
            await agregarCuentasBancarias(cuentasBancarias, proveedor.id_cedula_proveedor, localStorage.getItem("token"))
        }else{
            await actualizarCuentasBancarias(cuentasBancarias, localStorage.getItem("token"));

        }

      delete Datos.cuentasBancarias

      for (const key in Datos) {
          if (Object.prototype.hasOwnProperty.call(proveedor, key)) {
            formData.append(key, Datos[key]);
          }
      }

      await editarProveedor(proveedor.id_cedula_proveedor, Datos, localStorage.getItem('token'))
      toast.success('Proveedor actualizado correctamente', {
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
      toast.error('Error al actualizar el proveedor', {
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
  const deleteProveedor = async (id) => {
    try {
      await eliminarProveedor(id, localStorage.getItem('token'))
      toast.success('Proveedor eliminado correctamente', {
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
      toast.error('Error al eliminar el Proveedor', {
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
  const elementClicked = (user) => {
    console.log(user)
    setProveedor(user)
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
    setProveedores(matches)
  }
  return (
    <main >
      {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
          <div className="d-flex flex-row"><h1>Proveedores</h1>{(!cargado) && (<div class="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}</div>
          <div className="d-flex justify-content-between mt-4">
            <Add onClick={addClicked}></Add>
            <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
          </div>
          <Table columns={columns} data={proveedores} dataKeys={dataKeys} onClick={elementClicked}></Table>
          {addClick && (<Modal ><ProveedoresForm onSubmit={addProveedor} onCancel={onCancel} mode={1}></ProveedoresForm></Modal>)}
          {edit &&
            (
              <Modal >
                <ProveedoresForm
                  mode={2}
                  onSubmit={editProveedor}
                  onCancel={onCancel}
                  onDelete={() => deleteProveedor(proveedor.id_cedula_proveedor)}
                  proveedor={proveedor}
                >
                </ProveedoresForm>
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