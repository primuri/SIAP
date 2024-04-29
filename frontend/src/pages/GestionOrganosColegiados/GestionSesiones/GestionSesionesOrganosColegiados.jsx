import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Add } from "../../../utils/Add"
import { Modal } from "../../../utils/Modal"
import { Table } from "../../../utils/Table"
import { Search } from "../../../utils/Search"
import { PermisoDenegado } from "../../../utils/PermisoDenegado"
import { Back } from "../../../utils/Back"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerSesiones, obtenerNumeroAcuerdos, agregarSesion, editarSesion, eliminarSesion, agregarDocumento, addActa, addConvocatoria, addAgenda, editarDocumento, editarAgenda} from "../../../api/gestionOrganosColegiados"
import { OrganosColegiadosSesionesForm  } from "../../../components/GestionOrganosColegiados/OrganosColegiadosSesionesForm"

export const GestionSesionesOrganosColegiados= () => {
                                                             
    const user = JSON.parse(localStorage.getItem('user'))  
    
    const { IdOrganoC } = useParams();
    const location = useLocation();
    const nombreOC = location.state ? location.state.nombreOC : null;
    const navigate = useNavigate()
    const [data, setData] = useState([]) 
    const [reload, setReload] = useState(false)   
    const [cargado, setCargado] = useState(false)   
    const [sesion, setSesion] = useState(null)                                
    const [sesiones, setSesiones] = useState([])   
    
                        
    const [addClick, setAddClick] = useState(false)                              
    const [edit, setEdit] = useState(false)                                      
    const [error, setError] = useState(false)

    const columns = ['Identificador', 'Fecha', 'Número de acta', 'Cantidad de acuerdos', 'Acuerdos']
    const dataKeys = ['id_sesion','fecha', 'id_acta_fk.id_acta', 'n_acuerdos', '']

    user.groups[0] !== "administrador" ? setError(true) : null 
    
    const transformedSesiones = sesiones.map(sesion => ({
        ...sesion,  
        fecha: formatDate(sesion.fecha) 
      }));
    

    useEffect(() => {                                                            
        async function fetchData() {
            loadSesiones()
            setCargado(true);
        }
        fetchData();
    }, [reload]);
    
    function formatearFecha(response) {
        return response.data.map((obj) => {
            const fechaISO = obj.fecha;
            const dateObj = new Date(fechaISO);
            const fechaFormateada = dateObj.toISOString().split('T')[0];

            return { ...obj, fecha: fechaFormateada };
        });
    }


    async function loadSesiones() {
        try {
            const response = await obtenerSesiones(localStorage.getItem('token'));
            setSesion(formatearFecha(response))
            
            const sesionesFiltradas = response.data.filter(sesion => sesion.id_organo_colegiado_fk.id_organo_colegiado == IdOrganoC);

            for (const sesion of sesionesFiltradas) {
                const n_acuerdos = await obtenerNumeroAcuerdos(sesion.id_sesion);
                sesion.n_acuerdos = n_acuerdos;
            }
    
            setData(sesionesFiltradas);                                                                 
            setSesiones(sesionesFiltradas);                                                              
            setCargado(true);                                                                        
        } catch (error) {
            console.error(error);
        }
    }

    const addSesiones = async (formData) => {
        
        var toastId = toast.loading('Agregando...', {
            position: 'bottom-right',
            style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
                fontSize: '18px',
            },
        });
        
        try {
            let id_convocatoria_creado;
            let  id_acta_doc_creado;
            const convocatoraFile = formData.get('id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.documento');
            formData.delete('id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.documento');
    
            const actaFile = formData.get('id_acta_fk.id_documento_acta_fk.documento');
            formData.delete('id_acta_fk.id_documento_acta_fk.documento');

            const Datos = JSON.parse(formData.get('json'));
            formData.delete('json'); 

           
            if (convocatoraFile && actaFile) {
                const DocumentoComvocatoria = new FormData();

                DocumentoComvocatoria.append('documento', convocatoraFile);
                DocumentoComvocatoria.append('detalle', Datos.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.detalle);
                DocumentoComvocatoria.append('tipo', Datos.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.tipo);
    
                const DocumentoActa = new FormData();
                DocumentoActa.append('documento', actaFile);
                DocumentoActa.append('detalle', Datos.id_acta_fk.id_documento_acta_fk.detalle);
                DocumentoActa.append('tipo', Datos.id_acta_fk.id_documento_acta_fk.tipo);
    
                id_convocatoria_creado = await agregarDocumento(DocumentoComvocatoria, localStorage.getItem('token'));
                id_acta_doc_creado = await agregarDocumento(DocumentoActa, localStorage.getItem('token'));
            }

          

          delete Datos.id_agenda_fk.id_convocatoria_fk.id_convocatoria
          Datos.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk = id_convocatoria_creado
          const id_convocatoria_creada = await addConvocatoria(Datos.id_agenda_fk.id_convocatoria_fk);
          Datos.id_agenda_fk.id_convocatoria_fk = id_convocatoria_creada
          delete Datos.id_agenda_fk.id_agenda;
          const id_agenda_creada = await addAgenda(Datos.id_agenda_fk);
          Datos.id_agenda_fk = id_agenda_creada

          delete Datos.id_acta_fk.id_acta;
          Datos.id_acta_fk.id_documento_acta_fk = id_acta_doc_creado;
          const id_acta_creada = await addActa(Datos.id_acta_fk);
          Datos.id_acta_fk = id_acta_creada;
          Datos.id_organo_colegiado_fk = IdOrganoC;

            await agregarSesion(Datos)

            

            toast.success('Sesion agregada correctamente', {
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
              document.body.classList.remove('modal-open');

        } catch (error) {
            console.error("Error: \n" + error)
            toast.dismiss(toastId)
        }
    }

    const editaSesion = async (formData) => {
        
        try {   
            var toastId = toast.loading('Agregando...', {
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                    fontSize: '18px',
                },
            });

           

            
            const convocatoraFile = formData.get('id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.documento');
            formData.delete('id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.documento');
    
            const actaFile = formData.get('id_acta_fk.id_documento_acta_fk.documento');
            formData.delete('id_acta_fk.id_documento_acta_fk.documento');

            const Datos = JSON.parse(formData.get('json'));
            formData.delete('json');

            let id_docu_convocatoria;
            let id_docu_acta 

            
            if (convocatoraFile && actaFile) {
                const DocumentoComvocatoria = new FormData();
                DocumentoComvocatoria.append('documento', convocatoraFile);
                DocumentoComvocatoria.append('detalle', Datos.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.detalle);
                DocumentoComvocatoria.append('tipo', Datos.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.tipo);
                
                id_docu_convocatoria = Datos.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.id_documento;
                await editarDocumento(id_docu_convocatoria, DocumentoComvocatoria);


                const DocumentoActa = new FormData();
                DocumentoActa.append('documento', actaFile);
                DocumentoActa.append('detalle', Datos.id_acta_fk.id_documento_acta_fk.detalle);
                DocumentoActa.append('tipo', Datos.id_acta_fk.id_documento_acta_fk.tipo);
                
               
                id_docu_acta = Datos.id_acta_fk.id_documento_acta_fk.id_documento;
                await editarDocumento(id_docu_acta, DocumentoActa);
            
            }

           
            const id_agenda_editada = Datos.id_agenda_fk.id_agenda;
            delete Datos.id_agenda_fk.id_agenda
            Datos.id_agenda_fk.id_convocatoria_fk = Datos.id_agenda_fk.id_convocatoria_fk.id_convocatoria;
            await editarAgenda(id_agenda_editada, Datos.id_agenda_fk);
            Datos.id_agenda_fk = id_agenda_editada
            Datos.id_acta_fk = Datos.id_acta_fk.id_acta

            const id_sesion_editada = parseInt(Datos.id_sesion, 10);
            delete  Datos.id_sesion

            await editarSesion(id_sesion_editada, Datos)



            toast.success('Asistente agregado correctamente', {
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
            console.error("Error en la edición:", error)
            toast.dismiss(toastId)
        }
    }

    const deleteSesion = async (sesion) => {

        try {
            await eliminarSesion(sesion.id_sesion)

            toast.success('Sesion eliminada correctamente', {
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
            console.error("Error: \n" + error)
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

    const elementClicked = (selectedSesion) => {
        console.log("Sesión seleccionada para editar:", selectedSesion);
        if (event.target.tagName.toLowerCase() === 'button') {
            navigate(`${location.pathname}/${selectedSesion.id_sesion}/gestion-acuerdos`)
        } else {
            setSesion(selectedSesion);
            setEdit(true);
            setAddClick(false);
            document.body.classList.add('modal-open');
            console.log("Estado 'sesion' después de seleccionar para editar:", sesion);
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
        setSesiones(matches)
    }

    function toastProcesando(mensaje) {
        var toastId = toast.loading(mensaje, {
            position: 'bottom-right',
            style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
                fontSize: '18px',
            },
        });
    
        return toastId
    }
    
    

    function formatDate(dateString) {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    
    return (
        <main>
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <div className=" flex-row">
                        <h1>Gestión de Sesiones del Órgano Colegiado: {nombreOC}</h1>
                    </div>

                    {(!cargado) && (
                        <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                    )}             

                    <div className="d-flex justify-content-between mt-4">
                        <Add onClick={addClicked}></Add>
                        <Search colNames={columns.slice(0, -2)} columns={dataKeys.slice(0, -2)} onSearch={search}></Search>
                    </div>
                    <Table columns={columns} data={sesiones} dataKeys={dataKeys} onDoubleClick ={elementClicked} hasButtonColumn={true} hasButtonColumn2={false} buttonText="Gestionar" />
                    {addClick && (
                        <Modal><OrganosColegiadosSesionesForm onSubmit={addSesiones} onCancel={onCancel} mode={1} organoColegiado={IdOrganoC}></OrganosColegiadosSesionesForm></Modal>
                    )}
                    {edit && (
                        <Modal>
                            <OrganosColegiadosSesionesForm
                                mode={2}
                                onSubmit={editaSesion}
                                onCancel={onCancel}
                                onDelete={() => deleteSesion(sesion)}
                                sesion={sesion}
                                organoColegiado={IdOrganoC}
                            >
                            </OrganosColegiadosSesionesForm>
                        </Modal>
                    )}
                    <Toaster></Toaster>
                </div>
            ) : (
                <PermisoDenegado></PermisoDenegado>
            )}
        </main>
    );
    
}    
