import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import icono from '../../assets/person-i.png';
import { Confirmar } from '../../utils/Confirmar'
import { SoftwareForm } from "../GestionProductos/SoftwareForm";
import { ArticuloForm } from "../GestionProductos/ArticuloForm";
import { EventoForm } from "../GestionProductos/EventoForm";
import { Boton } from "../../utils/Boton"
import { GestionInformes } from "../../pages/GestionInformes/GestionInformes";
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';


export const ProyectosForm = ({ onSubmit, mode, proyecto, producto, onCancel, onDelete, id_codigo, tipo, saveState, canVersiones, academicos }) => {
    const navigate = useNavigate()
    const [fileData, setFileData] = useState(null);
    const [activeForm, setActiveForm] = useState('');
    const [softwareData, setSoftwareData] = useState(null);
    const [softwareFile, setSoftwareFile] = useState(null);
    const [articuloData, setArticuloData] = useState(null);
    const [articuloFile, setArticuloFile] = useState(null);
    const [eventoData, setEventoData] = useState(null);
    const [eventoFile, setEventoFile] = useState(null);
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [showProductContent, setShowProductContent] = useState(false);
    const [academicosFilter, setAcademicosFilter] = useState([]);
    const [formData, setFormData] = useState({
            id_colaborador_secundario: proyecto ? proyecto.id_colaborador_secundario: "" ,
            tipo: proyecto ? proyecto.tipo : "Secundario",
            estado: proyecto ? proyecto.estado : "",
            carga: proyecto  ? proyecto.carga : "",
            id_vigencia_fk: proyecto && proyecto.id_vigencia_fk ? proyecto.id_vigencia_fk : {
                fecha_inicio: proyecto && proyecto.id_vigencia_fk ? proyecto.id_vigencia_fk.fecha_inicio : "",
                fecha_fin: proyecto && proyecto.id_vigencia_fk ? proyecto.id_vigencia_fk.fecha_fin : ""
            },
            id_academico_fk: proyecto ? proyecto.id_academico_fk : {
                id_academico: proyecto && proyecto.id_academico ? proyecto.id_academico_fk.id_academico : ""
            },
            id_version_proyecto_fk: proyecto ? proyecto.id_version_proyecto_fk : {
                id_version_proyecto: proyecto && proyecto.id_version_proyecto_fk.id_version_proyecto ? proyecto.id_version_proyecto_fk.id_version_proyecto : "",
                id_oficio_fk: proyecto ? proyecto.id_version_proyecto_fk.id_oficio_fk : {
                    id_oficio: proyecto && proyecto.id_version_proyecto_fk.id_oficio_fk ? proyecto.id_version_proyecto_fk.id_oficio_fk.id_oficio : "",
                    ruta_archivo: proyecto && proyecto.id_version_proyecto_fk.id_oficio_fk ? proyecto.id_version_proyecto_fk.id_oficio_fk.ruta_archivo : "",
                    detalle: proyecto && proyecto.id_version_proyecto_fk.id_oficio_fk ? proyecto.id_version_proyecto_fk.id_oficio_fk.detalle : ""
                },
                id_vigencia_fk: proyecto ? proyecto.id_version_proyecto_fk.id_vigencia_fk : {
                    id_vigencia: proyecto && proyecto.id_version_proyecto_fk.id_vigencia_fk ? proyecto.id_version_proyecto_fk.id_vigencia_fk.id_vigencia : "",
                    fecha_inicio: proyecto && proyecto.id_version_proyecto_fk.id_vigencia_fk ? proyecto.id_version_proyecto_fk.id_vigencia_fk.fecha_inicio : "",
                    fecha_fin: proyecto && proyecto.id_version_proyecto_fk.id_vigencia_fk ? proyecto.id_version_proyecto_fk.id_vigencia_fk.fecha_fin : ""
                },
                id_codigo_vi_fk: proyecto ? proyecto.id_version_proyecto_fk.id_codigo_vi_fk : {
                    id_codigo_vi: proyecto && proyecto.id_version_proyecto_fk.id_codigo_vi_fk ? proyecto.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi : id_codigo,
                    nombre: proyecto && proyecto.id_version_proyecto_fk.nombre ? proyecto.id_version_proyecto_fk.id_codigo_vi_fk.nombre : "",
                },
                detalle: proyecto && proyecto.id_version_proyecto_fk  ? proyecto.id_version_proyecto_fk.detalle : "",
                numero_version: proyecto && proyecto.id_version_proyecto_fk ? proyecto.id_version_proyecto_fk.numero_version : canVersiones + 1,

            },
            asociar_academico: proyecto ? proyecto.id_academico_fk?.id_nombre_completo_fk?.nombre + " " + proyecto.id_academico_fk.id_nombre_completo_fk?.apellido +" " + proyecto.id_academico_fk.id_nombre_completo_fk?.segundo_apellido: ""
    });
   
  
    useEffect(() => {
        if (mode === 2) {
            setActiveForm(tipo);
        }
    }, [mode, tipo]);


    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "numero_version") {
            if (value.includes('e') || value.includes('+') || value.includes('-') || !/^[0-9]*$/.test(value)) {
                return;
            }
        }

        if (name === "id_academico_fk.id_academico") {
            formData.asociar_academico = value;
            if (value === "") {
                setAcademicosFilter([]);
            } else {
                const filteredAcademicos = academicos.filter(academico =>
                    academico.id_nombre_completo_fk.nombre.toLowerCase().includes(value.toLowerCase()) ||
                    academico.id_nombre_completo_fk.apellido.toLowerCase().includes(value.toLowerCase()) ||
                    academico.id_nombre_completo_fk.segundo_apellido.toLowerCase().includes(value.toLowerCase())
                );
                setAcademicosFilter(filteredAcademicos);
            }
        }
    
        const keys = name.split('.');
        let updatedValue = value;
    
        if (keys.includes('fecha_inicio') || keys.includes('fecha_fin')) {
            const startDateKey = keys.slice(0, -1).join('.') + '.fecha_inicio';
            const endDateKey = keys.slice(0, -1).join('.') + '.fecha_fin';
            const startDate = keys[keys.length - 1] === 'fecha_inicio' ? new Date(value) : new Date(getValueByPath(formData, startDateKey));
            const endDate = keys[keys.length - 1] === 'fecha_fin' ? new Date(value) : new Date(getValueByPath(formData, endDateKey));
    
            if (startDate > endDate) {
                return;
            }
        }
    
        const updateFormData = (path, value, obj) => {
            const keys = path.split('.');
            const lastKey = keys.pop();
            const lastObj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, obj);
           
            lastObj[lastKey] = value;

        };
    
        updateFormData(name, updatedValue, formData);
        setFormData({ ...formData });
    };
    
    function getValueByPath(object, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], object);
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileData(file);
    };

    const sendForm = (event) => {
        delete formData.asociar_academico
        event.preventDefault();
        const combinedData = new FormData();
        if (fileData) {
            combinedData.append('ruta_archivo', fileData);
        }
        if (softwareFile) {
            combinedData.append('id_documento_documentacion_fk.documento', softwareFile);
        }
        if (articuloFile) {
            combinedData.append('id_documento_articulo_fk.documento', articuloFile);
        }
        if (eventoFile) {
            combinedData.append('id_oficio_fk.documento', eventoFile);
        }
        const totalData = { ...formData, software: softwareData, articulo: articuloData, evento: eventoData };
        combinedData.append('json', JSON.stringify(totalData));
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

    const handleInformesClick = () => {
        saveState()
        navigate(`/gestion-informes/${proyecto.id_version_proyecto_fk.id_version_proyecto}`);
    };

    const handlePresupuestoClick = () => {
        saveState()
        navigate(`/gestion-presupuestos/${proyecto.id_version_proyecto_fk.id_version_proyecto}`)
    };

    const setCambios = (changes) => {
        setSoftwareData(changes.softwareData);
        setSoftwareFile(changes.softwareFile);
        setArticuloData(changes.articuloData);
        setArticuloFile(changes.articuloFile);
        setEventoData(changes.eventoData);
        setEventoFile(changes.eventoFile);
    };

    const handleBlur = (event) => {
        
        if(formData.id_academico_fk.id_academico !== 'number'){
            handleChange({target: { name: "asociar_academico", value: '' }});
        }
    }

    const handleSelectAcademico = (e, academico) => {
        setFormData(prev => ({
            ...prev,
                    id_academico_fk: {
                        id_academico: academico.id_academico
                    },
            asociar_academico: `${academico.id_nombre_completo_fk.nombre} ${academico.id_nombre_completo_fk.apellido} ${academico.id_nombre_completo_fk.segundo_apellido}`
        }));
        setAcademicosFilter([]);
    };

    return (
        <>
            <div className="modal-header pb-0 position-sticky top-0">
                <div className="text-center">
                    <div className="img-space">
                        <img src={icono} alt="" width={'72px'} />
                    </div>
                </div>
                <div className="col-10 mb-0 text-center">
                            <h2 className="headerForm">
                                {mode === 1 ? "Agregar una versión de proyecto" : "Editar una versión de proyecto"}
                            </h2>
                        </div>
                <div>
                    <button type="button" onClick={onCancel} className="close" data-dismiss="modal">
                        <span aria-hidden="true" className="close-icon">&times;</span>
                    </button>
                </div>
            </div>

            <form id="formProyecto" onSubmit={sendForm} className='d-flex flex-column' encType="multipart/form-data">
                <div className="modal-body" style={{ padding: '3vh 4vw' }}>
                    <div className="container">

                        <div className="row mb-4">
                            {mode === 2 && (
                                <>
                                    <div className="col-md-6">
                                        <label htmlFor="id_codigo_vi" className="label-personalizado mb-2 ">Código VI</label>
                                        <input type="text" className="form-control disabled-input" name="id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi" id="id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi" value={mode === 2 ? formData.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi : id_codigo} onChange={handleChange} disabled={true} />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="id_version_proyecto_fk.numero_version" className="label-personalizado  mb-2">Versión</label>
                                        <input type="text" className="form-control disabled-input " name="id_version_proyecto_fk.numero_version" id="id_version_proyecto_fk.numero_version" onChange={handleChange} value={formData.id_version_proyecto_fk.numero_version} min="1" step="1" pattern="^[0-9]+$" disabled={true} />
                                    </div>
                                </>
                            )
                            }
                        </div>

                        <div className="row mb-4">

                            <div className="col">
                                <label htmlFor="id_version_proyecto_fk.detalle" className="label-personalizado mb-2">Detalle   </label>
                                <textarea className="form-control" name="id_version_proyecto_fk.detalle" id="id_version_proyecto_fk.detalle" onChange={handleChange} value={formData.id_version_proyecto_fk.detalle} required />
                            </div>

                        </div>

                        <div className="row mb-4">
                        <div className="col">
                                <label htmlFor="fecha_inicio" className="label-personalizado mb-2">Fecha de inicio </label> <span className="disabled-input">(Opcional)</span>
                                <input type="date" className="form-control" name="id_version_proyecto_fk.id_vigencia_fk.fecha_inicio"
                                    id="id_vigencia_fk.fecha_inicio"
                                    value={formData.id_version_proyecto_fk.id_vigencia_fk.fecha_inicio
                                        ? new Date(formData.id_version_proyecto_fk.id_vigencia_fk.fecha_inicio).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="fecha_fin" className="label-personalizado mb-2">Fecha finalización</label> <span className="disabled-input">(Opcional)</span>
                                <input type="date" className="form-control"
                                    name="id_version_proyecto_fk.id_vigencia_fk.fecha_fin"
                                    id="id_version_proyecto_fk.id_vigencia_fk.fecha_fin"
                                    value={formData.id_version_proyecto_fk.id_vigencia_fk.fecha_fin
                                        ? new Date(formData.id_version_proyecto_fk.id_vigencia_fk.fecha_fin).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>
                           

                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="id_version_proyecto_fk.id_oficio_fk.detalle" className="label-personalizado mb-2">Detalle del oficio   </label>
                                <textarea className="form-control" name="id_version_proyecto_fk.id_oficio_fk.detalle" id="id_version_proyecto_fk.id_oficio_fk.detalle" value={formData.id_version_proyecto_fk.id_oficio_fk.detalle} onChange={handleChange} required />
                            </div>
                            <div className="col">
                                <label htmlFor="id_version_proyecto_fk.id_oficio_fk.ruta_archivo" className="label-personalizado mb-2">Oficio   </label>
                                <input type="file" className="form-control" name="id_version_proyecto_fk.id_oficio_fk.ruta_archivo" id="id_version_proyecto_fk.id_oficio_fk.ruta_archivo" onChange={handleFileChange}
                                    required={mode == 1 ? true : ''} />
                                {mode == 2 ? (
                                    <Tooltip title={formData.id_version_proyecto_fk.id_oficio_fk.ruta_archivo.split('/').pop()} placement="right-start">
                                        <a href={"http://localhost:8000" + formData.id_version_proyecto_fk.id_oficio_fk.ruta_archivo} target="blank_"
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                            {"Ver documento"}
                                        </a>
                                    </Tooltip>

                                )
                                    : ""}
                            </div>
                            <div className="row mb-4">
                                <h5 className="text-center my-3 mt-5">Asociar Colaborador Secundario</h5>
                                <div className="col">
                                    <label htmlFor="id_academico_fk" className="label-personalizado mb-2">Investigador(a) </label>
                                
                                    <div className="position-relative">
                                        <input type="text" className="form-control" name="id_academico_fk.id_academico"
                                        id="id_academico_fk.id_academico" value={formData.asociar_academico} onChange={handleChange} onBlur={handleBlur} required/>
                                        {(academicosFilter.length > 0) && (
                                            <div
                                                className="form-control bg-light position-absolute d-flex flex-column justify-content-center shadow ps-1 pe-1 row-gap-1 overflow-y-scroll pt-2"
                                                style={{ maxHeight: "60px" }}
                                            >
                                                {academicosFilter.map((academico) => {
                                                return (
                                                    <div
                                                    key={academico.id_academico}
                                                    className="pointer-event ms-1"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => handleSelectAcademico(e, academico)}
                                                    >
                                                    {`${academico.id_nombre_completo_fk.nombre} ${academico.id_nombre_completo_fk.apellido} ${academico.id_nombre_completo_fk.segundo_apellido}`}
                                                    </div>
                                                );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="estado" className="label-personalizado mb-2">Estado colaborador(a) </label>
                                <select className="form-select seleccion" name="estado" id="estado" value={formData.estado} onChange={handleChange} required>
                                    <option value="">Seleccionar estado</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="carga" className="label-personalizado mb-2">Carga colaborador(a) </label>
                                <select className="form-select seleccion" name="carga" id="carga" value={formData.carga} onChange={handleChange} required>
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
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="inicioVigenciaColaborador" className="label-personalizado mb-2">Fecha de inicio </label> <span className="disabled-input">(Opcional)</span>
                                <input type="date" className="form-control" name="id_vigencia_fk.fecha_inicio"
                                    id="id_vigencia_fk.fecha_inicio"
                                    value={formData.id_vigencia_fk.fecha_inicio
                                        ? new Date(formData.id_vigencia_fk.fecha_inicio).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>
                            <div className="col">
                                <label htmlFor="finVigenciaColaborador" className="label-personalizado mb-2">Fecha finalización </label> <span className="disabled-input">(Opcional)</span>
                                <input type="date" className="form-control"
                                    name="id_vigencia_fk.fecha_fin"
                                    id="id_vigencia_fk.fecha_fin"
                                    value={formData.id_vigencia_fk.fecha_fin
                                        ? new Date(formData.id_vigencia_fk.fecha_fin).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>
                        </div>
                        <br />
                        </div>
                        <hr></hr>
                        <div className="row mb-2">
                            <div className="col d-flex justify-content-center align-items-center">
                                <h5 className="label-personalizado mb-2 col-sm-auto control-label">Producto asociado</h5>
                            </div>
                        </div>
                        <div className="row mb-2">
                            <div className="col d-flex justify-content-center align-items-center">
                            {!showProductContent && (
                                <button
                                    id="toggleContentButton"
                                    type="button"
                                    className="table-button border-0 p-2 rounded text-white"
                                    onClick={() => setShowProductContent(true)}
                                >
                                    {mode === 1 ? "Agregar un producto" : "Ver producto"}
                                </button>
                            )}
                            </div>
                        </div>
                        
                       
                        {showProductContent && (
                            <div className="row mb-4">
                                {mode !== 2 && (
                                    <div className="row">
                                        <div className="col d-flex justify-content-center align-items-center">
                                            <Boton onClick={() => setActiveForm('evento')} text="Evento" />
                                        </div>
                                        <div className="col d-flex justify-content-center align-items-center">
                                            <Boton onClick={() => setActiveForm('software')} text="Software" />
                                        </div>
                                        <div className="col d-flex justify-content-center align-items-center">
                                            <Boton onClick={() => setActiveForm('articulo')} text="Artículo" />
                                        </div>
                                    </div>
                                )}

                                <div className="row mt-3">
                                    <div className="col">
                                        {activeForm === 'evento' && <EventoForm mode={mode} setCambios={setCambios} producto={producto} />}
                                        {activeForm === 'software' && <SoftwareForm mode={mode} setCambios={setCambios} producto={producto} />}
                                        {activeForm === 'articulo' && <ArticuloForm mode={mode} setCambios={setCambios} producto={producto} />}
                                    </div>
                                </div>
                            </div>
                        )}
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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="versión de proyecto" />)}
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
    producto: PropTypes.object,
    id_codigo: PropTypes.object,
    tipo: PropTypes.oneOf(['evento', 'software', 'articulo']),
    academicos: PropTypes.arrayOf(PropTypes.object).isRequired
};
