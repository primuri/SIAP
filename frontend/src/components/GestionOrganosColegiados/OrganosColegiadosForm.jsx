import { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { FormularioDinamico } from "../../utils/FomularioDinamico"
import { toast, Toaster } from 'react-hot-toast'
import icono from '../../assets/collegiate_body.svg';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Confirmar } from '../../utils/Confirmar'
import Tooltip from '@mui/material/Tooltip';
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
const filter = createFilterOptions();

export const OrganosColegiadosForm = ({ onSubmit, mode, organo_colegiado, onCancel, onDelete, rol }) => {

    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false)

    const [formData, setFormData] = useState({
        id_organo_colegiado: organo_colegiado ? organo_colegiado.id_organo_colegiado : "",
        nombre: organo_colegiado ? organo_colegiado.nombre : "",
        numero_miembros: organo_colegiado ? organo_colegiado.numero_miembros : "",
        quorum: organo_colegiado ? organo_colegiado.quorum : "",
        acuerdo_firme: organo_colegiado ? organo_colegiado.acuerdo_firme : "",
    })

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (rol === "invitado") {
            return;
        }
    
        if (name === 'numero_miembros' || name === 'quorum' || name === 'acuerdo_firme') {
            const numericValue = Number(value);
            if (!isNaN(numericValue) && numericValue >= 0) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: numericValue,
                }));
            }
        } else if (name.includes('.')) {
            const keys = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };
    


    const sendForm = (event) => {
        event.preventDefault();
        const jsonData = JSON.stringify(formData);
        onSubmit(jsonData);
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
                            {rol === "administrador" && (
                                <span>
                                    {mode === 1 ? "Agregar órgano colegiado" : "Editar órgano colegiado"}
                                </span>
                            )}
                            {rol === "invitado" && (
                                <span>
                                    Órgano Colegiado
                                </span>
                            )}
                        </h2>
                        </div>
                        <div className="col-1 mb-0 text-center">
                            <button type="button" onClick={onCancel} className="close" data-dismiss="modal">
                                <span aria-hidden="true" className="close-icon">&times;</span>
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
                                    <label htmlFor="nombre" className="label-personalizado mb-2">Nombre</label>
                                    <input type="text" className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} disabled={rol === "invitado"} required/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="quorum" className="label-personalizado mb-2">Quorum</label>
                                        <input type="number" className="form-control" name="quorum" id="quorum" value={formData.quorum} onChange={handleChange} disabled={rol === "invitado"} required/>
                                    </div>
                            </div>
                        </div>
          
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="numero_miembros" className="label-personalizado mb-2">Cantidad de integrantes</label>
                                    <input type="number" className="form-control" name="numero_miembros" id="numero_miembros"  value={formData.numero_miembros} onChange={handleChange} disabled={rol === "invitado"} required/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="acuerdo_firme" className="label-personalizado mb-2">Acuerdo en firme</label>
                                <input type="number" className="form-control" name="acuerdo_firme" id="acuerdo_firme" value={formData.acuerdo_firme} onChange={handleChange} required disabled={rol === "invitado"} />
                            </div>
                        </div>                
                    </div>
                </div>
                  
                {rol === "administrador" && (
                    <div className="modal-footer justify-content-center position-sticky bottom-0">
                        <div className="row">
                            <div className="col">
                                {mode === 1 ? (
                                    <button id="boton-personalizado" type="submit" className='table-button border-0 p-20 rounded text-white'>Agregar</button>
                                ) : (
                                    <>
                                        <button id="boton-personalizado" type="button" onClick={handleEditClick} className='table-button border-0 p-2 rounded text-white'>Guardar</button>
                                        {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="órgano colegiado" />)}
                                    </>
                                )}
                            </div>
                            <div className="col">
                                {mode === 2 && (
                                    <>
                                        <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white">Eliminar</button>
                                        {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="órgano colegiado" />)}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </form>
            <Toaster></Toaster>
        </div>
    )
}

OrganosColegiadosForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    organo_colegiado: PropTypes.object,
}