import { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { FormularioDinamico } from "../../utils/FomularioDinamico"
import { toast, Toaster } from 'react-hot-toast'
import icono from '../../assets/person-i.png';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Confirmar } from '../../utils/Confirmar'
import Tooltip from '@mui/material/Tooltip';
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
const filter = createFilterOptions();

export const EvaluacionForm = ({onSubmit, onCancel, evaluacion}) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [seccion, setSeccion] = useState(0);

    const [data, setData] = useState({
        nombreEvaluador: evaluacion ? evaluacion.id_evaluador_fk.id_nombre_completo_fk.nombre : "",
        apellidoEvaluador: evaluacion ? evaluacion.id_evaluador_fk.id_nombre_completo_fk.apellido: "",
        id: evaluacion ? evaluacion.id_evaluacion : "",
        detalle: evaluacion ? evaluacion.detalle : "",
        nombre: evaluacion ? evaluacion.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre : "",
        descripcion: evaluacion ? evaluacion.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.descripcion : "",
    })

    const [formData, setFormData] = useState({
        pregunta1: "El proyecto describe de forma detallada la actualidad, o los vacíos, o nuevos aportes en el estado del conocimiento.",
        respuesta1: "",
        pregunta2: "El planteamiento de la investigación responde a los vacíos o nuevos aportes identificados en el estado del conocimiento.",
        respuesta2: "",
        pregunta3: "La pregunta de investigación puede responderse con los objetivos, hipótesis o metas planteadas de forma adecuada.",
        respuesta3: "",
        pregunta4: "La metodología por implementar responde, de forma adecuada, a la pregunta, los objetivos, hipótesis o metas que se quieren contestar, y aporta al desarrollo del proyecto.",
        respuesta4: "",
        pregunta5: "La estrategia de análisis de datos o de información permite resolver el problema o preguntas planteadas.",
        respuesta5: "",
        pregunta6: "La ejecución de la propuesta contribuye a ampliar el acervo de conocimiento actual sobre el problema o a la solución del problema.",
        respuesta6: "",
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
    
        if (name.includes('.')) {
            const keys = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const sendForm = (event) => {
        event.preventDefault();    
        const allFieldsFilled = Object.values(formData).every(value => value !== "");
        if (allFieldsFilled) {
            const jsonData = JSON.stringify(formData);
            onSubmit(jsonData, evaluacion.id_evaluacion);
        } else {
            toast.error(`Error: Debe completar todos los campos antes de enviar la evaluación.`, {
                duration: 10000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
                })
        }
    };

    const handleEvaluarClick = () => {
        setShowConfirmationEdit(true);
    };

    const handleEvaluarCancel = () => {
        setShowConfirmationEdit(false);
    };

    const handleSiguiente = () => {
        setSeccion(seccion + 1);
    }

    const handleVolver = () => {
        setSeccion(seccion - 1);
    }

    return (
        <div>
            <div className="pb-0 position-sticky ml-2 mt-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="d-flex justify-content-end mb-0">
                            <button type="button" onClick={onCancel} className="close" data-dismiss="modal">
                                <span aria-hidden="true" className="close-icon">&times;</span>
                            </button>
                        </div>
                      
                        {seccion === 0 && (
                        <div>
                            <h2 className="headerForm text-center mt-2 mb-2"> Evaluación del proyecto {data.nombre}</h2>                                 
                            <div className="form-group">
                                <p htmlFor="intro" className="label-personalizado m-4 mb-2 mt-4" style={{ fontWeight: 'normal', textAlign: 'justify' }}>
                                 A continuación, se presenta una lista de indicadores para evaluar la propuesta de investigación asignada a su juicio experto. Después de leer cada uno de ellos, otorgue una calificación del 1 al 5, donde 1 corresponde a Muy insatisfactorio, 3 Satisfactorio y 5 Muy Satisfactorio. A mayor calificación, mayor satisfacción con la calidad y excelencia en el rubro indicado. Debe aportarse, sin excepción, una breve justificación de la calificación asignada a cada rubro. Puede optarse por completar “No aplica” cuando parezca que el indicador no es pertinente para la propuesta evaluada y se deben adicionar las observaciones respectivas, así como los comentarios cualitativos.
                                </p>
                                <div className="row mb-4">
                            <div className="col mt-2 text-center">
                                <div class="form-check form-check-inline">       
                                    <label class="form-check-label" for="inlineRadio1">1: Muy insactisfactorio</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label" for="inlineRadio3">3: Satisfactorio</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label" for="inlineRadio4">5: Muy Satisfactorio</label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <label class="form-check-label" for="inlineRadio4">N/A: No aplica</label>
                                </div>
                            </div>
                        </div>
                        <div className="m-4" >
                        Para todos los casos: <br></br>
                            a) Brindar el argumento correspondiente para justificar el puntaje asignado <br></br>
                            b) Explicitar la oportunidad de mejora: ¿cómo puede mejorar la propuesta en este rubro?
                        </div>
                    </div>
                </div>
                        )}                  
            </div>
        </div>
    </div>

       
            {seccion === 1 && (    
                <div>                
                    <h2 className="headerForm text-center mt-2 mb-2"> Evaluación del proyecto {data.nombre}</h2>   
                    
                    <form onSubmit={sendForm} className='d-flex flex-column position-relative justify-content-center m-5 mt-4' encType="multipart/form-data">
                        <div className="form-group m-2">
                            <label>1. {formData.pregunta1}</label>
                            <textarea className="form-control mt-2" rows="10" required value={formData.respuesta1} onChange={(e) => handleChange({ target: { name: 'respuesta1', value: e.target.value } })}></textarea>
                        </div>
                        <div className="form-group m-2 mt-4">
                            <label>2. {formData.pregunta2} </label>
                            <textarea className="form-control mt-2" rows="10" required value={formData.respuesta2} onChange={(e) => handleChange({ target: { name: 'respuesta2', value: e.target.value } })}></textarea>
                        </div>
                        <div className="form-group m-2 mt-4">
                            <label >3. {formData.pregunta3} </label>
                            <textarea className="form-control mt-2" rows="10" required value={formData.respuesta3} onChange={(e) => handleChange({ target: { name: 'respuesta3', value: e.target.value } })}></textarea>
                        </div>
                        <div className="form-group m-2 mt-4">
                            <label>4. {formData.pregunta4} </label>
                            <textarea className="form-control mt-2" rows="10" required value={formData.respuesta4} onChange={(e) => handleChange({ target: { name: 'respuesta4', value: e.target.value } })}></textarea>
                        </div>
                        <div className="form-group m-2 mt-4">
                            <label>5. {formData.pregunta5} </label>
                            <textarea className="form-control mt-2" rows="10" required value={formData.respuesta5} onChange={(e) => handleChange({ target: { name: 'respuesta5', value: e.target.value } })}></textarea>
                        </div>
                        <div className="form-group m-2 mt-4">
                            <label>6. {formData.pregunta6} </label>
                            <textarea className="form-control mt-2" rows="10" required value={formData.respuesta6} onChange={(e) => handleChange({ target: { name: 'respuesta6', value: e.target.value } })}></textarea>
                        </div>
                    </form>
                </div>        
            )}
     

            <div className="modal-footer justify-content-center position-sticky bottom-0">
                <div className="row">
                    <div className="col">
                        {seccion === 1 && (
                        <div>

                            <button onClick={handleVolver} className='table-button border-0 p-2 m-2 rounded text-white' id="boton-personalizado">Volver</button>
                            <button id="boton-evaluacion" type="button" onClick={handleEvaluarClick} className='table-button border-0 p-2 rounded text-white'>Enviar respuestas</button>
                            {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEvaluarCancel} accion="Enviar respuestas" objeto="evaluación" />)}    
                        </div>
                        
                        )}
                        {seccion === 0 && (<button onClick={handleSiguiente} className='table-button border-0 p-2 m-2 rounded text-white' id="boton-personalizado">Ir a la evaluación ➜</button>)}
                      
                    </div>
                </div>
            </div>
            
            <Toaster></Toaster>
        </div>
    )
}

EvaluacionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}