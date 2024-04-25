import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

export const SoftwareForm = ({ mode, producto, setCambios }) => {
    const [fileData, setFileData] = useState(null);
    const defaultFormData = {
        nombre: "",
        version: "",
        id_producto_fk: {
            id_producto: "",
            fecha: "",
            detalle: ""
        },
        id_documento_documentacion_fk: {
            id_documento_documentacion: "",
            tipo: "Documentacion",
            detalle: "",
            documento: ""
        }
    };

    const checkLetraNum = (value) => {
        const regex = /^[A-Za-z0-9áéíóúÁÉÍÓÚ\s]*$/;
        return regex.test(value);
    };


    const camposAValidar = [
        "id_producto_fk.detalle",
        "id_documento_documentacion_fk.detalle",
        "nombre"
    ];

    const initialFormData = producto || defaultFormData;
    const [formData, setFormData] = useState(initialFormData);



    const handleChange = (event) => {
        const { name, value } = event.target;

        if (camposAValidar.includes(name) && !checkLetraNum(value)) {
            return;
        }

        if (name === "numero_version") {
            if (value.includes('e') || value.includes('+') || value.includes('-') || !/^[0-9]*$/.test(value)) {
                return;
            }
        }
        
        if (name.includes('.')) {
            const keys = name.split('.');
            formData[keys[0]][keys[1]] = value;
        } else {
            formData[name] = value;
        }


        setCambios({ softwareData: { ...formData }, softwareFile: fileData });
    };

    const updateNestedField = (prevFormData, fieldPath, value) => {
        const keys = fieldPath.split('.');
        let data = { ...prevFormData };

        keys.reduce((current, key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            } else {
                current[key] = current[key] ? { ...current[key] } : {};
            }
            return current[key];
        }, data);

        return data;
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileData(file);
        setCambios({ softwareData: formData, softwareFile: file });
    };


    return (
        <>
            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="producto_detalle" className="label-personalizado mb-2">Detalle del Producto   </label>
                    <textarea className="form-control" name="id_producto_fk.detalle" id="id_producto_fk.detalle" onChange={handleChange} value={formData.id_producto_fk.detalle} required />
                </div>
                <div className="col">
                    <label htmlFor="producto_fecha" className="label-personalizado mb-2">Fecha del Producto  </label>
                    <input type="date" className="form-control"
                        name="id_producto_fk.fecha"
                        id="id_producto_fk.fecha"
                        value={formData.id_producto_fk.fecha
                            ? new Date(formData.id_producto_fk.fecha).toISOString().split('T')[0] : ""}
                        onChange={handleChange} required />
                </div>
            </div>

            <div className="row mb-2">
                <div className="col"> </div>
                <h5 className="label-personalizado mb-2 col-sm-auto control-label">Software</h5>
                <div className="col"> </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="nombre" className="label-personalizado mb-2"> Nombre   </label>
                    <textarea className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="numero_version" className="label-personalizado mb-2"> Num. versión   </label>
                    <input type="number" className="form-control" name="version" id="version" value={formData.version} onChange={handleChange} min="1" step="1" pattern="^[0-9]+$" required />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="detalleDocumentación" className="label-personalizado mb-2"> Detalle documentación   </label>
                    <textarea className="form-control" name="id_documento_documentacion_fk.detalle" id="detalleDocumentación" value={formData.id_documento_documentacion_fk.detalle} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="documento" className="label-personalizado mb-2"> Documento documentación   </label>
                    <input type="file" className="form-control" name="id_documento_documentacion_fk.documento" id="id_documento_documentacion_fk.documento" onChange={handleFileChange} required={mode == 1 ? true : ''} />
                    {mode == 2 ? (
                        <Tooltip title={formData.id_documento_documentacion_fk.documento.split('/').pop()} placement="right-start">
                            <a href={"http://localhost:8000" + formData.id_documento_documentacion_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                {"Ver documento"}
                            </a>
                        </Tooltip>

                    ) : ""}
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


