import { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { FormularioDinamico } from "../../utils/FomularioDinamico"
import { toast, Toaster } from 'react-hot-toast'
import icono from '../../assets/person-i.png';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Confirmar } from '../../utils/Confirmar'
import Tooltip from '@mui/material/Tooltip';
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
const filter = createFilterOptions();

export const AccionesForm = ({ onSubmit, mode, accion, onCancel, onDelete }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false)
    const [fileAccion, setFileAccion] = useState(null);

    const [formData, setFormData] = useState({
        id: accion ? accion.id_accion : "",
        fecha: accion ? accion.fecha : "",
        origen: accion ? accion.origen : "",
        destino: accion ? accion.destino : "",
        estado: accion ? accion.estado : "",
        id_documento_accion_fk: accion ? {...accion.id_documento_accion_fk} : {tipo: "Informe", detalle: "", documento: ""}
    })


    const handleChange = (event) => {
        const { name, value } = event.target;
    
        if (name.includes('.')) {
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
        let sendingForm = { ...formData}
        if(fileAccion){
            sendingForm.id_documento_accion_fk.documento = fileAccion
        }
        onSubmit(sendingForm);
        sendingForm = { ...formData}
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileAccion(file);
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
                                <img src={icono} alt="" width={'72px'} />
                            </div>
                        </div>
                        <div className="col-10 mb-0 text-center">
                            <h2 className="headerForm">
                                {mode === 1 ? "Agregar acción" : "Editar acción"}
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
                                    <label htmlFor="id_informe" className="label-personalizado mb-2">Identificador <span className="required">*</span> </label>
                                    <input type="text" className="form-control" name="id" id="id" value={mode === 2 ? formData.id: "Auto - generado"} onChange={handleChange} disabled />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="fecha" className="label-personalizado mb-2">Fecha <span className="required">*</span> </label>
                                    <input type="date" className="form-control" name="fecha" id="fecha" value={formData.fecha ? new Date(formData.fecha).toISOString().split('T')[0] : ""} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="origen" className="label-personalizado mb-2">Origen <span className="required">*</span> </label>
                                    <input type="text" className="form-control" name="origen" id="origen" value={formData.origen} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="fecha_presentacion" className="label-personalizado mb-2">Destino <span className="required">*</span> </label>
                                    <input type="text" className="form-control" name="destino" id="destino" value={formData.destino} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="estado" className="label-personalizado mb-2">Estado <span className="required">*</span></label>
                                <input type="text" className="form-control" name="estado" id="estado" value={formData.estado} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                    <label htmlFor="id_documento_accion" className="label-personalizado mb-2"> Documento <span className="required">*</span> </label>
                                    <input type="file" className="form-control" name="id_documento_accion_fk.documento" id="id_documento_accion" onChange={handleFileChange} required={mode == 1} />
                                    { typeof formData.id_documento_accion_fk.documento === 'string' && (
                                        <a href={'http://localhost:8000' + formData.id_documento_accion_fk.documento} target="blank" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                            {formData.id_documento_accion_fk.documento.split('/').pop()}
                                        </a>
                                    ) }

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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="acción" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="acción" />)}
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

AccionesForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    academico: PropTypes.object,
}