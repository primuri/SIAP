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

export const OrganosColegiadosSesionesForm = ({ onSubmit, mode, sesion, onCancel, onDelete, organoColegiado }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false);
    const [convocatoriaFile, setConvocatoriaFile] = useState(null);
    const [actaFile, setActaFile] = useState(null);

    const [formData, setFormData] = useState({
        id_sesion: sesion ? sesion.id_sesion : "",
        id_acta_fk: sesion ? sesion.id_acta_fk : "",
        id_agenda_fk: sesion ? sesion.id_agenda_fk : "",
        fecha: sesion ? sesion.fecha : "",
        link_carpeta: sesion ? sesion.link_carpeta : "",
        medio: sesion ? sesion.medio : "",
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
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

    const handleFileChange = (event, obj) => {
        const file = event.target.files[0];
        
        if (obj === "acta") {
            setActaFile(file);
        } else if (obj === "convocatoria") {
            setConvocatoriaFile(file)
        }
    };

    const sendForm = (event) => {
        event.preventDefault();
        const combinedData = new FormData();
        if (actaFile) {
            combinedData.append('acta_file', actaFile);
        }
        if(convocatoriaFile){
            combinedData.append('convocatoria_file', actaFile);
        }
        combinedData.append('json', JSON.stringify(formData));
        onSubmit(combinedData);

        /*
        event.preventDefault();
        const jsonData = JSON.stringify(formData);
        onSubmit(sesion.id_sesion, jsonData);
        */
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
                                {mode === 1 ? "Agregar sesión" : "Editar sesión"}
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
                                    <label htmlFor="id_sesion" className="label-personalizado mb-2">Identificador</label>
                                    <input type="text" className="form-control" name="id_sesion" id="id_sesion" value={formData.id_sesion} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="quorum" className="label-personalizado mb-2">Fecha</label>
                                        <input type="date" className="form-control" name="fecha" id="fecha" value={formData.fecha ? new Date(formData.fecha).toISOString().split('T')[0] : ""} onChange={handleChange} />
                                    </div>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="numero_actas" className="label-personalizado mb-2">Número de acta</label>
                                    <input type="number" className="form-control" name="numero_actas" id="id_acta_fk.id_acta" value={formData.id_acta_fk.id_acta} onChange={handleChange} readOnly/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="documento_acta" className="label-personalizado mb-2">Documento del acta</label>
                                {mode === 1 ? <input type="file" className="form-control" name="documento_acta" id="id_acta_fk.id_documento_acta_fk"  onChange={(event) => handleFileChange(event, 'acta')} required />: 
                                <a href={"http://localhost:8000" + formData.id_acta_fk.id_documento_acta_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2 d-block">
                                {"Ver documento"}
                            </a>}
                            </div>
                        </div> 
          
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="medio" className="label-personalizado mb-2">Medio</label>
                                <input type="text" className="form-control" name="medio" id="medio" value={formData.medio} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="link_doc" className="label-personalizado mb-2">Enlace a la documentación</label>
                                    <input type="url" className="form-control" name="link_carpeta" id="link_carpeta" value={formData.link_carpeta} onChange={handleChange}/>
                                </div>
                            </div>
                        </div>       

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="tipo_agenda" className="label-personalizado mb-2">Tipo de agenda</label>
                                <select
                                className="form-control"
                                name="tipo_agenda"
                                id="id_agenda_fk.tipo"
                                value={formData.id_agenda_fk.tipo}
                                onChange={handleChange}
                                required
                                >
                                    <option value="">Selecciona un tipo</option>
                                    <option value="inicial">Inicial</option>
                                    <option value="modificacion">Modificación</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="detalle_agenda" className="label-personalizado mb-2">Detalle agenda</label>
                                    <input type="text" className="form-control" name="detalle_agenda" id="id_agenda_fk.detalle" value={formData.id_agenda_fk.detalle} onChange={handleChange}/>
                                </div>
                            </div>
                        </div>   
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="numero_actas" className="label-personalizado mb-2">Documento de la convocatoria</label>
                                    {mode === 1 ? <input type="file" className="form-control" name="documento_acta" id="id_acta_fk.id_documento_acta_fk" onChange={(event) => handleFileChange(event, 'convocatoria')} required /> : 
                                    <a href={"http://localhost:8000" + formData.id_agenda_fk.id_convocatoria_fk?.id_documento_convocatoria_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2 d-block">
                                    {"Ver documento"}
                                </a>}
                                </div>
                            </div>
                        </div>     

                        <div className="row mb-4">
                           
                        </div>           
                    </div>
                </div>
       
                <div className="modal-footer justify-content-center position-sticky bottom-0">
                    <div className="row">
                        <div className="col">
                            {mode === 1 ? (
                                <button id="boton-personalizado" type="submit" className='table-button border-0 p-20 rounded text-white'>Agregar</button>
                            ) : (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleEditClick} className='table-button border-0 p-2 rounded text-white'>Guardar</button>
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="sesión" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="sesión" />)}
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

OrganosColegiadosSesionesForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    sesion: PropTypes.object,
    organoColegiado: PropTypes.number.isRequired,
}