import { useState } from "react";
import PropTypes from 'prop-types';
import icono from '../../assets/person-i.png';
import { Confirmar } from '../../utils/Confirmar'


export const ProyectosForm = ({ onSubmit, mode, proyecto, onCancel, onDelete, id_codigo }) => {
    // Cargar informacion
    const [fileData, setFileData] = useState(null);
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [formData, setFormData] = useState({
        id_version_proyecto: proyecto ? proyecto.id_version_proyecto : "",
        id_oficio_fk: proyecto ? proyecto.id_oficio_fk : {
            id_oficio: proyecto && proyecto.id_oficio_fk ? proyecto.id_oficio_fk.id_oficio : "",
            ruta_archivo: proyecto && proyecto.id_oficio_fk ? proyecto.id_oficio_fk.ruta_archivo : "",
            detalle: proyecto && proyecto.id_oficio_fk ? proyecto.id_oficio_fk.detalle : ""
        },
        id_vigencia_fk: proyecto ? proyecto.id_vigencia_fk : {
            id_vigencia: proyecto && proyecto.id_vigencia_fk ? proyecto.id_vigencia_fk.id_vigencia : "",
            fecha_inicio: proyecto && proyecto.id_vigencia_fk ? proyecto.id_vigencia_fk.fecha_inicio : "",
            fecha_fin: proyecto && proyecto.id_vigencia_fk ? proyecto.id_vigencia_fk.fecha_fin : ""
        },
        id_codigo_vi_fk: proyecto ? proyecto.id_codigo_vi_fk : {
            id_codigo_vi: proyecto && proyecto.id_codigo_vi_fk ? proyecto.id_codigo_vi_fk.id_codigo_vi : id_codigo,
            nombre: proyecto && proyecto.nombre ? proyecto.id_codigo_vi_fk.nombre : "",
        },
        detalle: proyecto ? proyecto.detalle : "",
        numero_version: proyecto ? proyecto.numero_version : ""
    });
    

    
    //Este handleChange acepta hasta 4 grados de anidacion
    const handleChange = (event) => {
        const { name, value } = event.target;

        const keys = name.split('.');
        switch (keys.length) {
            case 1:
                setFormData(prev => ({ ...prev, [keys[0]]: value }));
                break;
            case 2:
                setFormData(prev => ({
                    ...prev,
                    [keys[0]]: {
                        ...prev[keys[0]],
                        [keys[1]]: value
                    }
                }));
                break;
            case 3:
                setFormData(prev => ({
                    ...prev,
                    [keys[0]]: {
                        ...prev[keys[0]],
                        [keys[1]]: {
                            ...prev[keys[0]][keys[1]],
                            [keys[2]]: value
                        }
                    }
                }));
                break;
            case 4:
                // Verificación de la fecha (Solución de IA)
                if (keys[3] === 'fecha_inicio' || keys[3] === 'fecha_fin') {
                    const startDate = keys[3] === 'fecha_inicio' ? value : formData[keys[0]][keys[1]][keys[2]].fecha_inicio;
                    const endDate = keys[3] === 'fecha_fin' ? value : formData[keys[0]][keys[1]][keys[2]].fecha_fin;

                    if (new Date(endDate) < new Date(startDate)) {
                        return;
                    }
                }

                setFormData(prev => ({
                    ...prev,
                    [keys[0]]: {
                        ...prev[keys[0]],
                        [keys[1]]: {
                            ...prev[keys[0]][keys[1]],
                            [keys[2]]: {
                                ...prev[keys[0]][keys[1]][keys[2]],
                                [keys[3]]: value
                            }
                        }
                    }
                }));
                break;
            default:
                console.error("Anidacion fuera de rango");
        }
    };


    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileData(file);
    };

    const sendForm = (event) => {
        event.preventDefault();

        const combinedData = new FormData();
        if (fileData) {
            combinedData.append('ruta_archivo', fileData);
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
        <>
            <div className="modal-header pb-0 position-sticky top-0">
                <div className="text-center">
                    <div className="img-space">
                        <img src={icono} alt="" width={'72px'} />
                    </div>
                </div>
                <div className="text-center" style={{ marginLeft: '3.5vw' }}>
                    <h2>{mode === 1 ? ("Agregar un proyecto") : ("Editar proyecto")}</h2>
                </div>
                <div>
                    <button type="button" onClick={onCancel} className="close" data-dismiss="modal">
                        <span aria-hidden="true" className="close-icon">&times;</span>
                    </button>
                </div>
            </div>
            
            <form onSubmit={sendForm} className='d-flex flex-column' encType="multipart/form-data">
                <div className="modal-body" style={{ padding: '3vh 4vw' }}>
                    <div className="container">

                    <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="id_codigo_vi" className="label-personalizado mb-2">Código VI</label>
                                <input type="text" className="form-control disabled-input" name="id_codigo_vi_fk.id_codigo_vi" id="id_codigo_vi_fk.id_codigo_vi" value={mode === 2 ? formData.id_codigo_vi_fk.id_codigo_vi: id_codigo} onChange={handleChange} disabled={true} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="nombre" className="label-personalizado mb-2">Nombre</label>
                                <input type="text" className="form-control disabled-input" name="id_codigo_vi_fk.nombre" id="id_codigo_vi_fk.id_codigo_cimpa_fk.nombre" value={mode === 2 ? formData.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre: "Auto - generado"} onChange={handleChange} disabled={true} />
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="numero_version" className="label-personalizado mb-2">Versión <span className="required">*</span> </label>
                                <input type="text" className="form-control" name="numero_version" id="numero_version" onChange={handleChange} value={formData.numero_version} required />
                            </div>
                            <div className="col-md-6">
                            <label htmlFor="detalle" className="label-personalizado mb-2">Detalle <span className="required">*</span> </label>
                                <input type="text" className="form-control" name="detalle" id="detalle" onChange={handleChange} value={formData.detalle} required />
                            </div>
                        </div>
            
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="fecha_inicio" className="label-personalizado mb-2">Fecha de inicio </label>
                                <input type="date" className="form-control" name="id_vigencia_fk.fecha_inicio"
                                    id="id_vigencia_fk.fecha_inicio"
                                    value={formData.id_vigencia_fk.fecha_inicio
                                        ? new Date(formData.id_vigencia_fk.fecha_inicio).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>

                            <div className="col">
                                <label htmlFor="fecha_fin" className="label-personalizado mb-2">Fecha finalización</label>
                                <input type="date" className="form-control"
                                    name="id_vigencia_fk.fecha_fin"
                                    id="id_vigencia_fk.fecha_fin"
                                    value={formData.id_vigencia_fk.fecha_fin
                                        ? new Date(formData.id_vigencia_fk.fecha_fin).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="id_oficio_fk.ruta_archivo" className="label-personalizado mb-2">Oficio <span className="required">*</span> </label>
                                <input type="file" className="form-control" name="id_oficio_fk.ruta_archivo" id="id_oficio_fk.ruta_archivo" onChange={handleFileChange}
                                    required={mode == 1 ? true : ''} />
                                {mode == 2 ? (
                                    <a href={formData.id_oficio_fk.ruta_archivo} target="blank_"
                                        className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                        {formData.id_oficio_fk.ruta_archivo.split('/').pop()}
                                    </a>
                                )
                                    : ""}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="id_oficio_fk.detalle" className="label-personalizado mb-2">Detalle del Oficio <span className="required">* </span> </label>
                                <input type="text" className="form-control" name="id_oficio_fk.detalle" id="id_oficio_fk.detalle" value={formData.id_oficio_fk.detalle} onChange={handleChange} required />
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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="propuesta" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="propuesta" />)}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

ProyectosForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    proyecto: PropTypes.object,
    id_codigo: PropTypes.object
};