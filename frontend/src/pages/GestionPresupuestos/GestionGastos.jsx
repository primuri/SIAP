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
            const Data = JSON.parse(formData.get('json'));
            console.log(Data)
            const token = localStorage.getItem('token');
            var toastId = toast.loading('Agregando...', {
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                    fontSize: '18px',
                },
            });
            formData.delete('json');
    
            // Reestructurar y crear el objeto gasto
            delete Data.id_gasto;
            Data.id_partida_fk = parseInt(partidaID);
            Data.id_cedula_proveedor_fk = Data.id_factura_fk.id_cedula_proveedor_fk;
            Data.id_producto_servicio_fk = Data.id_factura_fk.id_producto_servicio_fk;
    
            // Adjuntar el ID de la factura al formulario formData
            console.log(Data.id_factura_fk)
            formData.append('id_factura_fk', Data.id_factura_fk.id_factura);
    
            formData.append("tipo", Data.id_documento_fk.tipo)
            formData.append("detalle", Data.id_documento_fk.detalle)
            const documentoResponse = await API.agregarFacturaDocumento(formData, token);
            Data.id_documento_fk = documentoResponse.data.id_documento;

            // Agregar factura y gasto
            if(Data.id_factura_fk.id_producto_servicio_fk.detalle.id_producto_servicio !== undefined){
                Data.id_factura_fk.id_producto_servicio_fk = Data.id_factura_fk.id_producto_servicio_fk.detalle.id_producto_servicio
            }else{
                var responsePS = await API.agregarProductoServicio({detalle: Data.id_factura_fk.id_producto_servicio_fk.detalle.detalle}, token)
                Data.id_factura_fk.id_producto_servicio_fk = responsePS.data.id_producto_servicio
            }
            const facturaResponse = await API.agregarFactura(Data.id_factura_fk, token);
            Data.id_factura_fk = facturaResponse.data.id_factura;
            delete Data.id_cedula_proveedor_fk;
            delete Data.id_producto_servicio_fk;
            Data.monto = parseInt(Data.monto);
            Data.fecha = '2024-03-08T15:20:40Z';
            await API.agregarGasto(Data, token);
    
            toast.success('Gasto agregado correctamente', {
                id: toastId,
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            });
            setAddClick(false);
            document.body.classList.remove('modal-open');
            window.location.reload();
        } catch (error) {
            toast.dismiss(toastId);
            console.error("Error al agregar gasto: ", error);
            toast.error('Error al agregar gasto', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--error-color)',
                    color: '#fff',
                },
            });
        }
    };

    const editGasto = async (formData) => {
        try {
            const Data = JSON.parse(formData.get('json'));
            const token = localStorage.getItem('token');
            var toastId = toast.loading('Editando...', {
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                    fontSize: '18px',
                },
            });
            formData.delete('json');

            Data.id_partida_fk = parseInt(partidaID);

            // ACTUALIZAR FACTURA Y MANEJAR PRODUCTO SERVICIO

            if(typeof Data.id_factura_fk.id_producto_servicio_fk.detalle !== 'object'){ // Si lo que viene no es un objeto, solo pasa el ID
                Data.id_factura_fk.id_producto_servicio_fk = Data.id_factura_fk.id_producto_servicio_fk.id_producto_servicio 

            }else{    
                var responsePS = ""                                                                  // Si lo que viene ES un objeto, lo agrega y saca el ID
                try{
                    responsePS = await API.agregarProductoServicio({detalle: Data.id_factura_fk.id_producto_servicio_fk.detalle.detalle}, token)
                    console.log(responsePS)
                } catch(error){
                    console.log(responsePS)
                }                                                               
                Data.id_factura_fk.id_producto_servicio_fk = responsePS.data.id_producto_servicio
            }

            Data.id_factura_fk.id_cedula_proveedor_fk = Data.id_factura_fk.id_cedula_proveedor_fk.id_cedula_proveedor
            const rF = await API.actualizarFactura(Data.id_factura_fk.id_factura, Data.id_factura_fk, token)

            Data.id_factura_fk = rF.data.id_factura
            Data.monto = parseInt(Data.monto);

            // DOCUMENTO GASTO PENDIENTE

            delete Data.id_documento_fk // Temporal para que deje actualizar sin documento.
                                        // Guiarse con manejo de documentos en Proveedores (RF de Wendy)

            // ACTUALIZAR GASTO CON LOS ID DE LAS COSAS

            await API.actualizarGasto(Data.id_gasto, Data, token);
    
            toast.success('Gasto editado correctamente', {
                id: toastId,
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            });
            setAddClick(false);
            document.body.classList.remove('modal-open');
            window.location.reload();
        } catch (error) {
            toast.dismiss(toastId);
            console.error("Error al editar gasto: ", error);
            toast.error('Error al editar gasto', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--error-color)',
                    color: '#fff',
                },
            });
        }
    };

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
            window.location.reload();
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

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    const formattedData = gastos.map(item => {
        const formattedItem = {};
        Object.keys(item).forEach(key => {
          if (key === 'fecha') {
            formattedItem[key] = formatDate(item[key]);
          } else {
            formattedItem[key] = item[key];
          }
        });
        return formattedItem;
    });

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
              <Table columns={columnsGastos} data={formattedData} dataKeys={dataKeyGastos} onDoubleClick={elementClicked} hasButtonColumn={false} buttonText="Gestionar"></Table>
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