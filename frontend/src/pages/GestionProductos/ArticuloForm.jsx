import React, { useState } from 'react';

export const FormularioArticulo = ({ mode, datos, setCambios }) => {
  const [formData, setFormData] = useState({
    nombre: datos ? datos.nombre : "",
    fecha_publicacion: datos ? datos.fecha_publicacion : "",
    tipo: datos ? datos.tipo : "",
    doi: datos ? datos.doi : "",
    isbn: datos ? datos.isbn : "",
    cant_paginas: datos ? datos.cant_paginas : "",
    id_revista_fk: datos ? datos.id_revista_fk : { nombre: "", pais: "" },
    id_producto_fk: datos ? datos.id_producto_fk : null,
    id_autor_fk: datos ? datos.id_autor_fk : {
      id_nombre_completo_fk: {
        nombre: "",
        apellido: "",
        segundo_apellido: "",
      },
    },
    id_documento_articulo_fk: datos ? { ...datos.id_documento_articulo_fk, tipo: "Articulo" } : {
      tipo: "Articulo",
      detalle: "",
      documento: null,
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

    formData.id_documento_articulo_fk.documento = file;
    setCambios(formData);
  };

  return (
    <>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="nombre" className="label-personalizado mb-2"> Nombre <span className="required">*</span> </label>
          <input type="text" className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="fecha_publicacion" className="label-personalizado mb-2"> Fecha de Publicación <span className="required">*</span> </label>
          <input type="text" className="form-control" name="fecha_publicacion" id="fecha_publicacion" value={formData.fecha_publicacion} onChange={handleChange} required />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="tipo" className="label-personalizado mb-2"> Tipo <span className="required">*</span> </label>
          <input type="text" className="form-control" name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="doi" className="label-personalizado mb-2"> DOI <span className="required">*</span> </label>
          <input type="text" className="form-control" name="doi" id="doi" value={formData.doi} onChange={handleChange} required />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="isbn" className="label-personalizado mb-2"> ISBN <span className="required">*</span> </label>
          <input type="text" className="form-control" name="isbn" id="isbn" value={formData.isbn} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="cant_paginas" className="label-personalizado mb-2"> Cantidad de Páginas <span className="required">*</span> </label>
          <input type="text" className="form-control" name="cant_paginas" id="cant_paginas" value={formData.cant_paginas} onChange={handleChange} required />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="nombreRevista" className="label-personalizado mb-2"> Nombre de la Revista <span className="required">*</span> </label>
          <input type="text" className="form-control" name="id_revista_fk.nombre" id="nombreRevista" value={formData.id_revista_fk.nombre} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="paisRevista" className="label-personalizado mb-2"> País de la Revista <span className="required">*</span> </label>
          <input type="text" className="form-control" name="id_revista_fk.pais" id="paisRevista" value={formData.id_revista_fk.pais} onChange={handleChange} required />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="nombreAutor" className="label-personalizado mb-2"> Nombre del Autor <span className="required">*</span> </label>
          <input type="text" className="form-control" name="id_autor_fk.id_nombre_completo_fk.nombre" id="nombreAutor" value={formData.id_autor_fk.id_nombre_completo_fk.nombre} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="apellidoAutor" className="label-personalizado mb-2"> Apellido del Autor <span className="required">*</span> </label>
          <input type="text" className="form-control" name="id_autor_fk.id_nombre_completo_fk.apellido" id="apellidoAutor" value={formData.id_autor_fk.id_nombre_completo_fk.apellido} onChange={handleChange} required />
        </div>
        <div className="col">
          <label htmlFor="segundoApellidoAutor" className="label-personalizado mb-2"> Segundo Apellido del Autor </label>
          <input type="text" className="form-control" name="id_autor_fk.id_nombre_completo_fk.segundo_apellido" id="segundoApellidoAutor" value={formData.id_autor_fk.id_nombre_completo_fk.segundo_apellido} onChange={handleChange} />
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="documento" className="label-personalizado mb-2"> Documento del Artículo <span className="required">*</span> </label>
          <input type="file" className="form-control" name="id_documento_articulo_fk.documento" id="documento" onChange={handleFileChange} required={mode === 1} />
          {mode === 2 && typeof formData.id_documento_articulo_fk.documento === 'string' && (
            <a
              href={"http://localhost:8000" + formData.id_documento_articulo_fk.documento}
              target="blank_"
              className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
            >
              {formData.id_documento_articulo_fk.documento.split('/').pop()}
            </a>
          )}
        </div>
      </div>
    </>
  );
};
