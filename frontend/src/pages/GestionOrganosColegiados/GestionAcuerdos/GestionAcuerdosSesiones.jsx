import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Add } from "../../../utils/Add"
import { Modal } from "../../../utils/Modal"
import { Table } from "../../../utils/Table"
import { Search } from "../../../utils/Search"
import { PermisoDenegado } from "../../../utils/PermisoDenegado"
import { Back } from "../../../utils/Back"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerAcuerdos, editarSesion, agregarDocumento, agregarOficio, agregarSeguimiento, agregarAcuerdo, eliminarOficio, eliminarDocumento, editarOficio, editarAcuerdo, editarDocumento} from "../../../api/gestionOrganosColegiados"
import { OrganosColegiadosAcuerdosForm } from '../../../components/GestionOrganosColegiados/OrganosColegiadosAcuerdosForm';

export const GestionAcuerdos = () => {
                                                             
    const user = JSON.parse(localStorage.getItem('user'))  
    const rol = user.groups[0]
    const {idSesion} = useParams() 
    const location = useLocation()
    const navigate = useNavigate()

    const [data, setData] = useState([]) 
    const [reload, setReload] = useState(false)   
    const [cargado, setCargado] = useState(false)   
    const [acuerdo, setAcuerdo] = useState(null)                                
    const [acuerdos, setAcuerdos] = useState([])   
                        
    const [addClick, setAddClick] = useState(false)                              
    const [edit, setEdit] = useState(false)                                      
    const [error, setError] = useState(false)

    const columns = ['Identificador', 'Descripción', 'Estado', 'Encargado']
    const dataKeys = ['id_acuerdo','descripcion', 'estado', 'encargado']

    
    if (rol !== "administrador" && rol !== "invitado") {
        setError(true);
    }                 

    useEffect(() => {                                                            
        async function fetchData() {
            loadAcuerdos()
            setCargado(true);
        }
        fetchData();
    }, [reload]);

    async function loadAcuerdos() {
        try {
            const response = await obtenerAcuerdos();
            const acuerdosFiltrados = response.data.filter(acuerdo => acuerdo.id_sesion_fk.id_sesion == parseInt(idSesion));
    
            setData(acuerdosFiltrados);                                                                 
            setAcuerdos(acuerdosFiltrados);                                                              
            setCargado(true);                                                                        
        } catch (error) {
            console.error(error);
        }
    }

    const volver = () => {
        const pathParts = location.pathname.split('/').filter(part => part !== '');
        const newPathParts = pathParts.slice(0, -2);
        const newPath = `/${newPathParts.join('/')}`;
        navigate(newPath);
    };

    const addAcuerdo = async (formData) => {
        var toastId = toast.loading('Agregando...', {
            position: 'bottom-right',
            style: {
                background: 'var(--celeste-ucr)',
                color: '#fff',
                fontSize: '18px',
            },
        });

        let  id_acuerdo_doc_creado;
        let id_seguimiento_doc_creado;
        let id_oficio_doc_creado;

        try {
           
            const seguimientoFile = formData.get('id_seguimiento_fk.id_documento_seguimiento_fk.documento');
            formData.delete('id_seguimiento_fk.id_documento_seguimiento_fk.documento');
    
            const acuerdoFile = formData.get('id_documento_acuerdo_fk.documento');
            formData.delete('id_documento_acuerdo_fk.documento');

            const oficioFile = formData.get('id_oficio_fk.ruta_archivo');
            formData.delete('id_oficio_fk.ruta_archivo');

            const Datos = JSON.parse(formData.get('json'));
            formData.delete('json'); 

           
            if (oficioFile && acuerdoFile && seguimientoFile) {
                const DocumentoAcuerdo = new FormData();
                DocumentoAcuerdo.append('documento', acuerdoFile);
                DocumentoAcuerdo.append('detalle', Datos.id_documento_acuerdo_fk.detalle);
                DocumentoAcuerdo.append('tipo', Datos.id_documento_acuerdo_fk.tipo);
    
                const DocumentoSeguimiento = new FormData();
                DocumentoSeguimiento.append('documento', seguimientoFile);
                DocumentoSeguimiento.append('detalle', Datos.id_seguimiento_fk.id_documento_seguimiento_fk.detalle);
                DocumentoSeguimiento.append('tipo', Datos.id_seguimiento_fk.id_documento_seguimiento_fk.tipo);
    
                const DocumentoOficio = new FormData();
                DocumentoOficio.append('ruta_archivo', oficioFile);
                DocumentoOficio.append('detalle', Datos.id_oficio_fk.detalle);
               

                id_acuerdo_doc_creado = await agregarDocumento(DocumentoAcuerdo);
                id_seguimiento_doc_creado = await agregarDocumento(DocumentoSeguimiento);
                id_oficio_doc_creado = await agregarOficio(DocumentoOficio);
            }

            Datos.id_oficio_fk = id_oficio_doc_creado;
            Datos.id_documento_acuerdo_fk = id_acuerdo_doc_creado;
            Datos.id_seguimiento_fk.id_documento_seguimiento_fk = id_seguimiento_doc_creado;
            delete Datos.id_seguimiento_fk.id_seguimiento;

            const id_segui = await agregarSeguimiento(Datos.id_seguimiento_fk);
            Datos.id_seguimiento_fk = id_segui;
            delete Datos.id_acuerdo;
            Datos.id_sesion_fk = parseInt(idSesion);

            await agregarAcuerdo(Datos);



            toast.success('Acuerdo agregado correctamente', {
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
            await eliminarDocumento(id_seguimiento_doc_creado)
            await eliminarDocumento(id_acuerdo_doc_creado)
            await eliminarOficio(id_oficio_doc_creado)
            toast.dismiss(toastId)
        }
    }


    const editaAcuerdo = async (formData) => {
         
        try {   
            var toastId = toast.loading('Agregando...', {
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                    fontSize: '18px',
                },
            });

           

            
            const seguimientoFile = formData.get('id_seguimiento_fk.id_documento_seguimiento_fk.documento');
            formData.delete('id_seguimiento_fk.id_documento_seguimiento_fk.documento');
    
            const acuerdoFile = formData.get('id_documento_acuerdo_fk.documento');
            formData.delete('id_documento_acuerdo_fk.documento');

            const oficioFile = formData.get('id_oficio_fk.ruta_archivo');
            formData.delete('id_oficio_fk.ruta_archivo');

            const Datos = JSON.parse(formData.get('json'));
            formData.delete('json');

            let id_acuerdo_doc_creado;
            let id_seguimiento_doc_creado;
            let id_oficio_doc_creado;


            
            if (acuerdoFile) {
                const DocumentoAcuerdo = new FormData();
                DocumentoAcuerdo.append('documento', acuerdoFile);
                DocumentoAcuerdo.append('detalle', Datos.id_documento_acuerdo_fk.detalle);
                DocumentoAcuerdo.append('tipo', Datos.id_documento_acuerdo_fk.tipo);
    
                id_acuerdo_doc_creado = Datos.id_documento_acuerdo_fk.id_documento;
                await editarDocumento(id_acuerdo_doc_creado, DocumentoAcuerdo);
            }


            if(seguimientoFile){
                const DocumentoSeguimiento = new FormData();
                DocumentoSeguimiento.append('documento', seguimientoFile);
                DocumentoSeguimiento.append('detalle', Datos.id_seguimiento_fk.id_documento_seguimiento_fk.detalle);
                DocumentoSeguimiento.append('tipo', Datos.id_seguimiento_fk.id_documento_seguimiento_fk.tipo);
    

                id_seguimiento_doc_creado = Datos.id_seguimiento_fk.id_documento_seguimiento_fk.id_documento;
                await editarDocumento(id_seguimiento_doc_creado, DocumentoSeguimiento);
            
            }

            if(oficioFile){
                const DocumentoOficio = new FormData();
                DocumentoOficio.append('ruta_archivo', oficioFile);
                DocumentoOficio.append('detalle', Datos.id_oficio_fk.detalle);

                id_oficio_doc_creado = Datos.id_oficio_fk.id_oficio;
                await editarOficio(id_oficio_doc_creado, DocumentoOficio);
            
            }else {
                const DocumentoData = new FormData();
                DocumentoData.append('detalle', Datos.id_oficio_fk.detalle);
               
                const id_docu = Datos.id_oficio_fk.id_oficio;
                await editarOficio(id_docu, DocumentoData);
            }


            Datos.id_documento_acuerdo_fk =  Datos.id_seguimiento_fk.id_documento_seguimiento_fk.id_documento
            Datos.id_oficio_fk = Datos.id_oficio_fk.id_oficio
            Datos.id_seguimiento_fk =  Datos.id_seguimiento_fk.id_seguimiento
            const id_acuerdo = Datos.id_acuerdo
            delete Datos.id_acuerdo

            await editarAcuerdo(id_acuerdo, Datos);
            
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

    const deleteAcuerdo = async (acuerdo) => {

        try {
            const  id_acuerdo_doc= acuerdo.id_documento_acuerdo_fk.id_documento
            await eliminarDocumento(id_acuerdo_doc)

            toast.success('Acuerdo eliminado correctamente', {
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

    const elementClicked = (selectedAcuerdo) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            navigate(`${location.pathname}/${selectedAcuerdo.id_sesion}/gestion-acuerdos`)
        } else {
            setAcuerdo(selectedAcuerdo);
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
        setAcuerdos(matches)
    }

   

    return (
        <main>
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">

                    {user.groups[0] === "administrador" && (
                        <div className=" flex-row">
                             <h1>Gestión de acuerdos de la sesión: {idSesion}</h1>
                        </div>
                    )}

                    {user.groups[0] === "invitado" && (
                        <div className=" flex-row">
                             <h1>Acuerdos de la sesión: {idSesion}</h1>
                        </div>
                    )}

                    {(!cargado) && (
                        <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                    )}             

 



                {user.groups[0] === "administrador" && (
                    <div className="d-flex justify-content-between mt-4">
                        <Add onClick={addClicked}></Add>
                        <Search colNames={columns.slice(0, -2)} columns={dataKeys.slice(0, -2)} onSearch={search}></Search>
                    </div>
                )}

                {user.groups[0] === "invitado" && (
                    <div className="d-flex justify-content-between mt-4">
                        <Search colNames={columns.slice(0, -2)} columns={dataKeys.slice(0, -2)} onSearch={search}></Search>
                    </div>
                )}

                    <div className="mt-3">
                    <Table columns={columns} data={acuerdos} dataKeys={dataKeys} onDoubleClick ={elementClicked} hasButtonColumn={false} hasButtonColumn2={false} buttonText="Gestionar" />
                    {addClick && (
                        <Modal><OrganosColegiadosAcuerdosForm onSubmit={addAcuerdo} onCancel={onCancel} mode={1} sesion={parseInt(idSesion)} rol={rol}></OrganosColegiadosAcuerdosForm></Modal>
                    )}
                    {edit && (
                        <Modal>
                            <OrganosColegiadosAcuerdosForm
                                mode={2}
                                onSubmit={editaAcuerdo}
                                onCancel={onCancel}
                                onDelete={() => deleteAcuerdo(acuerdo)}
                                acuerdo={acuerdo}
                                sesion={parseInt(idSesion)}
                                rol={rol}
                            >
                            </OrganosColegiadosAcuerdosForm>
                        </Modal>
                    )}
                    <Toaster></Toaster>
                    <Back onClick={volver}>Regresar a sesiones</Back>
                    </div>
                </div>
            ) : (
                <PermisoDenegado></PermisoDenegado>
            )}
        </main>
    );
    
}    