import React, { useState } from 'react';
import Paises from '../../utils/Paises.json'
import Tooltip from '@mui/material/Tooltip';


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

    const checkLetraNum = (value) => {
        // Esta expresión regular permite solo letras y espacios.
        const regex = /^[A-Za-z0-9\s]*$/;
        return regex.test(value);
      };

      const checkLetra = (value) => {
        // Esta expresión regular permite solo letras y espacios.
        const regex = /^[A-Za-z\s]*$/;
        return regex.test(value);
      };


      
      const camposLetrasNum = [
        "id_producto_fk.detalle",
        "nombre",
        "resumen",
        "id_oficio_fk.detalle"
    ];

    const camposLetras = [
        "id_area_fk.nombre",
        "id_institucion_fk.nombre"
    ];


    const initialFormData = producto || defaultFormData;
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Mover esta línea al inicio de la función para asegurar que la validación se realice correctamente.
        if (camposLetrasNum.includes(name) && !checkLetraNum(value)) {
            return; // Evita actualizar el estado si el valor no cumple con el patrón permitido.
        } else  if (camposLetras.includes(name) && !checkLetra(value)) {
            return; // Evita actualizar el estado si el valor no cumple con el patrón permitido.
        }

        setFormData(prevFormData => updateNestedField(prevFormData, name, value));
        setCambios({ eventoData: { ...formData, [name]: value }, eventoFile: fileData });
    };

    const updateNestedField = (prevFormData, fieldPath, value) => {
        const keys = fieldPath.split('.');
        let data = { ...prevFormData }; // Crea una copia superficial del objeto prevFormData para evitar mutaciones.

        keys.reduce((current, key, index) => {
            if (index === keys.length - 1) {
                current[key] = value;
            } else {
                current[key] = current[key] ? { ...current[key] } : {}; // Asegura la creación de un nuevo objeto si no existe, evitando mutaciones.
            }
            return current[key];
        }, data);

        return data;
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
                    <label htmlFor="producto_detalle" className="label-personalizado mb-2">Detalle del Producto   </label>
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
                    <label htmlFor="nombre" className="label-personalizado mb-2"> Nombre del Evento   </label>
                    <input type="text" className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="resumen" className="label-personalizado mb-2"> Resumen del Evento   </label>
                    <input type="text" className="form-control" name="resumen" id="resumen" value={formData.resumen} onChange={handleChange} required />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="pais" className="label-personalizado mb-2">País del Evento   </label>
                    <select className="form-control" name="pais" id="pais" value={formData.pais} onChange={handleChange} required>
                        <option value="">Seleccione un país</option>
                        {Paises.map((pais) => (
                            <option key={pais.value} value={pais.value}> {pais.label} </option>))}
                    </select>
                </div>
                <div className="col">
                    <label htmlFor="tipo_participacion" className="label-personalizado mb-2"> Tipo de Participación   </label>                
                    <select className="form-select seleccion" name="tipo_participacion" id="tipo_participacion" value={formData.tipo_participacion} onChange={handleChange}  required>
                        <option value="">Seleccionar tipo</option>
                        <option value="Activa">Activa</option>
                        <option value="Pasiva">Pasiva</option>
                    </select>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="enlace" className="label-personalizado mb-2"> Enlace del Evento   </label>
                    <input type="text" className="form-control" name="enlace" id="enlace" value={formData.enlace} onChange={handleChange} required />
                </div>
               
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="nombreArea" className="label-personalizado mb-2"> Nombre del Área del Evento   </label>
                    <input type="text" className="form-control" name="id_area_fk.nombre" id="nombreArea" value={formData.id_area_fk.nombre} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="nombreInstitucion" className="label-personalizado mb-2"> Nombre Institución del Evento   </label>
                    <input type="text" className="form-control" name="id_institucion_fk.nombre" id="nombreInstitucion" value={formData.id_institucion_fk.nombre} onChange={handleChange} required />
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="detalleOficio" className="label-personalizado mb-2"> Detalle del Oficio Del Evento   </label>
                    <input type="text" className="form-control" name="id_oficio_fk.detalle" id="detalleOficio" value={formData.id_oficio_fk.detalle} onChange={handleChange} required />
                </div>
                <div className="col">
                    <label htmlFor="documento" className="label-personalizado mb-2"> Documento del Oficio del Evento   </label>
                    <input type="file" className="form-control" name="id_oficio_fk.documento" id="id_oficio_fk.documento" onChange={handleFileChange} required={mode == 1 ? true : ''} />
                    {mode === 2 ? (
                        <Tooltip title={formData.id_oficio_fk.ruta_archivo.split('/').pop()} placement="right-start">
                            <a href={"http://localhost:8000" + formData.id_oficio_fk.ruta_archivo} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2" >
                                {"Descargar oficio"}
                            </a>
                        </Tooltip>
                    ): ""}
                </div>
            </div>
        </>
    );
};
