import { useEffect, useState }                  from "react"
import { columnsGastos, dataKeyGastos}          from "./utils"
import { Add }                                  from "../../utils/Add"
import { Modal }                                from "../../utils/Modal"
import { GastoForm }                            from "../../components/GestionPresupuestos/GastoForm"
import { Table }                                from "../../utils/Table"
import { Search }                               from "../../utils/Search"
import { Back }                                 from "../../utils/Back"
import { toast, Toaster }                       from 'react-hot-toast'
import { PermisoDenegado }                      from "../../utils/PermisoDenegado"
import * as API                                 from "../../api/gestionGastos"
import { useLocation, useNavigate, useParams }  from "react-router-dom"

export const GestionGastos = () => {   
    const {partidaID}                   = useParams() 
    const user                          = JSON.parse(localStorage.getItem('user'))  
    const [reload, setReload]           = useState(false)                           // Para recargar tabla   
    const navigate                      = useNavigate()
    const location                      = useLocation()                       
    const [gastos, setGastos]           = useState([])                              //Gastos que se muestran
    const [data, setData]               = useState([])                              //Todos los Gastos
    const [gasto, setGasto]             = useState(null)                            //Gasto al que se le da click en la tabla para editar
    const [cargado, setCargado]         = useState(false)
    const [error, setError]             = useState(false) 
    const [addClick, setAddClick]       = useState(false)                           // Para evento de agregar
    const [edit, setEdit]               = useState(false)                           // Para evento de editar

    user.groups[0] !== "administrador" ? setError(true) : null                      //Si no es administrador, pone el error en true

    useEffect(() => { loadGastosData(partidaID) }, [reload, partidaID])             // Carga los datos tras detectar cambios

    async function loadGastosData(partidaID) {
        try {
            const res = await API.obtenerGastos(partidaID, localStorage.getItem('token'))
            setData(res.data)
            setGastos(res.data)
            setCargado(true)
        } catch (error) {
            toast.error('Error al cargar los datos de Gastos', {
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                background: '#670000',
                color: '#fff',
                },
          })
        }
    }

    const addGasto = async (formData) => {
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
    
            // Reestructuración y creación del objeto gasto
            delete Data.gasto.id_gasto
            Data.gasto.id_partida = Data.partida.id_partida
            delete Data.partida.id_partida
    
            Data.gasto.id_cedula_proveedor_fk = Data.factura.id_cedula_proveedor_fk;
            Data.gasto.id_producto_servicio_fk = Data.factura.id_producto_servicio_fk;
    
            delete Data.factura;
    
            // Verificar si hay documento adjunto
            if (!formData.has('documento')) {
                throw new Error('Debe adjuntar un documento para agregar el gasto.');
            }
    
            // Agregar factura y gasto
            const facturaResponse = await API.agregarFactura(Data.factura, localStorage.getItem('token'));
            Data.gasto.id_factura_fk = facturaResponse.data.id_factura;
            await API.agregarGasto(Data.gasto, formData, localStorage.getItem('token'));
    
            toast.success('Gasto agregado correctamente', {
                id: toastId,
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
                },
            })
            setAddClick(false)
            document.body.classList.remove('modal-open');
            success()
        } catch (error) {
            toast.dismiss(toastId)
        }
    }

    const editGasto = async (formData) => {
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

        // Reestructuración y creación del objeto gasto
        delete Data.gasto.id_gasto;
        Data.gasto.id_partida = Data.partida.id_partida;
        delete Data.partida.id_partida;

        Data.gasto.id_cedula_proveedor_fk = Data.factura.id_cedula_proveedor_fk;
        Data.gasto.id_producto_servicio_fk = Data.factura.id_producto_servicio_fk;

        delete Data.id_factura_fk;

        // Adjuntar el ID de la factura al formulario formData
        formData.append('id_factura_fk', Data.factura.id_factura);
        delete Data.factura;

        await API.obtenerProveedores(localStorage.getItem('token'));

        let prod = await API.obtenerProductosServicios(localStorage.getItem('token'));
        if (prod) {
            // Si el producto existe, asignamos su ID al gasto
            Data.gasto.id_producto_servicio_fk = Data.factura.id_producto_servicio_fk;
        } else {
            // Si el producto no existe, agregamos el nuevo producto y asignamos su ID al gasto
            let producto_servicio = await API.agregarProductoServicio(Data.id_producto_servicio_fk, localStorage.getItem('token'));
            Data.gasto.id_producto_servicio_fk = producto_servicio.data.id_producto_servicio;
        }

        delete Data.documento;

        await API.actualizarFactura(Data.gasto.id_factura_fk, Data.factura, localStorage.getItem('token'));
        
        await API.actualizarGasto(gasto.id_gasto, Data.gasto, formData, localStorage.getItem('token'));

            toast.success('Gasto editado correctamente', {
                id: toastId,
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
                },
            })
            setAddClick(false)
            document.body.classList.remove('modal-open');
            success()
        } catch (error) {
            toast.dismiss(toastId)
        }
    }

    const deleteGasto = async (id) => {
        try {
            var toastId = toast.loading('Eliminando...', {
                position: 'bottom-right',
                style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
                fontSize: '18px',
                },
            });
            await API.eliminarGasto(id, localStorage.getItem('token'))
            toast.success('Gasto eliminado correctamente', {
                id: toastId,
                duration: 4000, 
                position: 'bottom-right', 
                style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
                },
            })
            setEdit(false)
            document.body.classList.remove('modal-open');
            success()
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

    // Al hacer click en la tabla 
    const elementClicked = (selectedGasto) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            setGasto(selectedGasto);
            navigate(`${location.pathname}${selectedGasto.id_gasto}`)
            
        } else {
            setGasto(selectedGasto)
            setEdit(true)
            setAddClick(false)
        }
    };

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
        setGastos(matches)
    }

    function addBtnClicked () {
        setAddClick(true)
        setEdit(false)
    }

    function volver() {
        const pathParts = location.pathname.split('/').filter(part => part !== '');
        const newPathParts = pathParts.slice(0, -2);
        const newPath = `/${newPathParts.join('/')}`;
        navigate(newPath);
    }

    return (
        <main >
          {!error ? (
            <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
              <div className="flex-row">
                <h1>Gestión de gastos de la partida </h1>
                {(!cargado) && (<div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}</div>
              <div className="d-flex justify-content-between mt-4">
                <Add onClick={addBtnClicked}></Add>
                <Search colNames={columnsGastos} columns={dataKeyGastos} onSearch={search}></Search>
              </div>
              <Table columns={columnsGastos} data={gastos} dataKeys={dataKeyGastos} onDoubleClick={elementClicked} hasButtonColumn={false} buttonText="Gestionar"></Table>
              {addClick && (<Modal ><GastoForm onSubmit={addGasto} onCancel={onCancel} mode={1}></GastoForm></Modal>)}
              {edit &&
                (
                  <Modal>
                    <GastoForm
                      mode={2}
                      onSubmit={editGasto}
                      onCancel={onCancel}
                      onDelete={() => deleteGasto(gasto.id_gasto)}
                      gasto={gasto}
                    >
                    </GastoForm>
                  </Modal>
                )
              }
              <Toaster></Toaster>
              <div className="d-flex justify-content-start">
                <Back onClick={volver}>Regresar a partidas</Back>
              </div>
            </div>
          ) : (
            <PermisoDenegado></PermisoDenegado>
          )}
        </main>
    )
}

