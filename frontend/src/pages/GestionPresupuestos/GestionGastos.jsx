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
import { useNavigate, useParams }  from "react-router-dom"
import { ReportButton } from "../../utils/ReportButton";

export const GestionGastos = () => {
    let {id_partida,partidaID}            = useParams()
    const user                            = JSON.parse(localStorage.getItem('user'))
    const navigate                        = useNavigate()
    const [clean_id, setClean_id]         = useState(partidaID.startsWith('g_id=') ? partidaID.split('g_id=')[1] : '')
  
    const [data, setData]                             = useState([])
    const [reload, setReload]                         = useState(false)
    const [cargado, setCargado]                       = useState(false)
    const [gasto, setGasto]                           = useState(null)
    const [gastos, setGastos]                         = useState([])
    const [partida, setPartida]                       = useState(null)
    const [selectedPartida, setSelectedPartida]       = useState(null);
  
    const [error, setError]                   = useState(false)
    const [addClick, setAddClick]             = useState(false)
    const [edit, setEdit]                     = useState(false)
    const [JsonIsReady, setJsonIsReady]       = useState(false)
    const [JsonForReport, setJsonForReport]   = useState({ reportData: {}, reportTitle: {}, colNames: {}, dataKeys: {}, idKey: {} })
  
    //user.groups[0] !== "administrador" ? setError(true) : null  
    const isInvestigador = user.groups.some((grupo) => {
      return grupo === 'investigador';
    });
  
    const token = localStorage.getItem('token')
  
    const transformedGastos = gastos.map(gasto => ({
      ...gasto,  
      fecha: formatDate(gasto.fecha) 
    }));

    useEffect(() => {
      setJsonIsReady(false)
      createJsonForReport()
    }, [gastos])

    const configureReportData = () => {
        if (gastos.length > 0) {
            try {
                const gastos_ = gastos.map((gasto) => {
                    gasto.partidaID = partidaID;
                    return gasto;
                });
                JsonForReport.reportData = gastos_;
                return true;
    
            } catch (exception) {
                console.error("Ocurrió un error al crear el JSON para reporte: ", exception);
                return false;
            }
        }
    }

    const createJsonForReport = () => {
        JsonForReport.reportTitle = "Gastos de partida";
        JsonForReport.idKey = 'id_partida_fk.id_partida';

        JsonForReport.dataKeys = [
            'id_gasto',
            'id_factura_fk.id_factura',
            'fecha',
            'detalle',
            'id_factura_fk.id_cedula_proveedor_fk.nombre',
            'id_factura_fk.id_producto_servicio_fk.detalle',
            'monto'
        ];
        JsonForReport.colNames = [
            'Código del gasto',
            'Código de la factura',
            'Fecha', 
            'Detalle', 
            'Proveedor',
            'Producto o Servicio',
            'Monto'
        ];
        setJsonIsReady(false)
        setJsonIsReady(configureReportData());
    };
  
    useEffect(() => {
      async function fetchData() {
          await loadGastos(clean_id);
          setCargado(true);
      }
  
      fetchData();
    }, [reload, clean_id]);
  
    async function loadGastos(clean_id) {
        try {
          const response = await API.obtenerGastos(token);
          response.data.forEach(item => {
          });
  
          const formattedAndFilteredData = response.data.map(item => ({
              ...item,
              fecha: item.fecha ? formatDate(item.fecha) : 'No especificado'
          })).filter(item => {
              return Number(item.id_partida_fk.id_partida) === Number(clean_id);
          });
  
          setData(formattedAndFilteredData);
          setGastos(formattedAndFilteredData);
          setCargado(true);
  
        } catch (error) {
            console.error('Error al cargar gastos:', error);
        }
    }
  
    function formatDate(dateString) {
      if (!dateString) return "";
      return new Date(dateString).toISOString().split('T')[0];
    }
  
    useEffect(() => {
      const fetchData = async () => {
        if (id_partida && data.length > 0) {
          const idNum = parseInt(id_partida, 10);
          const elemento = data.find(e => e.id_partida_fk.id_partida === idNum);
          if (elemento) {
            setEdit(true);
            setAddClick(false);
            setPartida(elemento);
          } else {
            navigate(`${location.pathname}${selectedPartida.id_partida}/gestion-gastos`);
          }
        }
      };
    
      fetchData();
    }, [data, partida]);
  
    const addGasto = async (formData) => {
      try {
          var toastId = toast.loading('Agregando...', {
              position: 'bottom-right',
              style: {
              background: 'var(--celeste-ucr)',
              color: '#fff',
              fontSize: '18px',
              },
          });

          formData.id_partida_fk = clean_id;
          delete formData.id_gasto;

          if (formData.id_documento_fk.documento !== "") {
            var responseDocumento = await API.agregarFacturaDocumento(formData.id_documento_fk, token)
            formData.id_documento_fk = responseDocumento.data.id_documento;
          }
          else {
            formData.id_documento_fk = null;
          }

          if(formData.id_factura_fk.id_producto_servicio_fk.detalle.id_producto_servicio !== undefined){
            formData.id_factura_fk.id_producto_servicio_fk = formData.id_factura_fk.id_producto_servicio_fk.detalle.id_producto_servicio
          }else{
              var responsePS = await API.agregarProductoServicio({detalle: formData.id_factura_fk.id_producto_servicio_fk.detalle.detalle}, token)
              formData.id_factura_fk.id_producto_servicio_fk = responsePS.data.id_producto_servicio
          }

          const facturaResponse = await API.agregarFactura(formData.id_factura_fk, token);
          formData.id_factura_fk = facturaResponse.data.id_factura;
          delete formData.id_cedula_proveedor_fk;
          delete formData.id_producto_servicio_fk;
          formData.monto = parseInt(formData.monto);
          const Datos = {
              monto: formData.monto,
              fecha: formData.fecha,
              id_documento_fk: formData.id_documento_fk,
              id_factura_fk: formData.id_factura_fk,
              id_partida_fk:  formData.id_partida_fk,
              detalle: formData.detalle
          }
          await API.agregarGasto(Datos, token);

          setReload(!reload);
  
          toast.success('Gasto agregado correctamente', {
              id: toastId,
              duration: 4000,
              position: 'bottom-right',
              style: {
              background: 'var(--celeste-ucr)',
              color: '#fff',
              },
          })
          setAddClick(false);
      } catch (error) {
        toast.dismiss(toastId);
      }
    }
  
    const editGasto = async (formData) => {
      try {
          var toastId = toast.loading('Editando...', {
              position: 'bottom-right',
              style: {
              background: 'var(--celeste-ucr)',
              color: '#fff',
              fontSize: '18px',
              },
          });

          console.log(formData)

          const id_gasto = formData.id_gasto;
          formData.id_partida_fk = clean_id;

          if(typeof formData.id_factura_fk.id_producto_servicio_fk.detalle !== 'object'){
            formData.id_factura_fk.id_producto_servicio_fk = formData.id_factura_fk.id_producto_servicio_fk.id_producto_servicio 
          }else{    
              var responsePS = ""                                                             
              try{
                  responsePS = await API.agregarProductoServicio({detalle: formData.id_factura_fk.id_producto_servicio_fk.detalle.detalle}, token)
              } catch(error){
                  console.log(responsePS)
              }                                                               
              formData.id_factura_fk.id_producto_servicio_fk = responsePS.data.id_producto_servicio
          }

          formData.id_factura_fk.id_cedula_proveedor_fk = formData.id_factura_fk.id_cedula_proveedor_fk.id_cedula_proveedor
          const rF = await API.actualizarFactura(formData.id_factura_fk.id_factura, formData.id_factura_fk, token)
          formData.id_factura_fk = rF.data.id_factura
          formData.monto = parseInt(formData.monto);

          if (formData.id_documento_fk) {
            delete formData.id_documento_fk.documento
            var responseDocumento = await API.actualizarFacturaDocumento(formData.id_documento_fk.id_documento, formData.id_documento_fk, token)
            formData.id_documento_fk = responseDocumento.data.id_documento;
          }
          else {
            formData.id_documento_fk = null;
          }

          await API.actualizarGasto(id_gasto, formData, token);
          setReload(!reload);

          toast.success('Gasto actualizado correctamente', {
              id: toastId,
              duration: 4000,
              position: 'bottom-right', 
              style: {
              background: 'var(--celeste-ucr)',
              color: '#fff',
              },
          })
          setEdit(false);
      } catch (error) {
        toast.dismiss(toastId);
      }
    }
  
    const deleteGasto = async (gasto) => { 
      try {
        var toastId = toast.loading('Eliminando...', {
          position: 'bottom-right',
          style: {
            background: 'var(--celeste-ucr)',
            color: '#fff',
            fontSize: '18px',
          },
        });

        await API.eliminarGasto(gasto.id_gasto, token);
        await API.eliminarFactura(gasto.id_factura_fk.id_factura, token);
        await API.eliminarDocumentoFactura(gasto.id_documento_fk.id_documento, token);
  
        toast.success('Gasto eliminado correctamente', {
          id: toastId,
          duration: 4000,
          position: 'bottom-right', 
          style: {
            background: 'var(--celeste-ucr)',
            color: '#fff',
          },
        })
        setEdit(false);
      } catch (error) {
        toast.dismiss(toastId);
      }
    }
  
    const onCancel = () => {
      setAddClick(false)
      setEdit(false)
      document.body.classList.remove('modal-open');
    }
  
    const addClicked = () => {
      setAddClick(true)
      setEdit(false)
    }
  
    const elementClicked = (selectedGasto) => {
      setGasto(selectedGasto)
      setAddClick(false)
      setEdit(true)
      document.body.classList.add('modal-open');
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
      setGastos(matches)
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
              <div className="d-flex flex-row">
                  {isInvestigador ? (<h1>Visualizar gastos</h1>): (<h1>Gestión de gastos </h1>)}

              </div>
  
              {(!cargado) && (
                  <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
              )}
  
              <div className="d-flex justify-content-between mt-4">
                <div className="col">
                  {!isInvestigador && (<Add onClick={addClicked}></Add>)}
                </div>
                  {(JsonIsReady && (<ReportButton reportData={JsonForReport.reportData} reportTitle={JsonForReport.reportTitle} colNames={JsonForReport.colNames} dataKeys={JsonForReport.dataKeys} idKey={JsonForReport.idKey}></ReportButton>))}
                  <Search colNames={columnsGastos} columns={dataKeyGastos} onSearch={search}></Search>
              </div>
  
            <Table columns={columnsGastos} data={transformedGastos} dataKeys={dataKeyGastos} onDoubleClick={elementClicked} hasButtonColumn={false} navigate={navigate} ></Table>
             {addClick && (
                  <Modal ><GastoForm 
                      id_partida={selectedPartida} 
                      onSubmit={addGasto} 
                      onCancel={onCancel} 
                      mode={1}>
                  </GastoForm></Modal>
             )}
              {edit && (
                  <Modal ><GastoForm
                      mode={2}
                      onSubmit={editGasto}
                      onCancel={onCancel}
                      onDelete={() => deleteGasto(gasto)}
                      gasto={gasto}>
                  </GastoForm></Modal>
              )}
            <Toaster></Toaster>
            <div className="d-flex justify-content-start">
              <Back onClick={volver}>Regresar a partidas</Back>
            </div>
          </div>
        ) : (
          <PermisoDenegado></PermisoDenegado>
        )}
      </main>)
  } 