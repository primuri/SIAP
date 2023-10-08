import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { toast, Toaster } from 'react-hot-toast'
import { obtenerUniversidades } from "../../../api/gestionAcademicos";
import icono from '../../../assets/person-i.png';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import * as React from 'react';
import { Confirmar } from '../../../utils/Confirmar'

const filter = createFilterOptions();

export const EvaluadoresForm = ({ onSubmit, mode, evaluador, onCancel, onDelete }) => {
  // Cargar informacion
  const [universidades, setUniversidades] = useState([])
  const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);

  const [formData, setFormData] = useState({
    tipo: evaluador ? evaluador.tipo : "",
    correo: evaluador ? evaluador.correo : "",
    id_nombre_completo_fk: evaluador ? evaluador.id_nombre_completo_fk : { nombre: "", apellido: "", segundo_apellido: "" },
    id_area_especialidad_fk: evaluador ? evaluador.id_area_especialidad_fk : { nombre: "" },
    universidad_fk: evaluador ? evaluador.universidad_fk : { pais: "", nombre: "" }
  });

  useEffect(() => {
    loadUniversidades()
  }, [evaluador])

  const loadUniversidades = async () => {
    try {
      const res = await obtenerUniversidades(localStorage.getItem('token'))
      setUniversidades(res.data)

    } catch (error) {
      toast.error('Error al cargar universidades', {
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: '#670000',
          color: '#fff',
        },
      })
    }
  }


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

  const obtenerUniversidadesUnicasPorPais = (universidades) => {
    const paisesUnicos = [...new Set(universidades.map(u => u.pais))];
    return paisesUnicos.map(pais => universidades.find(u => u.pais === pais));
  };

  const obtenerUniversidadesUnicasPorNombre = (universidades) => {
    const nombresUnicos = [...new Set(universidades.map(u => u.nombre))];
    return nombresUnicos.map(nombre => universidades.find(u => u.nombre === nombre));
  };

  const handleDeleteClick = () => {
    setShowConfirmationDelete(true);
  };

  const handleEditClick = () => {
    setShowConfirmationEdit(true);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setShowConfirmationDelete(false);
  };

  const handleDeleteCancel = () => {
    setShowConfirmationDelete(false);
  };

  const handleEditCancel = () => {
    setShowConfirmationEdit(false);
  };


  return (
    <>
      <div className="modal-header pb-0 position-sticky top-0">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-1 mb-0 text-center">
              <div className="img-space">
                <img src={icono} alt="" width={'72px'} />
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
        <div className="modal-body" style={{ padding: '3vh 4vw' }}>
          <div className="container">

            <div className="row mb-4">
              <div className="col">
                <label htmlFor="nombre" className="label-personalizado mb-2">Nombre <span class="required">*</span> </label>
                <input type="text" className="form-control" name="id_nombre_completo_fk.nombre" id="nombre" value={formData.id_nombre_completo_fk.nombre || ""} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="apellido" className="label-personalizado mb-2">Primer Apellido  <span class="required">*</span> </label>
                <input type="text" className="form-control" name="id_nombre_completo_fk.apellido" id="apellido" value={formData.id_nombre_completo_fk.apellido || ""} onChange={handleChange} required />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="segundoApellido" className="label-personalizado mb-2">Segundo apellido</label>
                <input type="text" className="form-control" name="id_nombre_completo_fk.segundo_apellido" id="segundo_apellido" value={formData.id_nombre_completo_fk.segundo_apellido || ""} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="correo" className="label-personalizado mb-2">Correo Electrónico <span class="required">*</span> </label>
                <input type="email" className="form-control" name="correo" id="correo" value={formData.correo} onChange={handleChange} required />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="areaEspecialidad" className="label-personalizado mb-2">Área de especialidad <span class="required">*</span></label>
                <input type="text" className="form-control" name="id_area_especialidad_fk.nombre" id="areaEspecialidad" value={formData.id_area_especialidad_fk.nombre} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="tipo" className="label-personalizado mb-2">Tipo <span class="required">*</span> </label>
                <select className="form-control" name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} required>
                  <option value="">Seleccionar tipo</option>
                  <option value="Interno">Interno</option>
                  <option value="Externo">Externo</option>
                </select>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col-md-6">
                <label htmlFor="universidadNombre" className="label-personalizado mb-2">Universidad <span class="required">*</span></label>
                <Autocomplete className="universidadAuto"
                  value={formData.universidad_fk}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setFormData({
                        ...formData,
                        universidad_fk: { nombre: newValue, pais: formData.universidad_fk.pais },
                      });
                    } else if (newValue && newValue.inputValue) {
                      setFormData({
                        ...formData,
                        universidad_fk: { nombre: newValue.inputValue, pais: formData.universidad_fk.pais },
                      });
                    } else {
                      setFormData({
                        ...formData,
                        universidad_fk: { nombre: newValue.nombre, pais: formData.universidad_fk.pais },
                      });
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.nombre);
                    if (inputValue !== '' && !isExisting) {
                      let cadena = `Añadir "${inputValue}"`;
                      filtered.push({
                        inputValue,
                        nombre: cadena.normalize(),
                      });
                    }

                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  id="universidad_nombre"
                  options={obtenerUniversidadesUnicasPorNombre(universidades)}
                  getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                      return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    // Regular option
                    return option.nombre;
                  }}
                  renderOption={(props, option) => <li {...props}>{option.nombre}</li>}
                  freeSolo
                  renderInput={(params) => (
                    <TextField {...params} className="form-control" />
                  )}
                />
              </div >
              <div className="col-md-6">
                <label htmlFor="universidadPais" className="label-personalizado mb-2">País de la Universidad <span class="required">*</span> </label>
                <Autocomplete
                  value={formData.universidad_fk}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setFormData({
                        ...formData,
                        universidad_fk: { nombre: formData.universidad_fk.nombre, pais: newValue },
                      });
                    } else if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      setFormData({
                        ...formData,
                        universidad_fk: { nombre: formData.universidad_fk.nombre, pais: newValue.inputValue },
                      });
                    } else {
                      setFormData({
                        ...formData,
                        universidad_fk: { nombre: formData.universidad_fk.nombre, pais: newValue.pais },
                      });
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.pais);
                    if (inputValue !== '' && !isExisting) {
                      filtered.push({
                        inputValue,
                        pais: `Añadir "${inputValue}"`,
                      });
                    }

                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  id="universidad_pais"
                  options={obtenerUniversidadesUnicasPorPais(universidades)}
                  getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                      return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    // Regular option
                    return option.pais;
                  }}
                  renderOption={(props, option) => <li {...props}>{option.pais}</li>}
                  sx={{ width: 300 }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField {...params} className="form-control" />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer justify-content-center position-sticky bottom-0">
          <div className="row">
            <div className="col">
              {mode === 1 ? (
                <button id="boton-personalizado" type="submit" className='table-button border-0 p-2 rounded text-white'>Agregar</button>
              ) : (
                <>
                  <button id="boton-personalizado" type="button" onClick={handleEditClick} className='table-button border-0 p-2 rounded text-white'>Guardar</button>
                  {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="evaluador(a)" />)}
                </>
              )}
            </div>
            <div className="col">
              {mode === 2 && (
                <>
                  <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                  {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="evaluador(a)" />)}
                </>
              )}
            </div>
          </div>
        </div>
      </form>
      <Toaster></Toaster>
    </>)
}

EvaluadoresForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  evaluador: PropTypes.object
};