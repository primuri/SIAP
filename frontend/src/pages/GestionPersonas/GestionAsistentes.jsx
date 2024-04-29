import { AsistenteForm } from "../../components/GestionPersonas/GestionAsistentes/AsistenteForm"
import { agregarAsistente, editarAsistente, obtenerAsistente, eliminarAsistente, eliminarDesinacionAsistente, editarDesinacionAsistente, agregarDesinacionAsistente, obtenerDesinacionAsistente } from "../../api/gestionAsistentes"
import { editarNombre, obtenerNombre } from "../../api/gestionAcademicos"
import { agregarDocumentacion,editarDocumentacion, eliminarDocumentacion } from "../../api/gestionProductos"
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { Back } from "../../utils/Back"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerVersionProyectos } from '../../api/gestionProyectos';
export const GestionAsistentes = () => {
    let { proyectoID } = useParams();

    // Estados                                                                   // Son objetos que contienen información para un componente y puede cambiar
    const user = JSON.parse(localStorage.getItem('user'))                        // Se recupera el usuario local del navegador, el que está usando el sistema
    const location = useLocation()
    const navigate = useNavigate()
    const [reload, setReload] = useState(false)                                  // Para controlar cuándo se debe de recargar la página
    const [asistentes, setAsistentes] = useState([])                                 // Estado para almacenar todos los informes
    const [cargado, setCargado] = useState(false)                                // Para controlar si los informes se cargaron o no  
    const [data, setData] = useState([])                                         // Todos los informes.                          
    const [asistente, setAsistente] = useState(null)                                 // Informe al que se le da click en la tabla.
    const [addClick, setAddClick] = useState(false)                              // Cuando se da click en agregar
    const [edit, setEdit] = useState(false)                                      // Cuando se da click en editar
    const [error, setError] = useState(false)
    const [numVersion, setNumVersion] = useState(null)
    const [id_proyecto, setIdProyecto] = useState(null)                          // Cuando hay un error
    const columns = ['Cedula', 'Nombre', 'Carrera', 'Ponderado', 'Condicion de Estudiante']
    const dataKeys = ['id_asistente_carnet_fk.cedula', 'id_asistente_carnet_fk.id_nombre_completo_fk.nombre', 'id_asistente_carnet_fk.carrera', 'id_asistente_carnet_fk.promedio_ponderado', 'id_asistente_carnet_fk.condicion_estudiante']

    user.groups[0] !== "administrador" ? setError(true) : null                   // Si no es administrador, pone el error en true

    useEffect(() => {                                                            // Cuando reload cambia, se llama a load()
        async function fetchData() {
            
            setCargado(true);
            const id_version_proyecto = await loadAsistenteById(proyectoID);

            setIdProyecto(id_version_proyecto[2]);
            setNumVersion(id_version_proyecto[1]);
        }
        fetchData();
    }, [reload]);

    async function loadAsistentes( numVersion) {
        try {
          const response = await obtenerDesinacionAsistente(localStorage.getItem('token')); // Asegúrate de pasar proyectoID aquí
          const filteredData = response.data.filter(item => item.id_version_proyecto_fk.numero_version === numVersion);
          console.log(filteredData)
          setData(filteredData);                                                                     
          setAsistentes(filteredData);                                                               
          setCargado(true);                                                                          
      } catch (error) {
          console.error("Error al cargar asistentes:", error);
          toast.error('Error al cargar los datos de asistentes', {
              duration: 4000,
              position: 'bottom-right',
              style: {
                  background: '#670000',
                  color: '#fff',
              },
          });
      }
  }
    

  // Manejo de datos que se van a enviar para agregar
  const addAsistente = async (formData) => {
    try {
        let id_documento_creada = ""
        var toastId = toast.loading('Agregando...', {
            position: 'bottom-right',
            style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
                fontSize: '18px',
            },
        });

        const documentoFile = formData.get('id_documento_inopia_fk');
        formData.delete('id_documento_inopia_fk'); // Eliminamos el archivo del FormData original
    

        const Datos = JSON.parse(formData.get('json'));
        formData.delete('json'); // Limpiamos formData

    // Si existe el archivo, procedemos a manejarlo según sea necesario
    if (documentoFile) {
        const DocumentoData = new FormData();
        DocumentoData.append('documento', documentoFile);
        DocumentoData.append('detalle', Datos.id_documento_inopia_fk.detalle);
        DocumentoData.append('tipo', Datos.id_documento_inopia_fk.tipo);
        // Aquí deberías tener el ID del documento si es necesario para editarDocumentacion
        // Supongamos que lo obtenemos de alguna manera, por ejemplo:

        id_documento_creada = await agregarDocumentacion( DocumentoData, localStorage.getItem('token'));
        formData.delete('json')
        delete Datos.id_documento_inopia_fk;
        // Aquí deberías ajustar según cómo necesitas manejar la respuesta de editarDocumentacion
      }

        delete Datos.id_asistente_carnet_fk.id_nombre_completo_fk.id_nombre_completo;
        const nombre_asistente = Datos.id_asistente_carnet_fk.id_nombre_completo_fk;
        const id_nombre_creado = await obtenerNombre(nombre_asistente, localStorage.getItem('token'))
        Datos.id_asistente_carnet_fk.id_nombre_completo_fk = id_nombre_creado;
        

        delete Datos.id_asistente_carnet_fk.id_asistente_carnet;
        const id_asistente_creado = await agregarAsistente(Datos.id_asistente_carnet_fk, localStorage.getItem('token'))
        delete  Datos.id_asistente_carnet_fk;

        const designacion_asistente = {  
            id_version_proyecto_fk: proyectoID,              
            id_asistente_carnet_fk : id_asistente_creado,
            id_documento_inopia_fk : id_documento_creada,
            cantidad_horas : Datos.cantidad_horas,
            consecutivo : Datos.consecutivo
        }
        await agregarDesinacionAsistente(designacion_asistente, localStorage.getItem('token'));


      toast.success('Asistente agregado correctamente', {
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
      console.log(error);
      toast.dismiss(toastId)
    }

  }
    // Manejo de los datos del formulario de editar 
    const editAsistente = async (formData) => {
        try {


              //falta hacer lo de documento que funcione
            //formData.append('detalle', Datos.id_documento_inopia_fk.detalle)
            //await editarDocumento(id_doc, formData, localStorage.getItem("token"))
            const documentoFile = formData.get('id_documento_inopia_fk');
            formData.delete('id_documento_inopia_fk'); // Eliminamos el archivo del FormData original

            // Ahora extraemos y parseamos los datos JSON del FormData
            const Datos = JSON.parse(formData.get('json'));
            formData.delete('json'); // Limpiamos formData

            // Si existe el archivo, procedemos a manejarlo según sea necesario
            if (documentoFile) {
            const DocumentoData = new FormData();
            DocumentoData.append('documento', documentoFile);
            DocumentoData.append('detalle', Datos.id_documento_inopia_fk.detalle);
            // Aquí deberías tener el ID del documento si es necesario para editarDocumentacion
            // Supongamos que lo obtenemos de alguna manera, por ejemplo:
            const id_docu = Datos.id_documento_inopia_fk.id_documento;
            await editarDocumentacion(id_docu, DocumentoData, localStorage.getItem('token'));
            // Aquí deberías ajustar según cómo necesitas manejar la respuesta de editarDocumentacion
            }

           
            
            const id_nombre_compl = Datos.id_asistente_carnet_fk.id_nombre_completo_fk.id_nombre_completo;

            const nombre_completo = {
                nombre: Datos.id_asistente_carnet_fk.id_nombre_completo_fk.nombre,
                apellido: Datos.id_asistente_carnet_fk.id_nombre_completo_fk.apellido,
                segundo_apellido: Datos.id_asistente_carnet_fk.id_nombre_completo_fk.segundo_apellido
            }

            await editarNombre(id_nombre_compl, nombre_completo, localStorage.getItem("token"))
            const id_nombre_editada = Datos.id_asistente_carnet_fk.id_nombre_completo_fk.id_nombre_completo
            delete Datos.id_asistente_carnet_fk.id_nombre_completo_fk
            Datos.id_asistente_carnet_fk.id_nombre_completo_fk = id_nombre_editada

            const id_asistente = Datos.id_asistente_carnet_fk.id_asistente_carnet;

            const asistente_carne = {
                condicion_estudiante: Datos.id_asistente_carnet_fk.condicion_estudiante,
                cedula: Datos.id_asistente_carnet_fk.cedula,
                carrera: Datos.id_asistente_carnet_fk.carrera,
                promedio_ponderado: Datos.id_asistente_carnet_fk.promedio_ponderado,
                id_nombre_completo_fk: id_nombre_editada
            }

            await editarAsistente(id_asistente, asistente_carne, localStorage.getItem("token"))
            const id_asistente_editado = Datos.id_asistente_carnet_fk.id_asistente_carnet
            delete Datos.id_asistente_carnet_fk
            Datos.id_asistente_carnet_fk = id_asistente_editado


            const id_doc = Datos.id_documento_inopia_fk.id_documento;
            delete Datos.id_documento_inopia_fk.id_documento;


            
            Datos.id_documento_inopia_fk = id_doc


            const id_designacion = Datos.id_designacion_asistente;

            const designacion = {
                cantidad_horas: Datos.cantidad_horas,
                consecutivo: Datos.consecutivo,
                id_asistente_carnet_fk: Datos.id_asistente_carnet_fk,
                id_documento_inopia_fk: Datos.id_documento_inopia_fk,
                id_version_proyecto_fk: proyectoID
            }
            await editarDesinacionAsistente(id_designacion, designacion, localStorage.getItem("token"))

            
            

            toast.success('Asistente editado correctamente', {
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
            console.log(error)
        }
    }

    // Manejo del eliminar
    const deleteAsistente = async (asistente) => {
        try {
          
            
            await eliminarDesinacionAsistente(asistente.id_designacion_asistente, localStorage.getItem('token'))
            await eliminarDocumentacion(asistente.id_documento_inopia_fk.id_documento, localStorage.getItem('token'))
            await eliminarAsistente(asistente.id_asistente_carnet_fk.id_asistente_carnet, localStorage.getItem('token'))

            toast.success('Asistente eliminado correctamente', {
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


    // Al darle click a cancelar, se cierra el modal
    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
        document.body.classList.remove('modal-open');
    }

    // Al darle click a agregar, muestra el modal
    const addClicked = () => {
        setAddClick(true)
        setEdit(false)
        document.body.classList.add('modal-open');

    }

    // Al hacer click en la tabla
    const elementClicked = (selectedAsistente) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            navigate(`${location.pathname}/${selectedAsistente.id_asistente}/gestion-asistentes`)
        } else {
            setAsistente(selectedAsistente);
            setEdit(true);
            setAddClick(false);
            document.body.classList.add('modal-open');
        }
    };

    // Obtener atributo de un objeto 
    function getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }

    // Búsqueda filtrada
    const search = (col, filter) => {
        const matches = data.filter((e) => {
            if (col.includes('.')) {
                const value = getValueByPath(e, col)
                return value && value.toString().includes(filter)
            }
            return e[col].toString().includes(filter)
        })
        setAsistentes(matches)
    }


    const volver = () => {
        const pathParts = location.pathname.split('/').filter(part => part !== '');
        const newPathParts = pathParts.slice(0, -2);
        const newPath = `/${newPathParts.join('/')}`;
        navigate(newPath);
    }


    async function loadAsistenteById(asistenteId) {
        try {
            const versiones = await obtenerVersionProyectos(localStorage.getItem('token'));
            let idCodigoVi = null;
            let numVersion = null;
            let descripcion = null;

            for (let version of versiones.data) {
                if (version.id_version_proyecto == asistenteId) {
                    idCodigoVi = version.id_codigo_vi_fk.id_codigo_vi;
                    numVersion = version.numero_version;                 
                    descripcion = version.id_codigo_vi_fk.id_codigo_cimpa_fk.descripcion;                
                    break;
                }
            }

            if (idCodigoVi && numVersion && descripcion) {
              loadAsistentes(numVersion) 
              return [idCodigoVi, numVersion, descripcion]; // Devuelve las variables como un array
            } else {
                throw new Error('No se encontró una versión de proyecto que coincida con el asistente');
            }

        } catch (error) {
        
            return null;
        }
    }

  

    return (
        <main>
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <div className=" flex-row">
                        <h1>Gestión de Asistentes de la versión {numVersion} de: </h1>
                        <br></br>
                        <h3>{id_proyecto}</h3>
                    </div>

                    {(!cargado) && (
                        <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                    )}             

                    <div className="d-flex justify-content-between mt-4">
                        <Add onClick={addClicked}></Add>
                        <Search colNames={columns.slice(0, -1)} columns={dataKeys.slice(0, -1)} onSearch={search}></Search>
                    </div>
                    <Table columns={columns} data={asistentes} dataKeys={dataKeys} onDoubleClick ={elementClicked} />
                    {addClick && (
                        <Modal><AsistenteForm onSubmit={addAsistente} onCancel={onCancel} mode={1}></AsistenteForm></Modal>
                    )}
                    {edit && (
                        <Modal>
                            <AsistenteForm
                                mode={2}
                                onSubmit={editAsistente}
                                onCancel={onCancel}
                                onDelete={() => deleteAsistente(asistente)}
                                asistente={asistente}
                            >
                            </AsistenteForm>
                        </Modal>
                    )}
                    <Toaster></Toaster>
                    <div className="d-flex justify-content-start">
                        <Back onClick={volver}>Regresar</Back>
                    </div>
                </div>
            ) : (
                <PermisoDenegado></PermisoDenegado>
            )}
        </main>
    );
    
}    
