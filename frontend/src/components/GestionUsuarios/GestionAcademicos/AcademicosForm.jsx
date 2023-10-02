import { useState } from "react";
import PropTypes from 'prop-types';

export const AcademicosForm = ({onSubmit, mode, academico, onCancel, onDelete }) => {

  // Si hay informacion en el academico, la almacena en formData, sino queda vacía
  const [formData, setFormData] = useState({
    cedula: academico ? academico.cedula : "",
    foto: academico ? academico.foto : "null",
    sitio_web: academico ? academico.sitio_web : "",
    area_de_trabajo: academico ? academico.area_de_trabajo : "",
    grado_maximo: academico ? academico.grado_maximo : "",
    correo: academico ? academico.correo : "",
    categoria_en_regimen: academico ? academico.categoria_en_regimen : "",
    pais_procedencia: academico ? academico.pais_procedencia : "",
    id_nombre_completo_fk: academico ? academico.id_nombre_completo_fk : { nombre: "", apellido: "", segundo_apellido: "" },
    id_area_especialidad_fk: academico ? academico.id_area_especialidad_fk : { nombre: "" },
    universidad_fk: academico ? academico.universidad_fk : { pais: "", nombre: "" }
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
  
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value
        }
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileName = file ? file.name : ""; 
    setFormData({
      ...formData,
      foto: fileName,
    });
  };

  const sendForm = (event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(formData);
    onSubmit(jsonData);
  };

  return (
    <>
      <div class="modal-header">
          <h2>{mode === 1 ? "Agregar un académico(a)" : "Editar académico(a)"}</h2>
      </div>

      <form onSubmit={sendForm} className='d-flex flex-column'> 
          <div class="modal-body">
              <div className="container">
                  <div className="row">
                      <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="cedula">Cédula</label>
                          <input type="text" name="cedula" id="cedula" value={formData.cedula} onChange={handleChange} required/>
                      </div>
                      <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="nombre">Nombre</label>
                          <input type="text" name="id_nombre_completo_fk.nombre" id="nombre" value={formData.id_nombre_completo_fk.nombre || ""} onChange={handleChange} required/>
                        </div>
                  </div>
                  <br/>
                  <div className="row">
                      <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="apellido">Apellido</label>
                          <input type="text" name="id_nombre_completo_fk.apellido" id="apellido" value={formData.id_nombre_completo_fk.apellido || ""} onChange={handleChange} required/>
                      </div>
                      <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="segundoApellido">Segundo apellido</label>
                          <input type="text" name="id_nombre_completo_fk.segundo_apellido" id="segundo_apellido" value={formData.id_nombre_completo_fk.segundo_apellido || ""} onChange={handleChange}/>
                      </div>
                  </div>
                  <br/>
                  <div className="row">
                      <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="correo">Correo</label>
                          <input type="email" name="correo" id="correo" value={formData.correo} onChange={handleChange} required/>
                      </div>
                      <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="paisProcedencia">País de Procedencia</label>
                          <input type="text" name="pais_procedencia" id="pais_procedencia" value={formData.pais_procedencia} onChange={handleChange}/>
                      </div>
                  </div>
                  <br/>
                  <div className="row">
                      <div className="col">
                          <label className="col-sm-auto control-label">Universidad</label>
                      </div>
                      <div className="col">
                          <label htmlFor="universidadPais">País de la Universidad</label>
                          <input type="text" name="universidad_fk.pais" id="universidadPais" value={formData.universidad_fk.pais} onChange={handleChange} required/>    
                      </div>
                      <div className="col">
                          <label htmlFor="universidadNombre">Nombre de la Universidad</label>
                          <input type="text" name="universidad_fk.nombre" id="universidadNombre" value={formData.universidad_fk.nombre} onChange={handleChange} required/>
                      </div>
                  </div>
                  <br/>
                  <div className="row">
                      <div className="col">
                          <label className="col-sm-4 control-label">Telefono</label>
                          <input type="text" name="telefono" id="" /> 
                      </div>
                      <div className="col">
                        <label className="col-sm-4 control-label">Titulos</label>
                        <input type="text" name="titulos" id="" /> 
                      </div>
                  </div>
                  <br/>
                  <div className="row">
                      <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="categoriaEnRegimen">Categoría en Régimen</label>
                          <select name="categoria_en_regimen" id="categoria_en_regimen" value={formData.categoria_en_regimen} onChange={handleChange}>
                              <option value="">Seleccionar categoría</option>
                              <option value="Instructor">Instructor</option>
                              <option value="Profesor Adjunto">Profesor Adjunto</option>
                              <option value="Profesor Asociado">Profesor Asociado</option>
                              <option value="Catedrático">Catedrático</option>
                          </select>
                      </div>
                      <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="gradoMaximo">Grado Máximo</label>
                          <select name="grado_maximo" id="grado_maximo" value={formData.grado_maximo} onChange={handleChange}>
                              <option value="">Seleccionar grado</option>
                              <option value="Br">Bachiller</option>
                              <option value="Lic">Licenciado</option>
                              <option value="Mtr">Máster</option>
                              <option value="Dr">Doctor</option>
                          </select>
                      </div>
                  </div>
                  <br/>
                  <div className="row">
                      <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="areaEspecialidad">Área de Especialidad</label>
                          <input type="text" name="id_area_especialidad_fk.nombre" id="areaEspecialidad" value={formData.id_area_especialidad_fk.nombre} onChange={handleChange}/>
                      </div>
                      <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="areaTrabajo">Área de Trabajo</label>
                          <input name="area_de_trabajo" id="area_de_trabajo" value={formData.area_de_trabajo} onChange={handleChange} />
                      </div>
                  </div>
                  <br/>
                  <div className="row">
                    <div className="col">
                        <label className="col-sm-4 control-label" htmlFor="sitioWeb">Sitio Web</label>
                        <input type="url" name="sitio_web" id="sitio_web" value={formData.sitio_web} onChange={handleChange}/>
                    </div>
                    <div className="col">
                        <label className="col-sm-4 control-label" htmlFor="foto">Subir Foto</label>
                        <input type="file" name="foto" id="foto" onChange={handleFileChange}/>
                    </div>
                  </div>
              </div>
          </div>

          <div class="modal-footer">
              <div className="row">
                  <div className="col">
                      <button type="submit" className='table-button border-0 p-2 rounded text-white'>
                          {mode === 1 ? "Agregar" : "Editar"}
                      </button>
                  </div>
                  <div className="col">
                      {mode === 2 && (
                          <button type="button" onClick={onDelete} className='delete-button border-0 p-2 rounded text-white'> Eliminar </button>
                      )}
                  </div>
                  <div className="col">
                      <button type="button" onClick={onCancel} className='cancel-button border-0 p-2 rounded text-white'> Cancelar </button>
                  </div>
              </div>
          </div>
      </form>
    </>
  );
};

AcademicosForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  academico: PropTypes.object,
};
