import React, { useState } from 'react';
export const EventoForm = ({ mode, datos, setCambios }) => {
    const [formData, setFormData] = useState({
        fecha: datos ? datos.fecha : "",
        detalle: datos ? datos.detalle : "",
        id_version_proyecto: datos ? datos.id_version_proyecto : null,
        nombre: datos ? datos.nombre : "",
        resumen: datos ? datos.resumen : "",
        pais: datos ? datos.pais : "",
        tipo_participacion: datos ? datos.tipo_participacion : "",
        enlace: datos ? datos.enlace : "",
        id_institucion_fk: datos ? datos.id_institucion_fk : { nombre: "" },
        id_area_fk: datos ? datos.id_area_fk : { nombre: "" },
        id_oficio_fk: datos ? datos.id_oficio_fk : {
            ruta_archivo: null,
            detalle: "",
        },
    });

    const updateNestedField = (formData, fieldPath, value) => {
        const keys = fieldPath.split('.');
        const lastKey = keys.pop();

        keys.reduce((obj, key) => (obj[key] = obj[key] || {}), formData)[lastKey] = value;

        return { ...formData };
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedFormData = updateNestedField(formData, name, value);
        setFormData(updatedFormData);
        setCambios(updatedFormData);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        formData.id_oficio_fk.ruta_archivo = file;
        setCambios(formData);
    };

    return (
        <>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="fecha" className="label-personalizado mb-2"> Fecha <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="fecha" id="fecha" value={formData.fecha} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="detalle" className="label-personalizado mb-2"> Detalle <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="detalle" id="detalle" value={formData.detalle} onChange={handleChange} required />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="nombre" className="label-personalizado mb-2"> Nombre <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="resumen" className="label-personalizado mb-2"> Resumen <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="resumen" id="resumen" value={formData.resumen} onChange={handleChange} required />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="pais" className="label-personalizado mb-2"> País <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="pais" id="pais" value={formData.pais} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="tipo_participacion" className="label-personalizado mb-2"> Tipo de Participación <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="tipo_participacion" id="tipo_participacion" value={formData.tipo_participacion} onChange={handleChange} required />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="enlace" className="label-personalizado mb-2"> Enlace <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="enlace" id="enlace" value={formData.enlace} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="detalleOficio" className="label-personalizado mb-2"> Detalle del Oficio <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="id_oficio_fk.detalle" id="detalleOficio" value={formData.id_oficio_fk.detalle} onChange={handleChange} required />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="documento" className="label-personalizado mb-2"> Documento del Oficio <span className="required">*</span> </label>
                    <input type="file" className="form-control" name="id_oficio_fk.ruta_archivo" id="documento" onChange={handleFileChange} required={mode === 1} />
                    {mode === 2 && typeof formData.id_oficio_fk.ruta_archivo === 'string' && (
                        <a
                            href={"http://localhost:8000" + formData.id_oficio_fk.ruta_archivo}
                            target="blank_"
                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
                        >
                            {formData.id_oficio_fk.ruta_archivo.split('/').pop()}
                        </a>
                    )}
                </div>
                <div className="col">
                    <label htmlFor="nombreInstitucion" className="label-personalizado mb-2"> Nombre de la Institución <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="id_institucion_fk.nombre" id="nombreInstitucion" value={formData.id_institucion_fk.nombre} onChange={handleChange} required />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="nombreArea" className="label-personalizado mb-2"> Nombre del Área <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="id_area_fk.nombre" id="nombreArea" value={formData.id_area_fk.nombre} onChange={handleChange} required />
                </div>
            </div>
        </>
    );
};
