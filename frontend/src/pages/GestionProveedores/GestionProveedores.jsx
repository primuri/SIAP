import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { ProveedoresForm } from "../../components/GestionProveedores/ProveedoresForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { obtenerProveedores, agregarProveedor, editarProveedor, eliminarProveedor, agregarCuentasBancarias, actualizarCuentasBancarias, editarDocumentoCuentaAndDocumento, agregarDocumentoCuenta, editarDocumentoCuenta, eliminarDocumentoCuentas } from "../../api/gestionProveedores"
import { toast, Toaster } from 'react-hot-toast'
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { useNavigate, useParams } from "react-router-dom"

export const GestionProveedores = () => {
  let { id_cedula_proveedor } = useParams()
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [reload, setReload] = useState(false)
  const [proveedores, setProveedores] = useState([])
  const [data, setData] = useState([])
  const [proveedor, setProveedor] = useState(null)
  const [cargado, setCargado] = useState(false)
  const [error, setError] = useState(false)
  const [addClick, setAddClick] = useState(false)
  const [edit, setEdit] = useState(false)
  const columns = ['Cédula', 'Tipo', 'Correo', 'Nombre', 'Teléfono']
  const dataKeys = ['id_cedula_proveedor', 'tipo', 'correo', 'nombre', 'telefono']

  user.groups[0] !== "administrador" ? setError(true) : null

  const token = localStorage.getItem('token')

  useEffect(() => { loadProveedores() }, [reload])

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

  useEffect(() => {
    if (id_cedula_proveedor && data.length > 0) {
      const elemento = data.find(e => e.id_cedula_proveedor === id_cedula_proveedor);
      if (elemento) {
        setProveedor(elemento)
        setEdit(true)
        setAddClick(false)
      } else {
        navigate('/gestion-proveedores')
      }
    }
  }, [data, id_cedula_proveedor])

  const addProveedor = async (formData) => {
    try {
      var toastId = toast.loading('Agregando...', {
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
          fontSize: '18px',
        },
      });

      if (formData.id_documento_fk.documento !== "") {
        var responseDocumento = await agregarDocumentoCuenta(formData.id_documento_fk, token)
        formData.id_documento_fk = responseDocumento.data.id_documento;
      }
      else {
        formData.id_documento_fk = null;
      }

      await agregarProveedor(formData, token)
      setReload(!reload);

      toast.success('Proveedor agregado correctamente', {
        id: toastId,
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
        },
      })
      setAddClick(false)
    } catch (error) {
      toast.dismiss(toastId)
    }
  }

  const editProveedor = async (formData) => {
    try {
      var toastId = toast.loading('Editando...', {
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
          fontSize: '18px',
        },
      });
      if (formData.id_documento_fk) {
        if (typeof formData.id_documento_fk.documento === 'object') {
          var responseDocumento = await editarDocumentoCuentaAndDocumento(formData.id_documento_fk.id_documento, formData.id_documento_fk, token)
        } else {
          delete formData.id_documento_fk.documento
          let id_doc = formData.id_documento_fk.id_documento
          delete formData.id_documento_fk.id_documento
          var responseDocumento = await editarDocumentoCuenta(id_doc, formData.id_documento_fk, token)
        }
        formData.id_documento_fk = responseDocumento.data.id_documento;
      }
      else {
        formData.id_documento_fk = null;
      }

      const Datos = formData

      const cuentasBancarias = Datos?.cuentaBancaria;
      delete proveedor.cuentaBancaria;

      if (cuentasBancarias) {
        await actualizarCuentasBancarias(cuentasBancarias, proveedor.id_cedula_proveedor, token);
      }

      delete Datos.cuentaBancaria

      await editarProveedor(proveedor.id_cedula_proveedor, Datos, token)

      toast.success('Proveedor actualizado correctamente', {
        id: toastId,
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
        },
      })
      setEdit(false)
      setReload(!reload);
      navigate('/gestion-proveedores')
    } catch (error) {
      toast.dismiss(toastId)
    }
  }

  const deleteProveedor = async (id, doc_id) => {
    try {
      var toastId = toast.loading('Eliminando...', {
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
          fontSize: '18px',
        },
      });
      await eliminarProveedor(id, token)
      await eliminarDocumentoCuentas(doc_id, token)


      toast.success('Proveedor eliminado correctamente', {
        id: toastId,
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
        },
      })
      setEdit(false)
      setReload(!reload);
      navigate('/gestion-proveedores')
    } catch (error) {
      toast.dismiss(toastId)
    }
  }

  const onCancel = () => {
    setAddClick(false)
    setEdit(false)
    document.body.classList.remove('modal-open');
    navigate('/gestion-proveedores')
  }

  const addClicked = () => {
    setAddClick(true)
    setEdit(false)
    document.body.classList.add('modal-open');

  }

  const elementClicked = (user) => {
    navigate(`/gestion-proveedores/${user.id_cedula_proveedor}`)
  }

  function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }

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
          <div className="d-flex flex-row"><h1>Gestión de proveedores</h1>{(!cargado) && (<div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}</div>
          <div className="d-flex justify-content-between mt-4">
            <Add onClick={addClicked}></Add>
            <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
          </div>
          <Table columns={columns} data={proveedores} dataKeys={dataKeys} onDoubleClick={elementClicked}></Table>
          {addClick && (<Modal ><ProveedoresForm onSubmit={addProveedor} onCancel={onCancel} mode={1}></ProveedoresForm></Modal>)}
          {edit &&
            (
              <Modal >
                <ProveedoresForm
                  mode={2}
                  onSubmit={editProveedor}
                  onCancel={onCancel}
                  onDelete={() => deleteProveedor(proveedor.id_cedula_proveedor, proveedor.id_documento_fk.id_documento)}
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