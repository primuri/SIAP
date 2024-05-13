import PropTypes from 'prop-types'
import icono from '../../assets/budget.svg';
import { Confirmar } from '../../utils/Confirmar';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';

const filter = createFilterOptions();
const currentYear = new Date().getFullYear();

export const PartidaForm = ({ onSubmit, mode, version, id_version,onCancel, onDelete }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [formData, setFormData] = useState({
        "id_partida": version? version.id_partida : "",
        "id_version_presupuesto_fk": version? version.id_version_presupuesto_fk.id_version_presupuesto : id_version,
        "monto": version ? version.monto : "",
        "saldo": version ? version.saldo : "",
        "detalle": version ? version.detalle : "",
    });

    //Agregado para verificacion de saldo<monto. Mostrar error en el form
    const [formErrors, setFormErrors] = useState({
        saldo: '',
        monto: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        let updatedValue = value;
    
        // Determinar si el campo es numérico o de texto
        if (name === 'saldo' || name === 'monto') {
            const numericValue = parseFloat(value);
            updatedValue = isNaN(numericValue) ? '' : numericValue; // Si no es numérico, establecer a 0
        }
    
        // Actualizar el estado del formulario
        setFormData(prev => {
            const newFormData = {
                ...prev,
                [name]: updatedValue
            };
    
            // Validar después de actualizar, solo para campos numéricos
            if (name === 'saldo' || name === 'monto') {
                const saldo = parseFloat(newFormData.saldo || 0);
                const monto = parseFloat(newFormData.monto || 0);
    
                if (saldo > monto) {
                    setFormErrors(errors => ({
                        ...errors,
                        saldo: saldo > monto ? "El saldo no puede ser mayor al monto." : ''
                    }));
                    return prev; // Devolver el estado anterior si la validación falla
                }
            }

            // Limpiar errores si todo está correcto
            setFormErrors(errors => ({
                ...errors,
                [name]: ''
            }));
    
            return newFormData; // Si todo está correcto, actualizamos el estado
        });
    };
    
    

    const sendForm = (event) => {
        event.preventDefault()
        const combinedData = new FormData();
        for (const [key, value] of Object.entries(formData)) {
            combinedData.append(key, value);
        }
        for (let [key, value] of combinedData.entries()) {
        }
        onSubmit(combinedData)
    }

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
        <div>
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
                                {mode === 1 ? "Agregar partida" : "Editar partida"}
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

            <form onSubmit={sendForm} className='d-flex flex-column position-relative justify-content-center' encType="multipart/form-data">
                <div className="modal-body justify-content-center" style={{ padding: '3vh 4vw' }}>
                    <div className="container ">
                        <div className="row mb-4">
                            {(mode === 2 || true) && (<div className="col-md-6">
                                <label htmlFor="codigoCimpa" className="label-personalizado mb-2">Código </label>
                                <input type="text" className="form-control disabled-input" name="id_codigo_cimpa_fk.id_codigo_cimpa" id="id_codigo_cimpa_fk.id_codigo_cimpa" value={mode === 2 ? formData.id_partida : "Auto - generado"} onChange={handleChange} disabled={true} />
                            </div>)}
                            <div className="col-md-6">
                                <label htmlFor="detalle" className="label-personalizado mb-2">Detalle</label>
                                <textarea className="form-control" name="detalle" id="detalle" value={formData.detalle} onChange={handleChange} />
                            </div>
                            
                        </div>
                        <div className='row mb-4'>
                            <div className="col-md-6">
                                <label htmlFor="monto" className="label-personalizado mb-2">Monto</label>
                                <input type="number" className="form-control" name="monto" id="monto" value={formData.monto} onChange={handleChange} required />
                                {formErrors.monto && <div style={{ color: 'red' }}>{formErrors.monto}</div>}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="saldo" className="label-personalizado mb-2">Saldo</label>
                                <input type="number" className="form-control" name="saldo" id="saldo" value={formData.saldo} onChange={handleChange} required/>
                                {formErrors.saldo && <div style={{ color: 'red' }}>{formErrors.saldo}</div>}
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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="partida" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="partida" />)}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            <Toaster></Toaster>
        </div>
    )
}


PartidaForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    presupuesto: PropTypes.object,
    version: PropTypes.object,
    id_version: PropTypes.string,
}