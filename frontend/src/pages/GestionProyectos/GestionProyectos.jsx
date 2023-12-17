import { useEffect, useState } from "react"
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Table } from "../../utils/Table"
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { Search } from "../../utils/Search"
import { toast, Toaster } from 'react-hot-toast'
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import {obtenerProyectos } from "../../api/gestionProyectos"
import { useNavigate } from "react-router-dom"
import { TableNoHover } from "../../utils/TableNoHover";


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

    user.groups[0] !== "administrador" ? setError(true) : null  
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

    // Al hacer click en la tabla
    const elementClicked = (proyecto) => {
        // setSelectedProyecto(proyecto);
        // setProyectosVersion([])
        // setSelectedIdCodigoVi(proyecto.id_codigo_vi);
        // loadVersionProyectos(proyecto.id_codigo_vi);
        // setDetalleVisible(true);
        navigate(`/gestion-proyectos/p_id=${proyecto.id_codigo_vi}/gestion-versiones`)
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
                    <>
                        <div className="d-flex flex-row">
                            <h1>Gestión de proyectos</h1>
                            {!cargado && (
                                <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                            )}
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                            <div className="w-50">
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
                            <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
                        </div>
                        <TableNoHover style={{ cursor: 'default' }} columns={columns} data={transformedState} dataKeys={dataKeys} onDoubleClick ={elementClicked} hasButtonColumn={true} buttonText="Gestionar" ></TableNoHover>
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