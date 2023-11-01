import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Back } from "../../utils/Back"
import { Modal } from "../../utils/Modal"
import { ProyectosForm } from "../../components/GestionProyectos/ProyectosForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { toast, Toaster } from 'react-hot-toast'
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { agregarOficio, agregarVersionProyectos, agregarVigencia, editarOficio, editarVersionProyectos, editarVigencia, eliminarOficio, eliminarVersion, eliminarVigencia, obtenerProyectos, obtenerVersionProyectos } from "../../api/gestionProyectos"
import { agregarArea, agregarArticulo, agregarAutor, agregarDocumentacion, agregarInstitucion, agregarProducto, agregarRevista, agregarSoftware, agregarevento, editarArticulo, editarAutor, editarDocumentacion, editarProducto, editarRevista, editarSoftware, eliminarArea, eliminarDocumentacion, eliminarInstitucion, eliminarProducto, eliminarRevista, eliminarSoftware, obtenerArticulo, obtenerEvento, obtenerSoftware, editarArea, editarInstitucion, editarevento } from "../../api/gestionProductos"
import { eliminarNombre } from "../../api/gestionAcademicos"
import { useLocation, useNavigate } from "react-router-dom"


export const GestionProyectos = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate();
    const location = useLocation();
    const [reload, setReload] = useState(false)
    const [proyectos, setProyectos] = useState([]) // Proyectos que se muestran
    const [cargado, setCargado] = useState(false)
    const [data, setData] = useState([])//Todas las Proyectos
    const [proyecto, setProyecto] = useState(null) //Proyecto al que se le da click en la tabla para editar
    const [producto, setProducto] = useState(null)
    const [tipo, setTipo] = useState(null)
    const [error, setError] = useState(false) //Si hay un error se muestra una página para eso. Este es para el error de permisos.
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const [detalleVisible, setDetalleVisible] = useState(false);
    const [selectedIdCodigoVi, setSelectedIdCodigoVi] = useState(null);
    const [selectedProyecto, setSelectedProyecto] = useState(null);
    const [transformedState, setTransformedState] = useState([]);
    const columns = ['Código VI', 'Nombre', 'Descripción', 'Actividad']
    const dataKeys = ['id_codigo_vi', 'id_codigo_cimpa_fk.nombre', 'id_codigo_cimpa_fk.descripcion', 'id_codigo_cimpa_fk.actividad']
    const columns2 = ['Código VI', 'Nombre', 'Versión', 'Detalle']
    const dataKeys2 = ['id_codigo_vi_fk.id_codigo_vi', 'id_codigo_vi_fk.id_codigo_cimpa_fk.nombre', 'numero_version', 'detalle']

    user.groups[0] !== "administrador" ? setError(true) : null  //Si no es administrador, pone el error en true
    useEffect(() => {
        
        const transformedProyectos = proyectos.map(proyecto => ({
            ...proyecto,
            id_codigo_cimpa_fk: {
                ...proyecto.id_codigo_cimpa_fk
            }
        }));
    
        setTransformedState(transformedProyectos);
        
    }, [proyectos]);
    const volver = () => {
        setDetalleVisible(false)
        loadProyectos()
    };

    // Detecta cambios y realiza la solicitud nuevamente  
    useEffect(() => {
        async function fetchData() {
            await loadProyectos();
            setCargado(true);
        }

        fetchData();
    }, [reload]);

    useEffect(()=> {
        async function fetch(){
            if (sessionStorage.getItem('isBackNavigation') === 'true') {
                const estado = JSON.parse(localStorage.getItem("estado"))
                if (estado) {
                    setProyecto(estado.proyecto);
                    setProducto(estado.producto);
                    setTipo(estado.tipo);
                    setError(estado.error);
                    setAddClick(estado.addClick);
                    setEdit(estado.edit);
                    setDetalleVisible(estado.detalleVisible);
                    setSelectedIdCodigoVi(estado.selectedIdCodigoVi)
                    await loadVersionProyectos(estado.selectedIdCodigoVi)
                }
                sessionStorage.removeItem('isBackNavigation');
                localStorage.removeItem('estado');
            } else {
                console.log("no lo encontro el estado")
            }
        }
        fetch()
       
      }, [location]);

    const saveState = () => {
        const estado = {
            proyecto: proyecto,
            producto: producto,
            tipo: tipo,
            error: error,
            addClick: addClick,
            edit: edit,
            detalleVisible: detalleVisible,
            selectedIdCodigoVi: selectedIdCodigoVi,
        };
    
        localStorage.setItem('estado', JSON.stringify(estado));
    }
      
    async function loadProyectos() {
        try {
            const res = await obtenerProyectos(localStorage.getItem('token'))
            setData(res.data)

            setProyectos(res.data)

        } catch (error) {
            toast.error('Error al cargar los datos de proyectos', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    async function loadVersionProyectos(proyecto) {
        try {
            const res = await obtenerVersionProyectos(localStorage.getItem('token'))
            const filteredData = res.data.filter(item => item.id_codigo_vi_fk.id_codigo_vi === proyecto);
            setData(filteredData);
            setProyectos(filteredData);


        } catch (error) {
            toast.error('Error al cargar los datos de proyectos', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    async function loadEvento(user) {
        try {
            const eventos = await obtenerEvento(localStorage.getItem('token'));

            const matchedEvento = eventos.data.find(evento =>
                evento.id_producto_fk &&
                evento.id_producto_fk.id_version_proyecto_fk &&
                evento.id_producto_fk.id_version_proyecto_fk.id_version_proyecto === user.id_version_proyecto
            );

            if (matchedEvento) {
                setProducto(matchedEvento);
                setTipo("evento");
                return true;
            } else {
                console.warn('No se encontró el evento que coincide con user.id_version_proyecto');
                setProducto(null);
                return false;
            }

        } catch (error) {
            toast.error('Error al cargar los datos de evento', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    async function loadArticulo(user) {
        try {
            const articulos = await obtenerArticulo(localStorage.getItem('token'));

            // Buscar el software que coincide con user.id_version_proyecto
            const matchedArticulo = articulos.data.find(articulo =>
                articulo.id_producto_fk &&
                articulo.id_producto_fk.id_version_proyecto_fk &&
                articulo.id_producto_fk.id_version_proyecto_fk.id_version_proyecto === user.id_version_proyecto
            );

            if (matchedArticulo) {
                setProducto(matchedArticulo);
                setTipo("articulo");
                return true;
            } else {
                console.warn('No se encontró el articulo que coincide con user.id_version_proyecto');
                setProducto(null);
                return false;
            }

        } catch (error) {
            toast.error('Error al cargar los datos de artículo', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    async function loadSoftware(user) {
        try {
            const softwares = await obtenerSoftware(localStorage.getItem('token'));

            // Buscar el software que coincide con user.id_version_proyecto
            const matchedSoftware = softwares.data.find(software =>
                software.id_producto_fk &&
                software.id_producto_fk.id_version_proyecto_fk &&
                software.id_producto_fk.id_version_proyecto_fk.id_version_proyecto === user.id_version_proyecto
            );

            if (matchedSoftware) {
                setProducto(matchedSoftware);
                setTipo("software");
                return true;
            } else {
                console.warn('No se encontró el software que coincide con user.id_version_proyecto');
                setProducto(null);
                return false;
            }

        } catch (error) {
            toast.error('Error al cargar los datos de software', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    // Manejo de datos que se van a enviar para agregar
    const addProyecto = async (formData) => {
        const Datos = JSON.parse(formData.get('json'))
        try {
            //Guardar el archivo de odcumentacion en otro form para trabajarlo en la peticion API
            let producto = null;
            let soft = null;
            let artic = null;
            let ev = null;

            if ('software' in Datos) {
                const DocumentacionData = new FormData();
                const documentacionFile = formData.get('id_documento_documentacion_fk.documento');
                if (documentacionFile) {
                    DocumentacionData.append('documento', documentacionFile);
                    DocumentacionData.append('detalle', Datos.software.id_documento_documentacion_fk.detalle);
                    DocumentacionData.append('tipo', Datos.software.id_documento_documentacion_fk.tipo);
                    formData.delete('id_documento_documentacion_fk');
                }
                const id_documentacion_creada = await agregarDocumentacion(DocumentacionData, localStorage.getItem('token'))
                delete Datos.software.id_documento_documentacion_fk;
                Datos.software.id_documento_documentacion_fk = id_documentacion_creada;

                producto = Datos.software;
                delete Datos.software;
                soft = true;
            } else if ('articulo' in Datos) {
                const DocumentoData = new FormData();
                const documentoFile = formData.get('id_documento_articulo_fk.documento');
                if (documentoFile) {
                    DocumentoData.append('documento', documentoFile);
                    DocumentoData.append('detalle', Datos.articulo.id_documento_articulo_fk.detalle);
                    DocumentoData.append('tipo', Datos.articulo.id_documento_articulo_fk.tipo);
                    formData.delete('id_documento_articulo_fk');

                }
                const id_documento_creada = await agregarDocumentacion(DocumentoData, localStorage.getItem('token'))
                delete Datos.articulo.id_documento_articulo_fk;

                delete Datos.articulo.id_revista_fk.id_revista;
                const id_revista_creada = await agregarRevista(Datos.articulo.id_revista_fk, localStorage.getItem('token'))

                delete Datos.articulo.id_autor_fk.id_autor;
                delete Datos.articulo.id_autor_fk.id_nombre_completo_fk.id_nombre_completo;
                const autor = {
                    id_nombre_completo_fk: Datos.articulo.id_autor_fk.id_nombre_completo_fk
                }
                const id_autor_creado = await agregarAutor(autor, localStorage.getItem('token'))

                Datos.articulo.id_documento_articulo_fk = id_documento_creada;
                Datos.articulo.id_autor_fk = id_autor_creado;
                Datos.articulo.id_revista_fk = id_revista_creada;

                producto = Datos.articulo;
                delete Datos.articulo;
                artic = true;

            } else if ('evento' in Datos) {
                const DocumentoOficioData = new FormData();
                const documentoOficioFile = formData.get('id_oficio_fk.documento');
                if (documentoOficioFile) {
                    DocumentoOficioData.append('ruta_archivo', documentoOficioFile);
                    DocumentoOficioData.append('detalle', Datos.evento.id_oficio_fk.detalle);
                    formData.delete('id_oficio_fk');
                }


                const id_documento_oficio_creado = await agregarOficio(DocumentoOficioData, localStorage.getItem('token'))
                delete Datos.evento.id_oficio_fk;

                delete Datos.evento.id_area_fk.id_area;
                const id_area_creada = await agregarArea(Datos.evento.id_area_fk, localStorage.getItem('token'))

                delete Datos.evento.id_institucion_fk.id_institucion;
                const id_institucion_creada = await agregarInstitucion(Datos.evento.id_institucion_fk, localStorage.getItem('token'))


                Datos.evento.id_oficio_fk = id_documento_oficio_creado;
                Datos.evento.id_area_fk = id_area_creada;
                Datos.evento.id_institucion_fk = id_institucion_creada;

                producto = Datos.evento;
                delete Datos.evento;
                ev = true;
            }

            formData.delete('json');
            let fecha_ini = Datos.id_vigencia_fk.fecha_inicio;
            let fecha_fi = Datos.id_vigencia_fk.fecha_fin;

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
            const id_vigencia_creado = await agregarVigencia(vigencia, localStorage.getItem('token'))
            delete Datos.id_vigencia_fk;
            const id_vi = Datos.id_codigo_vi_fk.id_codigo_vi;
            delete Datos.id_codigo_vi_fk;
            Datos.id_codigo_vi_fk = id_vi;
            delete Datos.id_version_proyecto;
            Datos.id_vigencia_fk = id_vigencia_creado;

            formData.delete(formData.id_version_proyecto);
            formData.delete(formData.id_vigencia_fk);
            formData.delete(formData.id_codigo_vi_fk);
            formData.append('detalle', Datos.id_oficio_fk.detalle);


            const id_oficio_creado = await agregarOficio(formData, localStorage.getItem('token'));
            delete Datos.id_oficio_fk;
            Datos.id_oficio_fk = id_oficio_creado;


            const id_version_creada = await agregarVersionProyectos(Datos, localStorage.getItem('token'))
            delete producto.id_producto_fk.id_producto;
            producto.id_producto_fk.id_version_proyecto_fk = id_version_creada;

            const id_producto_creado = await agregarProducto(producto.id_producto_fk, localStorage.getItem('token'))

            delete producto.id_producto_fk;
            producto.id_producto_fk = id_producto_creado;

            if (soft) {
                await agregarSoftware(producto, localStorage.getItem('token'))
            } else if (artic) {
                await agregarArticulo(producto, localStorage.getItem('token'));
            } else if (ev) {
                await agregarevento(producto, localStorage.getItem('token'));
            }

            loadVersionProyectos(id_vi)
            toast.success('Versión de proyecto agregada correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setAddClick(false)
            loadVersionProyectos(id_vi)
            setReload(!reload)

        } catch (error) {
            await eliminarOficio(Datos.id_oficio_fk, localStorage.getItem("token"));
            await eliminarVigencia(Datos.id_vigencia_fk, localStorage.getItem("token"));
            toast.error('Error al agregar la versión de proyecto', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    // Manejo de los datos del formulario de editar 
    const editProyecto = async (formData) => {
        try {
            const Datos = JSON.parse(formData.get('json'))
            let soft = null;
            let artic = null;
            let ev = null;

            let producto = null;
            if ('software' in Datos && Datos.software != null) {
                const DocumentacionData = new FormData();
                const documentacionFile = formData.get('id_documento_documentacion_fk.documento');
                if (documentacionFile) {
                    DocumentacionData.append('documento', documentacionFile);
                }
                DocumentacionData.append('detalle', Datos.software.id_documento_documentacion_fk.detalle);
                DocumentacionData.append('tipo', Datos.software.id_documento_documentacion_fk.tipo);
                formData.delete('id_documento_documentacion_fk');

                await editarDocumentacion(Datos.software.id_documento_documentacion_fk.id_documento, DocumentacionData, localStorage.getItem('token'))
                const id_docu = Datos.software.id_documento_documentacion_fk.id_documento;
                delete Datos.software.id_documento_documentacion_fk;
                Datos.software.id_documento_documentacion_fk = id_docu;


                producto = Datos.software;
                delete Datos.software;
                artic = true;

            } else if ('articulo' in Datos && Datos.articulo != null) {
                const DocumentoData = new FormData();
                const documentoFile = formData.get('id_documento_articulo_fk.documento');
                if (documentoFile) {
                    DocumentoData.append('documento', documentoFile);
                }
                DocumentoData.append('detalle', Datos.articulo.id_documento_articulo_fk.detalle);
                DocumentoData.append('tipo', Datos.articulo.id_documento_articulo_fk.tipo);
                formData.delete('id_documento_articulo_fk');

                const id_docu = Datos.articulo.id_documento_articulo_fk.id_documento;
                await editarDocumentacion(id_docu, DocumentoData, localStorage.getItem('token'))
                delete Datos.articulo.id_documento_articulo_fk;
                Datos.articulo.id_documento_articulo_fk = id_docu;

                const id_revista = Datos.articulo.id_revista_fk.id_revista;
                await editarRevista(id_revista, Datos.articulo.id_revista_fk, localStorage.getItem('token'))
                delete Datos.articulo.id_revista_fk;
                Datos.articulo.id_revista_fk = id_revista;


                const id_autor = Datos.articulo.id_autor_fk.id_autor;

                const autor = {
                    id_nombre_completo_fk: Datos.articulo.id_autor_fk.id_nombre_completo_fk
                }

                await editarAutor(id_autor, autor, localStorage.getItem('token'))
                delete Datos.articulo.id_autor_fk;
                Datos.articulo.id_autor_fk = id_autor;

                producto = Datos.articulo;
                delete Datos.articulo;
                artic = true;
            } else if ('evento' in Datos && Datos.evento != null) {

                const DocumentoOficioData = new FormData();
                const documentoOficioFile = formData.get('id_oficio_fk.documento');
                if (documentoOficioFile) {
                    DocumentoOficioData.append('ruta_archivo', documentoOficioFile);
                }
                DocumentoOficioData.append('detalle', Datos.evento.id_oficio_fk.detalle);
                formData.delete('id_oficio_fk');

                const id_docu = Datos.evento.id_oficio_fk.id_oficio;
                await editarOficio(id_docu, DocumentoOficioData, localStorage.getItem('token'))


                delete Datos.evento.id_oficio_fk;
                Datos.evento.id_oficio_fk = id_docu;

                const id_area = Datos.evento.id_area_fk.id_area;
                delete Datos.evento.id_area_fk.id_area;
                await editarArea(id_area, Datos.evento.id_area_fk, localStorage.getItem('token'))
                delete Datos.evento.id_area_fk;
                Datos.evento.id_area_fk = id_area;

                const id_institucion = Datos.evento.id_institucion_fk.id_institucion;
                delete Datos.evento.id_institucion_fk.id_institucion;
                await editarInstitucion(id_institucion, Datos.evento.id_institucion_fk, localStorage.getItem('token'))
                delete Datos.evento.id_institucion_fk;
                Datos.evento.id_institucion_fk = id_institucion;



                producto = Datos.evento;
                delete Datos.evento;
                ev = true;
            }

            formData.delete('json');

            const id_version_proy = Datos.id_version_proyecto;
            const id_codigo_vi = Datos.id_codigo_vi_fk.id_codigo_vi;
            delete Datos.id_version_proyecto;
            delete Datos.id_codigo_vi_fk;
            Datos.id_codigo_vi_fk = id_codigo_vi;

            const id_vig = Datos.id_vigencia_fk.id_vigencia;

            let fecha_inicio_adaptada = Datos.id_vigencia_fk.fecha_inicio;
            let fecha_fin_adaptada = Datos.id_vigencia_fk.fecha_fin;


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

            await editarVigencia(id_vig, vigencia, localStorage.getItem("token"))
            const id_vigencia_editada = Datos.id_vigencia_fk.id_vigencia;
            delete Datos.id_vigencia_fk;
            Datos.id_vigencia_fk = id_vigencia_editada;

            const id_oficio = Datos.id_oficio_fk.id_oficio;
            formData.delete(formData.id_version_proyecto);
            formData.delete(formData.id_vigencia_fk);
            formData.delete(formData.id_codigo_vi_fk);
            formData.append('detalle', Datos.id_oficio_fk.detalle);
            const id_oficio_editada = await editarOficio(id_oficio, formData, localStorage.getItem("token"))
            delete Datos.id_oficio_fk;
            Datos.id_oficio_fk = id_oficio_editada.data.id_oficio;

            await editarVersionProyectos(id_version_proy, Datos, localStorage.getItem("token"))

            if (producto != null) {
                producto.id_producto_fk.id_version_proyecto_fk = id_version_proy;
                const id_produ = producto.id_producto_fk.id_producto;
                await editarProducto(id_produ, producto.id_producto_fk, localStorage.getItem('token'))
                delete producto.id_producto_fk;
                producto.id_producto_fk = id_produ;
                if (soft) {
                    await editarSoftware(producto.id_software, producto, localStorage.getItem('token'))
                } else if (artic) {
                    await editarArticulo(producto.id_articulo, producto, localStorage.getItem('token'))
                } else if (ev) {
                    await editarevento(producto.id_evento, producto, localStorage.getItem('token'))
                }

            }

            loadVersionProyectos(Datos.id_codigo_vi_fk)

            toast.success('Versión proyecto actualizada correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setEdit(false)
            loadVersionProyectos(Datos.id_codigo_vi_fk)
            setReload(!reload)
        } catch (error) {
            toast.error('Error al actualizar la versión de proyecto', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    // Manejo del eliminar
    const deleteProyecto = async (proyecto) => {
        try {
            const id = proyecto.id_codigo_vi_fk.id_codigo_vi;
            if (tipo == "software") {
                await eliminarDocumentacion(producto.id_documento_documentacion_fk.id_documento, localStorage.getItem("token"));
                await eliminarVersion(proyecto.id_version_proyecto, localStorage.getItem("token"));
                await eliminarOficio(proyecto.id_oficio_fk.id_oficio, localStorage.getItem("token"));
                await eliminarVigencia(proyecto.id_vigencia_fk.id_vigencia, localStorage.getItem("token"));
            }
            if (tipo == "articulo") {
                await eliminarDocumentacion(producto.id_documento_articulo_fk.id_documento, localStorage.getItem("token"));
                await eliminarVersion(proyecto.id_version_proyecto, localStorage.getItem("token"));
                await eliminarOficio(proyecto.id_oficio_fk.id_oficio, localStorage.getItem("token"));
                await eliminarVigencia(proyecto.id_vigencia_fk.id_vigencia, localStorage.getItem("token"));
                await eliminarRevista(producto.id_revista_fk.id_revista, localStorage.getItem("token"));
                await eliminarNombre(producto.id_autor_fk.id_nombre_completo_fk.id_nombre_completo, localStorage.getItem("token"));
            }
            if (tipo == "evento") {
                await eliminarOficio(producto.id_oficio_fk.id_oficio, localStorage.getItem("token"));
                await eliminarVersion(proyecto.id_version_proyecto, localStorage.getItem("token"));
                await eliminarOficio(proyecto.id_oficio_fk.id_oficio, localStorage.getItem("token"));
                await eliminarVigencia(proyecto.id_vigencia_fk.id_vigencia, localStorage.getItem("token"));
                await eliminarArea(producto.id_area_fk.id_area, localStorage.getItem("token"));
                await eliminarInstitucion(producto.id_institucion_fk.id_institucion, localStorage.getItem("token"));

            }

            loadVersionProyectos(id)

            toast.success('Proyecto eliminado correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setEdit(false)
            loadVersionProyectos(id)
            setReload(!reload)

        } catch (error) {
            console.log(error);
            toast.error('Error al eliminar el proyecto', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }
    // Al darle click a cancelar, se cierra el modal
    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
    }
    // Al darle click a agregar, muestra el modal
    const addClicked = () => {
        setAddClick(true)
        setEdit(false)
    }
    // Al hacer click en la tabla
    const elementClicked = (proyecto) => {
        setSelectedProyecto(proyecto);
        setSelectedIdCodigoVi(proyecto.id_codigo_vi);
        loadVersionProyectos(proyecto.id_codigo_vi);
        setDetalleVisible(true);
    }
    
    
    //se filtra
    function getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }

    const elementClicked2 = async (user) => {
        setProyecto(user);

        try {
            const isSoftware = await loadSoftware(user);
            if (!isSoftware) {
                const isArticulo = await loadArticulo(user);
                if (!isArticulo) {
                    await loadEvento(user);
                }
            }
            setEdit(true);
            setAddClick(false);
        } catch (error) {
            console.error('Error al obtener los datos de la linea:', error);
        }
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
        setProyectos(matches)
    }
    return (
        <main>

            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    {detalleVisible ? (
                        <div>
                            <div className="d-flex flex-row">
                                <h1>Gestión de versión de proyectos</h1>
                                {!cargado && (
                                    <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                                )}
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <Add onClick={addClicked}></Add>
                                <Search colNames={columns2} columns={dataKeys2} onSearch={search}></Search>
                            </div>
                            <div className="mt-3">
                                <Table columns={columns2} data={transformedState} dataKeys={dataKeys2} onClick={elementClicked2}></Table>
                                {addClick && (<Modal ><ProyectosForm id_codigo={selectedIdCodigoVi} onSubmit={addProyecto} onCancel={onCancel} mode={1} saveState={saveState}></ProyectosForm></Modal>)}
                                {edit &&
                                    (
                                        <Modal >
                                            <ProyectosForm
                                                mode={2}
                                                onSubmit={editProyecto}
                                                onCancel={onCancel}
                                                onDelete={() => deleteProyecto(proyecto)}
                                                proyecto={proyecto}
                                                producto={producto}
                                                tipo={tipo}
                                                saveState={saveState}
                                            >
                                            </ProyectosForm>
                                        </Modal>
                                    )
                                }
                                <Toaster></Toaster>
                                <Back onClick={volver}>Regresar a proyectos</Back>
                            </div>

                        </div>
                    ) : (
                        <>
                            <div className="d-flex flex-row">
                                <h1>Gestión de proyectos</h1>
                                {!cargado && (
                                    <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                                )}
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <div className="w-50"></div>
                                <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
                            </div>
                            <Table columns={columns} data={transformedState} dataKeys={dataKeys} onClick={elementClicked} ></Table>
                            <Toaster></Toaster>
                        </>
                    )}
                </div>
            ) : (
                <PermisoDenegado></PermisoDenegado>
            )}
        </main>
    );

}
