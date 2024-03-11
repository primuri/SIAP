import { FormModalModified } from "../../utils/FormModalModified";
import { VIFields } from "../../pages/GestionInformes/utils";
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import icono from '../../assets/person-i.png'
import * as API from '../../api/gestionEvaluaciones'

export const EvaluacionForm = ({ onSubmit, onDelete, onCancel, mode, evaluacion }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false)
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false)
    const [documento, setDocumento] = useState(null)
    const [proyectos, setProyectos] = useState([])
    const [versionesProyecto, setVersionesProyecto] = useState([])
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState('')
    const [loadedLista, setLoadedLista] = useState(false)
    const [loadedVersiones, setLoadedVersiones] = useState(true)
    const [evaluadores, setEvaluadores] = useState([])
    const [evaluadorSeleccionado, setEvaluadorSeleccionado] = useState('')
    const [loadedEvaluadores, setLoadedEvaluadores] = useState(true)
    const [canDelete, setCanDelete] = useState(true)
    useEffect(() => {
        obtenerProyectos()
        obtenerEvaluadores()
        checkCanDelete()
        if(mode === 2 && evaluacion){
            setProyectoSeleccionado(`${evaluacion.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi} | ${evaluacion.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}`)
            setEvaluadorSeleccionado(`${evaluacion.id_evaluador_fk.id_evaluador} | ${evaluacion.id_evaluador_fk.id_nombre_completo_fk.nombre} ${evaluacion.id_evaluador_fk.id_nombre_completo_fk.apellido}`)
        }
    }, [])

    useEffect(() => {
        cargarVersiones()
        console.log("Proyecto selec: " + proyectoSeleccionado)
    }, [proyectoSeleccionado])

    // => Campos del formulario 

    const [formData, setFormData] = useState({
        id_evaluacion: evaluacion ? evaluacion.id_evaluacion : '',
        detalle: evaluacion ? evaluacion.detalle : "",
        estado: evaluacion ? evaluacion.estado : "Pendiente",
        id_version_proyecto_fk: evaluacion ? evaluacion.id_version_proyecto_fk.id_version_proyecto: null,
        id_evaluador_fk: evaluacion ? evaluacion.id_evaluador_fk.id_evaluador : null,
        id_documento_evaluacion_fk: evaluacion ? { ...evaluacion.id_documento_evaluacion_fk } : { tipo: "Evaluacion", detalle: "", documento: null }
    })

    // => Funciones para el autoComplete
    const checkCanDelete = async () => {
        if(evaluacion){
            var canDelete = await API.canDelete(evaluacion.id_evaluacion)
            if (!canDelete) {
                setCanDelete(false)
            }
            setCanDelete(true)
        }
        
    }
    var obtenerProyectos = async () => {
        var listaProyectos = [];
        try {
            var response = await API.obtenerProyectos();

            for (const proyecto of response.data) {
                let stringProyecto = `${proyecto.id_codigo_vi} | ${proyecto.id_codigo_cimpa_fk.nombre}`;
                listaProyectos.push(stringProyecto);
                
            }
        } catch (error) {
            console.log(error);
        }
        setProyectos(listaProyectos)
        setLoadedLista(true)
    };

    const cargarVersiones = async () => {
        // Expresión regular para extraer el id_codigo_vi del string almacenado en proyectoSeleccionado
        const regex = /(\d+-\d+)\s*\|/;

        try {
            // Suponiendo que proyectoSeleccionado es el string que contiene el id_codigo_vi
            const match = proyectoSeleccionado.match(regex);

            // Verificar si se encontró el id_codigo_vi en el string
            if (match && match[1]) {
                const idProyecto = match[1];
                setLoadedVersiones(false)
                // Obtener las versiones del proyecto utilizando la API
                const response = await API.obtenerVersionesProyecto(idProyecto);

                // Actualizar el estado con las versiones del proyecto
                setVersionesProyecto(response.data);
                setLoadedVersiones(true)

            }
        } catch (error) {
            console.log(error);
        }
    }

    var obtenerEvaluadores = async () =>{
        var listaEvaluadores = []

        try {
            var response = await API.obtenerEvaluadores();

            for (const evaluador of response.data) {
                let stringEvaluador = `${evaluador.id_evaluador} | ${evaluador.id_nombre_completo_fk.nombre} ${evaluador.id_nombre_completo_fk.apellido}`;
                listaEvaluadores.push(stringEvaluador);
            }
        } catch (error) {
            console.log(error);
        }
        setEvaluadores(listaEvaluadores)
        setLoadedEvaluadores(true)
    }

    // => Funciones de manejo de cambios

    const updateNestedField = (formData, fieldPath, value) => {
        const keys = fieldPath.split('.');
        const lastKey = keys.pop();

        keys.reduce((obj, key) => obj[key] = obj[key] || {}, formData)[lastKey] = value;

        return { ...formData };
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedFormData = updateNestedField(formData, name, value);
        setFormData(updatedFormData);
    };

    const handleDeleteClick = () => {
        setShowConfirmationDelete(true);
    };

    const handleEditClick = () => {
        setShowConfirmationEdit(true);
    };

    const handleDeleteConfirm = () => {
        onDelete();
        setShowConfirmationDelete(false);
    };

    const handleDeleteCancel = () => {
        setShowConfirmationDelete(false);
    };

    const handleEditCancel = () => {
        setShowConfirmationEdit(false);
    };

    const handleFileChange = (event, obj) => {
        const file = event.target.files[0];

        setDocumento(file)
    };

    // => Recoleccion y envio de formulario

    const sendForm = (event) => {
        event.preventDefault();
        let sendingForm = { ...formData }

        if (documento) {
            sendingForm.id_documento_evaluacion_fk.documento = documento
        }

        onSubmit(sendingForm);
    };

    return (
        <>
            <FormModalModified {...{ icono, mode, borrar: (formData.estado === "Completa"), nombreForm: "evaluación", onCancel, handleEditClick, handleDeleteClick, handleDeleteConfirm, handleEditCancel, handleDeleteCancel, showConfirmationDelete, showConfirmationEdit, sendForm }}>
                <div className="modal-body" style={{ padding: '3vh 4vw' }}>
                    <div className="container">
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="proyecto" className="label-personalizado mb-2">Proyecto a evaluar</label>
                                {(!loadedLista) && (
                                    <div className="spinner-border text-info" style={{ marginLeft: '1vw', width: '15px', height: '15px' }} role="status"></div>
                                )}
                                <Autocomplete
                                    value={proyectoSeleccionado}
                                    id="free-solo-demo"
                                    freeSolo
                                    options={proyectos}
                                    renderInput={(params) => <TextField {...params} required/>}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            setProyectoSeleccionado(newValue)
                                        } else {
                                            setProyectoSeleccionado('')
                                        }
                                    }}
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="numero_version" className="label-personalizado mb-2">Versión a evaluar</label>
                                {(!loadedVersiones) && (
                                    <div className="spinner-border text-info" style={{ marginLeft: '1vw', width: '15px', height: '15px' }} role="status"></div>
                                )}
                                {proyectoSeleccionado !== '' ? (<>
                                    <select
                                        className="form-select seleccion"
                                        name="id_version_proyecto_fk"
                                        id="id_version_proyecto_fk"
                                        value={formData.id_version_proyecto_fk}
                                        onChange={handleChange}
                                        disabled={proyectoSeleccionado !== '' ? false : true}
                                        required
                                    >
                                        <option value="" defaultValue={""}>Seleccione una version</option>
                                        {versionesProyecto.map((version) => (
                                            <option value={version.id_version_proyecto}>
                                                {version.numero_version}
                                            </option>
                                        ))}
                                    </select>
                                </>) : (<><input type="text" className="form-control disabled-input" disabled={true} value={'Primero seleccione un proyecto'} /></>)}
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                        <label htmlFor="numero_version" className="label-personalizado mb-2">Evaluador asignado</label>

                            {(!loadedEvaluadores) && (
                                    <div className="spinner-border text-info" style={{ marginLeft: '1vw', width: '15px', height: '15px' }} role="status"></div>
                                )}
                                <Autocomplete
                                    value={evaluadorSeleccionado}
                                    id="free-solo-demo"
                                    freeSolo
                                    options={evaluadores}
                                    renderInput={(params) => <TextField {...params} required/>}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            setEvaluadorSeleccionado(newValue)
                                            const regex = /^\d+/;

                                            try {
                                                const match = newValue.match(regex);
                                    
                                                if (match && match[0]) {
                                                    const idEvaluador = match[0];
                                                    formData.id_evaluador_fk = idEvaluador
                                                }
                                                console.log(formData.id_evaluador_fk)
                                            } catch (error) {
                                                console.log(error);
                                            }
                                        } else {
                                            setEvaluadorSeleccionado('')
                                        }
                                    }}
                                />
                            </div>
                            {mode == 2 && (
                            <div className="col">
                                <label htmlFor="numero_version" className="label-personalizado mb-2">Estado <span className="disabled-input">(Solo ver)</span></label>
                                <input type="text" className="form-control disabled-input" name="detalle" id="detalle" value={formData.estado} disabled/>
                            </div>)}
                        </div>
                        <div className="row mb-4">

                            <div className="col">
                                <label htmlFor="documento" className="label-personalizado mb-2"> Documento evaluación <span className="disabled-input">(Opcional)</span></label>
                                <input type="file" className="form-control" name="id_documento_evaluacion_fk.documento" id="documentoInforme" onChange={(event) => handleFileChange(event)} />
                                {mode == 2 && typeof formData.id_documento_evaluacion_fk.documento !== 'object' && (
                                    <Tooltip title={formData.id_documento_evaluacion_fk.documento.split('/').pop()} placement="right-start">
                                        <a href={"http://localhost:8000" + formData.id_documento_evaluacion_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                            {"Ver documento"}
                                        </a>
                                    </Tooltip>
                                )}
                            </div>
                            <div className="col">
                                <label htmlFor="detalleEvaluacion" className="label-personalizado mb-2"> Detalle evaluación <span className="disabled-input">(Opcional)</span></label>
                                <input type="text" className="form-control" name="detalle" id="detalle" value={formData.detalle} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </FormModalModified>
        </>
    )
}