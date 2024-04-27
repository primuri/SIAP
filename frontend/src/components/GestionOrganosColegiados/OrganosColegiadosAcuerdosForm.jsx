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
//3 documentos -> id_oficio_fk es un documentos con id, ruta_archivo y detalle. id_seguimiento_fk es id_seguimiento, id_documento_seguimiento_fk(detalle, tipo, documento) y id_documento_acuerdo_fk -> tipo, detalle y documento.
export const OrganosColegiadosAcuerdosForm = ({ onSubmit, mode, acuerdo, onCancel, onDelete, sesion }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false);
    const [oficioFile, setOficioFile] = useState(null);
    const [seguimientoFile, setSeguimientoFile] = useState(null);
    const [acuerdoFile, setAcuerdoFile] = useState(null);

    const [formData, setFormData] = useState({
        id_acuerdo: acuerdo ? acuerdo.id_acuerdo : "",
        descripcion: acuerdo ? acuerdo.descripcion : "",
        estado: acuerdo ? acuerdo.estado : "",
        fecha_cumplimiento: acuerdo ? acuerdo.fecha_cumplimiento : "",
        encargado: acuerdo ? acuerdo.encargado : "",
        id_seguimiento_fk: acuerdo ? acuerdo.id_seguimiento_fk : "",
        id_oficio_fk: acuerdo ?  acuerdo.id_oficio_fk : "",
        id_sesion_fk: acuerdo ? acuerdo.id_oficio_fk : sesion,
    })
 
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        if (name === 'numero_miembros' || name === 'quorum' || name === 'acuerdo_firme') {
            // Verifica si es un número válido y positivo
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
        
        if (obj === "oficio") {
            setOficioFile(file)
        } else if (obj === "seguimiento") {
            setSeguimientoFile(file)
        }else if (obj === "acuerdo"){
            setAcuerdoFile(file)
        }
    };

    const sendForm = (event) => {
        
        event.preventDefault();
        const combinedData = new FormData();
        if (oficioFile) {
            combinedData.append('oficio_file', oficioFile);
        }
        if(seguimientoFile){
            combinedData.append('seguimiento_file', seguimientoFile);
        }
        if(acuerdoFile){
            combinedData.append('acuerdo_file', acuerdoFile);
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
                                    {mode == 2 ?  
                                        (<>
                                            <label htmlFor="id_acuerdo" className="label-personalizado mb-2">Identificador</label>
                                            <input type="text" className="form-control" name="id_acuerdo" id="id_acuerdo" value={formData.id_acuerdo} onChange={handleChange} />
                                        </>) 
                                    : "" }
                                </div>
                            </div>
                            <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="descripcion" className="label-personalizado mb-2">Descripción</label>
                                        <input type="date" className="form-control" name="descripcion" id="descripcion" value={formData.descripcion} onChange={handleChange} />
                                    </div>
                            </div>
                        </div>
                        <div className="row mb-4">
                        <div className="col-md-6">
                                <label htmlFor="estado" className="label-personalizado mb-2">Estado</label>
                                <select
                                className="form-control"
                                name="estado"
                                id="id_agenda_fk.tipo"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                                >
                                    <option value="">Selecciona un estado</option>
                                    <option value="tramitado">Tramitado</option>
                                    <option value="en_tramite">En trámite</option>
                                    <option value="no_tramite">No requiere trámite</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="fecha_cumplimiento" className="label-personalizado mb-2">Fecha cumplimiento</label>
                                <input type="date" className="form-control" name="fecha_cumplimiento" id="fecha_cumplimiento" value={formData.fecha_cumplimiento} onChange={handleChange} required />
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
                                <label htmlFor="documento_acta" className="label-personalizado mb-2">Documento Acta</label>
                                {mode === 1 ? <input type="file" className="form-control" name="documento_acta" id="id_acta_fk.id_documento_acta_fk"  onChange={(event) => handleFileChange(event, 'acta')} required />: 
                                <a href={"http://localhost:8000" + formData.id_acta_fk.id_documento_acta_fk.documento} target="blank_" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2 d-block">
                                {"Ver documento"}
                            </a>}
                            </div>
                        </div>       

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="detalle_agenda" className="label-personalizado mb-2">Detalle agenda</label>
                                    <input type="text" className="form-control" name="detalle_agenda" id="id_agenda_fk.detalle" value={formData.id_agenda_fk.detalle} onChange={handleChange}/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="tipo_agenda" className="label-personalizado mb-2">Tipo agenda</label>
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
                        </div>   
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="numero_actas" className="label-personalizado mb-2">Documento convocatoria</label>
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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="órgano colegiado" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="órgano colegiado" />)}
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

OrganosColegiadosAcuerdosForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    acuerdo: PropTypes.object,
    sesion: PropTypes.number.isRequired,
}