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
export const GestionProyectos = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [reload, setReload] = useState(false)
    const [proyectos, setProyectos] = useState([]) // Proyectos que se muestran
    const [cargado, setCargado] = useState(false)
    const [data, setData] = useState([])//Todas las Proyectos
    const [proyecto, setProyecto] = useState(null) //Proyecto al que se le da click en la tabla para editar
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
    // Manejo de datos que se van a enviar para agregar
    const addProyecto = async (formData) => {
        try {
            const Datos = JSON.parse(formData.get('json'))
            
            formData.delete('json');
            
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

            await agregarVersionProyectos(Datos, localStorage.getItem('token'))
            toast.success('Proyecto agregada correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setAddClick(false)
            loadVersionProyectos(Datos.id_codigo_vi_fk )
            setReload(!reload)
        } catch (error) {
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
            

            toast.success('Proyecto actualizada correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setEdit(false)
            loadVersionProyectos(Datos.id_codigo_vi_fk )
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
            const id = proyecto.id_codigo_vi_fk.id_codigo_vi;
            await eliminarVersion(proyecto.id_version_proyecto, localStorage.getItem("token"));
            await eliminarOficio(proyecto.id_oficio_fk.id_oficio, localStorage.getItem("token"));
            await eliminarVigencia(proyecto.id_vigencia_fk.id_vigencia, localStorage.getItem("token"));
            

            toast.success('proyecto eliminada correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setEdit(false)
            setReload(!reload)
            loadVersionProyectos(id)
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

    const elementClicked2 = (user) => {
       
        setProyecto(user)
        setEdit(true)
        setAddClick(false)
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
                                        >
                                        </ProyectosForm>
                                    </Modal>
                                )
                            }
                            {}
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
