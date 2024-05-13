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

export const OrganosColegiadosSesionesForm = ({ onSubmit, mode, sesion, onCancel, onDelete, organoColegiado, rol }) => {
        const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
        const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
        const [fileData, setFileData] = useState(null);
        const [fileData2, setFileData2] = useState(null);
      
        const [formData, setFormData] = useState({
            id_sesion: sesion ? sesion.id_sesion: "",
            fecha: sesion ? sesion.fecha: "",
            medio: sesion ? sesion.medio: "",
            link_carpeta: sesion ? sesion.link_carpeta: "",
            id_agenda_fk: sesion ? sesion.id_agenda_fk: { 
                id_agenda: sesion ? sesion.id_agenda_fk.id_agenda: "",
                tipo: sesion ? sesion.id_agenda_fk.tipo: "",
                detalle: sesion ? sesion.id_agenda_fk.detalle: "", 
                id_convocatoria_fk: sesion && sesion.id_agenda_fk.id_convocatoria_fk ? sesion.id_agenda_fk.id_convocatoria_fk : { 
                    id_convocatoria: sesion && sesion.id_agenda_fk.id_convocatoria_fk ? sesion.id_agenda_fk.id_convocatoria_fk.id_convocatoria : "" , 
                    id_documento_convocatoria_fk: sesion && sesion.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk ? sesion.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk : {
                        id_documento: sesion && sesion.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk ? sesion.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.id_documento: "", 
                        tipo: sesion && sesion.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk ? sesion.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.tipo: "Agenda Sesion", 
                        detalle: sesion && sesion.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk ? sesion.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.detalle: "Agenda Convocatoria", 
                        documento: sesion && sesion.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk ? sesion.id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.documento: "" 
                    }
                }
            },
            id_acta_fk: sesion ? sesion.id_acta_fk: {
                id_acta: sesion ? sesion.id_acta_fk.id_acta: "",
                id_documento_acta_fk: sesion && sesion.id_acta_fk.id_documento_acta_fk ? sesion.id_acta_fk.id_documento_acta_fk : { 
                    id_documento: sesion && sesion.id_acta_fk.id_documento_acta_fk ? sesion.id_acta_fk.id_documento_acta_fk.id_documento: "", 
                    tipo: sesion && sesion.id_acta_fk.id_documento_acta_fk ? sesion.id_acta_fk.id_documento_acta_fk.tipo: "Acta Sesion", 
                    detalle: sesion && sesion.id_acta_fk.id_documento_acta_fk ? sesion.id_acta_fk.id_documento_acta_fk.detalle: "", 
                    documento: sesion && sesion.id_acta_fk.id_documento_acta_fk ? sesion.id_acta_fk.id_documento_acta_fk.documento: "" 
                }
            },
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

     const sendForm = (event) => {
        event.preventDefault();
        const combinedData = new FormData();

        if (fileData) {
            combinedData.append('id_agenda_fk.id_convocatoria_fk.id_documento_convocatoria_fk.documento', fileData);
        }

        if (fileData2) {
            combinedData.append('id_acta_fk.id_documento_acta_fk.documento', fileData2);
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
        
        
        const handleFileChange = (event) => {
            const { id, files } = event.target;
            const file = files[0]; 
        
            if (!file) return;  
            if (id === "id_agenda_fk.id_convocatoria_fk?.id_documento_convocatoria_fk.documento") {
                setFileData(file); 
            } else if (id === "id_acta_fk.id_documento_acta_fk.documento") {
                setFileData2(file); 
            }
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
                                {rol === "administrador" && (
                                    <span>
                                        {mode === 1 ? "Agregar sesión" : "Editar sesión"}
                                    </span>
                                )}
                                {rol === "invitado" && (
                                    <span>
                                        Sesión
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
                                    <label htmlFor="id_sesion" className="label-personalizado mb-2">Identificador</label>
                                    <input type="text" className="form-control" name="id_sesion" id="id_sesion" value={formData.id_sesion} onChange={handleChange} readOnly = {mode === 2} disabled={rol === "invitado"}/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="fecha" className="label-personalizado mb-2">Fecha</label>
                                        <input type="date" className="form-control" name="fecha" id="fecha" value={formData.fecha ? new Date(formData.fecha).toISOString().split('T')[0] : ""} onChange={handleChange} required disabled={rol === "invitado"}/>
                                    </div>
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="id_acta_fk.id_documento_acta_fk.detalle" className="label-personalizado mb-2">Detalle de acta</label>
                                    <input type="text" className="form-control" name="id_acta_fk.id_documento_acta_fk.detalle" id="id_acta_fk.id_documento_acta_fk.detalle" value={formData.id_acta_fk.id_documento_acta_fk.detalle} onChange={handleChange} required disabled={rol === "invitado"}/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="documento_acta" className="label-personalizado mb-2">Documento del acta</label>
                                <input type="file" className="form-control" name="id_acta_fk.id_documento_acta_fk.documento" id="id_acta_fk.id_documento_acta_fk.documento"  onChange={handleFileChange} required disabled={rol === "invitado"}/>
                                {mode === 2 ? (
                                    <Tooltip title={formData.id_acta_fk.id_documento_acta_fk.documento.split('/').pop()} placement="right-start">
                                    <a href={"http://localhost:8000" + formData.id_acta_fk.id_documento_acta_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2" >
                                        {"Ver documento"}
                                    </a>
                                </Tooltip>
                            ): ""}
                            </div>
                        </div> 
          
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="medio" className="label-personalizado mb-2">Medio</label>
                                <input type="text" className="form-control" name="medio" id="medio" value={formData.medio} onChange={handleChange} required disabled={rol === "invitado"}/>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="link_carpeta" className="label-personalizado mb-2">Enlace a la documentación</label>
                                    <input type="text" className="form-control" name="link_carpeta" id="link_carpeta" value={formData.link_carpeta} onChange={handleChange} disabled={rol === "invitado"}/>
                                </div>
                            </div>
                        </div>       

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="id_agenda_fk.tipo" className="label-personalizado mb-2" >Tipo de agenda </label >
                                <select
                                
                                className="form-control"
                                name="id_agenda_fk.tipo"
                                id="id_agenda_fk.tipo"
                                value={formData.id_agenda_fk.tipo}
                                onChange={handleChange}
                                required 
                                disabled={rol === "invitado"}
                                >
                                    <option value="">Selecciona un tipo</option>
                                    <option value="inicial">Inicial</option>
                                    <option value="modificacion">Modificación</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="id_agenda_fk.detalle" className="label-personalizado mb-2">Detalle agenda</label>
                                    <input type="text" className="form-control" name="id_agenda_fk.detalle" id="id_agenda_fk.detalle" value={formData.id_agenda_fk.detalle} onChange={handleChange} disabled={rol === "invitado"}/>
                                </div>
                            </div>
                        </div>   
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="doc_convocatoria" className="label-personalizado mb-2">Documento de la convocatoria</label>
                                    <input disabled={rol === "invitado"} type="file" className="form-control" name="id_agenda_fk.id_convocatoria_fk?.id_documento_convocatoria_fk.documento" id="id_agenda_fk.id_convocatoria_fk?.id_documento_convocatoria_fk.documento" onChange={handleFileChange} required />
                                    {mode === 2 ? ( 
                                        <Tooltip title={formData.id_agenda_fk.id_convocatoria_fk?.id_documento_convocatoria_fk.documento.split('/').pop()} placement="right-start">
                                        <a href={"http://localhost:8000" + formData.id_agenda_fk.id_convocatoria_fk?.id_documento_convocatoria_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2" >
                                            {"Descargar documento"}
                                        </a>
                                    </Tooltip>
                                ): ""}
                                </div>
                            </div>
                        </div>     

                        <div className="row mb-4">
                           
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
              )}
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