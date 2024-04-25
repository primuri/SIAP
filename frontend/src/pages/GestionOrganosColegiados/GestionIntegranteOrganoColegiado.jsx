import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { IntegranteOrganoColegiadoForm } from "../../components/GestionOrganosColegiados/IntegranteOrganoColegiadoForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { Back } from "../../utils/Back"
import { toast, Toaster } from "react-hot-toast"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { agregarIntegrante, obtenerIntegrantes, eliminarIntegrante, editarIntegrante, agregarVigencia, editarVigencia, eliminarVigencia, agregarOficio, editarOficio, eliminarOficio } from "../../api/gestionIntegranteOrganoColegiado"
import { useNavigate, useParams } from "react-router-dom"

export const GestionIntegranteOrganoColegiado = () => {
  let {id_organo,id}                    = useParams()
  const user                            = JSON.parse(localStorage.getItem('user'))
  const navigate                        = useNavigate()
  const [clean_id, setClean_id]         = useState(id.startsWith('o_id=') ? id.split('o_id=')[1] : '')

  const [data, setData]                                                 = useState([])
  const [reload, setReload]                                             = useState(false)
  const [cargado, setCargado]                                           = useState(false)
  const [integrante, setIntegrante]                                     = useState(null)
  const [integrantes, setIntegrantes]                                   = useState([])
  const [organo_colegiado, setOrganoColegiado]                          = useState(null)
  const [selectedIdOrganoColegiado, setSelectedIdOrganoColegiado]       = useState(null);

  const [error, setError]                   = useState(false)
  const [addClick, setAddClick]             = useState(false)
  const [edit, setEdit]                     = useState(false)

  const columns = ['Integrante', 'Inicio de funciones', 'Puesto', 'Número oficio', 'Normativa reguladora', 'Órgano Colegiado']
  const dataKeys = ['nombre_integrante', 'inicio_funciones', 'puesto', 'id_oficio_fk.id_oficio', 'normativa_reguladora', 'id_organo_colegiado_fk.nombre']

  user.groups[0] !== "administrador" ? setError(true) : null  

  const token = localStorage.getItem('token')

  const transformedIntegrantes = integrantes.map(integrante => ({
    ...integrante,  
    inicio_funciones: formatDate(integrante.inicio_funciones) 
  }));

  useEffect(() => {
    async function fetchData() {
        await loadIntegrantes(clean_id);
        setCargado(true);
    }

    fetchData();
  }, [reload, clean_id]);

  async function loadIntegrantes(clean_id) {
    try {
        const response = await obtenerIntegrantes(token);
        response.data.forEach(item => {
        });

        const formattedAndFilteredData = response.data.map(item => ({
            ...item,
            inicio_funciones: item.inicio_funciones ? formatDate(item.inicio_funciones) : 'No especificado'
        })).filter(item => {
            return Number(item.id_organo_colegiado_fk.id_organo_colegiado) === Number(clean_id);
        });

        setData(formattedAndFilteredData);
        setIntegrantes(formattedAndFilteredData);
        setCargado(true);

    } catch (error) {
        console.error('Error al cargar integrantes:', error);
    }
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0];
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id_organo && data.length > 0) {
        const idNum = parseInt(id_organo, 10);
        const elemento = data.find(e => e.id_organo_colegiado_fk.id_organo_colegiado === idNum);
        if (elemento) {
          setEdit(true);
          setAddClick(false);
          setOrganoColegiado(elemento);
        } else {
          navigate(`/gestion-organos-colegiados/${id}/gestion-integrantes`);
        }
      }
    };
  
    fetchData();
  }, [data, organo_colegiado]);
  
  const success = () => {
      window.location.href = `/gestion-organos-colegiados/${id}/gestion-integrantes`
  }

  const addIntegrante = async (formData) => {
    const Data = JSON.parse(formData.get('json'))
    try {
        var toastId = toast.loading('Agregando...', {
            position: 'bottom-right',
            style: {
            background: 'var(--celeste-ucr)',
            color: '#fff',
            fontSize: '18px',
            },
        });

        formData.delete('json');

        let fecha_ini = Data.id_vigencia_fk.fecha_inicio;
        let fecha_fi = Data.id_vigencia_fk.fecha_fin;

        if (!fecha_ini || fecha_ini.trim() === "") {
            fecha_ini = null;
        }

        if (!fecha_fi || fecha_fi.trim() === "") {
            fecha_fi = null;
        }
        const vigencia = {
            fecha_inicio: fecha_ini,
            fecha_fin: fecha_fi
        }
        const id_vigencia_creado = await agregarVigencia(vigencia, token)
        delete Data.id_vigencia_fk;
        Data.id_vigencia_fk = id_vigencia_creado;

        const id_oc = Data.id_organo_colegiado_fk.id_organo_colegiado;
        delete Data.id_organo_colegiado_fk;

        Data.id_organo_colegiado_fk = clean_id;
        delete Data.id_integrante;

        formData.delete(formData.id_integrante);
        formData.delete(formData.id_vigencia_fk);
        formData.delete(formData.id_organo_colegiado_fk);
        formData.append('detalle', Data.id_oficio_fk.detalle);

        const id_oficio_creado = await agregarOficio(formData, token);
        delete Data.id_oficio_fk;
        Data.id_oficio_fk = id_oficio_creado;

        await agregarIntegrante(Data, token)

        loadIntegrantes(id_oc)

        toast.success('Integrante agregado correctamente', {
            id: toastId,
            duration: 4000,
            position: 'bottom-right',
            style: {
            background: 'var(--celeste-ucr)',
            color: '#fff',
            },
        })
        setAddClick(false)
        loadIntegrantes(id_oc)
        success()
    } catch (error) {
      toast.dismiss(toastId)
    }
  }

  const editIntegrante = async (formData) => {
    try {
        var toastId = toast.loading('Editando...', {
            position: 'bottom-right',
            style: {
            background: 'var(--celeste-ucr)',
            color: '#fff',
            fontSize: '18px',
            },
        });
        const Data = JSON.parse(formData.get('json'))

        formData.delete('json')

        const id_integrante = Data.id_integrante;
        const id_organo_colegiado = Data.id_organo_colegiado_fk.id_organo_colegiado;
        delete Data.id_integrante;
        delete Data.id_organo_colegiado_fk;
        Data.id_organo_colegiado_fk = id_organo_colegiado;

        const id_vig = Data.id_vigencia_fk.id_vigencia;

        let fecha_inicio_adaptada = Data.id_vigencia_fk.fecha_inicio;
        let fecha_fin_adaptada = Data.id_vigencia_fk.fecha_fin;

        if (!fecha_inicio_adaptada) {
            fecha_inicio_adaptada = null;
        } else {
            if (!fecha_inicio_adaptada.endsWith("Z")) {
                fecha_inicio_adaptada += "T00:00:00Z";
            }
        }

        if (!fecha_fin_adaptada) {
            fecha_fin_adaptada = null;
        } else {
            if (!fecha_fin_adaptada.endsWith("Z")) {
                fecha_fin_adaptada += "T00:00:00Z";
            }
        }

        const vigencia = {
            fecha_inicio: fecha_inicio_adaptada,
            fecha_fin: fecha_fin_adaptada
        }

        await editarVigencia(id_vig, vigencia, token)
        const id_vigencia_editada = Data.id_vigencia_fk.id_vigencia;
        delete Data.id_vigencia_fk;
        Data.id_vigencia_fk = id_vigencia_editada;

        const id_oficio = Data.id_oficio_fk.id_oficio;
        formData.delete(formData.id_integrante);
        formData.delete(formData.id_vigencia_fk);
        formData.delete(formData.id_organo_colegiado_fk);
        formData.append('detalle', Data.id_oficio_fk.detalle);
        const id_oficio_editada = await editarOficio(id_oficio, formData, token)
        delete Data.id_oficio_fk;
        Data.id_oficio_fk = id_oficio_editada.data.id_oficio;

        await editarIntegrante(id_integrante, Data, localStorage.getItem("token"))

        loadIntegrantes(Data.id_organo_colegiado_fk)

        toast.success('Integrante actualizado correctamente', {
            id: toastId,
            duration: 4000,
            position: 'bottom-right', 
            style: {
            background: 'var(--celeste-ucr)',
            color: '#fff',
            },
        })
        setEdit(false)
        loadIntegrantes(Data.id_organo_colegiado_fk)
        success()
    } catch (error) {
      toast.dismiss(toastId)
    }
  }

  const deleteIntegrante = async (integrante) => { 
    try {
      var toastId = toast.loading('Eliminando...', {
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
          fontSize: '18px',
        },
      });

      const id = integrante.id_organo_colegiado_fk.id_organo_colegiado;

      await eliminarIntegrante(integrante.id_integrante, token)
      await eliminarOficio(integrante.id_oficio_fk.id_oficio, token);
      await eliminarVigencia(integrante.id_vigencia_fk.id_vigencia, token);

      loadIntegrantes(id)

      toast.success('Integrante eliminado correctamente', {
        id: toastId,
        duration: 4000,
        position: 'bottom-right', 
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
        },
      })
      setEdit(false)
      loadIntegrantes(id)
      success()
    } catch (error) {
      toast.dismiss(toastId)
    }
  }

  const onCancel = () => {
    setAddClick(false)
    setEdit(false)
    navigate(`/gestion-organos-colegiados/${id}/gestion-integrantes`)
  }

  const addClicked = () => {
    setAddClick(true)
    setEdit(false)
  }

  const elementClicked = (selectedIntegrante) => {
    setIntegrante(selectedIntegrante)
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
    setIntegrantes(matches)
  }

  function volver() {
    const pathParts = location.pathname.split('/').filter(part => part !== '');
    const newPathParts = pathParts.slice(0, -2);
    const newPath = `/${newPathParts.join('/')}`;
    navigate(newPath);
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0];
  }

  return (
    <main >
      {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
            <div className="d-flex flex-row">
                <h1>Gestión de integrantes del Órgano Colegiado</h1>
            </div>

            {(!cargado) && (
                <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
            )}

            <div className="d-flex justify-content-between mt-4">
                <Add onClick={addClicked}></Add>
                <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
            </div>

          <Table columns={columns} data={transformedIntegrantes} dataKeys={dataKeys} onDoubleClick={elementClicked} hasButtonColumn={false} navigate={navigate} ></Table>
           {addClick && (
                <Modal ><IntegranteOrganoColegiadoForm 
                    id_organo={selectedIdOrganoColegiado} 
                    onSubmit={addIntegrante} 
                    onCancel={onCancel} 
                    mode={1}>
                </IntegranteOrganoColegiadoForm></Modal>
           )}
            {edit && (
                <Modal ><IntegranteOrganoColegiadoForm
                    mode={2}
                    onSubmit={editIntegrante}
                    onCancel={onCancel}
                    onDelete={() => deleteIntegrante(integrante)}
                    integrante={integrante}>
                </IntegranteOrganoColegiadoForm></Modal>
            )}
          <Toaster></Toaster>
          <div className="d-flex justify-content-start">
            <Back onClick={volver}>Regresar a órganos colegiados</Back>
          </div>
        </div>
      ) : (
        <PermisoDenegado></PermisoDenegado>
      )}
    </main>)
} 
