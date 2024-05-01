import { AsistenteForm } from "../../components/GestionPersonas/GestionAsistentes/AsistenteForm"
import { agregarAsistente, editarAsistente, obtenerAsistente, eliminarAsistente, eliminarDesignacionAsistente, editarDesignacionAsistente, agregarDesignacionAsistente, obtenerDesignacionAsistente } from "../../api/gestionAsistentes"
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
                                                               
    const user = JSON.parse(localStorage.getItem('user'))                     
    const location = useLocation()
    const navigate = useNavigate()
    const [reload, setReload] = useState(false)                                  
    const [asistentes, setAsistentes] = useState([])                                
    const [cargado, setCargado] = useState(false)                               
    const [data, setData] = useState([])                                                           
    const [asistente, setAsistente] = useState(null)                             
    const [addClick, setAddClick] = useState(false)                           
    const [edit, setEdit] = useState(false)                                     
    const [error, setError] = useState(false)
    const [numVersion, setNumVersion] = useState(null)
    const [id_proyecto, setIdProyecto] = useState(null)                    
    const columns = ['Cedula', 'Nombre', 'Carrera', 'Ponderado', 'Condicion de Estudiante']
    const dataKeys = ['id_asistente_carnet_fk.cedula', 'id_asistente_carnet_fk.id_nombre_completo_fk.nombre', 'id_asistente_carnet_fk.carrera', 'id_asistente_carnet_fk.promedio_ponderado', 'id_asistente_carnet_fk.condicion_estudiante']

    user.groups[0] !== "administrador" ? setError(true) : null                

    useEffect(() => {                                                          
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
          const response = await obtenerDesignacionAsistente(localStorage.getItem('token'));
          const filteredData = response.data.filter(item => item.id_version_proyecto_fk.numero_version === numVersion);
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
    

  const addAsistente = async (formData) => {
    try {
        var toastId = toast.loading('Agregando...', {
            position: 'bottom-right',
            style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
                fontSize: '18px',
            },
        });

        let id_documento_creada = ""
        const documentoFile = formData.get('id_documento_inopia_fk');
        formData.delete('id_documento_inopia_fk');
    

        const Datos = JSON.parse(formData.get('json'));
        formData.delete('json');

        if (documentoFile) {
            const DocumentoData = new FormData();
            DocumentoData.append('documento', documentoFile);
            DocumentoData.append('detalle', Datos.id_documento_inopia_fk.detalle);
            DocumentoData.append('tipo', Datos.id_documento_inopia_fk.tipo);

            id_documento_creada = await agregarDocumentacion( DocumentoData, localStorage.getItem('token'));
            formData.delete('json')
            delete Datos.id_documento_inopia_fk;
        }

        delete Datos.id_asistente_carnet_fk.id_nombre_completo_fk.id_nombre_completo;
        const nombre_asistente = Datos.id_asistente_carnet_fk.id_nombre_completo_fk;
        const id_nombre_creado = await obtenerNombre(nombre_asistente, localStorage.getItem('token'))
        Datos.id_asistente_carnet_fk.id_nombre_completo_fk = id_nombre_creado;
        

        delete Datos.id_asistente_carnet_fk.id_asistente_carnet;
        const id_asistente_creado = await agregarAsistente(Datos.id_asistente_carnet_fk, localStorage.getItem('token'))
        delete  Datos.id_asistente_carnet_fk;
        let designacion_asistente;
        if(id_documento_creada === ""){
            designacion_asistente = {  
                id_version_proyecto_fk: proyectoID,              
                id_asistente_carnet_fk : id_asistente_creado,
                cantidad_horas : Datos.cantidad_horas,
                consecutivo : Datos.consecutivo
            }
        } else {
            designacion_asistente = {  
                id_version_proyecto_fk: proyectoID,              
                id_asistente_carnet_fk : id_asistente_creado,
                id_documento_inopia_fk : id_documento_creada,
                cantidad_horas : Datos.cantidad_horas,
                consecutivo : Datos.consecutivo
            }
        }
        await agregarDesignacionAsistente(designacion_asistente, localStorage.getItem('token'));


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
      console.error(error);
      toast.dismiss(toastId)
    }

  }
    const editAsistente = async (formData) => {
        try {
            let id_docu = -1;
            const documentoFile = formData.get('id_documento_inopia_fk');
            formData.delete('id_documento_inopia_fk');

            const Datos = JSON.parse(formData.get('json'));
            formData.delete('json');

            if (documentoFile) {
                const DocumentoData = new FormData();
                DocumentoData.append('documento', documentoFile);
                DocumentoData.append('detalle', Datos.id_documento_inopia_fk.detalle);
                DocumentoData.append('tipo', Datos.id_documento_inopia_fk.tipo);
                id_docu = Datos.id_documento_inopia_fk.id_documento;
                if(id_docu === ""){
                    id_docu = await agregarDocumentacion( DocumentoData, localStorage.getItem('token'));
                    await editarDocumentacion(id_docu, DocumentoData, localStorage.getItem('token'));
            }else{
                await editarDocumentacion(id_docu, DocumentoData, localStorage.getItem('token'));
            }
           
            }else{
                const DocumentoData = new FormData();
                DocumentoData.append('detalle', Datos.id_documento_inopia_fk.detalle);
                DocumentoData.append('tipo', Datos.id_documento_inopia_fk.tipo);
                id_docu = Datos.id_documento_inopia_fk.id_documento;
                if(id_docu === ""){
                    id_docu = await agregarDocumentacion( DocumentoData, localStorage.getItem('token'));
                    await editarDocumentacion(id_docu, DocumentoData, localStorage.getItem('token'));
            }else{
                await editarDocumentacion(id_docu, DocumentoData, localStorage.getItem('token'));
            }
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
            let id_doc;
            if(id_docu === -1){
                id_doc = Datos.id_documento_inopia_fk.id_documento;
            }else{
                id_doc = id_docu;
            }
           
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
            await editarDesignacionAsistente(id_designacion, designacion, localStorage.getItem("token"))

            
            

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
            console.error(error)
        }
    }

    const deleteAsistente = async (asistente) => {
        try {
          
            
            await eliminarDesignacionAsistente(asistente.id_designacion_asistente, localStorage.getItem('token'))
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
              return [idCodigoVi, numVersion, descripcion];
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
