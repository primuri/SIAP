import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { PresupuestoForm } from "../../components/GestionPresupuestos/PresupuestoForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { Back } from "../../utils/Back"
import { toast, Toaster } from "react-hot-toast"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { agregarPresupuesto, obtenerPresupuestos, eliminarPresupuesto, actualizarPresupuesto, buscaEnteFinanciero, agregarEnte, buscaCodigoFinanciero, agregarCodigosFinancieros, obtenerVersionesProyectos, obtenerVersionesPresupuesto } from "../../api/gestionPresupuestos"
import { useNavigate, useParams } from "react-router-dom"
import { ReportButton } from "../../utils/ReportButton";
import axios from 'axios'

export const GestionPresupuestos = () => {
  const { proyectoID } = useParams();
  const user = JSON.parse(localStorage.getItem('user'))
  const [reload, setReload] = useState(false)
  const navigate = useNavigate();
  const [presupuestos, setPresupuestos] = useState([])
  const [data, setData] = useState([])
  const [presupuesto, setPresupuesto] = useState(null)
  const [canDelete, setCanDelete] = useState(false)
  const [version, setVersion] = useState(null)
  const [cargado, setCargado] = useState(false)
  const [error, setError] = useState(false)
  const [addClick, setAddClick] = useState(false)
  const [edit, setEdit] = useState(false)
  const [JsonForReport, setJsonForReport] = useState({ reportData: {}, reportTitle: {}, colNames: {}, dataKeys: {}, idKey: {} })
  const [JsonIsReady, setJsonIsReady] = useState(false)
  const columns = ['Proyecto', 'Año de aprobación', 'Tipo', 'Ente financiero', 'Oficio', 'Documento', 'Código Financiero', 'Versiones']
  const dataKeys = ['id_codigo_vi.id_codigo_vi', 'anio_aprobacion', 'tipo_presupuesto', 'id_ente_financiero_fk.nombre', 'id_oficio_fk.id_oficio', 'id_oficio_fk.ruta_archivo', 'id_codigo_financiero_fk.codigo', 'Versiones']

  useEffect(() => {
    setJsonIsReady(false)
    createJsonForReport()
  }, [presupuestos])

  const isInvestigador = user.groups.some((grupo) => {
    return grupo === 'investigador';
  });

  const configureReportData = async () => {
    const getLastVersionPresupuesto = async (id_presupuesto) => {
      const token = localStorage.getItem('token');

      const SIAPAPI = axios.create({
        baseURL: 'http://localhost:8000/'
      }, [])

      var response = await SIAPAPI.get('presupuesto/version_presupuestos/', {
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        }
      })

      var lastVersion = { id_version_presupuesto: 0 }

      response.data.map((version) => {
        if (version.id_presupuesto_fk.id_presupuesto === id_presupuesto && lastVersion.id_version_presupuesto < version.id_version_presupuesto) {
          lastVersion = version
        }
      })

      return (lastVersion ? lastVersion : {})
    }

    const getPartidas = async (id_version_presupuesto) => {
      const token = localStorage.getItem('token');

      const SIAPAPI = axios.create({
        baseURL: 'http://localhost:8000/'
      })

      var response = await SIAPAPI.get('presupuesto/partidas/', {
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const filteredData = response.data.filter(item => item.id_version_presupuesto_fk.id_version_presupuesto === id_version_presupuesto);

      return filteredData ? filteredData : {}
    }

    if (presupuestos.length > 0) {
      try {
        const promises = presupuestos.map(async (presupuesto) => {
          const ultimaVersion = await getLastVersionPresupuesto(presupuesto.id_presupuesto);
          const partidasLista = await getPartidas(ultimaVersion.id_version_presupuesto);

          presupuesto.id_version_presupuesto_fk = ultimaVersion;
          presupuesto[JsonForReport.colNames.length - 1] = partidasLista;

          return presupuesto;
        });

        const presupuestosConDatosCompletos = await Promise.all(promises);
        JsonForReport.reportData = presupuestosConDatosCompletos;
        return true

      } catch (exception) {
        console.error("Ocurrió un error al crear el Json para reporte: ")
        return false
      }
    }
  }

  const createJsonForReport = async () => {
    JsonForReport.reportTitle = "Presupuesto"
    JsonForReport.idKey = "id_presupuesto"
    JsonForReport.dataKeys = [
      'id_presupuesto',
      'id_codigo_vi.id_codigo_vi',
      'id_version_proyecto_fk.numero_version',
      'tipo_presupuesto',
      'id_ente_financiero_fk.nombre',
      'id_codigo_financiero_fk.codigo',
      'anio_aprobacion',
      'id_version_presupuesto_fk.id_version_presupuesto',
      'id_version_presupuesto_fk.monto',
      'id_version_presupuesto_fk.fecha',
      'id_version_presupuesto_fk.detalle',
      ['id_partida', 'detalle', 'monto']
    ]

    JsonForReport.colNames = [
      'Presupuesto',
      'Código VI',
      'Versión de proyecto',
      'Tipo',
      'Ente financiero',
      'Código financiero',
      'Año de aprobación',
      'Versión de presupuesto',
      'Monto',
      'Fecha',
      'Detalle',
      { 'tableName': 'Partidas', 'colNames': ['Identificador', 'Detalle', 'Monto'] }
    ]

    setJsonIsReady(await configureReportData())
  }


  useEffect(() => {
    loadPresupuestos(proyectoID)
    loadVersiones(proyectoID)
  }, [reload, proyectoID, canDelete])
  async function loadPresupuestos(proyectoID) {
    try {
      const res = await obtenerPresupuestos(proyectoID, localStorage.getItem('token'))
      setData(res.data)
      setPresupuestos(res.data)
      setCargado(true)
      await loadVersionesPresupuestos()
    } catch (error) {
      toast.error('Error al cargar los datos de Presupuestos', {
        duration: 4000,
        position: 'bottom-right',
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

  async function loadVersionesPresupuestos() {
    try {
      const res = await obtenerVersionesPresupuesto(localStorage.getItem('token'))
      if (presupuestos.length > 0) {
        const versionesFiltered = res.data.filter((versionP) => versionP.id_presupuesto_fk.id_presupuesto == presupuestos[0].id_presupuesto)
        if (versionesFiltered.length > 0) {
          setCanDelete(false)
        } else {
          setCanDelete(true)
        }
      } else {
        setCanDelete(true)
      }
    } catch (error) {

    }
  }

  const success = () => {
    const timer = setTimeout(() => {
      navigate(-1);
    }, 1000);
  }

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
      delete Data.presupuesto.id_presupuesto
      Data.presupuesto.id_codigo_vi = Data.proyecto.id_codigo_vi
      delete Data.proyecto.id_codigo_vi
      Data.presupuesto.tipo_presupuesto = Data.tipoPresupuesto
      let ente = await buscaEnteFinanciero(Data.ente_financiero_fk.nombre, localStorage.getItem('token'))
      if (ente) {
        delete Data.ente_financiero_fk
        Data.presupuesto.id_ente_financiero_fk = ente.id_ente_financiero
      } else {
        delete Data.ente_financiero_fk.id_ente_financiero
        ente = await agregarEnte(Data.ente_financiero_fk, localStorage.getItem('token'))
        Data.presupuesto.id_ente_financiero_fk = ente.data.id_ente_financiero
      }
      let codigo_financiero = await buscaCodigoFinanciero(Data.id_codigo_financiero_fk.codigo, localStorage.getItem('token'))
      if (codigo_financiero) {
        delete Data.id_codigo_financiero_fk
        Data.presupuesto.id_codigo_financiero_fk = codigo_financiero.id_codigo_financiero
      } else {
        delete Data.id_codigo_financiero_fk.id_codigo_financiero
        codigo_financiero = await agregarCodigosFinancieros(Data.id_codigo_financiero_fk, localStorage.getItem('token'))
        Data.presupuesto.id_codigo_financiero_fk = codigo_financiero.data.id_codigo_financiero
      }
      formData.append('detalle', Data.oficio.detalle)
      delete Data.oficio
      await agregarPresupuesto(Data.presupuesto, formData, localStorage.getItem('token'))
      toast.success('Presupuesto agregado correctamente', {
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
      setReload(!reload)
    } catch (error) {
      toast.dismiss(toastId)
    }

  }

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
      delete Data.presupuesto.id_presupuesto
      Data.presupuesto.id_codigo_vi = Data.proyecto.id_codigo_vi
      delete Data.proyecto.id_codigo_vi
      Data.presupuesto.tipo_presupuesto = Data.tipoPresupuesto
      let ente = await buscaEnteFinanciero(Data.ente_financiero_fk.nombre, localStorage.getItem('token'))
      if (ente) {
        delete Data.ente_financiero_fk
        Data.presupuesto.id_ente_financiero_fk = ente.id_ente_financiero
      } else {
        delete Data.ente_financiero_fk.id_ente_financiero
        ente = await agregarEnte(Data.ente_financiero_fk, localStorage.getItem('token'))
        Data.presupuesto.id_ente_financiero_fk = ente.data.id_ente_financiero
      }
      let codigo_financiero = await buscaCodigoFinanciero(Data.id_codigo_financiero_fk.codigo, localStorage.getItem('token'))
      if (codigo_financiero) {
        delete Data.id_codigo_financiero_fk
        Data.presupuesto.id_codigo_financiero_fk = codigo_financiero.id_codigo_financiero
      } else {
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
      toast.dismiss(toastId)
    }
  }

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
        duration: 4000,
        position: 'bottom-right',
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

  const onCancel = () => {
    setAddClick(false)
    setEdit(false)
    document.body.classList.remove('modal-open');
  }

  const addClicked = () => {
    setAddClick(true)
    setEdit(false)
    document.body.classList.add('modal-open');

  }

  const elementClicked = (presupuesto) => {
    if (event.target.tagName.toLowerCase() === 'button') {
      navigate(`${location.pathname}/${presupuesto.id_presupuesto}/gestion-versiones`)
    } else {
      setPresupuesto(presupuesto)
      setEdit(true)
      setAddClick(false)
      document.body.classList.add('modal-open');
    }
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
    setPresupuestos(matches)
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
          <div className="flex-row">
            {isInvestigador ? (<h1>Visualizar presupuesto de la versión {version ? version[0].numero_version : ""} de: </h1>) : (<h1>Gestión de presupuesto de la versión {version ? version[0].numero_version : ""} de: </h1>)}

            <h3>{version ? version[0].id_codigo_vi_fk.id_codigo_cimpa_fk.descripcion : ""} </h3>
            {(!cargado) && (<div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}</div>
          <div className={`d-flex ${data.length < 1 ? "justify-content-between" : "justify-content-end"} mt-4`}>
            {(data.length < 1) && (!isInvestigador) ? <Add onClick={addClicked}></Add> : ''}
            {(JsonIsReady && (<ReportButton reportData={JsonForReport.reportData} reportTitle={JsonForReport.reportTitle} colNames={JsonForReport.colNames} dataKeys={JsonForReport.dataKeys} idKey={JsonForReport.idKey}></ReportButton>))}
            <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
          </div>
          <Table columns={columns} data={presupuestos} dataKeys={dataKeys} onDoubleClick={elementClicked} onClickButton2={elementClicked} hasButtonColumn={true} buttonText="Gestionar"></Table>
          {addClick && (<Modal ><PresupuestoForm onSubmit={addPresupuesto} version={version[0]} onCancel={onCancel} mode={1} canDelete={canDelete}></PresupuestoForm></Modal>)}
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
                  canDelete={canDelete}
                >
                </PresupuestoForm>
              </Modal>
            )
          }
          <Toaster></Toaster>
          <div className="d-flex justify-content-start">
            <Back onClick={volver}>Regresar a versión de proyecto</Back>
          </div>
        </div>
      ) : (
        <PermisoDenegado></PermisoDenegado>
      )}
    </main>)
} 
