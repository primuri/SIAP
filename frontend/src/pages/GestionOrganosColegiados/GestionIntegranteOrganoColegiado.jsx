import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { IntegranteOrganoColegiadoForm } from "../../components/GestionOrganosColegiados/IntegranteOrganoColegiadoForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { Back } from "../../utils/Back"
import { toast, Toaster } from "react-hot-toast"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { agregarIntegrante, obtenerIntegrantes, eliminarIntegrante, editarIntegrante, agregarVigencia, editarVigencia, eliminarVigencia, agregarOficio, editarOficio, eliminarOficio, obtenerIntegranteOrganoColegiado, obtenerOrganosColegiados } from "../../api/gestionIntegranteOrganoColegiado"
import { useNavigate, useParams } from "react-router-dom"

export const GestionIntegranteOrganoColegiado = () => {
  const { organoID }          = useParams(); 
  const user                  = JSON.parse(localStorage.getItem('user'))
  const navigate              = useNavigate()

  const [data, setData]                                   = useState([])//Todos los Integrantes
  const [reload, setReload]                               = useState(false)
  const [cargado, setCargado]                             = useState(false)
  const [integrante, setIntegrante]                       = useState(null) //Integrante al que se le da click en la tabla para editar
  const [integrantes, setIntegrantes]                     = useState([]) //Integrantes que se muestran
  const [id_organo_colegiado, setOrganoColegiado]         = useState(null)

  const [error, setError]                   = useState(false) //Si hay un error se muestra una página para eso. Este es para el error de permisos.
  const [addClicked, setAddClicked]         = useState(false)
  const [editClicked, setEditClicked]       = useState(false)

  /*
  let {id_organo_colegiado,id} = useParams()
  const user = JSON.parse(localStorage.getItem('user'))
  const [data, setData] = useState([])
  const [selectedIdOrganoCo, setSelectedIdOrganoCo] = useState(null);

  const [clean_id, setClean_id] = useState(id.startsWith('p_id=') ? id.split('p_id=')[1] : '')
  */
  const columns = ['Integrante', 'Inicio de funciones', 'Puesto', 'Número oficio', 'Normativa reguladora', 'Órgano Colegiado']
  const dataKeys = ['nombre_integrante', 'inicio_funciones', 'puesto', 'id_oficio_fk.id_oficio', 'normativa_reguladora', 'id_organo_colegiado_fk.nombre']

  user.groups[0] !== "administrador" ? setError(true) : null  

  const token = localStorage.getItem('token')

  useEffect(() => {                                                           
    async function fetchData() {
      loadIntegrantes()
      setCargado(true);
      const id_organo_colegiado = await loadIntegranteById(organoID);

      setOrganoColegiado(id_organo_colegiado);
    }
    fetchData();
  }, [reload]);
/*
useEffect(() => {
    async function fetchData() {
        
        await loadIntegrantes(clean_id);
        setCargado(true);
    }

    fetchData();
  }, [reload, clean_id]);
*/

  async function loadIntegrantes() {
    try{
      const response = await obtenerIntegranteOrganoColegiado(token, organoID)
        console.log("obtener integrantes")
        console.log(response.data)
        setData(response.data);
        setIntegrantes(response.data)
        setCargado(true);
    } catch (error){
        console.log(error)
    }
  }
  /*
  async function loadIntegrantes(integrante) {
    try {
        setCargado(false);
        const filteredData = res.data.filter(item => item.id_organo_colegiado_fk.id_organo_colegiado === integrante);
        setData(filteredData);
        setIntegrantes(filteredData)
        setCargado(true);

    } catch (error) {
        
    }
  }

  async function loadIntegrantes(integrante) {
    try {
        setCargado(false);
        const filteredData = res.data.filter(item => item.id_organo_colegiado_fk.id_organo_colegiado === integrante);
        setData(filteredData);
        setIntegrantes(filteredData)
        setCargado(true);

    } catch (error) {
        
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id_organo_colegiado && data.length > 0) {
        const idNum = parseInt(id_organo_colegiado, 10);
        const elemento = data.find(e => e.id_organo_colegiado_fk.id_organo_colegiado === idNum);
        if (elemento) {
          setEdit(true);
          setAddClick(false);
          setIntegarnte(elemento);
        } else {
          navigate(`/gestion-organos-colegiados/${id}/gestion-integrantes`);
        }
      }
    };
  
    fetchData(); // Call the async function immediately
  }, [data, id_organo_colegiado]);
  
  const success = () => {
      window.location.href = `/gestion-organos-colegiados/${id}/gestion-integrantes`
  }

*/

  // Manejo de datos que se van a enviar para agregar
  const addIntegrante = async (formData) => {
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
/*
      formData.delete('id_oficio_fk'); // Eliminamos el archivo del FormData original
      formData.delete('json')
      delete Data.integrante.id_integrante
      Data.integrante.id_organo_colegiado_fk = Data.integrante.id_organo_colegiado_fk.id_organo_colegiado
      delete Data.integrante.id_organo_colegiado_fk.id_organo_colegiado

      let fecha_ini = Datos.integrante.id_vigencia_fk.fecha_inicio;
      let fecha_fi = Datos.integrante.id_vigencia_fk.fecha_fin;

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
      delete Datos.integrante.id_vigencia_fk;
*/
      /*
      const id_oc = Datos.integrante.id_organo_colegiado_fk.id_organo_colegiado;
        delete Datos.integrante.id_organo_colegiado_fk;
        Datos.integrante.id_organo_colegiado_fk = clean_id;
        Datos.integrante.id_vigencia_fk = id_vigencia_creado;

        formData.delete(formData.id_integrante);
        formData.delete(formData.id_vigencia_fk);
        formData.delete(formData.id_organo_colegiado_fk);
        formData.append('detalle', Datos.integrante.id_oficio_fk.detalle);

        const id_oficio_creado = await agregarOficio(formData, localStorage.getItem('token'));
        delete Datos.integrante.id_oficio_fk;
        Datos.integrante.id_oficio_fk = id_oficio_creado;
        const id_integrante_creado = await agregarIntegrante(Datos.integrante, localStorage.getItem('token'))
        producto.id_producto_fk.integrante = id_integrante_creado;

        Datos.integrante = id_integrante_creado;

        loadIntegrantes(id_oc)
        */

/*
      Datos.integrante.id_vigencia_fk = id_vigencia_creado;
      formData.delete(formData.id_vigencia_fk);
      
      formData.append('detalle', Data.oficio.detalle)
      delete Data.oficio
      await agregarIntegrante(Data.integrante, formData, token)
*/
        console.log("Entro a add");
        formData.delete('json');
        let fecha_ini = Data.integrante.id_vigencia_fk.fecha_inicio;
        let fecha_fi = Data.integrante.id_vigencia_fk.fecha_fin;

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
        console.log(vigencia);
        console.log("llego a vigencia");
        const id_vigencia_creado = await agregarVigencia(vigencia, token)
        delete Data.integrante.id_vigencia_fk;
        Data.integrante.id_vigencia_fk = id_vigencia_creado;
        console.log("guardo vigencia");

        formData.delete(formData.id_integrante);
        formData.delete(formData.id_vigencia_fk);
        formData.delete(formData.id_organo_colegiado_fk);
        formData.append('detalle', Data.integrante.id_oficio_fk.detalle);
        console.log("hizo delete y append");

        const id_oficio_creado = await agregarOficio(formData, token);
        delete Data.integrante.id_oficio_fk;
        Data.integrante.id_oficio_fk = id_oficio_creado;
        console.log("guardo oficio");

        await agregarIntegrante(Data.integrante, token)

        toast.success('Integrante agregado correctamente', {
            id: toastId,
            duration: 4000, // Duración en milisegundos (4 segundos en este caso)
            position: 'bottom-right', // Posición en la pantalla
            style: {
            background: 'var(--celeste-ucr)',
            color: '#fff',
            },
        })
        setAddClicked(false)
        setReload(!reload)
        document.body.classList.remove('modal-open');
        success()
    } catch (error) {
      toast.dismiss(toastId)
      //await eliminarOficio(Data.id_oficio_fk, token);
      //await eliminarVigencia(Data.id_vigencia_fk, token);
    }

  }

  // Manejo de los datos del formulario de editar 
  const editIntegrante = async (formData) => {
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
      //delete Data.integrante.id_integrante
      //Data.integrante.id_organo_colegiado_fk = Data.integrante.id_organo_colegiado_fk.id_organo_Colegiado
      /*
      const id_integrante = Datos.integrante.id_integrante;
        const id_organo_colegiado = Datos.integrante.id_organo_colegiado_fk.id_organo_colegiado;
        delete Datos.integrante.id_integrante;
        delete Datos.integrante.id_organo_colegiado_fk;
        */
      
        /*
      delete Data.integrante.id_organo_colegiado_fk.id_organo_Colegiado

      const id_vig = Datos.integrante.id_vigencia_fk.id_vigencia;

      let fecha_inicio_adaptada = Datos.integrante.id_vigencia_fk.fecha_inicio;
      let fecha_fin_adaptada = Datos.integrante.id_vigencia_fk.fecha_fin;

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
      */
      /*

        const id_vigencia_editada = Datos.integrante.id_vigencia_fk.id_vigencia;
        delete Datos.integrante.id_vigencia_fk;
        Datos.integrante.id_vigencia_fk = id_vigencia_editada;

        const id_oficio = Datos.integrante.id_oficio_fk.id_oficio;
        formData.delete(formData.id_integrante);
        formData.delete(formData.id_vigencia_fk);
        formData.delete(formData.id_organo_colegiado_fk);
        formData.append('detalle', Datos.integrante.id_oficio_fk.detalle);
        const id_oficio_editada = await editarOficio(id_oficio, formData, localStorage.getItem("token"))
        delete Datos.integrante.id_oficio_fk;
        Datos.integrante.id_oficio_fk = id_oficio_editada.data.id_oficio;

        const id_integrante_editado = await editarIntegrante(id_integrante, Datos.integrante, localStorage.getItem("token"))

        Datos.integrante = id_integrante_editado.data.id_integrante;

        Datos.integrante = id_integrante;
        loadIntegrantes(Datos.integrante.id_organo_colegiado_fk)

      */
/*
      formData.append('detalle', Data.oficio.detalle)
      formData.append('id_oficio', Data.oficio.id_oficio_fk)
      delete Data.oficio

      await actualizarIntegrante(integrante.id_integrante, Data.integrante, formData, token)

*/


        formData.delete('json');

        const id_integrante = Data.integrante.id_integrante;
        const id_organo_colegiado = Data.integrante.id_organo_colegiado_fk.id_organo_colegiado;
        delete Data.integrante.id_integrante;
        delete Data.integrante.id_organo_colegiado_fk;
        Data.integrante.id_organo_colegiado_fk = id_organo_colegiado;

        const id_vig = Data.integrante.id_vigencia_fk.id_vigencia;

        let fecha_inicio_adaptada = Data.integrante.id_vigencia_fk.fecha_inicio;
        let fecha_fin_adaptada = Data.integrante.id_vigencia_fk.fecha_fin;


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
        const id_vigencia_editada = Data.integrante.id_vigencia_fk.id_vigencia;
        delete Data.integrante.id_vigencia_fk;
        Data.integrante.id_vigencia_fk = id_vigencia_editada;

        const id_oficio = Data.integrante.id_oficio_fk.id_oficio;
        formData.delete(formData.id_integrante);
        formData.delete(formData.id_vigencia_fk);
        formData.delete(formData.id_organo_colegiado_fk);
        formData.append('detalle', Data.integrante.id_oficio_fk.detalle);
        const id_oficio_editada = await editarOficio(id_oficio, formData, token)
        delete Data.integrante.id_oficio_fk;
        Data.integrante.id_oficio_fk = id_oficio_editada.data.id_oficio;

        await editarIntegrante(id_integrante, Data.integrante, localStorage.getItem("token"))

        toast.success('Integrante actualizado correctamente', {
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
        success()
    } catch (error) {
      toast.dismiss(toastId)
    }
  }

  // Manejo del eliminar
  const deleteIntegrante = async (id) => { //parametro integrante
    try {
      var toastId = toast.loading('Eliminando...', {
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
          fontSize: '18px',
        },
      });

    /*
        const id = integrante.id_organo_colegiado_fk.id_organo_colegiado;
        await eliminarIntegrante(integrante.id_integrante, localStorage.getItem("token"));
        await eliminarOficio(integrante.id_oficio_fk.id_oficio, localStorage.getItem("token"));
        await eliminarVigencia(integrante.id_vigencia_fk.id_vigencia, localStorage.getItem("token"));

        loadIntegrantes(id)

    */

      await eliminarIntegrante(id, token)
      toast.success('Integrante eliminado correctamente', {
        id: toastId,
        duration: 4000, // Duración en milisegundos (4 segundos en este caso)
        position: 'bottom-right', // Posición en la pantalla
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
        },
      })
      setEdit(false)
      //loadIntegrantes(id)
      setReload(!reload)
      document.body.classList.remove('modal-open');
      success()
    } catch (error) {
      toast.dismiss(toastId)
    }
  }

  // Al hacer click en la tabla
  const elementClicked = (selectedIntegrante) => {
    setIntegrante(selectedIntegrante)
    setEditClicked(true)
    setAddClicked(false)
    document.body.classList.add('modal-open');
  }

  function addBtnClicked () {
    setAddClicked(true)
    setEditClicked(false)
  }

  function onCancel () {
    setAddClicked(false)
    setEditClicked(false)
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
    setIntegrantes(matches)
  }

  function volver() {
    const pathParts = location.pathname.split('/').filter(part => part !== '');
    const newPathParts = pathParts.slice(0, -2);
    const newPath = `/${newPathParts.join('/')}`;
    navigate(newPath);
  }

  async function loadIntegranteById(integranteId) {
    try {
        const organos_colegiados = await obtenerOrganosColegiados(token);
        let idOrganoColegiado = null;
        let nombre = null;

        for (let organo_colegiado of organos_colegiados.data) {
            if (organo_colegiado.id_organo_colegiado == integranteId) {
                idOrganoColegiado = organo_colegiado.id_organo_colegiado;
                nombre = organo_colegiado.nmbre;                                
                break;
            }
        }

        if (idOrganoColegiado && nombre) {
            return [idOrganoColegiado, nombre];  // Devuelve las variables como un array
        } else {
            throw new Error('No se encontró un órgano colegiado que coincida con el integrante');
        }

    } catch (error) {
    
        return null;
    }
  }

  return (
    <main >
      {!error ? (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
            <div className="d-flex flex-row">
                <h1>Gestión de integrantes del Órgano Colegiado:</h1>
                <br></br>
                <h3>{id_organo_colegiado}</h3>
            </div>

            {(!cargado) && (
                <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
            )}

            <div className="d-flex justify-content-between mt-4">
                <Add onClick={addBtnClicked}></Add>
                <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
            </div>

          <Table columns={columns} data={integrantes} dataKeys={dataKeys} onDoubleClick={elementClicked} hasButtonColumn={false} ></Table>
           {(addClicked || editClicked) && (
                <Modal>
                    <IntegranteOrganoColegiadoForm
                        mode={editClicked ? 2 : 1}
                        onSubmit={editClicked ? editIntegrante : addIntegrante}
                        onCancel={onCancel}
                        onDelete={editClicked ? () => deleteIntegrante(integrante.id_integrante) : undefined}
                        integrante={integrante}
                    />
                </Modal>
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

//id_organo={selectedIdOrganoCo}  dentro del form para agregar