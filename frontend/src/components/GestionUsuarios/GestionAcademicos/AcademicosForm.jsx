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
      <h1>{mode === 1 ? "Agregar un académico(a)" : "Editar académico(a)"}</h1>

      <form onSubmit={sendForm} className='d-flex flex-column'>

        <label htmlFor="nombre">Nombre</label>
        <input type="text" name="id_nombre_completo_fk.nombre" id="nombre" value={formData.id_nombre_completo_fk.nombre || ""} onChange={handleChange} required/>

        <label htmlFor="apellido">Apellido</label>
        <input type="text" name="id_nombre_completo_fk.apellido" id="apellido" value={formData.id_nombre_completo_fk.apellido || ""} onChange={handleChange} required/>

        <label htmlFor="segundoApellido">Segundo Apellido</label>
        <input type="text" name="id_nombre_completo_fk.segundo_apellido" id="segundo_apellido" value={formData.id_nombre_completo_fk.segundo_apellido || ""} onChange={handleChange}/>

        <label htmlFor="cedula">Cédula</label>
        <input type="text" name="cedula" id="cedula" value={formData.cedula} onChange={handleChange} required/>
        
        <label htmlFor="foto">Subir Foto</label>
        <input type="file" name="foto" id="foto" onChange={handleFileChange}/>

        <label htmlFor="sitioWeb">Sitio Web</label>
        <input type="url" name="sitio_web" id="sitio_web" value={formData.sitio_web} onChange={handleChange}/>

        <label htmlFor="AreaTrabajo">Area de Trabajo</label>
        <input name="area_de_trabajo" id="area_de_trabajo" value={formData.area_de_trabajo} onChange={handleChange} />

        <label htmlFor="gradoMaximo">Grado Máximo</label>
        <select name="grado_maximo" id="grado_maximo" value={formData.grado_maximo} onChange={handleChange}>
          <option value="">Seleccionar grado</option>
          <option value="Ph.D.">Ph.D.</option>
          <option value="Master">Master</option>
          <option value="Bachillerato">Bachillerato</option>
        </select>

        <label htmlFor="correo">Correo</label>
        <input type="email" name="correo" id="correo" value={formData.correo} onChange={handleChange} required/>

        <label htmlFor="areaEspecialidad">Área de Especialidad</label>
        <input type="text" name="id_area_especialidad_fk.nombre" id="areaEspecialidad" value={formData.id_area_especialidad_fk.nombre} onChange={handleChange}/>

        <label htmlFor="categoriaEnRegimen">Categoría en Régimen</label>
        <select name="categoria_en_regimen" id="categoria_en_regimen" value={formData.categoria_en_regimen} onChange={handleChange}>
          <option value="">Seleccionar categoría</option>
          <option value="Junior">Junior</option>
        </select>

        <label htmlFor="paisProcedencia">País de Procedencia</label>
        <input type="text" name="pais_procedencia" id="pais_procedencia" value={formData.pais_procedencia} onChange={handleChange}/>

        <label htmlFor="universidadNombre">Nombre de la Universidad</label>
        <input type="text" name="universidad_fk.nombre" id="universidadNombre" value={formData.universidad_fk.nombre} onChange={handleChange} required/>

        <label htmlFor="universidadPais">País de la Universidad</label>
        <input type="text" name="universidad_fk.pais" id="universidadPais" value={formData.universidad_fk.pais} onChange={handleChange} required/>
        
        <div>
          <button type="submit" className='table-button border-0 p-2 rounded text-white'>
            {mode === 1 ? "Agregar" : "Editar"}
          </button>
          {mode === 2 && (
            <button type="button" onClick={onDelete} className='delete-button border-0 p-2 rounded text-white'> Eliminar </button>
          )}
          <button type="button" onClick={onCancel} className='cancel-button border-0 p-2 rounded text-white'> Cancelar </button>
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
