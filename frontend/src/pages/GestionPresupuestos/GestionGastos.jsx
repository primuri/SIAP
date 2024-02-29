import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { GastoForm } from "../../components/GestionPresupuestos/GastoForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { obtenerGastos, agregarGasto, editarGasto, eliminarGasto, obtenerProveedores } from "../../api/gestionGastos"
import { toast, Toaster } from 'react-hot-toast'
import { PermisoDenegado } from "../../utils/PermisoDenegado"

export const GestionGastos = () => {

  const { partidaID } = useParams();

  const user = JSON.parse(localStorage.getItem('user'))                          // Se recupera el usuario local del navegador, el que está usando el sistema
  const location = useLocation()
  const navigate = useNavigate()
  const [reload, setReload] = useState(false)                                  // Para controlar cuándo se debe de recargar la página
  const [gastos, setGastos] = useState([])                                     // Estado para almacenar todos los gastos
  const [cargado, setCargado] = useState(false)                                // Para controlar si los gastos se cargaron o no  
  const [data, setData] = useState([])                                         // Todos los gastos.                          
  const [gasto, setGasto] = useState(null)                                     // Gasto al que se le da click en la tabla.
  const [addClick, setAddClick] = useState(false)                              // Cuando se da click en agregar
  const [edit, setEdit] = useState(false)                                      // Cuando se da click en editar
  const [error, setError] = useState(false)
  const [id_partida, setIdPartida] = useState(null)                       // Cuando hay un error
  const columns = ['Código', 'Fecha' , 'Detalle', 'Monto', 'Factura']
  const dataKeys = ['id_gasto', 'fecha', 'detalle', 'monto']

  user.groups[0] !== "administrador" ? setError(true) : null                   // Si no es administrador, pone el error en true

  useEffect(() => {                                                            // Cuando reload cambia, se llama a load()
    async function fetchData() {
        loadGastos()
        setCargado(true);
        const id_partida_presupuesto = await loadGastoById(partidaID);

        setIdPartida(id_partida_presupuesto[1]);
    }
    fetchData();
  }, [reload]);

  async function loadGastos() {
    try {
        const response = await obtenerGastos(localStorage.getItem('token'), partidaID)            // Se envía el token y se obtienen todos los gastos
        setData(response.data)                                                                    // Se guardan en data todos los gastos
        setGastos(response.data)                                                                  // Se guardan todos los gastos
        setCargado(true)                                                                          // Como se cargaron, se pone cargado en true
    } catch (error) {
      
    }
  }

  // Manejo de datos que se van a enviar para agregar
  const addGasto = async (formData) => {
    try {

        const Data = JSON.parse(formData)

        Data.id_partida_fk = partidaID;
        await agregarGasto(Data, localStorage.getItem("token"))

        toast.success('Gasto agregado correctamente', {
            duration: 4000,
            position: 'bottom-right',
            style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
            },
        })
        setAddClick(false)
        setReload(!reload)
        document.body.classList.remove('modal-open');

    } catch (error) {
    }
  }

  // Manejo de los datos del formulario de editar 
  const editGasto = async (formData) => {
    try {
        const Data = JSON.parse(formData)
        Data.id_partida_fk = partidaID;

        await editarGasto(gasto.id_gasto, Data, localStorage.getItem("token"))
        toast.success('Gasto editado correctamente', {
            duration: 4000,
            position: 'bottom-right',
            style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
            },
        })
        setEdit(false)
        setReload(!reload)
        document.body.classList.remove('modal-open');
    } catch (error) {
        
    }
  }

  // Manejo del eliminar
  const deleteGasto = async (gasto) => {
    try {
        await eliminarGasto(gasto.id_gasto, localStorage.getItem('token'))

        toast.success('Gasto eliminado correctamente', {
            duration: 4000,
            position: 'bottom-right',
            style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
            },
        })
        setEdit(false)
        setReload(!reload)
        document.body.classList.remove('modal-open');
    } catch (error) {
        
    }
    setEdit(false)
  }

  // Al darle click a cancelar, se cierra el modal
  const onCancel = () => {
    setAddClick(false)
    setEdit(false)
    document.body.classList.remove('modal-open');
    navigate('/gestion-proveedores')
  }

  // Al darle click a agregar, muestra el modal
  const addClicked = () => {
    setAddClick(true)
    setEdit(false)
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
    setGastos(matches)
  }

  const volver = () => {
    const pathParts = location.pathname.split('/').filter(part => part !== '');
    const newPathParts = pathParts.slice(0, -2);
    const newPath = `/${newPathParts.join('/')}`;
    navigate(newPath); 
  }

  return (
    <main >
      {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
          <div className=" flex-row">
            <h1>Gestión de gastos de la partida {id_partida} de: </h1>
            <br></br>
            <h3>{id_proyecto}</h3>
          </div>

          {(!cargado) && (
            <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
          )}

          <div className="d-flex justify-content-between mt-4">
            <Add onClick={addClicked}></Add>
            <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
          </div>

          <Table columns={columns} data={gastos} dataKeys={dataKeys} onDoubleClick={elementClicked}></Table>

          {addClick && (<Modal ><GastoForm onSubmit={addGasto} onCancel={onCancel} mode={1}></GastoForm></Modal>)}
          {edit &&
            (
              <Modal >
                <GastoForm
                  mode={2}
                  onSubmit={editGasto}
                  onCancel={onCancel}
                  onDelete={() => deleteGasto(gasto)}
                  gasto={gasto}
                >
                </GastoForm>
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