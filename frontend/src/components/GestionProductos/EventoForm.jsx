import React, { useState } from 'react';
import Paises from '../../utils/Paises.json'

export const EventoForm = ({ mode, producto, setCambios }) => {
    const [fileData, setFileData] = useState(null);
    const [eventoPais, setEventoPais] = useState(producto ? producto.pais: "");
    const defaultFormData = {
        id_producto_fk: {
            id_producto: "",
            fecha: "",
            detalle: ""
        },
        nombre: "",
        resumen: "",
        pais: "",
        tipo_participacion: "",
        enlace: "",
        id_institucion_fk:{ 
            id_institucion: "",
            nombre: "" 
        },
        id_area_fk: { 
            id_area: "",
            nombre: "" 
        },
        id_oficio_fk: {
            id_oficio: "",
            ruta_archivo: "",
            detalle: "",
        },
    };
    const initialFormData = producto || defaultFormData;
    const [formData, setFormData] = useState(initialFormData);


    const updateNestedField = (formData, fieldPath, value) => {
        const keys = fieldPath.split('.');
        const lastKey = keys.pop();

        keys.reduce((obj, key) => obj[key] = obj[key] || {}, formData)[lastKey] = value;

        return { ...formData };
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "pais_procedencia") {
            setPaisSeleccionado(value);
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        const updatedFormData = updateNestedField(formData, name, value);
        setFormData(updatedFormData);
        setCambios({ eventoData: { ...updatedFormData }, eventoFile: fileData });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileData(file);
        setCambios({ eventoData: formData, eventoFile: file }); 
    };

    return (
        <>       
           <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="producto_detalle" className="label-personalizado mb-2">Detalle del Producto <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="id_producto_fk.detalle" id="id_producto_fk.detalle" onChange={handleChange} value={formData.id_producto_fk.detalle} required />
                </div>
                <div className="col">
                    <label htmlFor="producto_fecha" className="label-personalizado mb-2">Fecha del Producto</label>
                    <input type="date" className="form-control"
                        name="id_producto_fk.fecha"
                        id="id_producto_fk.fecha"
                        value={formData.id_producto_fk.fecha
                            ? new Date(formData.id_producto_fk.fecha).toISOString().split('T')[0] : ""}
                        onChange={handleChange} />
                </div>
            </div>
            <div className="row mb-2">
                <div className="col"> </div>
                    <h5 className="label-personalizado mb-2 col-sm-auto control-label">Evento</h5>
                <div className="col"> </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="nombre" className="label-personalizado mb-2"> Nombre del Evento <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="resumen" className="label-personalizado mb-2"> Resumen del Evento <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="resumen" id="resumen" value={formData.resumen} onChange={handleChange} required />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="pais" className="label-personalizado mb-2">País del Evento <span className="required">*</span> </label>
                    <select className="form-control" name="pais" id="pais" value={formData.pais} onChange={handleChange} required>
                        <option value="">Seleccione un país</option>
                        {Paises.map((pais) => (
                            <option key={pais.value} value={pais.value}> {pais.label} </option>))}
                    </select>
                </div>
                <div className="col">
                    <label htmlFor="tipo_participacion" className="label-personalizado mb-2"> Tipo de Participación <span className="required">*</span> </label>                
                    <select className="form-select seleccion" name="tipo_participacion" id="tipo_participacion" value={formData.tipo_participacion} onChange={handleChange}  required>
                        <option value="">Seleccionar tipo</option>
                        <option value="Activa">Activa</option>
                        <option value="Pasiva">Pasiva</option>
                    </select>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="enlace" className="label-personalizado mb-2"> Enlace del Evento <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="enlace" id="enlace" value={formData.enlace} onChange={handleChange} required />
                </div>
               
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="nombreArea" className="label-personalizado mb-2"> Nombre del Área del Evento <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="id_area_fk.nombre" id="nombreArea" value={formData.id_area_fk.nombre} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="nombreInstitucion" className="label-personalizado mb-2"> Nombre de la Institución del Evento <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="id_institucion_fk.nombre" id="nombreInstitucion" value={formData.id_institucion_fk.nombre} onChange={handleChange} required />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="detalleOficio" className="label-personalizado mb-2"> Detalle del Oficio Del Evento <span className="required">*</span> </label>
                    <input type="text" className="form-control" name="id_oficio_fk.detalle" id="detalleOficio" value={formData.id_oficio_fk.detalle} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="documento" className="label-personalizado mb-2"> Documento del Oficio del Evento <span className="required">*</span> </label>
                    <input type="file" className="form-control" name="id_oficio_fk.documento" id="id_oficio_fk.documento" onChange={handleFileChange} required={mode == 1 ? true : ''} />
                    {mode === 2 ? (
                        <a href={"http://localhost:8000" + formData.id_oficio_fk.ruta_archivo} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2" >
                            {formData.id_oficio_fk.ruta_archivo.split('/').pop()}
                        </a>
                    ): ""}
                </div>
            </div>
        </>
    );
};
