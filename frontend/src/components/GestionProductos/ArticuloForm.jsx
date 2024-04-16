import React, { useState } from 'react';
import Paises from '../../utils/Paises.json'
import Tooltip from '@mui/material/Tooltip';

export const ArticuloForm = ({ mode, producto, setCambios }) => {
  const [fileData, setFileData] = useState(null);
  const [paisRevista, setPaisRevista] = useState(producto ? producto.id_revista_fk.pais : "");
  const defaultFormData = {
    nombre: "",
    fecha_publicacion: "",
    tipo: "",
    doi: "",
    isbn: "",
    observaciones: "",
    cant_paginas: "",
    id_revista_fk: {
      id_revista: "",
      nombre: "",
      pais: ""
    },
    id_producto_fk: {
      id_producto: "",
      fecha: "",
      detalle: ""
    },
    id_autor_fk: {
      id_autor: "",
      id_nombre_completo_fk: {
        id_nombre_completo: "",
        nombre: "",
        apellido: "",
        segundo_apellido: "",
      },
    },
    id_documento_articulo_fk: {
      id_documento_articulo: "",
      tipo: "Articulo",
      detalle: "",
      documento: ""
    }
  };
  const initialFormData = producto || defaultFormData;
  const [formData, setFormData] = useState(initialFormData);

  const updateNestedField = (formData, fieldPath, value) => {
    const keys = fieldPath.split('.');
    const lastKey = keys.pop();

    keys.reduce((obj, key) => obj[key] = obj[key] || {}, formData)[lastKey] = value;

    return { ...formData };
  };


  const check = (value) => {
    // Esta expresión regular permite solo letras y espacios.
    const regex = /^[A-Za-záéíóúÁÉÍÓÚ\s]*$/;
    return regex.test(value) || value === "";
  };

  const checkLetraNum = (value) => {
    // Esta expresión regular permite solo letras y espacios.
    const regex = /^[A-Za-z0-9áéíóúÁÉÍÓÚ\s]*$/;
    return regex.test(value);
  };


  const checkCedula = (value) => {
    // Esta expresión regular permite letras y números, pero no espacios ni caracteres especiales.
    const regex = /^[A-Za-z0-9]*$/;
    return regex.test(value);
  };

  const camposSoloLetras = [
    "id_autor_fk.id_nombre_completo_fk.nombre",
    "id_autor_fk.id_nombre_completo_fk.apellido",
    "id_autor_fk.id_nombre_completo_fk.segundo_apellido",
    "tipo"
  ];


  const camposLetrasNum = [
    "id_revista_fk.nombre",
    "nombre"
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Primero, verifica campos que necesitan validación específica.
    if (name === "pais_procedencia") {
      setPaisRevista(value); // Asegúrate de que esta función actualice correctamente el estado.
    } else if (name === "cant_paginas") {
      // Solo permite dígitos.
      if (/^[0-9]*$/.test(value) || value === "") {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
      return; // Termina la ejecución si es cant_paginas para no ejecutar updateNestedField
    } else if (camposSoloLetras.includes(name) && !check(value)) {
      return; // Termina si la validación de campos específicos falla.
    } else if (name === "cedula" && !checkCedula(value)) {
      return; // Evita actualizar el estado si la cédula no es válida.
    } else if (camposLetrasNum.includes(name) && !checkLetraNum(value)) {
      return;
    }

    console.log(formData)
    // Actualiza el estado para todos los demás casos, incluidos campos anidados.

    if (name.includes('.')) {
      const keys = name.split('.');
      let ref = formData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (ref[keys[i]] === undefined) {
          ref[keys[i]] = {}; // Asegúrate de crear un objeto si no existe
        }
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
    } else {
      formData[name] = value;
    }

    setCambios({ articuloData: { ...formData }, articuloFile: fileData });
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFileData(file);
    setCambios({ articuloData: formData, articuloFile: file });
  };

  return (
    <>
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="producto_detalle" className="label-personalizado mb-2">Detalle del Producto   </label>
          <input type="text" className="form-control" name="id_producto_fk.detalle" id="id_producto_fk.detalle" onChange={handleChange} value={formData.id_producto_fk.detalle} required />
        </div>
        <div className="col">
          <label htmlFor="producto_fecha" className="label-personalizado mb-2">Fecha del Producto   </label>
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
        <h5 className="label-personalizado mb-2 col-sm-auto control-label">Artículo</h5>
        <div className="col"> </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="nombre" className="label-personalizado mb-2"> Nombre del artículo   </label>
          <input type="text" className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="fecha_publicacion" className="label-personalizado mb-2">Fecha de Publicación  </label>
          <input type="date" className="form-control" name="fecha_publicacion" id="fecha_publicacion"
            value={formData.fecha_publicacion
              ? new Date(formData.fecha_publicacion).toISOString().split('T')[0] : ""}
            onChange={handleChange} required />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="tipo" className="label-personalizado mb-2"> Tipo   </label>
          <input type="text" className="form-control" name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="doi" className="label-personalizado mb-2"> DOI   </label>
          <input type="text" className="form-control" name="doi" id="doi" value={formData.doi} onChange={handleChange} required />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="isbn" className="label-personalizado mb-2"> ISBN   </label>
          <input type="text" className="form-control" name="isbn" id="isbn" value={formData.isbn} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="cant_paginas" className="label-personalizado mb-2"> Cantidad de Páginas   </label>
          <input type="number" className="form-control" name="cant_paginas" id="cant_paginas" value={formData.cant_paginas} onChange={handleChange} min="1" step="1" pattern="^[0-9]+$" required />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col"> </div>
        <h5 className="label-personalizado mb-2 col-sm-auto control-label">Revista</h5>
        <div className="col"> </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="nombreRevista" className="label-personalizado mb-2"> Nombre de la Revista   </label>
          <input type="text" className="form-control" name="id_revista_fk.nombre" id="nombreRevista" value={formData.id_revista_fk.nombre} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <label htmlFor="paisRevista" className="label-personalizado mb-2">País de la Revista   </label>
          <select className="form-control" name="id_revista_fk.pais" id="id_revista_fk.pais" value={formData.id_revista_fk.pais} onChange={handleChange} required>
            <option value="">Seleccione un país</option>
            {Paises.map((pais) => (
              <option key={pais.value} value={pais.value}> {pais.label} </option>))}
          </select>
        </div>
      </div>
      <div className="row mb-2">
        <div className="col"> </div>
        <h5 className="label-personalizado mb-2 col-sm-auto control-label">Autor (a)</h5>
        <div className="col"> </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="nombreAutor" className="label-personalizado mb-2"> Nombre   </label>
          <input type="text" className="form-control" name="id_autor_fk.id_nombre_completo_fk.nombre" id="nombreAutor" value={formData.id_autor_fk.id_nombre_completo_fk.nombre} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="apellidoAutor" className="label-personalizado mb-2"> Apellido  </label>
          <input type="text" className="form-control" name="id_autor_fk.id_nombre_completo_fk.apellido" id="apellidoAutor" value={formData.id_autor_fk.id_nombre_completo_fk.apellido} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="segundoApellidoAutor" className="label-personalizado mb-2"> Segundo Apellido <span className="optional"> (Opcional)</span> </label>
          <input type="text" className="form-control" name="id_autor_fk.id_nombre_completo_fk.segundo_apellido" id="segundoApellidoAutor" value={formData.id_autor_fk.id_nombre_completo_fk.segundo_apellido} onChange={handleChange} />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="detalleArticulo" className="label-personalizado mb-2"> Detalle Artículo   </label>
          <input type="text" className="form-control" name="id_documento_articulo_fk.detalle" id="detalleArticulo" value={formData.id_documento_articulo_fk.detalle} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="documento" className="label-personalizado mb-2"> Documento del Artículo   </label>
          <input type="file" className="form-control" name="id_documento_articulo_fk.documento" id="documento" onChange={handleFileChange} required={mode == 1 ? true : ''} />
          {mode === 2 ? (
            <Tooltip title={formData.id_documento_articulo_fk.documento.split('/').pop()} placement="right-start">
              <a href={"http://localhost:8000" + formData.id_documento_articulo_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2" >
                {"Descargar documento"}
              </a>
            </Tooltip>

          ) : ""}
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="observaciones" className="label-personalizado mb-2"> Observaciones <span className="optional"> (Opcional)</span> </label>
          <input type="textArea" className="form-control" name="observaciones" id="observaciones" value={formData.observaciones} onChange={handleChange} />
        </div>
      </div>
    </>
  );
};
