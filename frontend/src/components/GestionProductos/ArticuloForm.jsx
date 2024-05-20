import React, { useState } from 'react';
import Paises from '../../utils/Paises.json'
import Tooltip from '@mui/material/Tooltip';
import icono2 from '../../assets/upload_doc.svg'

export const ArticuloForm = ({ mode, producto, setCambios }) => {
  const [fileData, setFileData] = useState(null);
  const [paisRevista, setPaisRevista] = useState(producto ? producto.id_revista_fk.pais : "");
  const [selectedFileName, setSelectedFileName] = useState('');
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

  const user = JSON.parse(localStorage.getItem('user'))

  const isInvestigador = user.groups.some((grupo) => {
      return grupo === 'investigador';
  });


  const checkCedula = (value) => {
    const regex = /^[A-Za-z0-9]*$/;
    return regex.test(value);
  };


  const handleChange = (event) => {
    const { name, value } = event.target;

  
    if (name === "pais_procedencia") {
        setPaisRevista(value);
        return;  
    }

    if (name === "cant_paginas") {
      if (value.includes('e') || value.includes('+') || value.includes('-') || !/^[0-9]*$/.test(value)) {
          return;
      }
  }
   
    if (name === "cedula" && !checkCedula(value)) {
        return; 
    }

  
    function updateNestedObject(obj, path, newValue) {
        const keys = path.split('.');
        if (keys[0] === 'fecha_publicacion') {
          const year = new Date(value).getFullYear();
          if (year < 1980) {
              event.target.setCustomValidity("La fecha no puede ser anterior a 1980.");
              event.target.reportValidity();
              return;
          } else {
              event.target.setCustomValidity("");
          }
      }
        if (keys[0] === 'id_producto_fk' && keys[1] === 'fecha') {
          const year = new Date(value).getFullYear();
          if (year < 1980) {
              event.target.setCustomValidity("La fecha no puede ser anterior a 1980.");
              event.target.reportValidity();
              return;
          } else {
              event.target.setCustomValidity("");
          }
      }
        const lastKey = keys.pop();  
        const lastObj = keys.reduce((o, key) => o[key] = o[key] || {}, obj);
        lastObj[lastKey] = newValue;
    }

    setFormData(prevFormData => {
        const newFormData = JSON.parse(JSON.stringify(prevFormData));
        updateNestedObject(newFormData, name, value);  
        setCambios({ articuloData: newFormData, articuloFile: fileData });  
        return newFormData;  
    });
};


  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFileName(file.name);
    }

    setFileData(file);
    setCambios({ articuloData: formData, articuloFile: file });
  };

  return (
    <>
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="producto_detalle" className="label-personalizado mb-2">Detalle del Producto   </label>
          <textarea className="form-control" name="id_producto_fk.detalle" id="id_producto_fk.detalle" onChange={handleChange} value={formData.id_producto_fk.detalle} required disabled={isInvestigador}/>
        </div>
        <div className="col">
          <label htmlFor="producto_fecha" className="label-personalizado mb-2">Fecha del Producto   </label>
          <input type="date" className="form-control"
            name="id_producto_fk.fecha"
            id="id_producto_fk.fecha"
            value={formData.id_producto_fk.fecha
              ? new Date(formData.id_producto_fk.fecha).toISOString().split('T')[0] : ""}
            onChange={handleChange} required disabled={isInvestigador}/>
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
          <textarea className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required disabled={isInvestigador}/>
        </div>
        <div className="col">
          <label htmlFor="fecha_publicacion" className="label-personalizado mb-2">Fecha de Publicación  </label>
          <input type="date" className="form-control" name="fecha_publicacion" id="fecha_publicacion"
            value={formData.fecha_publicacion
              ? new Date(formData.fecha_publicacion).toISOString().split('T')[0] : ""}
            onChange={handleChange} required disabled={isInvestigador}/>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="tipo" className="label-personalizado mb-2"> Tipo   </label>
          <input type="text" className="form-control" name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} required disabled={isInvestigador}/>
        </div>
        <div className="col">
          <label htmlFor="doi" className="label-personalizado mb-2"> DOI   </label>
          <input type="text" className="form-control" name="doi" id="doi" value={formData.doi} onChange={handleChange} required disabled={isInvestigador}/>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="isbn" className="label-personalizado mb-2"> ISBN   </label>
          <input type="text" className="form-control" name="isbn" id="isbn" value={formData.isbn} onChange={handleChange} required disabled={isInvestigador}/>
        </div>
        <div className="col">
          <label htmlFor="cant_paginas" className="label-personalizado mb-2"> Cantidad de Páginas   </label>
          <input type="number" className="form-control" name="cant_paginas" id="cant_paginas" value={formData.cant_paginas} onChange={handleChange} min="1" step="1" pattern="^[0-9]+$" required disabled={isInvestigador}/>
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
          <textarea className="form-control" name="id_revista_fk.nombre" id="nombreRevista" value={formData.id_revista_fk.nombre} onChange={handleChange} required disabled={isInvestigador}/>
        </div>
        <div className="col-md-6">
          <label htmlFor="paisRevista" className="label-personalizado mb-2">País de la Revista   </label>
          <select className="form-control" name="id_revista_fk.pais" id="id_revista_fk.pais" value={formData.id_revista_fk.pais} onChange={handleChange} required disabled={isInvestigador}>
            <option value="" disabled defaultValue={""}>Seleccione un país</option>
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
          <input type="text" className="form-control" name="id_autor_fk.id_nombre_completo_fk.nombre" id="nombreAutor" value={formData.id_autor_fk.id_nombre_completo_fk.nombre} onChange={handleChange} required disabled={isInvestigador}/>
        </div>
        <div className="col">
          <label htmlFor="apellidoAutor" className="label-personalizado mb-2"> Apellido  </label>
          <input type="text" className="form-control" name="id_autor_fk.id_nombre_completo_fk.apellido" id="apellidoAutor" value={formData.id_autor_fk.id_nombre_completo_fk.apellido} onChange={handleChange} required disabled={isInvestigador}/>
        </div>
        <div className="col">
          <label htmlFor="segundoApellidoAutor" className="label-personalizado mb-2"> Segundo Apellido <span className="optional"> (Opcional)</span> </label>
          <input type="text" className="form-control" name="id_autor_fk.id_nombre_completo_fk.segundo_apellido" id="segundoApellidoAutor" value={formData.id_autor_fk.id_nombre_completo_fk.segundo_apellido} onChange={handleChange} disabled={isInvestigador}/>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="detalleArticulo" className="label-personalizado mb-2"> Detalle Artículo   </label>
          <textarea className="form-control" name="id_documento_articulo_fk.detalle" id="detalleArticulo" value={formData.id_documento_articulo_fk.detalle} onChange={handleChange} required disabled={isInvestigador}/>
        </div>
        <div className="col">
          <label htmlFor="id_documento_articulo_fk.documento" className="label-personalizado mb-2" style={{ display: 'block' }}>
              Documento del Artículo
          </label>
          <input
              type="file"
              className={isInvestigador ? "form-control disabled-input" : "form-control"}
              name="id_documento_articulo_fk.documento"
              id="id_documento_articulo_fk.documento"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              required={mode == 1}
              disabled={isInvestigador}
          />
          <label htmlFor="id_documento_articulo_fk.documento" style={{ cursor: 'pointer', display: 'block' }}>
              {selectedFileName ? (
                  <span>Nombre del archivo: {selectedFileName}</span>
              ) : (
                  <div className="file-upload-icon-container">
                      <img src={icono2} alt="Seleccionar archivo" className="file-upload-icon" />
                  </div>
              )}
          </label>
          {mode === 2 && formData.id_documento_articulo_fk?.documento && (
              <Tooltip title={formData.id_documento_articulo_fk.documento.split('/').pop()} placement="right-start">
                  <a
                      href={"http://localhost:8000" + formData.id_documento_articulo_fk.documento}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
                  >
                      Descargar documento
                  </a>
              </Tooltip>
          )}
      </div>

      </div>
      <div className="row mb-4">
        <div className="col">
          <label htmlFor="observaciones" className="label-personalizado mb-2"> Observaciones <span className="optional"> (Opcional)</span> </label>
          <textarea className="form-control" name="observaciones" id="observaciones" value={formData.observaciones} onChange={handleChange} disabled={isInvestigador}/>
        </div>
      </div>
    </>
  );
};
