import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { PropuestasForm } from "../../components/GestionPropuestas/PropuestasForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { toast, Toaster } from 'react-hot-toast'
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { agregarDocumento, editarColaborador, editarDocumento, editarPropuesta, eliminarColaborador, eliminarDocumento, eliminarPropuesta, obtenerPropuestas } from "../../api/gestionPropuestas"
import { obtenerAcademicos } from "../../api/gestionAcademicos"

import { agregarProyectos, agregarVigencia, editarVigencia, eliminarProyecto, eliminarVigencia, obtenerProyectos, obtenerVersionProyectos } from "../../api/gestionProyectos"

export const GestionPropuestas = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const [reload, setReload] = useState(false)
    const [propuestas, setPropuestas] = useState([]) // Propuestas que se muestran
    const [cargado, setCargado] = useState(false)
    const [data, setData] = useState([])//Todas las propuestas
    const [propuesta, setPropuesta] = useState(null) //Propuesta al que se le da click en la tabla para editar
    const [error, setError] = useState(false) //Si hay un error se muestra una página para eso. Este es para el error de permisos.
    const [addClick, setAddClick] = useState(false)
    const [edit, setEdit] = useState(false)
    const [academicos, setAcademicos] = useState([]);
    const columns = ['Código CIMPA', 'Nombre', 'Estado', 'Vigencia', 'Actividad', 'Colaborador(a)', 'Documento']
    const dataKeys = ['id_codigo_cimpa_fk.id_codigo_cimpa', 'id_codigo_cimpa_fk.nombre', 'id_codigo_cimpa_fk.estado', 'id_codigo_cimpa_fk.fecha_vigencia', 'id_codigo_cimpa_fk.actividad', 'id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk.nombre', 'documento']
    user.groups[0] !== "administrador" ? setError(true) : null  //Si no es administrador, pone el error en true
    const transformedPropuestas = propuestas.map(propuesta => ({
        ...propuesta,
        id_codigo_cimpa_fk: {
            ...propuesta.id_codigo_cimpa_fk,
            fecha_vigencia: formatDate(propuesta.id_codigo_cimpa_fk.fecha_vigencia)
        }
    }));
    // Detecta cambios y realiza la solicitud nuevamente  
    useEffect(() => {
        async function fetchData() {
            await loadPropuestas();
            await loadAcademicos();
            setCargado(true);
        }

        fetchData();
    }, [reload]);

    async function loadAcademicos() {
        try {
            const res = await obtenerAcademicos(localStorage.getItem('token'));
            setAcademicos(res.data);
        } catch (error) {
            toast.error('Error al cargar los datos de investigadores', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            });
        }
    }
    async function loadPropuestas() {
        try {
            const res = await obtenerPropuestas(localStorage.getItem('token'))
            setData(res.data)
            console.log(res.data)
            setPropuestas(res.data)

        } catch (error) {
            toast.error('Error al cargar los datos de propuestas', {
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
    const addPropuesta = async (formData) => {
        try {

            await agregarDocumento(formData, localStorage.getItem('token'))
            toast.success('Propuesta agregada correctamente', {
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
            toast.error('Error al agregar la propuesta', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    async function contarVersionesDeProyecto(id_codigo_vi, token) {
        try {
            const response = await obtenerVersionProyectos(token);
            if (!response.data) return 0;
            const versionesDelProyecto = response.data.filter(version => version.id_codigo_vi_fk.id_codigo_vi == id_codigo_vi);
            const cantidad = versionesDelProyecto.length;
            return cantidad;
        } catch (error) {
            console.error("Error al contar las versiones del proyecto:", error);
            return 0;
        }
    }

    async function proyectoExiste(id_codigo_vi, token) {
        try {
            const response = await obtenerProyectos(token);
            if (!response.data) return false;
            return response.data.some(proyecto => proyecto.id_codigo_vi == id_codigo_vi);
        } catch (error) {
            console.error("Error al verificar si el proyecto existe:", error);
            return false;
        }
    }

    // Manejo de los datos del formulario de editar 
    const editPropuesta = async (formData) => {
        try {

            const Datos = JSON.parse(formData.get('json'))
            formData.delete('json');

            const id_vig = Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.id_vigencia;


            let fecha_inicio_adaptada = Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio;
            let fecha_fin_adaptada = Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin;

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
            const id_vigencia_editada = Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.id_vigencia
            delete Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk
            Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk = id_vigencia_editada


            const id_colab = Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_colaborador_principal;
            const id_academi = Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_academico;
            delete Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk;
            delete Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_colaborador_principal;
            Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk = id_academi;
            await editarColaborador(id_colab, Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk, localStorage.getItem("token"))
            delete Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk;
            Datos.id_codigo_cimpa_fk.id_colaborador_principal_fk = id_colab;


            const id_propu = Datos.id_codigo_cimpa_fk.id_codigo_cimpa;
            const fecha_vigencia_adaptada = Datos.id_codigo_cimpa_fk.fecha_vigencia;
            const fecha_vigencia = fecha_vigencia_adaptada + "T00:00:00Z";
            delete Datos.id_codigo_cimpa_fk.fecha_vigencia;
            Datos.id_codigo_cimpa_fk.fecha_vigencia = fecha_vigencia;

            if (Datos.id_codigo_cimpa_fk.estado == "Aprobada") {
                const proyecto = {
                    id_codigo_vi: id_propu,
                    id_codigo_cimpa_fk: id_propu
                }
                const existe = await proyectoExiste(proyecto.id_codigo_vi, localStorage.getItem("token"));

                if (!existe) {
                    await agregarProyectos(proyecto, localStorage.getItem("token"));
                    toast.success('Se agregó un proyecto asociado a esa propuesta', {
                        duration: 4000,
                        position: 'bottom-right',
                        style: {
                            background: '#003DA5',
                            color: '#fff',
                        },
                    })
                }

                //Para borrar proyectos
            } else if (Datos.id_codigo_cimpa_fk.estado == "En desarrollo") {

                const existe = await proyectoExiste(id_propu, localStorage.getItem("token"));
                const cant_ver = await contarVersionesDeProyecto(id_propu, localStorage.getItem("token"));
                if (existe && cant_ver == 0) {
                    await eliminarProyecto(id_propu, localStorage.getItem("token"));
                }

            }
            await editarPropuesta(id_propu, Datos.id_codigo_cimpa_fk, localStorage.getItem("token"))


            const id_doc = Datos.id_documentos_asociados;
            delete Datos.id_codigo_cimpa_fk;
            Datos.id_codigo_cimpa_fk = id_propu;
            formData.append('detalle', Datos.detalle)
            formData.append('id_codigo_cimpa_fk', Datos.id_codigo_cimpa_fk)
            await editarDocumento(id_doc, formData, localStorage.getItem("token"))

            toast.success('Propuesta actualizada correctamente', {
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
            toast.error('Error al actualizar la propuesta', {
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
    const deletePropuesta = async (propuesta) => {
        try {


            await eliminarDocumento(propuesta.id_documentos_asociados, localStorage.getItem('token'))
            await eliminarColaborador(propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_colaborador_principal, localStorage.getItem('token'))
            await eliminarVigencia(propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.id_vigencia, localStorage.getItem('token'))

            toast.success('Propuesta eliminada correctamente', {
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
            toast.error('Error al eliminar la propuesta', {
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
        document.body.classList.remove('modal-open');
    }
    // Al darle click a agregar, muestra el modal
    const addClicked = () => {
        setAddClick(true)
        setEdit(false)
        document.body.classList.add('modal-open');
    }
    // Al hacer click en la tabla
    const elementClicked = (user) => {

        setPropuesta(user)
        setEdit(true)
        setAddClick(false)
        document.body.classList.add('modal-open');
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
        setPropuestas(matches)
    }
    return (
        <main >
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <div className="d-flex flex-row"><h1>Gestión de propuestas</h1>{(!cargado) && (<div class="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}</div>
                    <div className="d-flex justify-content-between mt-4">
                        <Add onClick={addClicked}></Add>
                        <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
                    </div>
                    <Table columns={columns} data={transformedPropuestas} dataKeys={dataKeys} onClick={elementClicked}></Table>
                    {addClick && (<Modal ><PropuestasForm academicos={academicos} onSubmit={addPropuesta} onCancel={onCancel} mode={1}></PropuestasForm></Modal>)}
                    {edit &&
                        (
                            <Modal >
                                <PropuestasForm
                                    mode={2}
                                    onSubmit={editPropuesta}
                                    onCancel={onCancel}
                                    onDelete={() => deletePropuesta(propuesta)}
                                    academicos={academicos}
                                    propuesta={propuesta}
                                >
                                </PropuestasForm>
                            </Modal>
                        )
                    }
                    <Toaster></Toaster>
                </div>
            ) : (
                <PermisoDenegado></PermisoDenegado>
            )}
        </main>)
}

function formatDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split('T')[0];
}

