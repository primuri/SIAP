import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Back } from "../../utils/Back"
import { Modal } from "../../utils/Modal"
import { ProyectosForm } from "../../components/GestionProyectos/ProyectosForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { toast, Toaster } from 'react-hot-toast'
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { obtenerProyectos, obtenerVersionProyectos } from "../../api/gestionProyectos"
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
    const [selectedProyecto, setSelectedProyecto] = useState(null);
    const columns = ['Codigo VI','Nombre', 'Descripcion','Actividad']
    const dataKeys = ['id_codigo_vi','id_codigo_cimpa_fk.nombre','id_codigo_cimpa_fk.descripcion','id_codigo_cimpa_fk.actividad']
    const columns2 = ['Codigo VI','Nombre', 'Version','Detalle']
    const dataKeys2 = ['id_codigo_vi_fk.id_codigo_vi','id_codigo_vi_fk.nombre','numero_version','detalle']
    
    user.groups[0] !== "administrador" ? setError(true) : null  //Si no es administrador, pone el error en true
    const transformedProyectos = proyectos.map(proyecto => ({
        ...proyecto,
        id_codigo_cimpa_fk: {
            ...proyecto.id_codigo_cimpa_fk
        }
    }));

    const handleDoubleClick = (proyecto) => {
        setSelectedProyecto(proyecto);
        loadVersionProyectos();
        setDetalleVisible(true);
    };

    const volver = (proyecto) => {
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
            console.log(res.data)
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
    async function loadVersionProyectos() {
        try {
            const res = await obtenerVersionProyectos(localStorage.getItem('token'))
            setData(res.data)
            console.log(res.data)
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
    // Manejo de datos que se van a enviar para agregar
    const addProyecto = async (formData) => {
        try {

            
            toast.success('Proyecto agregada correctamente', {
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

            toast.success('Proyecto actualizada correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setEdit(false)
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
    const elementClicked = (user) => {
        // console.log(user)
        setProyecto(user)
        setEdit(true)
        setAddClick(false)
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
        setProyectos(matches)
    }
    return (
        <main>
            
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <div className="d-flex flex-row">
                        <h1>Gestión de Proyectos</h1>
                        {!cargado && (
                            <div class="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                        )}
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                                <Add onClick={addClicked}></Add>
                                <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
                    </div>
                    {detalleVisible ? (
                        <div>
                            {}
                            <Table 
                                columns={columns2} 
                                data={transformedProyectos}
                                dataKeys={dataKeys2} 
                            ></Table>
                            {}
                            <Back onClick={volver}>Volver a la lista</Back>
                        </div>
                    ) : (
                        <>
                            <Table 
                                columns={columns} 
                                data={transformedProyectos} 
                                dataKeys={dataKeys} 
                               onClick={handleDoubleClick}
                                onDoubleClick={elementClicked}
                            ></Table>
                            {addClick && (<Modal><ProyectosForm onSubmit={addProyecto} onCancel={onCancel} mode={1}></ProyectosForm></Modal>)}
                            {edit &&
                                (
                                    <Modal>
                                        <ProyectosForm
                                            mode={2}
                                            onSubmit={editProyecto}
                                            onCancel={onCancel}
                                            onDelete={() => deleteProyecto(proyecto)}
                                            proyecto={proyecto}
                                        ></ProyectosForm>
                                    </Modal>
                                )
                            }
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
