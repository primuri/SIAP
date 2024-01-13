import { FormModal } from "../../utils/FormModal";
import { VIFields } from "../../pages/GestionInformes/utils";
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
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


    useEffect(() => {
        obtenerProyectos()
    })

    useEffect(() => {
        cargarVersiones()
        console.log("Proyecto selec: " + proyectoSeleccionado)
    }, [proyectoSeleccionado])

    // => Campos del formulario 

    const [formData, setFormData] = useState({
        detalle: evaluacion ? evaluacion.detalle : "",
        estado: evaluacion ? evaluacion.estado : "",
        id_version_proyecto_fk: evaluacion ? evaluacion.id_version_proyecto_fk : null,
        id_evaluador_fk: evaluacion ? evaluacion.id_evaluador_fk : null,
        id_documento_evaluacion_fk: evaluacion ? { ...evaluacion.id_documento_evaluacion_fk } : { tipo: "Evaluacion", detalle: "", documento: "" }
    })

    // => Funciones para el autoComplete

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

    const handleProyectoSeleccionadoChange = (event, newValue) => {
        proyectoSeleccionado = newValue; // Actualiza la variable directamente
    };

    const cargarVersiones = async () => {
        // Expresión regular para extraer el id_codigo_vi del string almacenado en proyectoSeleccionado
        const regex = /^\d+/;

        try {
            // Suponiendo que proyectoSeleccionado es el string que contiene el id_codigo_vi
            const match = proyectoSeleccionado.match(regex);

            // Verificar si se encontró el id_codigo_vi en el string
            if (match && match[0]) {
                const idProyecto = match[0];
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

        if (obj === "oficio") {
            setFileOficio(file);
        } else if (obj === "informe") {
            setFileInforme(file)
        }
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
            <FormModal {...{ icono, mode, nombreForm: "evaluación", onCancel, handleEditClick, handleDeleteClick, handleDeleteConfirm, handleEditCancel, handleDeleteCancel, showConfirmationDelete, showConfirmationEdit, sendForm }}>
                <div className="modal-body" style={{ padding: '3vh 4vw' }}>
                    <div className="container">
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="proyecto" className="label-personalizado mb-2">Proyecto a evaluar</label>
                                {(!loadedLista) && (
                                    <div className="spinner-border text-info" style={{marginLeft: '1vw', width: '15px', height: '15px'}} role="status"></div>
                                )}
                                <Autocomplete
                                    value={proyectoSeleccionado}
                                    id="free-solo-demo"
                                    freeSolo
                                    options={proyectos}
                                    renderInput={(params) => <TextField {...params} />}
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
                                    <div className="spinner-border text-info" style={{marginLeft: '1vw', width: '15px', height: '15px'}} role="status"></div>
                                )}
                                {proyectoSeleccionado !== '' ? (<>
                                    <select
                                        className="form-select seleccion"
                                        name="id_version_proyecto_fk"
                                        id="id_version_proyecto_fk"
                                        value={formData.id_version_proyecto_fk}
                                        onChange={handleChange}
                                        disabled={proyectoSeleccionado !== '' ? false : true}
                                    >
                                        <option value="" disabled defaultValue={""}>Seleccione una version</option>
                                        {versionesProyecto.map((version) => (
                                            <option value={version.id_version_proyecto}>
                                                {version.numero_version}
                                            </option>
                                        ))}
                                    </select>
                                </>) : (<><input type="text" className="form-control disabled-input" disabled={true} value={'Primero seleccione un proyecto'} /></>)}
                            </div>
                        </div>
                    </div>
                </div>
            </FormModal>
        </>
    )
}