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

export const EvaluacionForm = ({ onSubmit, onCancel, evaluacion, mode  }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false)

    const [formData, setFormData] = useState({
        nombreEvaluador: evaluacion ? evaluacion.id_evaluador_fk.id_nombre_completo_fk.nombre : "",
        apellidoEvaluador: evaluacion ? evaluacion.id_evaluador_fk.id_nombre_completo_fk.apellido: "",
        id: evaluacion ? evaluacion.id_evaluacion : "",
        detalle: evaluacion ? evaluacion.detalle : "",
        nombre: evaluacion ? evaluacion.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre : "",
        descripcion: evaluacion ? evaluacion.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.descripcion : "",
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
        /*event.preventDefault();
        formData.id_version_proyecto_fk = 1;
        const jsonData = JSON.stringify(formData);
        onSubmit(jsonData);*/
    };

    const handleEvaluarClick = () => {
        setShowConfirmationEdit(true);
    };


    const handleEvaluarCancel = () => {
        setShowConfirmationEdit(false);
    };

    return (
        <div>
            <div className="modal-header pb-0 position-sticky top-0">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-1 mb-0 text-center">
                            <div className="img-space">
                                <img src={icono} alt="" width={'72px'} />
                            </div>
                        </div>
                        <div className="col mb-0 ">
                            <h2 className="headerForm text-center"> {mode === 1 ? "Evaluación de proyecto" : formData.nombre }</h2>                                 
                            <div className="form-group">
                                <p htmlFor="id_informe" className="label-personalizado mb-2 " style={{ fontWeight: 'normal', textAlign: 'justify' }}>
                                 A continuación, se presenta una lista de indicadores para evaluar la propuesta de investigación asignada a su juicio experto. Después de leer cada uno de ellos, otorgue una calificación del 1 al 5, donde 1 corresponde a Muy insatisfactorio, 3 Satisfactorio y 5 Muy Satisfactorio. A mayor calificación, mayor satisfacción con la calidad y excelencia en el rubro indicado. Debe aportarse, sin excepción, una breve justificación de la calificación asignada a cada rubro. Puede optarse por completar “No aplica” cuando parezca que el indicador no es pertinente para la propuesta evaluada y se deben adicionar las observaciones respectivas, así como los comentarios cualitativos.
                                </p>

                                <br></br><br></br>
                                 Para todos los casos: <br></br>
                                    a) Brindar el argumento correspondiente para justificar el puntaje asignado;<br></br>
                                    b) Explicitar la oportunidad de mejora: ¿cómo puede mejorar la propuesta en este rubro?
                            </div>
                        </div>

                        <div className="col-1 mb-0 text-center">
                            <button type="button" onClick={onCancel} className="close" data-dismiss="modal">
                                <span aria-hidden="true" className="close-icon">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={sendForm} className='d-flex flex-column position-relative justify-content-center' encType="multipart/form-data">
                <div className="modal-body justify-content-center" style={{ padding: '3vh 4vw' }}>

                <div className="container ">
                        <div className="row mb-4">
                            <div className="col">
                              
                            <div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"></input>
  <label class="form-check-label" for="inlineRadio1">1</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2"></input>
  <label class="form-check-label" for="inlineRadio2">2</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="option3"></input>
  <label class="form-check-label" for="inlineRadio3">3</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio4" value="option4"></input>
  <label class="form-check-label" for="inlineRadio4">4</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio5" value="option5"></input>
  <label class="form-check-label" for="inlineRadio4">5</label>
</div>


                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-footer justify-content-center position-sticky bottom-0">
                    <div className="row">
                        <div className="col">
                            <button id="boton-personalizado" type="button" onClick={handleEvaluarClick} className='table-button border-0 p-2 rounded text-white'>Enviar</button>
                            {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEvaluarCancel} accion="Enviar" objeto="evaluación" />)}
                        </div>
                    </div>
                </div>
            </form>
            <Toaster></Toaster>
        </div>
    )
}

EvaluacionForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
}