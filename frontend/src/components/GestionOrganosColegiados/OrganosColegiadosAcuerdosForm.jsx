import { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { FormularioDinamico } from "../../utils/FomularioDinamico"
import { toast, Toaster } from 'react-hot-toast'
import icono from '../../assets/document.svg';
import icono2 from '../../assets/upload_doc.svg'
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Confirmar } from '../../utils/Confirmar'
import Tooltip from '@mui/material/Tooltip';
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
const filter = createFilterOptions();
export const OrganosColegiadosAcuerdosForm = ({ onSubmit, mode, acuerdo, onCancel, onDelete, sesion, rol }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [oficioFile, setOficioFile] = useState(null);
    const [seguimientoFile, setSeguimientoFile] = useState(null);
    const [acuerdoFile, setAcuerdoFile] = useState(null);
    const [selectedFileNameAcuerdo, setSelectedFileNameAcuerdo] = useState('');
    const [selectedFileNameOficio, setSelectedFileNameOficio] = useState('');
    const [selectedFileNameSeguimiento, setSelectedFileNameSeguimiento] = useState('');

    const [formData, setFormData] = useState({
        id_acuerdo: acuerdo ? acuerdo.id_acuerdo: "",
        descripcion: acuerdo ? acuerdo.descripcion : "",
        estado: acuerdo ? acuerdo.estado : "",
        fecha_cumplimiento: acuerdo ? acuerdo.fecha_cumplimiento : "",
        encargado: acuerdo ? acuerdo.encargado : "",
        id_seguimiento_fk: acuerdo ? acuerdo.id_seguimiento_fk: {
            id_seguimiento: acuerdo ? acuerdo.id_seguimiento_fk.id_seguimiento: "",
            id_documento_seguimiento_fk: acuerdo && acuerdo.id_seguimiento_fk.id_documento_seguimiento_fk ? acuerdo.id_seguimiento_fk.id_documento_seguimiento_fk: {
                id_documento: acuerdo && acuerdo.id_seguimiento_fk.id_documento_seguimiento_fk ? acuerdo && acuerdo.id_seguimiento_fk.id_documento_seguimiento_fk.id_documento: "", 
                tipo: acuerdo && acuerdo.id_seguimiento_fk.id_documento_seguimiento_fk ? acuerdo && acuerdo.id_seguimiento_fk.id_documento_seguimiento_fk.tipo: "Seguimiento", 
                detalle: acuerdo && acuerdo.id_seguimiento_fk.id_documento_seguimiento_fk ? acuerdo && acuerdo.id_seguimiento_fk.id_documento_seguimiento_fk.detalle: "Documento seguimiento", 
                documento: acuerdo && acuerdo.id_seguimiento_fk.id_documento_seguimiento_fk ? acuerdo && acuerdo.id_seguimiento_fk.id_documento_seguimiento_fk.documento: "" 
            }
            
        },
        id_oficio_fk: acuerdo ? acuerdo.id_oficio_fk: {
            id_oficio: acuerdo ? acuerdo.id_oficio_fk.id_oficio: "",
            ruta_archivo: acuerdo ? acuerdo.id_oficio_fk.ruta_archivo: "",
            detalle: acuerdo ? acuerdo.id_oficio_fk.detalle: ""
        },
        id_documento_acuerdo_fk: acuerdo ? acuerdo.id_documento_acuerdo_fk: {
            id_documento: acuerdo ? acuerdo.id_documento_acuerdo_fk.id_documento: "",
            tipo: acuerdo ? acuerdo.id_documento_acuerdo_fk.tipo: "Acuerdo", 
            detalle: acuerdo ? acuerdo.id_documento_acuerdo_fk.detalle: "Documento acuerdo", 
            documento: acuerdo ? acuerdo.id_documento_acuerdo_fk.documento: "" 
        }

       
    });
 
    useEffect(() => {
    }, [sesion])
  
    const handleChange = (event) => {

        if (rol === "invitado") {
            return;
        }

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        setFormData(prevFormData => {

            const setNestedData = (path, value, obj) => {
                let levels = path.split('.');
                let lastLevel = levels.pop();
                let depth = levels.reduce((o, level) => {
                    if (!o[level]) o[level] = {};
                    return o[level];
                }, obj);
                depth[lastLevel] = value;
            };
    
            const updatedFormData = {...prevFormData};
    
            setNestedData(name, value, updatedFormData);
    
            return updatedFormData;
        });
    };


    const handleFileChange = (event) => {
        const { id, files } = event.target;
        const file = files[0]; 
    
        if (!file) return;  
        if (id === "id_seguimiento_fk.id_documento_seguimiento_fk.documento") {
            setSelectedFileNameSeguimiento(file.name);
            setSeguimientoFile(file); 
        } else if (id === "id_documento_acuerdo_fk.documento") {
            setSelectedFileNameAcuerdo(file.name);
            setAcuerdoFile(file); 
        } else if(id === "id_oficio_fk.ruta_archivo"){
            setSelectedFileNameOficio(file.name);
            setOficioFile(file);
        }
    };

    const sendForm = (event) => {
        event.preventDefault();
        const combinedData = new FormData();

        if (seguimientoFile) {
            combinedData.append('id_seguimiento_fk.id_documento_seguimiento_fk.documento', seguimientoFile);
        }

        if (acuerdoFile) {
            combinedData.append('id_documento_acuerdo_fk.documento', acuerdoFile);
        }

        if(oficioFile){
            combinedData.append('id_oficio_fk.ruta_archivo', oficioFile);
        }

        combinedData.append('json', JSON.stringify(formData));
        onSubmit(combinedData);
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
                                <img src={icono} />
                            </div>
                        </div>
                        <div className="col-10 mb-0 text-center">
                            <h2 className="headerForm">
                                {rol === "administrador" && (
                                    <span>
                                        {mode === 1 ? "Agregar acuerdo" : "Editar acuerdo"}
                                    </span>
                                )}
                                {rol === "invitado" && (
                                    <span>
                                        Acuerdo
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
                            {mode == 2 ?  
                                (<>
                                    <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="id_acuerdo" className="label-personalizado mb-2">Identificador</label>
                                        <input type="text" className="form-control" name="id_acuerdo" id="id_acuerdo" value={formData.id_acuerdo} onChange={handleChange} readOnly = {mode === 2} disabled={rol === "invitado"}/>
                                    </div>
                                </div>
                                </>) 
                            : "" }
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                                    <div className="form-group">
                                        <label htmlFor="descripcion" className="label-personalizado mb-2">Descripción</label>
                                        <textarea className="form-control" name="descripcion" id="descripcion" value={formData.descripcion} onChange={handleChange} required disabled={rol === "invitado"}/>
                                    </div>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                    <label htmlFor="estado" className="label-personalizado mb-2">Estado</label>
                                    <select
                                    disabled={rol === "invitado"}
                                    className="form-control"
                                    name="estado"
                                    id="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    required
                                    >
                                        <option value="">Selecciona un estado</option>
                                        <option value="Tramitado">Tramitado</option>
                                        <option value="En tramite">En trámite</option>
                                        <option value="No tramite">No requiere trámite</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="fecha_cumplimiento" className="label-personalizado mb-2">Fecha cumplimiento</label>
                                    <input type="date" className="form-control" name="fecha_cumplimiento" id="fecha_cumplimiento" value={formData.fecha_cumplimiento} onChange={handleChange} required disabled={rol === "invitado"}/>
                                </div>
                        </div> 
             

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="encargado" className="label-personalizado mb-2">Encargado</label>
                                    <input type="text" className="form-control" name="encargado" id="encargado" value={formData.encargado} onChange={handleChange} required disabled={rol === "invitado"}/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="id_seguimiento_fk.id_documento_seguimiento_fk.documento" className="label-personalizado mb-2" style={{ display: 'block' }}>
                                    Documento del seguimiento
                                </label>
                                <input
                                    type="file"
                                    className={rol === "invitado" ? "form-control disabled-input" : "form-control"}
                                    name="id_seguimiento_fk.id_documento_seguimiento_fk.documento"
                                    id="id_seguimiento_fk.id_documento_seguimiento_fk.documento"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    required
                                    disabled={rol === "invitado"}
                                />
                                <label htmlFor="id_seguimiento_fk.id_documento_seguimiento_fk.documento" style={{ cursor: 'pointer', display: 'block' }}>
                                    {selectedFileNameSeguimiento ? (
                                        <span>Nombre del archivo: {selectedFileNameSeguimiento}</span>
                                    ) : (
                                        <div className="file-upload-icon-container">
                                            <img src={icono2} alt="Seleccionar archivo" className="file-upload-icon" />
                                        </div>
                                    )}
                                </label>
                                {mode === 2 && formData.id_seguimiento_fk.id_documento_seguimiento_fk?.documento && (
                                    <Tooltip title={formData.id_seguimiento_fk.id_documento_seguimiento_fk.documento.split('/').pop()} placement="right-start">
                                        <a
                                            href={"http://localhost:8000" + formData.id_seguimiento_fk.id_documento_seguimiento_fk.documento}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
                                        >
                                            Ver seguimiento
                                        </a>
                                    </Tooltip>
                                )}
                            </div>
                        </div>           
                        <div className="row mb-4">            
                            <div className="col-md-6">
                                <label htmlFor="id_documento_acuerdo_fk.documento" className="label-personalizado mb-2" style={{ display: 'block' }}>
                                    Documento del acuerdo
                                </label>
                                <input
                                    type="file"
                                    className={rol === "invitado" ? "form-control disabled-input" : "form-control"}
                                    name="id_documento_acuerdo_fk.documento"
                                    id="id_documento_acuerdo_fk.documento"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    required
                                    disabled={rol === "invitado"}
                                />
                                <label htmlFor="id_documento_acuerdo_fk.documento" style={{ cursor: 'pointer', display: 'block' }}>
                                    {selectedFileNameAcuerdo ? (
                                        <span>Nombre del archivo: {selectedFileNameAcuerdo}</span>
                                    ) : (
                                        <div className="file-upload-icon-container">
                                            <img src={icono2} alt="Seleccionar archivo" className="file-upload-icon" />
                                        </div>
                                    )}
                                </label>
                                {mode === 2 && formData.id_documento_acuerdo_fk?.documento && (
                                    <Tooltip title={formData.id_documento_acuerdo_fk.documento.split('/').pop()} placement="right-start">
                                        <a
                                            href={"http://localhost:8000" + formData.id_documento_acuerdo_fk.documento}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
                                        >
                                            Ver acuerdo
                                        </a>
                                    </Tooltip>
                                )}
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="detalle_oficio" className="label-personalizado mb-2">Detalle oficio</label>
                                    <input type="text" className="form-control" name="id_oficio_fk.detalle" id="id_oficio_fk.detalle" value={formData.id_oficio_fk.detalle} onChange={handleChange}  required disabled={rol === "invitado"}/>
                                </div>
                            </div>
                        </div> 
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="id_oficio_fk.ruta_archivo" className="label-personalizado mb-2" style={{ display: 'block' }}>
                                    Documento del oficio
                                </label>
                                <input
                                    type="file"
                                    className={rol === "invitado" ? "form-control disabled-input" : "form-control"}
                                    name="id_oficio_fk.ruta_archivo"
                                    id="id_oficio_fk.ruta_archivo"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    required
                                    disabled={rol === "invitado"}
                                />
                                <label htmlFor="id_oficio_fk.ruta_archivo" style={{ cursor: 'pointer', display: 'block' }}>
                                    {selectedFileNameOficio ? (
                                        <span>Nombre del archivo: {selectedFileNameOficio}</span>
                                    ) : (
                                        <div className="file-upload-icon-container">
                                            <img src={icono2} alt="Seleccionar archivo" className="file-upload-icon" />
                                        </div>
                                    )}
                                </label>
                                {mode === 2 && formData.id_oficio_fk?.ruta_archivo && (
                                    <Tooltip title={formData.id_oficio_fk.ruta_archivo.split('/').pop()} placement="right-start">
                                        <a
                                            href={"http://localhost:8000" + formData.id_oficio_fk.ruta_archivo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
                                        >
                                            Ver oficio
                                        </a>
                                    </Tooltip>
                                )}
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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="acuerdo" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="acuerdo" />)}
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

OrganosColegiadosAcuerdosForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    acuerdo: PropTypes.object,
    sesion: PropTypes.number.isRequired,
}