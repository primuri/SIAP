import { useState } from "react";
import PropTypes from 'prop-types';
import icono from '../../../assets/person-i.png';

export const EvaluadoresForm = ({ onSubmit, mode, evaluador, onCancel, onDelete }) => {
  // Cargar informacion
  const [formData, setFormData] = useState({
    tipo: evaluador ? evaluador.tipo : "",
    correo: evaluador ? evaluador.correo : "",
    id_nombre_completo_fk: evaluador ? evaluador.id_nombre_completo_fk : { nombre: "", apellido: "", segundo_apellido: "" },
    id_area_especialidad_fk: evaluador ? evaluador.id_area_especialidad_fk : { nombre: "" },
    universidad_fk: evaluador ? evaluador.universidad_fk : { pais: "", nombre: "" }
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

  const sendForm = (event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(formData);
    onSubmit(jsonData);
  };

  return (
    <>
      <div className="modal-header pb-0">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-1 mb-0 text-center">
              <div className="img-space">
                <img src={icono} alt="" width={'88px'} />
              </div>
            </div>
            <div className="col-10 mb-0 text-center">
              <h2 className="headerForm">
                {mode === 1 ? "Agregar evaluador(a)" : "Editar evaluador(a)"}
              </h2>
            </div>
            <div className="col-1 mb-0 text-center">
              <button
                type="button"
                onClick={onCancel}
                className="close"
                data-dismiss="modal"
              >
                <span aria-hidden="true" className="close-icon">
                  &times;
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={sendForm} className='d-flex flex-column'>
        <div className="modal-body">
          <div className="container px-5">

            <div className="row mb-4">
              <div className="col">
                <label htmlFor="nombre" className="label-personalizado mb-2">Nombre</label>
                <input type="text" className="form-control" name="id_nombre_completo_fk.nombre" id="nombre" value={formData.id_nombre_completo_fk.nombre || ""} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="apellido" className="label-personalizado mb-2">Primer Apellido</label>
                <input type="text" className="form-control" name="id_nombre_completo_fk.apellido" id="apellido" value={formData.id_nombre_completo_fk.apellido || ""} onChange={handleChange} required />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="segundoApellido" className="label-personalizado mb-2">Segundo apellido</label>
                <input type="text" className="form-control" name="id_nombre_completo_fk.segundo_apellido" id="segundo_apellido" value={formData.id_nombre_completo_fk.segundo_apellido || ""} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="correo" className="label-personalizado mb-2">Correo</label>
                <input type="email" className="form-control" name="correo" id="correo" value={formData.correo} onChange={handleChange} required />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="universidadNombre" className="label-personalizado mb-2">Universidad</label>
                <input type="text" className="form-control" name="universidad_fk.nombre" id="universidadNombre" value={formData.universidad_fk.nombre} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="universidadPais" className="label-personalizado mb-2">País de la Universidad</label>
                <input type="text" className="form-control" name="universidad_fk.pais" id="pais_universidad" value={formData.universidad_fk.pais} onChange={handleChange} required />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="areaEspecialidad" className="label-personalizado mb-2">Área de especialidad</label>
                <input type="text" className="form-control" name="id_area_especialidad_fk.nombre" id="areaEspecialidad" value={formData.id_area_especialidad_fk.nombre} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="tipo" className="label-personalizado mb-2">Tipo</label>
                <select className="form-control" name="tipo" id="tipo" value={formData.tipo} onChange={handleChange}>
                  <option value="">Seleccionar tipo</option>
                  <option value="Interno">Interno</option>
                  <option value="Externo">Externo Adjunto</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer justify-content-center">
          <div className="row">
            <div className="col">
              <button id="boton-personalizado" type="submit" className='table-button border-0 p-2 rounded text-white'>
                {mode === 1 ? "Agregar" : "Guardar"}
              </button>
            </div>
            <div className="col">
              {mode === 2 && (
                <button id="boton-personalizado" type="button" onClick={onDelete} className='delete-button border-0 p-2 rounded text-white'> Eliminar </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </>)
}

EvaluadoresForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  evaluador: PropTypes.object
};