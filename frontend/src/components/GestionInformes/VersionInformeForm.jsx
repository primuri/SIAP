import { FormModal } from "../../utils/FormModal";
import { VIFields } from "../../pages/GestionInformes/utils";
import { useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import icono from '../../assets/person-i.png'

export const VersionInformeForm = ({ onSubmit, onDelete, onCancel, mode, versionInforme }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false)
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false)
    const [formData, setFormData] = useState(VIFields(versionInforme))
    const [fileOficio, setFileOficio] = useState(null);
    const [fileInforme, setFileInforme] = useState(null);

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
            setFileOficio(file);
        } else if (obj === "informe") {
            setFileInforme(file)
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
                                <input type="number" className="form-control" name="numero_version" id="numero_version" value={formData.numero_version} onChange={handleChange} required />
                            </div>
                            <div className="col">
                                <label htmlFor="fecha_presentacion" className="label-personalizado mb-2"> Fecha presentación   </label>
                                <input type="date" className="form-control" name="fecha_presentacion" id="fecha_presentacion" value={formData.fecha_presentacion} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="detalleOficio" className="label-personalizado mb-2"> Detalle oficio   </label>
                                <input type="text" className="form-control" name="id_oficio_fk.detalle" id="detalleOficio" value={formData.id_oficio_fk.detalle} onChange={handleChange} required />
                            </div>
                            <div className="col">
                                <label htmlFor="documentoOficio" className="label-personalizado mb-2"> Documento oficio   </label>
                                <input type="file" className="form-control" name="id_oficio_fk.documento" id="documentoOficio" onChange={(event) => handleFileChange(event, 'oficio')} required={mode == 1} />
                                {mode == 2 && (
                                     <Tooltip title={formData.id_oficio_fk.ruta_archivo.split('/').pop()} placement="right-start">
                                     <a href={"http://localhost:8000" + formData.id_oficio_fk.ruta_archivo} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                        {"Ver documento"}
                                    </a>
                                    </Tooltip>
                                    
                                )}
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="detalleInforme" className="label-personalizado mb-2"> Detalle informe   </label>
                                <input type="text" className="form-control" name="id_documento_informe_fk.detalle" id="detalleInforme" value={formData.id_documento_informe_fk.detalle} onChange={handleChange} required />
                            </div>
                            <div className="col">
                                <label htmlFor="documentoInforme" className="label-personalizado mb-2"> Documento informe   </label>
                                <input type="file" className="form-control" name="id_documento_informe_fk.documento" id="documentoInforme" onChange={(event) => handleFileChange(event, 'informe')} required={mode == 1} />
                                {mode == 2 && (

                                    <Tooltip title={formData.id_documento_informe_fk.documento.split('/').pop()} placement="right-start">
                                        <a href={"http://localhost:8000" + formData.id_documento_informe_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                            {"Ver documento"}
                                        </a>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        {mode === 2 && typeof formData.id_evaluacion_cc_fk.documento !== 'undefined' && (
                            <div className="row mb-4">
                                <div className="col">
                                    <label htmlFor="detalleEvaluacionCC" className="label-personalizado mb-2"> Detalle evaluación CC   </label>
                                    <input type="text" className="form-control" name="id_evaluacion_cc_fk.detalle" id="detalleEvaluacion" value={formData.id_evaluacion_cc_fk.detalle} onChange={handleChange} disabled />
                                </div>
                                <div className="col">
                                    <label htmlFor="documentoEvaluacionCC" className="label-personalizado mb-2"> Documento evaluación CC   </label>
                                    <a href={formData.id_evaluacion_cc_fk.documento} target="blank" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                        {formData.id_evaluacion_cc_fk.documento.split('/').pop()}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </FormModal>
        </>
    )
}