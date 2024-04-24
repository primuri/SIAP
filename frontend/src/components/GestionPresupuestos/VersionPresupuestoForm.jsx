import PropTypes from 'prop-types'
import icono from '../../assets/person-i.png';
import { Confirmar } from '../../utils/Confirmar';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';

const filter = createFilterOptions();
const currentYear = new Date().getFullYear();

export const VersionPresupuestoForm = ({ onSubmit, mode, version, id_presupuesto,onCancel, onDelete }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [formData, setFormData] = useState({
            "id_presupuesto_fk": version? version.id_presupuesto_fk.id_presupuesto : id_presupuesto,
            "version": version ? version.version : "",
            "monto": version ? version.monto : "",
            "saldo": 12,
            "fecha": version ? version.fecha.split('T')[0] : "",
            "detalle": version ? version.detalle : "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target

        if (name.includes('.')) {
            const keys = name.split('.')
            setFormData(prev => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value
                }
            }))

        } else {
            setFormData({
                ...formData,
                [name]: value,
            })
        }
    }

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
                                <img src={icono} alt="" width={'72px'} />
                            </div>
                        </div>
                        <div className="col-10 mb-0 text-center">
                            <h2 className="headerForm">
                                {mode === 1 ? "Agregar versión de presupuesto" : "Editar versión de presupuesto"}
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
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="version" className="label-personalizado mb-2">Versión</label>
                                    <input type="number" className="form-control" name="version" id="version" value={formData.version} onChange={handleChange} required/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="fecha_presentacion" className="label-personalizado mb-2"> Fecha   </label>
                                <input type="date" className="form-control" name="fecha" id="fecha" value={formData.fecha} onChange={handleChange} required />
                            </div>
                            
                        </div>
                        <div className='row mb-4'>
                            <div className="col-md-6">
                                <label htmlFor="monto" className="label-personalizado mb-2">Monto</label>
                                <input type="number" className="form-control" name="monto" id="monto" value={formData.monto} onChange={handleChange} required />
                                
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="detalle" className="label-personalizado mb-2">Detalle</label>
                                <input type="text" className="form-control" name="detalle" id="detalle" value={formData.detalle} onChange={handleChange} />
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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="versión de presupuesto" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="versión de presupuesto" />)}
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


VersionPresupuestoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    presupuesto: PropTypes.object,
    version: PropTypes.object,
    id_presupuesto: PropTypes.string,
}