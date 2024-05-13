import { useEffect, useState } from "react"
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Table } from "../../utils/Table"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { Search } from "../../utils/Search"
import { toast, Toaster } from 'react-hot-toast'
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { obtenerProyectos } from "../../api/gestionProyectos"
import { useNavigate } from "react-router-dom"
import { TableNoHover } from "../../utils/TableNoHover";
import { ReportButton } from "../../utils/ReportButton";

import axios from 'axios' // PARA REPORTES


export const GestionProyectos = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const navigate = useNavigate();
    const [reload, setReload] = useState(false)
    const [proyectos, setProyectos] = useState([])
    const [cargado, setCargado] = useState(false)
    const [data, setData] = useState([])
    const [error, setError] = useState(false)
    const [transformedState, setTransformedState] = useState([]);
    const columns = ['Código VI', 'Nombre', 'Descripción', 'Actividad', 'Versiones']
    const dataKeys = ['id_codigo_vi', 'id_codigo_cimpa_fk.nombre', 'id_codigo_cimpa_fk.descripcion', 'id_codigo_cimpa_fk.actividad', 'Versiones']

    const isInvestigador = user.groups.some((grupo) => {
        return grupo === 'investigador';
    });

    //===============================================================================================================================
    // Configuración particular para reporte de proyectos
    //===============================================================================================================================

    const configureReportData = async () => {
        // Funcion auxiliar para jalar ultima versión de un proyecto
        const getLastVersionProyecto = async (id_codigo_vi) => {
            const token = localStorage.getItem('token');

            const SIAPAPI = axios.create({
                baseURL: 'http://localhost:8000/'
            }, [])

            var response = await SIAPAPI.get('version_proyecto/versionproyecto/', {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            var lastVersion = { id_version_proyecto: 0 }

            response.data.map((version) => {
                if (version.id_codigo_vi_fk.id_codigo_vi === id_codigo_vi && lastVersion.id_version_proyecto < version.id_version_proyecto) {
                    lastVersion = version
                }
            })

            return (lastVersion ? lastVersion : {})
        }

        // Funcion auxiliar para jalar producto dada una versión de proyecto
        const getProducto = async (id_version_proyecto) => {
            const token = localStorage.getItem('token');
            var productoBuscado = null

            const SIAPAPI = axios.create({
                baseURL: 'http://localhost:8000/'
            })

            var response = await SIAPAPI.get('producto/eventos/', {             // Buscar id version en eventos
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            response.data.map((producto) => {
                if (producto.id_producto_fk.id_version_proyecto_fk.id_version_proyecto === id_version_proyecto) {
                    producto.tipo = 'evento'
                    productoBuscado = producto
                }
            })

            response = await SIAPAPI.get('producto/softwares/', {                 // Buscar id version en softwares
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            response.data.map((producto) => {
                if (producto.id_producto_fk.id_version_proyecto_fk.id_version_proyecto === id_version_proyecto) {
                    producto.tipo = 'software'
                    productoBuscado = producto

                } 
            })

            response = await SIAPAPI.get('producto/articulos/', {                 // Buscar id version en articulos
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            response.data.map((producto) => {
                if (producto.id_producto_fk.id_version_proyecto_fk.id_version_proyecto === id_version_proyecto) {
                    producto.tipo = 'articulo'
                    productoBuscado = producto

                } 
            })

            return productoBuscado
        }

        // Funcion auxiliar para jalar asistentes dada una versión de proyecto
        const getAsistentes = async (id_version_proyecto) => {
            const token = localStorage.getItem('token');

            const SIAPAPI = axios.create({
                baseURL: 'http://localhost:8000/'
            })

            var response = await SIAPAPI.get('version_proyecto/designacionasistente/', {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            const filteredData = response.data.filter(item => item.id_version_proyecto_fk.id_version_proyecto === id_version_proyecto);

            return filteredData ? filteredData : {}
        }

        // Jalar y pegar datos en reportData
        if (proyectos.length > 0) {
            try {
                const promises = proyectos.map(async (proyecto) => {
                    const ultimaVersion = await getLastVersionProyecto(proyecto.id_codigo_vi);
                    const productoAsociado = await getProducto(ultimaVersion.id_version_proyecto);
                    const asistentesLista = await getAsistentes(ultimaVersion.id_version_proyecto);

                    // Asignar versión version proyecto a la data
                    proyecto.id_version_proyecto_fk = ultimaVersion;

                    // Asignar producto a la data
                    proyecto.producto = productoAsociado;

                    // Asignar los asistentes al proyecto a la data
                    proyecto[JsonForReport.colNames.length - 1] = asistentesLista;

                    return proyecto;
                });

                // Esperar que todas las promesas se resuelvan
                const proyectosConDatosCompletos = await Promise.all(promises);

                // Asignar los proyectos con datos completos a JsonForReport
                JsonForReport.reportData = proyectosConDatosCompletos;
                return true

            } catch (exception) {
                console.error("Ocurrió un error al crear el Json para reporte: ")
                return false
            }
        }
    }

    // ==============================================================================================================================
    // Parte que cada uno debe crear para su reporte:
    // ==============================================================================================================================

        // Json que almacena la información que debe recibir el componente ReportButton:  
        const [JsonForReport, setJsonForReport] = useState({ reportData: {}, reportTitle: {}, colNames: {}, dataKeys: {}, idKey: {} })

        // Variable que mide cuando el Json está listo para ser enviado al ReportButton:
        const [JsonIsReady, setJsonIsReady] = useState(false)

        // Funcion auxiliar para jalar producto dada una versión de proyecto
        const createJsonForReport = async () => {
            // Titulo del reporte a mostrar en PDF
            JsonForReport.reportTitle = "Proyecto"

            // LLave para acceder al id del objeto del reporte
            JsonForReport.idKey = "id_codigo_vi"

            // Llaves para acceder a los datos (incluye tabla extra)
            JsonForReport.dataKeys = [
                'id_codigo_vi',
                'id_codigo_cimpa_fk.id_codigo_cimpa',
                'id_codigo_cimpa_fk.estado',
                'id_codigo_cimpa_fk.nombre',
                'id_version_proyecto_fk.numero_version',
                'id_codigo_cimpa_fk.fecha_vigencia',
                'id_codigo_cimpa_fk.descripcion',
                'id_codigo_cimpa_fk.actividad',
                'id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_nombre_completo_fk',
                'id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.cedula',
                'id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio',
                'id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin',
                'id_codigo_cimpa_fk.id_colaborador_principal_fk.tipo',
                'id_codigo_cimpa_fk.id_colaborador_principal_fk.carga',
                'producto.id_producto_fk.detalle',
                'producto.id_producto_fk.fecha',
                'producto.tipo', ['id_asistente_carnet_fk.id_asistente_carnet', 'id_asistente_carnet_fk.id_nombre_completo_fk', 'id_asistente_carnet_fk.condicion_estudiante', 'cantidad_horas']
            ]

            // Nombres de las columnas o titulos de los items (incluye tabla extra)
            JsonForReport.colNames = [
                'Código VI',
                'Código CIMPA',
                'Estado proyecto',
                'Nombre',
                'Ultima versión de proyecto',
                'Fecha vigencia',
                'Descripción',
                'Actividad',
                'Colaborador Principal',
                'Colaborador Principal Cedula',
                'Colaborador Principal fecha inicio',
                'Colaborador Principal fecha fin',
                'Colaborador Principal tipo',
                'Colaborador Principal carga',
                'Detalle producto',
                'Fecha producto',
                'Tipo producto',
                {'tableName': 'Asistentes', 'colNames': ['Carnet', 'Nombre', 'Condición', 'Cantidad horas']}
            ]

            // Función auxiliar particular para configurar data del reporte
            setJsonIsReady(await configureReportData())
        }

        // Use effect para cada vez que hay un cambio en la data (contemplando filtrado [Search]), se actualice el JSON
        useEffect(() => {
            setJsonIsReady(false)
            createJsonForReport()
        }, [proyectos])

    // ==============================================================================================================================
    
    useEffect(() => {
        const transformedProyectos = proyectos;
        setTransformedState(transformedProyectos);
    }, [proyectos]);

    useEffect(() => {
        async function fetchData() {
            await loadProyectos();
            setCargado(true);
        }

        fetchData();
    }, [reload]);

    async function loadProyectos() {
        try {
            if(isInvestigador){
                const res = await obtenerProyectos(localStorage.getItem('token'))

                const proyectosFiltrados = res.data.filter(proyecto => proyecto.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.correo === user.academico_fk.correo);

                setData(res.data)
                setProyectos(res.data)
            } else {
                const res = await obtenerProyectos(localStorage.getItem('token'))
                setData(res.data)
                setProyectos(res.data)
            }
           

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

    const elementClicked = (proyecto) => {
        navigate(`/gestion-proyectos/p_id=${proyecto.id_codigo_vi}/gestion-versiones`)
    }

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
        setProyectos(matches)
    }

    user.groups[0] !== "administrador" && user.groups[0] !== "investigador" && user.groups[1] !== "investigador"  ? setError(true) : null

    return (
        <main>

            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <>
                        <div className="d-flex flex-row">
                            <h1>Gestión de proyectos</h1>
                            {!cargado && (
                                <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                            )}
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                            <div >
                                <HtmlTooltip
                                    title={
                                        <React.Fragment>
                                            <b>¿Cómo agregar un proyecto?</b>
                                            <br />
                                            Para hacerlo, la propuesta de ese proyecto debe de estar aprobada. Diríjase a Gesión de propuestas, dele click a la propuesta y apruébela con el botón que lo indica.
                                        </React.Fragment>
                                    }
                                    placement="right-start"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="23"
                                        height="23"
                                        fill="currentColor"
                                        className="mx-2 info"
                                        style={{ cursor: "pointer", color: "#670000" }}
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                    </svg>
                                </HtmlTooltip>


                            </div>
                            <div className="d-flex container-fluid justify-content-end">
                                {/* ---------> Añadir la siguiente linea de codigo en el div del search. Posiblemente requiera ajustes de CSS <-----------*/}
                                {(JsonIsReady && (<ReportButton reportData={JsonForReport.reportData} reportTitle={JsonForReport.reportTitle} colNames={JsonForReport.colNames} dataKeys={JsonForReport.dataKeys} idKey={JsonForReport.idKey}></ReportButton>))}
                                {/* ----------------------------------------------------------------------------------------------------------------------*/}
                                <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
                            </div>
                        </div>
                        <TableNoHover style={{ cursor: 'default' }} columns={columns} data={transformedState} dataKeys={dataKeys} onDoubleClick={elementClicked} hasButtonColumn={true} buttonText="Gestionar" ></TableNoHover>
                        <Toaster></Toaster>
                    </>
                </div>
            ) : (
                <PermisoDenegado></PermisoDenegado>
            )}
        </main>
    );

}

const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: 'rgba(0, 0, 0, 0.77)',
        maxWidth: 300,
        fontSize: theme.typography.pxToRem(16),
        border: '1px solid #dadde9',
    },
}));