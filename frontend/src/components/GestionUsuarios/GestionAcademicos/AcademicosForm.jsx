import { useState } from "react";
import PropTypes from 'prop-types';

export const AcademicosForm = ({ onSubmit, mode, academico, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    cedula: academico ? academico.cedula : "",
    foto: null, // Esto se actualizará cuando se cargue una foto
    sitioWeb: academico ? academico.sitioWeb : "",
    gradoMaximo: academico ? academico.gradoMaximo : "",
    correo: academico ? academico.correo : "",
    areaDeTrabajo: academico ? academico.areaDeTrabajo : "",
    categoriaEnRegimen: academico ? academico.categoriaEnRegimen : "",
    paisProcedencia: academico ? academico.paisProcedencia : "",
    idNombreCompletoFk: academico ? academico.idNombreCompletoFk : "",
    idAreaEspecialidadFk: academico ? academico.idAreaEspecialidadFk : "",
    universidadFk: academico ? academico.universidadFk : "",
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      foto: file,
    });
  };

  const eviaForm = (e) => {
    e.preventDefault();
    // Aquí puedes enviar formData como JSON
    const jsonData = JSON.stringify(formData);
    onSubmit(jsonData);
  };

  return (
    <>
      <h1>{mode === 1 ? "Agregar un académico(a)" : "Editar académico(a)"}</h1>
      <form onSubmit={eviaForm} className='d-flex flex-column'>
        <label htmlFor="cedula">Cédula</label>
        <input
          type="text"
          name="cedula"
          id="cedula"
          value={formData.cedula}
          onChange={handleChange}
          required
        />
        <label htmlFor="foto">Subir Foto</label>
        <input
          type="file"
          name="foto"
          id="foto"
          onChange={handleFileChange}
        />
        <label htmlFor="sitioWeb">Sitio Web</label>
        <input
          type="url"
          name="sitioWeb"
          id="sitioWeb"
          value={formData.sitioWeb}
          onChange={handleChange}
        />
        <label htmlFor="gradoMaximo">Grado Máximo</label>
        <select
          name="gradoMaximo"
          id="gradoMaximo"
          value={formData.gradoMaximo}
          onChange={handleChange}
        >
          <option value="">Seleccionar grado</option>
          <option value="Ph.D.">Ph.D.</option>
          <option value="Master">Master</option>
          <option value="Bachillerato">Bachillerato</option>
        </select>
        <label htmlFor="correo">Correo</label>
        <input
          type="email"
          name="correo"
          id="correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />
        <label htmlFor="areaDeTrabajo">Área de Trabajo</label>
        <input
          type="text"
          name="areaDeTrabajo"
          id="areaDeTrabajo"
          value={formData.areaDeTrabajo}
          onChange={handleChange}
        />
        <label htmlFor="categoriaEnRegimen">Categoría en Régimen</label>
        <select
          name="categoriaEnRegimen"
          id="categoriaEnRegimen"
          value={formData.categoriaEnRegimen}
          onChange={handleChange}
        >
          <option value="">Seleccionar categoría</option>
          <option value="Junior">Junior</option>
          {/* Agrega más opciones según tus necesidades */}
        </select>
        <label htmlFor="paisProcedencia">País de Procedencia</label>
        <input
          type="text"
          name="paisProcedencia"
          id="paisProcedencia"
          value={formData.paisProcedencia}
          onChange={handleChange}
        />
        {/* Otros campos de entrada */}
        <div>
          <button
            type="submit"
            className='table-button border-0 p-2 rounded text-white'
          >
            {mode === 1 ? "Agregar" : "Editar"}
          </button>
          {mode === 2 && (
            <button
              type="button"
              onClick={onDelete}
              className='delete-button border-0 p-2 rounded text-white'
            >
              Eliminar
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className='cancel-button border-0 p-2 rounded text-white'
          >
            Cancelar
          </button>
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
