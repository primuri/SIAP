import React, { useState } from 'react';

export const SoftwareForm = ({ mode, software, setCambios }) => {
    const [formData, setFormData] = useState({
        nombre: software ? software.nombre : "",
        version: software ? software.version : "",
        id_producto_fk: software ? software.id_producto_fk : {
            id_producto: software && software.id_producto_fk ? software.id_producto_fk.id_producto : "",
            fecha: software && software.id_producto_fk ? software.id_producto_fk.fecha : "",
            detalle: software && software.id_producto_fk ? software.id_producto_fk.detalle : ""
        },
            id_documento_documentacion_fk: software ? software.id_documento_documentacion_fk : {
                id_documento_documentacion: software && software.id_documento_documentacion_fk ? software.id_documento_documentacion_fk.id_documento_documentacion : "",
                tipo: software && software.id_documento_documentacion_fk ? software.id_documento_documentacion_fk.tipo : "Documentacion",
                detalle: software && software.id_documento_documentacion_fk ? software.id_documento_documentacion_fk.detalle : "",
                documento: software && software.id_documento_documentacion_fk ? software.id_documento_documentacion_fk.documento : ""
            }
    })

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
        setCambios(formData)
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        formData.id_documento_documentacion_fk.documento = file
        setCambios(formData)
    };

    return (
        <>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="nombre" className="label-personalizado mb-2"> Nombre <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="numero_version" className="label-personalizado mb-2"> Num. versión <span className="required">*</span> </label>
                    <input type="number" className="form-control" name="version" id="version" value={formData.version} onChange={handleChange} required />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="detalleInforme" className="label-personalizado mb-2"> Detalle informe <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="id_documento_documentacion_fk.detalle" id="detalleInforme" value={formData.id_documento_documentacion_fk.detalle} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="documento" className="label-personalizado mb-2"> Documento documentación <span className="required">*</span> </label>
                    <input type="file" className="form-control" name="id_documento_documentacion_fk.documento" id="documento" onChange={handleFileChange} required={mode == 1} />
                    {mode == 2 && (typeof formData.id_documento_documentacion_fk.documento === 'string') && (
                        <a href={"http://localhost:8000" + formData.id_documento_documentacion_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                            {formData.id_documento_documentacion_fk.documento.split('/').pop()}
                        </a>
                    )}
                </div>
            </div>
        </>
    )

}
/*
    NOTA PARA SETCAMBIOS: La idea es que este componente reciba una función set cambios que permita que el componente
    padre pueda tener siempre actualizado el formdata del software, por lo que se debe trabajar debidamente esa función
*/
/*
    NOTA PARA DOCUMENTO: Debe tratarse diferente cuando se edita el archivo (documentación) y cuando no. Dado que, puede mandar
    un 'editar' con un archivo o un 'editar' con una ruta al archivo... Esto dependiendo de si se activó
    el handleFileChange o no.
*/