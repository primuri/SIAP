import { FormModal } from "../../utils/FormModal";
import { VIFields } from "../../pages/GestionInformes/utils";
import { useState, useEffect } from "react";
import Tooltip from '@mui/material/Tooltip';
import icono from '../../assets/document.svg'
import icono2 from '../../assets/upload_doc.svg'

export const VersionInformeForm = ({ onSubmit, onDelete, onCancel, mode, versionInforme }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false)
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false)
    const [formData, setFormData] = useState(VIFields(versionInforme))
    const [fileOficio, setFileOficio] = useState(null);
    const [fileInforme, setFileInforme] = useState(null);  
    const [fileEvaluacion, setFileEvaluacion] = useState(null);
    const [selectedFileNameOficio, setSelectedFileNameOficio] = useState('');
    const [selectedFileNameInforme, setSelectedFileNameInforme] = useState('');
    const [selectedFileNameEvaluacion, setSelectedFileNameEvaluacion] = useState('');

    const user = JSON.parse(localStorage.getItem('user'))
    const isInvestigador = user.groups.some((grupo) => {
        return grupo === 'investigador';
    });

    useEffect(() => {
        if (versionInforme) {
            setFormData(VIFields(versionInforme));
            setFileOficio(versionInforme.id_oficio_fk?.ruta_archivo || null);
            setFileInforme(versionInforme.id_documento_informe_fk?.documento || null);
            setFileEvaluacion(versionInforme.id_evaluacion_cc_fk?.id_documento_evualuacion_fk?.documento || null);
        }
    }, [versionInforme]);

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

    const sendForm = (event) => {
        event.preventDefault();
        let sendingForm = { ...formData }
        if (fileOficio) {
            sendingForm.id_oficio_fk.ruta_archivo = fileOficio
        }
        if (fileInforme) {
            sendingForm.id_documento_informe_fk.documento = fileInforme
        }
        if (fileEvaluacion){
           if(sendingForm.id_evaluacion_cc_fk.id_documento_evualuacion_fk === null){
                sendingForm.id_evaluacion_cc_fk.id_documento_evualuacion_fk = {
                    tipo: "Evaluacion",
                    detalle: "Doc EVCC",
                    documento: null
                };
           }
            sendingForm.id_evaluacion_cc_fk.id_documento_evualuacion_fk.documento = fileEvaluacion 
           
            
           
        }

        onSubmit(sendingForm);
        sendingForm = { ...formData }
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
            setSelectedFileNameOficio(file.name);
            setFileOficio(file);
        } else if (obj === "informe") {
            setSelectedFileNameInforme(file.name);
            setFileInforme(file)
        } else if (obj === "evaluacion"){
            setSelectedFileNameEvaluacion(file.name);
            setFileEvaluacion(file)
        }
    };

    return (
        <>
            <FormModal {...{ icono, mode, nombreForm: "versión informe", onCancel, handleEditClick, handleDeleteClick, handleDeleteConfirm, handleEditCancel, handleDeleteCancel, showConfirmationDelete, showConfirmationEdit, sendForm }}>
                <div className="modal-body" style={{ padding: '3vh 4vw' }}>
                    <div className="container">
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="numero_version" className="label-personalizado mb-2"> Número versión   </label>
                                <input type="number" className="form-control" name="numero_version" id="numero_version" value={formData.numero_version} onChange={handleChange} required disabled={isInvestigador}/>
                            </div>
                            <div className="col">
                                <label htmlFor="fecha_presentacion" className="label-personalizado mb-2"> Fecha presentación   </label>
                                <input type="date" className="form-control" name="fecha_presentacion" id="fecha_presentacion" value={formData.fecha_presentacion} onChange={handleChange} required disabled={isInvestigador}/>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="detalleOficio" className="label-personalizado mb-2"> Detalle oficio   </label>
                                <textarea className="form-control" name="id_oficio_fk.detalle" id="detalleOficio" value={formData.id_oficio_fk.detalle} onChange={handleChange} required disabled={isInvestigador}/>
                            </div>
                            <div className="col">
                                <label htmlFor="documentoOficio" className="label-personalizado mb-2" style={{ display: 'block' }}>
                                    Documento oficio
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="id_oficio_fk.documento"
                                    id="documentoOficio"
                                    onChange={(event) => handleFileChange(event, 'oficio')}
                                    required={mode === 1}
                                    disabled={isInvestigador}
                                    style={{ display: 'none' }} 
                                />
                                <label htmlFor="documentoOficio" style={{ cursor: 'pointer', display: 'block' }}>
                                    {selectedFileNameOficio ? (
                                        <span>Nombre del archivo: {selectedFileNameOficio}</span>
                                    ) : (
                                        <div className="file-upload-icon-container">
                                            <img src={icono2} alt="Seleccionar archivo" className="file-upload-icon" />
                                        </div>
                                    )}
                                </label>
                                {mode === 2 && formData.id_oficio_fk.ruta_archivo && (
                                    <Tooltip title={formData.id_oficio_fk.ruta_archivo.split('/').pop()} placement="right-start">
                                        <a
                                            href={"http://localhost:8000" + formData.id_oficio_fk.ruta_archivo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
                                        >
                                            Ver documento
                                        </a>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="detalleInforme" className="label-personalizado mb-2"> Detalle informe   </label>
                                <textarea className="form-control" name="id_documento_informe_fk.detalle" id="detalleInforme" value={formData.id_documento_informe_fk.detalle} onChange={handleChange} required disabled={isInvestigador}/>
                            </div>
                            <div className="col">
                                <label htmlFor="documentoInforme" className="label-personalizado mb-2" style={{ display: 'block' }}>
                                    Documento informe
                                </label>
                                <input
                                    type="file"
                                    className="form-control"
                                    name="id_documento_informe_fk.documento"
                                    id="documentoInforme"
                                    onChange={(event) => handleFileChange(event, 'informe')}
                                    required={mode === 1}
                                    disabled={isInvestigador}
                                    style={{ display: 'none' }} 
                                />
                                <label htmlFor="documentoInforme" style={{ cursor: 'pointer', display: 'block' }}>
                                    {selectedFileNameInforme ? (
                                        <span>Nombre del archivo: {selectedFileNameInforme}</span>
                                    ) : (
                                        <div className="file-upload-icon-container">
                                            <img src={icono2} alt="Seleccionar archivo" className="file-upload-icon" />
                                        </div>
                                    )}
                                </label>
                                {mode === 2 && formData.id_documento_informe_fk.documento && (
                                    <Tooltip title={formData.id_documento_informe_fk.documento.split('/').pop()} placement="right-start">
                                        <a
                                            href={"http://localhost:8000" + formData.id_documento_informe_fk.documento}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
                                        >
                                            Ver documento
                                        </a>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <label htmlFor="detalleEvaluacionCC" className="label-personalizado mb-2"> Detalle evaluación CC <span className="disabled-input">(Opcional)</span>  </label>
                                    <textarea className="form-control" name="id_evaluacion_cc_fk.detalle" id="detalleEvaluacion" value={formData.id_evaluacion_cc_fk.detalle} onChange={handleChange} disabled={isInvestigador}/>
                                </div>
                                <div className="col">
                                    <label htmlFor="documentoEvaluacionCC" className="label-personalizado mb-2" style={{ display: 'block' }}>
                                        Documento evaluación CC
                                        <span className="disabled-input">(Opcional)</span>
                                    </label>
                                    <input
                                        type="file"
                                        className={formData.estado === "Completa" ? "form-control disabled-input" : "form-control"}
                                        name="id_evaluacion_cc_fk.id_documento_evualuacion_fk.documento"
                                        id="documentoEvaluacionCC"
                                        onChange={(event) => handleFileChange(event, 'evaluacion')}
                                        style={{ display: 'none' }}
                                        disabled={isInvestigador}
                                    />
                                    <label htmlFor="documentoEvaluacionCC" style={{ cursor: 'pointer', display: 'block' }}>
                                        {selectedFileNameEvaluacion ? (
                                            <span>Nombre del archivo: {selectedFileNameEvaluacion}</span>
                                        ) : (
                                            <div className="file-upload-icon-container">
                                                <img src={icono2} alt="Seleccionar archivo" className="file-upload-icon" />
                                            </div>
                                        )}
                                    </label>
                                    {mode === 2 && formData.id_evaluacion_cc_fk.id_documento_evualuacion_fk?.documento && (
                                        <Tooltip title={formData.id_evaluacion_cc_fk.id_documento_evualuacion_fk.documento.split('/').pop()} placement="right-start">
                                            <a
                                                href={"http://localhost:8000" + formData.id_evaluacion_cc_fk.id_documento_evualuacion_fk.documento}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
                                            >
                                                Ver documento
                                            </a>
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                    </div>
                </div>
            </FormModal>
        </>
    )
}