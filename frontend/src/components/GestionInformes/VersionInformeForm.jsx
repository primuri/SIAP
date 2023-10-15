import { FormModal } from "../../utils/FormModal";
import { VIFields } from "../../pages/GestionInformes/utils";
import { useState } from "react";
import { icono } from '../../../assets/person-i.png'

export const VersionInformeForm = ({ onSubmit, onDelete, onCancel, mode, versionInforme }) => {
    const [showConfirmationEdit, setShowConfirmationEdit]     = useState(false)
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false)
    const [formData, setFormData]                             = useState(VIFields(versionInforme))

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
        const jsonData = JSON.stringify(formData);
        onSubmit(jsonData);
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileData(file);
    };

    return (
        <>
            <FormModal {...{ icono, mode, nombreForm: "version informe", onCancel, handleEditClick, handleDeleteClick, handleDeleteConfirm, handleEditCancel, handleDeleteCancel, showConfirmationDelete, showConfirmationEdit, sendForm }}>
                <div className="modal-body" style={{ padding: '3vh 4vw' }}>
                    <div className="container">
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="numero_version" className="label-personalizado mb-2"> Num. versión <span className="required">*</span> </label>
                                <input type="number" className="form-control" name="numero_version" id="numero_version" value={formData.numero_version} onChange={handleChange} required />
                            </div>
                            <div className="col">
                                <label htmlFor="fecha_presentacion" className="label-personalizado mb-2"> Fecha presentación <span className="required">*</span> </label>
                                <input type="date" className="form-control" name="fecha_presentacion" id="fecha_presentacion" value={formData.fecha_presentacion} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="detalleOficio" className="label-personalizado mb-2"> Detalle oficio <span className="required">*</span> </label>
                                <input type="text" className="form-control" name="id_oficio_fk.detalle" id="detalleOficio" value={formData.id_oficio_fk.detalle} onChange={handleChange} required />
                            </div>
                            <div className="col">
                                <label htmlFor="documentoOficio" className="label-personalizado mb-2"> Documento oficio <span className="required">*</span> </label>
                                <input type="file" className="form-control" name="id_oficio_fk.documento" id="documentoOficio" onChange={handleFileChange} required={mode == 1} />
                                {mode == 2 && (
                                    <a href={formData.id_oficio_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                        {formData.id_oficio_fk.documento.split('/').pop()}
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="detalleInforme" className="label-personalizado mb-2"> Detalle informe <span className="required">*</span> </label>
                                <input type="text" className="form-control" name="id_documento_informe_fk.detalle" id="detalleInforme" value={formData.id_documento_informe_fk.detalle} onChange={handleChange} required />
                            </div>
                            <div className="col">
                                <label htmlFor="documentoInforme" className="label-personalizado mb-2"> Documento informe <span className="required">*</span> </label>
                                <input type="file" className="form-control" name="id_documento_informe_fk.documento" id="documentoInforme" onChange={handleFileChange} required={mode == 1} />
                                {mode == 2 && (
                                    <a href={formData.id_evaluacion_cc_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                        {formData.id_evaluacion_cc_fk.documento.split('/').pop()}
                                    </a>
                                )}
                            </div>
                        </div>
                        {mode === 2 && formData.id_evaluacion_cc_fk && (
                            <div className="row mb-4">
                                <div className="col">
                                    <label htmlFor="detalleEvaluacionCC" className="label-personalizado mb-2"> Detalle evaluación CC <span className="required">*</span> </label>
                                    <input type="text" className="form-control" name="id_evaluacion_cc_fk.detalle" id="detalleEvaluacion" value={formData.id_evaluacion_cc_fk.detalle} onChange={handleChange} disabled />
                                </div>
                                <div className="col">
                                    <label htmlFor="documentoEvaluacionCC" className="label-personalizado mb-2"> Documento evaluación CC <span className="required">*</span> </label>
                                    <a href={formData.id_evaluacion_cc_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
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