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
import { agregarDocumentacion, agregarProducto, agregarSoftware, editarDocumentacion, editarProducto, editarSoftware, eliminarDocumentacion, obtenerSoftware } from "../../api/gestionProductos"


export const GestionProyectos = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [reload, setReload] = useState(false)
    const [proyectos, setProyectos] = useState([]) // Proyectos que se muestran
    const [cargado, setCargado] = useState(false)
    const [data, setData] = useState([])//Todas las Proyectos
    const [proyecto, setProyecto] = useState(null) //Proyecto al que se le da click en la tabla para editar
    const [producto, setProducto] = useState(null)
    const [error, setError] = useState(false) //Si hay un error se muestra una página para eso. Este es para el error de permisos.
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const [detalleVisible, setDetalleVisible] = useState(false);
    const [selectedIdCodigoVi, setSelectedIdCodigoVi] = useState(null);
    const [selectedProyecto, setSelectedProyecto] = useState(null);
    const columns = ['Codigo VI','Nombre', 'Descripcion','Actividad']
    const dataKeys = ['id_codigo_vi','id_codigo_cimpa_fk.nombre','id_codigo_cimpa_fk.descripcion','id_codigo_cimpa_fk.actividad']
    const columns2 = ['Codigo VI','Nombre', 'Version','Detalle']
    const dataKeys2 = ['id_codigo_vi_fk.id_codigo_vi','id_codigo_vi_fk.id_codigo_cimpa_fk.nombre','numero_version','detalle']
    
    user.groups[0] !== "administrador" ? setError(true) : null  //Si no es administrador, pone el error en true
    const transformedProyectos = proyectos.map(proyecto => ({
        ...proyecto,
        id_codigo_cimpa_fk: {
            ...proyecto.id_codigo_cimpa_fk
        }
    }));

    const volver = () => {
        setDetalleVisible(false)
        loadProyectos()
    };

    // Detecta cambios y realiza la solicitud nuevamente  
    useEffect(() => {
        async function fetchData() {
            loadProyectos();
            setCargado(true);
        }

        fetchData();
    }, [reload]);
    async function loadProyectos() {
        try {
            const res = await obtenerProyectos(localStorage.getItem('token'))
            setData(res.data)
           
            setProyectos(res.data)

        } catch (error) {
            toast.error('Error al cargar los datos de Proyectos', {
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
            toast.error('Error al cargar los datos de Proyectos', {
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
            //console.log(softwares.data);
    
            // Buscar el software que coincide con user.id_version_proyecto
            const matchedSoftware = softwares.data.find(software => 
                software.id_producto_fk &&
                software.id_producto_fk.id_version_proyecto_fk &&
                software.id_producto_fk.id_version_proyecto_fk.id_version_proyecto === user.id_version_proyecto
            );
    
            if (matchedSoftware) {
                setProducto(matchedSoftware);
            } else {
                console.warn('No se encontró el software que coincide con user.id_version_proyecto');
                setProducto(null);  
            }
    
        } catch (error) {
            toast.error('Error al cargar los datos de Software', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }
    
    const printFileDetailsFromFormData = (formData) => {
        let fileFound = false;
    
        for (let [name, value] of formData.entries()) {
            if (value instanceof Blob) {
                console.log(`Nombre del archivo en formData: ${name}, Nombre real del archivo: ${value.name}, Tamaño: ${value.size} bytes`);
                fileFound = true;
            }
        }
    
        return fileFound;
    }
   
    // Manejo de datos que se van a enviar para agregar
    const addProyecto = async (formData) => {
        const Datos = JSON.parse(formData.get('json'))
        try {
            //Guardar el archivo de odcumentacion en otro form para trabajarlo en la peticion API
            const DocumentacionData = new FormData();
            const documentacionFile = formData.get('id_documento_documentacion_fk.documento');
            if (documentacionFile) {
                DocumentacionData.append('ruta_archivo', documentacionFile);
                DocumentacionData.append('detalle', Datos.software.id_documento_documentacion_fk.detalle);
                DocumentacionData.append('tipo', Datos.software.id_documento_documentacion_fk.tipo);
                formData.delete('id_documento_documentacion_fk');
            }
            //Imprime el documento para saber si existe
             printFileDetailsFromFormData(DocumentacionData);
            for (let pair of DocumentacionData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }
            
            const id_documentacion_creada = await agregarDocumentacion(DocumentacionData, localStorage.getItem('token'))
            delete Datos.software.id_documento_documentacion_fk;
            Datos.software.id_documento_documentacion_fk = id_documentacion_creada;

            formData.delete('json');

            const producto = Datos.software;
            delete Datos.software;
            
           

            
            let fecha_ini = Datos.id_vigencia_fk.fecha_inicio;
            let fecha_fi = Datos.id_vigencia_fk.fecha_fin;
           
            if (!fecha_ini || fecha_ini.trim() === "") {
                fecha_ini = null;
            }
            
            if (!fecha_fi || fecha_fi.trim() === ""){
                fecha_fi = null;
            }
            const vigencia = {
                    fecha_inicio: fecha_ini,
                    fecha_fin: fecha_fi
            } 
            const id_vigencia_creado = await agregarVigencia(vigencia,localStorage.getItem('token'))
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

            const id_software_creado = await agregarSoftware(producto, localStorage.getItem('token'))

            loadVersionProyectos(id_vi)
            toast.success('Proyecto agregada correctamente', {
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
            toast.error('Error al agregar la Proyecto', {
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
            const DocumentacionData = new FormData();
            const documentacionFile = formData.get('id_documento_documentacion_fk.documento');
            if (documentacionFile) {
                DocumentacionData.append('ruta_archivo', documentacionFile);
                DocumentacionData.append('detalle', Datos.software.id_documento_documentacion_fk.detalle);
                DocumentacionData.append('tipo', Datos.software.id_documento_documentacion_fk.tipo);
                formData.delete('id_documento_documentacion_fk');
            }
            printFileDetailsFromFormData(DocumentacionData);
            for (let pair of DocumentacionData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            await editarDocumentacion(Datos.software.id_documento_documentacion_fk.id_documento, DocumentacionData, localStorage.getItem('token'))
            const id_docu =Datos.software.id_documento_documentacion_fk.id_documento;
            delete Datos.software.id_documento_documentacion_fk;
            Datos.software.id_documento_documentacion_fk = id_docu;
            
            const producto = Datos.software;
            delete Datos.software;

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

            await editarVersionProyectos(id_version_proy,Datos, localStorage.getItem("token"))
            producto.id_producto_fk.id_version_proyecto_fk = id_version_proy;

            const id_produ = producto.id_producto_fk.id_producto;
            await editarProducto(id_produ, producto.id_producto_fk, localStorage.getItem('token'))
            
            delete producto.id_producto_fk;
            producto.id_producto_fk = id_produ;

            await editarSoftware(producto.id_software ,producto, localStorage.getItem('token'))

           
            loadVersionProyectos(Datos.id_codigo_vi_fk)

            toast.success('Proyecto actualizada correctamente', {
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
            toast.error('Error al actualizar la Proyecto', {
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
            loadSoftware(proyecto);
            await eliminarDocumentacion(producto.id_documento_documentacion_fk.id_documento, localStorage.getItem("token"));
            
            const id = proyecto.id_codigo_vi_fk.id_codigo_vi;
            await eliminarVersion(proyecto.id_version_proyecto, localStorage.getItem("token"));
            await eliminarOficio(proyecto.id_oficio_fk.id_oficio, localStorage.getItem("token"));
            await eliminarVigencia(proyecto.id_vigencia_fk.id_vigencia, localStorage.getItem("token"));
           
            loadVersionProyectos(id)

            toast.success('proyecto eliminada correctamente', {
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
            toast.error('Error al eliminar la proyecto', {
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
            loadSoftware(user);
            setEdit(true);
            setAddClick(false);
        } catch (error) {
            console.error('Error al obtener los softwares:', error);
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
                                <h1>Gestión de Version de Proyectos</h1>
                                {!cargado && (
                                    <div class="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                                )}
                            </div>
                            <div className="d-flex justify-content-between mt-4">
                                <Add onClick={addClicked}></Add>
                                <Search colNames={columns2} columns={dataKeys2} onSearch={search}></Search>
                            </div>
                            {}
                            <Table columns={columns2} data={transformedProyectos} dataKeys={dataKeys2} onClick={elementClicked2}></Table>
                            {addClick && (<Modal ><ProyectosForm id_codigo={selectedIdCodigoVi} onSubmit={addProyecto}  onCancel={onCancel} mode={1}></ProyectosForm></Modal>)}
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
                                        >
                                        </ProyectosForm>
                                    </Modal>
                                )
                            }
                            {}
                            <Toaster></Toaster>
                            <Back onClick={volver}>Volver</Back>
                        </div>
                    ) : (
                        <>
                        <div className="d-flex flex-row">
                            <h1>Gestión de Proyectos</h1>
                            {!cargado && (
                                <div class="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                            )}
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                                <Add></Add>
                                <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
                        </div>
                            <Table columns={columns} data={transformedProyectos} dataKeys={dataKeys} onClick={elementClicked} ></Table>
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
