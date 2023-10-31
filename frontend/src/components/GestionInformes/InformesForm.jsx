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

export const InformesForm = ({ onSubmit, mode, informe, onCancel, onDelete }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false)

    // Si hay informacion en el informe, la almacena en formData, sino queda vacía
    const [formData, setFormData] = useState({
        id: informe ? informe.id_informe : "",
        estado: informe ? informe.estado : "",
        tipo: informe ? informe.tipo : "",
        fecha_presentacion: informe ? informe.fecha_presentacion : "",
        fecha_debe_presentar: informe ? informe.fecha_debe_presentar : "",
        id_version_proyecto_fk: informe ? informe.id_version_proyecto_fk.id_version_proyecto: "",
    })


    /* Carga las versiones de proyectos 
    const versionSeleccionada = versionesProyectos.find(versionesProyectos =>
        String(versionesProyectos.id_version_proyecto) === String(formData.idVersionProyecto)
    );
    const versionProyecto = versionSeleccionada ? versionSeleccionada.id_version_proyecto : "";*/

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
        formData.id_version_proyecto_fk = 1;
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
                                <img src={icono} alt="" width={'72px'} />
                            </div>
                        </div>
                        <div className="col-10 mb-0 text-center">
                            <h2 className="headerForm">
                                {mode === 1 ? "Agregar informe" : "Editar informe"}
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
                                    <label htmlFor="estado" className="label-personalizado mb-2">Estado <span className="required">*</span> </label>
                                    <select className="form-select seleccion" name="estado" id="estado" value={formData.estado} onChange={handleChange} required>
                                        <option value="" disabled defaultValue={""}>Seleccione un Estado</option>
                                        <option value="En desarrollo">En desarrollo</option>
                                        <option value="En evaluación">En evaluación</option>
                                        <option value="Concluido">Concluido</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="tipo" className="label-personalizado mb-2">Tipo <span className="required">*</span> </label>
                                    <select className="form-select seleccion" name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} required>
                                        <option value="" disabled defaultValue={""}>Seleccione un tipo</option>
                                        <option value="Primer parcial">Primer parcial</option>
                                        <option value="Segundo parcial">Segundo parcial</option>
                                        <option value="Tercer parcial">Tercer parcial</option>
                                        <option value="Final">Final</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="fecha_presentacion" className="label-personalizado mb-2">Fecha de presentación <span className="required">*</span> </label>
                                    <input type="date" className="form-control" name="fecha_presentacion" id="fecha_presentacion"    value={formData.fecha_presentacion ? new Date(formData.fecha_presentacion).toISOString().split('T')[0] : ""} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="fecha_debe_presentar" className="label-personalizado mb-2">Fecha que se debe presentar <span className="required">*</span></label>
                                <input type="date" className="form-control" name="fecha_debe_presentar" id="fecha_debe_presentar" value={formData.fecha_debe_presentar ? new Date(formData.fecha_debe_presentar).toISOString().split('T')[0] : ""} onChange={handleChange} required />
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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="informe" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="informe" />)}
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

InformesForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    academico: PropTypes.object,
}