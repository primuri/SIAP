import PropTypes from 'prop-types'
import icono from '../../assets/person-i.png';
import { Confirmar } from '../../utils/Confirmar';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { FormularioDinamico } from "../../utils/FomularioDinamico"

const filter = createFilterOptions();

export const GastoForm = ({ onSubmit, mode, gasto, onCancel, onDelete }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [proveedores, setProveedores] = useState([]);
    const [formData, setFormData] = useState({
        id: gasto ? gasto.id_gasto : "",
        fecha: gasto ? gasto.fecha : "",
        detalle: gasto ? gasto.detalle : "",
        monto: gasto ? gasto.fecha_presentacion : "",
        id_partida_fk: gasto ? gasto.id_partida_fk.id_partida : "",
        id_factura_fk: gasto ? gasto.id_factura_fk.id_factura: "",
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
        if (oficioData) {
            combinedData.append('ruta_archivo', oficioData);
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
                                {mode === 1 ? "Agregar gasto" : "Editar gasto"}
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
                                    <label htmlFor="id_gasto" className="label-personalizado mb-2">Código   </label>
                                    <input type="text" className="form-control" name="id" id="id" value={mode === 2 ? formData.id: "Auto - generado"} onChange={handleChange} disabled />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="fecha" className="label-personalizado mb-2">Fecha   </label>
                                    <input type="date" className="form-control" name="fecha" id="fecha"    value={formData.fecha ? new Date(formData.fecha).toISOString().split('T')[0] : ""} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="detalle" className="label-personalizado mb-2">Detalle   </label>
                                    <input type="text" className="form-control" name="detalle" id="detalle" value={formData.detalle} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="monto" className="label-personalizado mb-2">Monto  </label>
                                    <input type="text" className="form-control" name="monto" id="monto" value={formData.monto} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="detalle" className="label-personalizado mb-2">Número de factura   </label>
                                    <input type="text" className="form-control" name="id" id="id" value={mode === 2 ? formData.id: "Auto - generado"} onChange={handleChange} disabled />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="monto" className="label-personalizado mb-2">Identificador del producto  </label>
                                    <input type="text" className="form-control" name="monto" id="monto" value={formData.monto} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="detalle" className="label-personalizado mb-2">Identificador del proveedor   </label>
                                    <input type="text" className="form-control" name="detalle" id="detalle" value={formData.detalle} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="id_documento_fk" className="label-personalizado mb-2"> Documento </label>
                                <input type="file" className="form-control" name="id_documento_fk.documento" id="id_documento_fk" onChange={handleFileChange} />
                                { typeof formData.id_documento_fk.documento === 'string' && (
                                    <a href={'http://localhost:8000' + formData.id_documento_fk.documento} target="blank" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                        {formData.id_documento_fk.documento.split('/').pop()}
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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="gasto" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="gasto" />)}
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


GastoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    gasto: PropTypes.object,
}