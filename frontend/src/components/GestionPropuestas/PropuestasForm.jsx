import { useState } from "react";
import PropTypes from 'prop-types';
import icono from '../../assets/person-i.png';
import { Confirmar } from '../../utils/Confirmar'


export const PropuestasForm = ({ onSubmit, mode, propuesta, onCancel, onDelete, academicos }) => {
    // Cargar informacion
    const [fileData, setFileData] = useState(null);
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);

    const [formData, setFormData] = useState({
        id_documentos_asociados: propuesta ? propuesta.id_documentos_asociados : "",
        detalle: propuesta ? propuesta.detalle : "",
        documento: propuesta ? propuesta.documento : "",
        id_codigo_cimpa_fk: propuesta ? propuesta.id_codigo_cimpa_fk : {
            nombre: propuesta ? propuesta.id_codigo_cimpa_fk.nombre : "",
            objetivo_general: propuesta ? propuesta.id_codigo_cimpa_fk.objetivo_general : "",
            estado: propuesta ? propuesta.id_codigo_cimpa_fk.estado : "",
            actividad: propuesta ? propuesta.id_codigo_cimpa_fk.actividad : "",
            fecha_vigencia: propuesta ? propuesta.id_codigo_cimpa_fk.fecha_vigencia : "",
            descripcion: propuesta ? propuesta.id_codigo_cimpa_fk.descripcion : "",
            id_codigo_cimpa: propuesta ? propuesta.id_codigo_cimpa_fk.id_codigo_cimpa : "00-0000",
            id_colaborador_principal_fk: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk : {
                tipo: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.tipo : "Principal",
                estado: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.estado : "",
                carga: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.carga : "",
                id_vigencia_fk: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk : {
                    fecha_inicio: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio : "",
                    fecha_fin: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin : ""
                },
                id_academico_fk: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk : {
                    id_academico: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_academico : ""
                }
            }
        }
    });

    //Carga los academicos para cargarlos en el Editar
    const academicoSeleccionado = academicos.find(academico =>
        String(academico.id_academico) === String(formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_academico)
    );
    const nombreAcademico = academicoSeleccionado ? academicoSeleccionado.id_nombre_completo_fk.nombre : "";
    const apellidoAcademico = academicoSeleccionado ? academicoSeleccionado.id_nombre_completo_fk.apellido : "";
    const segundo_apellidoAcademico = academicoSeleccionado ? academicoSeleccionado.id_nombre_completo_fk.segundo_apellido : "";

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
            combinedData.append('documento', fileData);
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
                    <h2>{mode == 1 ? ("Agregar una propuesta") : ("Editar propuesta")}</h2>
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
                                <label htmlFor="codigoCimpa" className="label-personalizado mb-2">Código CIMPA</label>
                                <input type="text" className="form-control disabled-input" name="id_codigo_cimpa_fk.id_codigo_cimpa" id="id_codigo_cimpa_fk.id_codigo_cimpa" value={mode === 2 ? formData.id_codigo_cimpa_fk.id_codigo_cimpa : "Auto - generado"} onChange={handleChange} disabled={true} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="nombre" className="label-personalizado mb-2">Nombre <span className="required">*</span> </label>
                                <input type="text" className="form-control" name="id_codigo_cimpa_fk.nombre" id="id_codigo_cimpa_fk.nombre" value={formData.id_codigo_cimpa_fk.nombre} onChange={handleChange} required />
                            </div>
                        </div>


                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="estado" className="label-personalizado mb-2">Estado Propuesta <span className="required">*</span> </label>
                                <select className="form-select seleccion " name="id_codigo_cimpa_fk.estado" id="id_codigo_cimpa_fk.estado" value={formData.id_codigo_cimpa_fk.estado} onChange={handleChange} required>
                                    <option value="">Seleccionar estado</option>
                                    <option value="Aprobada">Aprobada</option>
                                    <option value="En desarrollo">En desarrollo</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="id_codigo_cimpa_fk.fecha_vigencia" className="label-personalizado mb-2">Fecha<span className="required">*</span> </label>
                                <input type="date" className="form-control" name="id_codigo_cimpa_fk.fecha_vigencia" id="id_codigo_cimpa_fk.fecha_vigencia" value={formData.id_codigo_cimpa_fk.fecha_vigencia ? new Date(formData.id_codigo_cimpa_fk.fecha_vigencia).toISOString().split('T')[0] : ""} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="descripcion" className="label-personalizado mb-2">Descripción <span className="required">*</span> </label>
                                <textarea className="form-control" name="id_codigo_cimpa_fk.descripcion" id="id_codigo_cimpa_fk.descripcion" value={formData.id_codigo_cimpa_fk.descripcion} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="actividad" className="label-personalizado mb-2">Actividad <span className="required">*</span> </label>
                                <select className="form-select seleccion" name="id_codigo_cimpa_fk.actividad" id="id_codigo_cimpa_fk.actividad" value={formData.id_codigo_cimpa_fk.actividad} onChange={handleChange} required>
                                    <option value="">Seleccionar actividad</option>
                                    <option value="Acción social">Acción social</option>
                                    <option value="Investigación">Investigación</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">

                                <label htmlFor="detalle" className="label-personalizado mb-2">Objetivo General</label>
                                <textarea className="form-control" name="id_codigo_cimpa_fk.objetivo_general" id="id_codigo_cimpa_fk.objetivo_general" value={formData.id_codigo_cimpa_fk.objetivo_general} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk" className="label-personalizado mb-2">Colaborador(a) principal <span className="required">*</span> </label>
                                <select className="form-select seleccion"
                                    name="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_academico"
                                    id="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_academico"
                                    value={formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk} onChange={handleChange}>
                                    <option value="">
                                        {mode === 1 && nombreAcademico.length === 0 ? "Seleccionar colaborador" : nombreAcademico + " " + apellidoAcademico + " " + segundo_apellidoAcademico}
                                    </option>
                                    {academicos && academicos.length > 0 && academicos.map(academico => (
                                        <option key={academico.id_academico} value={academico.id_academico}>
                                            {academico.id_nombre_completo_fk.nombre + " " + academico.id_nombre_completo_fk.apellido + " " + academico.id_nombre_completo_fk.segundo_apellido}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="row mb-5">
                            <div className="col-md-6">
                                <label htmlFor="estadoColaborador" className="label-personalizado mb-2">Estado Colaborador(a) <span className="required">*</span> </label>
                                <select className="form-select seleccion" name="id_codigo_cimpa_fk.id_colaborador_principal_fk.estado" id="id_codigo_cimpa_fk.id_colaborador_principal_fk.estado" value={formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.estado} onChange={handleChange} required>
                                    <option value="">Seleccionar estado</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="cargaColaborador" className="label-personalizado mb-2">Carga colaborador(a) <span className="required">*</span> </label>
                                <select className="form-select seleccion" name="id_codigo_cimpa_fk.id_colaborador_principal_fk.carga" id="id_codigo_cimpa_fk.id_colaborador_principal_fk.carga" value={formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.carga} onChange={handleChange} required>
                                    <option value="">Seleccionar carga</option>
                                    <option value="1/8">1/8</option>
                                    <option value="1/4">1/4</option>
                                    <option value="3/4">3/4</option>
                                    <option value="3/8">3/8</option>
                                    <option value="1/2">1/2</option>
                                    <option value="5/8">5/8</option>
                                    <option value="7/8">7/8</option>
                                    <option value="TS">TS</option>
                                    <option value="Sc">SC</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-2">
                            <div className="col"> </div>
                            <div className="col">
                                <label className="label-personalizado mb-2 col-sm-auto control-label">Vigencia Colaborador(a)</label>
                            </div>
                            <div className="col"> </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="inicioVigenciaColaborador" className="label-personalizado mb-2">Fecha de inicio </label>
                                <input type="date" className="form-control" name="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio"
                                    id="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio"
                                    value={formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio
                                        ? new Date(formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>
                            <div className="col">
                                <label htmlFor="finVigenciaColaborador" className="label-personalizado mb-2">Fecha finalización</label>
                                <input type="date" className="form-control"
                                    name="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin"
                                    id="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin"
                                    value={formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin
                                        ? new Date(formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <br />
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="documento_asociado.documento" className="label-personalizado mb-2">Documento <span className="required">*</span> </label>
                                <input type="file" className="form-control" name="documento" id="documento" onChange={handleFileChange}
                                    required={mode == 1 ? true : ''} />
                                {mode == 2 ? (
                                    <a href={formData.documento} target="blank_"
                                        className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                        {formData.documento.split('/').pop()}
                                    </a>
                                )
                                    : ""}
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="documento_asociado.detalle" className="label-personalizado mb-2">Detalle del Documento <span className="required">* </span> </label>
                                <input type="text" className="form-control" name="detalle" id="detalle" value={formData.detalle} onChange={handleChange} required />
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
        </>)
}

PropuestasForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    propuesta: PropTypes.object,
    academicos: PropTypes.arrayOf(PropTypes.object).isRequired
};
