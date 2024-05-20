import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { toast, Toaster } from 'react-hot-toast'
import icono from '../../../assets/add_person.svg';
import icono2 from '../../../assets/upload_doc.svg'
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import * as React from 'react';
import { Confirmar } from '../../../utils/Confirmar'
import Tooltip from '@mui/material/Tooltip';

const filter = createFilterOptions();

export const AsistenteForm = ({ onSubmit, mode, asistente, onCancel, onDelete }) => {
  const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
  const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');

  const [formData, setFormData] = useState({
    id_designacion_asistente: asistente ? asistente.id_designacion_asistente : "",
    cantidad_horas: asistente ? asistente.cantidad_horas : "",
    consecutivo: asistente ? asistente.consecutivo : "",
    id_asistente_carnet_fk: asistente ? asistente.id_asistente_carnet_fk : {
      carrera: asistente ? asistente.id_asistente_carnet_fk.carrera : "",
      promedio_ponderado: asistente ? asistente.id_asistente_carnet_fk.promedio_ponderado : "",
      cedula: asistente ? asistente.id_asistente_carnet_fk.cedula : "",
      condicion_estudiante: asistente ? asistente.id_asistente_carnet_fk.condicion_estudiante : "",
      id_nombre_completo_fk: asistente && asistente.id_asistente_carnet_fk.id_nombre_completo_fk ? asistente.id_asistente_carnet_fk.id_nombre_completo_fk : {
        nombre: asistente && asistente.id_asistente_carnet_fk.id_nombre_completo_fk ? asistente.id_asistente_carnet_fk.id_nombre_completo_fk.nombre : "",
        apellido: asistente && asistente.id_asistente_carnet_fk.id_nombre_completo_fk ? asistente.id_asistente_carnet_fk.id_nombre_completo_fk.apellido : "",
        segundo_apellido: asistente && asistente.id_asistente_carnet_fk.id_nombre_completo_fk ? asistente.id_asistente_carnet_fk.id_nombre_completo_fk.segundo_apellido : ""
      }
    },
    id_documento_inopia_fk: asistente?.id_documento_inopia_fk || { id_documento: "", tipo: "Asistente", detalle: "", documento: "" }

  });

  const user = JSON.parse(localStorage.getItem('user'))
  const isInvestigador = user.groups.some((grupo) => {
    return grupo === 'investigador';
  });

  useEffect(() => {
  }, [asistente])



  const handleChange = (event) => {
    const { name, value } = event.target;

    if ((name === "cantidad_horas" || name === "consecutivo") && (value.includes('e') || value.includes('+') || value.includes('-') || !/^[0-9]*$/.test(value))) {
      return;
    }

    if (name.includes('.')) {
      const keys = name.split('.');
      if (keys.length === 3) {
        setFormData(prev => ({
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: {
              ...prev[keys[0]][keys[1]],
              [keys[2]]: value
            }
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value
          }
        }));
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  const sendForm = (event) => {
    event.preventDefault()
    const combinedData = new FormData();
    if (fileData) {
      combinedData.append('id_documento_inopia_fk', fileData);
    }
    combinedData.append('json', JSON.stringify(formData))
    onSubmit(combinedData)
  }

  const handleDeleteClick = () => {
    setShowConfirmationDelete(true);
  };

  const handleEditClick = () => {
    setShowConfirmationEdit(true);
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFileName(file.name);
    }

    setFileData(file);
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

  const updateNestedField = (formData, fieldPath, value) => {
    const keys = fieldPath.split('.');
    const lastKey = keys.pop();

    keys.reduce((obj, key) => obj[key] = obj[key] || {}, formData)[lastKey] = value;

    return { ...formData };
  };

  return (
    <>
      <div className="modal-header pb-0 position-sticky top-0">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-1 mb-0 text-center">
              <div className="img-space">
                <img src={icono}/>
              </div>
            </div>
            <div className="col-10 mb-0 text-center">
              <h2 className="headerForm">
                {mode === 1 ? "Agregar Asistente" : isInvestigador ? "Visualizar asistente" : "Editar Asistente"}
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
                <label htmlFor="nombreAsistente" className="label-personalizado mb-4"> Nombre   </label>
                <input type="text" className="form-control" name="id_asistente_carnet_fk.id_nombre_completo_fk.nombre" id="nombreAsistente" value={formData.id_asistente_carnet_fk.id_nombre_completo_fk.nombre} onChange={handleChange} required disabled={isInvestigador} />
              </div>
              <div className="col">
                <label htmlFor="apellidoAsistente" className="label-personalizado mb-4"> Apellido  </label>
                <input type="text" className="form-control" name="id_asistente_carnet_fk.id_nombre_completo_fk.apellido" id="apellidoAsistente" value={formData.id_asistente_carnet_fk.id_nombre_completo_fk.apellido} onChange={handleChange} required disabled={isInvestigador} />
              </div>
              <div className="col">
                <label htmlFor="segundoApellidoid_asistente_carnet_fk" className="label-personalizado"> Segundo Apellido </label> <span className="disabled-input">(Opcional)</span>
                <input type="text" className="form-control" name="id_asistente_carnet_fk.id_nombre_completo_fk.segundo_apellido" id="segundoApellidoid_asistente_carnet_fk" value={formData.id_asistente_carnet_fk.id_nombre_completo_fk.segundo_apellido} onChange={handleChange} disabled={isInvestigador} />
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <label htmlFor="cedula" className="label-personalizado mb-2">Cedula </label>
                <input type="text" className="form-control" name="id_asistente_carnet_fk.cedula" id="cedula" value={formData.id_asistente_carnet_fk.cedula} onChange={handleChange} required disabled={isInvestigador} />
              </div>
              <div className="col-md-6">
                <label htmlFor="condicionEstudiante" className="label-personalizado mb-2">Condicion Estudiante   </label>
                <select className="form-control" name="id_asistente_carnet_fk.condicion_estudiante" id="condicion_estudiante" value={formData.id_asistente_carnet_fk.condicion_estudiante} onChange={handleChange} required disabled={isInvestigador}>
                  <option value="">Seleccionar Condición</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <label htmlFor="id_asistente_carnet_fk.carrera" className="label-personalizado mb-2"> Carrera</label>
                <input type="text" className="form-control" name="id_asistente_carnet_fk.carrera" id="id_asistente_carnet_fk.carrera" value={formData.id_asistente_carnet_fk.carrera} onChange={handleChange} required disabled={isInvestigador} />
              </div>
              <div className="col">
                <label htmlFor="id_asistente_carnet_fk.promedio_ponderado" className="label-personalizado mb-2"> Promedio Ponderado   </label>
                <input type="number" className="form-control" name="id_asistente_carnet_fk.promedio_ponderado" id="id_asistente_carnet_fk.promedio_ponderado" value={formData.id_asistente_carnet_fk.promedio_ponderado} onChange={handleChange} min="0" step="0.01" max="10" pattern="^\d+(\.\d{1,2})?$" required disabled={isInvestigador} />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <label htmlFor="cantidad_horas" className="label-personalizado mb-2"> Cantidad de Horas</label>
                <input type="number" className="form-control" name="cantidad_horas" id="cantidad_horas" value={formData.cantidad_horas} onChange={handleChange} min="0" step="1" pattern="^[0-9]+$" required disabled={isInvestigador} />
              </div>
              <div className="col">
                <label htmlFor="consecutivo" className="label-personalizado mb-2"> Consecutivo </label>
                <input type="number" className="form-control" name="consecutivo" id="consecutivo" value={formData.consecutivo} onChange={handleChange} min="0" step="1" pattern="^[0-9]+$" required disabled={isInvestigador} />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col">
                <label htmlFor="detalleInopia" className="label-personalizado mb-2"> Detalle Inopia   </label> <span className="disabled-input">(Opcional)</span>
                <textarea className="form-control" name="id_documento_inopia_fk.detalle" id="detalleInopia" value={formData.id_documento_inopia_fk.detalle || ''} onChange={handleChange} disabled={isInvestigador} />
              </div>
              <div className="col">
                <label htmlFor="id_documento_inopia_fk.documento" className="label-personalizado mb-2" style={{ display: 'block' }}>
                    Documento del Inopia
                    <span className="disabled-input">(Opcional)</span>
                </label>
                <input
                    type="file"
                    className={isInvestigador ? "form-control disabled-input" : "form-control"}
                    name="id_documento_inopia_fk.documento"
                    id="id_documento_inopia_fk.documento"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    disabled={isInvestigador}
                />
                <label htmlFor="id_documento_inopia_fk.documento" style={{ cursor: 'pointer', display: 'block' }}>
                    {selectedFileName ? (
                        <span>Nombre del archivo: {selectedFileName}</span>
                    ) : (
                        <div className="file-upload-icon-container">
                            <img src={icono2} alt="Seleccionar archivo" className="file-upload-icon" />
                        </div>
                    )}
                </label>
                {mode === 2 && formData.id_documento_inopia_fk?.documento && (
                    <Tooltip title={formData.id_documento_inopia_fk.documento.split('/').pop()} placement="right-start">
                        <a
                            href={"http://localhost:8000" + formData.id_documento_inopia_fk.documento}
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
          </div>
        </div>
        {!isInvestigador && (
        <div className="modal-footer justify-content-center position-sticky bottom-0">
          <div className="row">
            <div className="col">
              {mode === 1 ? (
                <button id="boton-personalizado" type="submit" className='table-button border-0 p-2 rounded text-white'>Agregar</button>
              ) : (
                <>
                  <button id="boton-personalizado" type="button" onClick={handleEditClick} className='table-button border-0 p-2 rounded text-white'>Guardar</button>
                  {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="asistente" />)}
                </>
              )}
            </div>
            <div className="col">
              {mode === 2 && (
                <>
                  <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                  {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="asistente" />)}
                </>
              )}
            </div>
          </div>
        </div>
        )}
      </form>
      <Toaster></Toaster>
    </>)
}

AsistenteForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  asistente: PropTypes.object
}