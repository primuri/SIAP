import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import icono from '../../assets/project_version.svg';
import icono2 from '../../assets/upload_doc.svg'
import { Confirmar } from '../../utils/Confirmar'
import { SoftwareForm } from "../GestionProductos/SoftwareForm";
import { ArticuloForm } from "../GestionProductos/ArticuloForm";
import { EventoForm } from "../GestionProductos/EventoForm";
import { Boton } from "../../utils/Boton"
import { GestionInformes } from "../../pages/GestionInformes/GestionInformes";
import { useNavigate } from "react-router-dom";
import Tooltip from '@mui/material/Tooltip';
import { obtenerColaboradorSecundario } from "../../api/gestionProyectos";
import { FormularioDinamicoCheck } from "../../utils/FormularioDinamicoCheck"; 


const configuracionColaborador = [
    { 
        campo: 'estado', placeholder: 'Estado', tipo: 'select', required: true, opciones: ['Activo', 'Inactivo']
    },
    { 
        campo: 'carga',  placeholder: 'Carga', tipo: 'select', required: true, opciones: ['1/8', '1/4', '3/4', '3/8', '1/2', '5/8', '7/8', 'TS', 'SC']
    },
    { 
        campo: 'fecha_inicio', 
        placeholder: 'Fecha Inicio', 
        tipo: 'date', 
        required: false 
    },
    { 
        campo: 'fecha_fin', 
        placeholder: 'Fecha Fin', 
        tipo: 'date', 
        required: false 
    },
    { 
        campo: 'id_academico_fk', 
        placeholder: 'Nombre Colaborador', 
        tipo: 'text', 
        required: true
    }
];


export const ProyectosForm = ({ onSubmit, mode, proyecto, producto, onCancel, onDelete, id_codigo, tipo, saveState, canVersiones, academicos }) => {
    const navigate = useNavigate()
    const [fileData, setFileData] = useState(null);
    const [activeForm, setActiveForm] = useState('');
    const [colaboradores, setColaboradores] = useState([])
    const [softwareData, setSoftwareData] = useState(null);
    const [softwareFile, setSoftwareFile] = useState(null);
    const [articuloData, setArticuloData] = useState(null);
    const [articuloFile, setArticuloFile] = useState(null);
    const [eventoData, setEventoData] = useState(null);
    const [eventoFile, setEventoFile] = useState(null);
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [showProductContent, setShowProductContent] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');
    const [formData, setFormData] = useState({
            id_version_proyecto: proyecto ? proyecto.id_version_proyecto: "",
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
            detalle: proyecto ? proyecto.detalle: "",
            numero_version: proyecto ? proyecto.numero_version : "" ,
        
    });
    const user = JSON.parse(localStorage.getItem('user'))

    const isInvestigador = user.groups.some((grupo) => {
        return grupo === 'investigador';
    });
  
    useEffect(() => {
        if(proyecto){
            loadColaboradores(proyecto.id_version_proyecto)
        }
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

  const loadColaboradores = async (proyectoId) => {
    try {
        const res = await obtenerColaboradorSecundario(localStorage.getItem('token'));
        if (res.data && res.data.length > 0) {
            const colaboraFiltrados = res.data.filter(colaborador => colaborador.id_version_proyecto_fk.id_version_proyecto === proyectoId).map(col => ({
                ...col,
                fecha_inicio: col.id_vigencia_fk.fecha_inicio ? col.id_vigencia_fk.fecha_inicio.split('T')[0] : null,
                fecha_fin: col.id_vigencia_fk.fecha_fin ? col.id_vigencia_fk.fecha_fin.split('T')[0] : null,
            }));
            setColaboradores(colaboraFiltrados);
        } else {
            setColaboradores([]);
        }
    } catch (error) {
        console.error("Error al cargar los colaboradores: ", error);
    }
}
    
    function getValueByPath(object, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], object);
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedFileName(file.name);
        }

        setFileData(file);
    };

    const sendForm = (event) => {
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

        if (colaboradores.length > 0) {
            formData.colaboradores = colaboradores
            console.log(colaboradores)
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


    return (
        <>
            <div className="modal-header pb-0 position-sticky top-0">
                <div className="text-center">
                    <div className="img-space">
                        <img src={icono}/>
                    </div>
                </div>
                <div id="modal-header-proyecto" className="col-10 mb-0 text-center">
                            <h2 className="headerForm">
                                {mode === 1 ? "Agregar una versión de proyecto" : mode === 2 && !isInvestigador ? "Editar una versión de proyecto": "Visualizar versión de proyecto"}
                            </h2>
                        </div>
                <div>
                    <button id="button-close-proyecto" type="button" onClick={onCancel} className="close" data-dismiss="modal">
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
                                        <input type="text" className="form-control disabled-input" name="id_codigo_vi_fk.id_codigo_vi" id="id_codigo_vi_fk.id_codigo_vi" value={mode === 2 ? formData.id_codigo_vi_fk.id_codigo_vi : id_codigo} onChange={handleChange} disabled={true} />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="numero_version" className="label-personalizado  mb-2">Versión</label>
                                        <input type="text" className="form-control disabled-input " name="numero_version" id="numero_version" onChange={handleChange} value={formData.numero_version} min="1" step="1" pattern="^[0-9]+$" disabled={true} />
                                    </div>
                                </>
                            )
                            }
                        </div>

                        <div className="row mb-4">

                            <div className="col">
                                <label htmlFor="detalle" className="label-personalizado mb-2">Detalle   </label>
                                <textarea className="form-control" name="detalle" id="detalle" onChange={handleChange} value={formData.detalle} required  disabled={isInvestigador}/>

                            </div>
                        </div>

                        <div className="row mb-4">
                        <div className="col">
                                <label htmlFor="fecha_inicio" className="label-personalizado mb-2">Fecha de inicio </label> <span className="disabled-input">(Opcional)</span>
                                <input type="date" className="form-control" name="id_vigencia_fk.fecha_inicio"
                                    id="fecha_inicio"
                                    value={formData.id_vigencia_fk.fecha_inicio
                                        ? new Date(formData.id_vigencia_fk.fecha_inicio).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} disabled={isInvestigador} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="fecha_fin" className="label-personalizado mb-2">Fecha finalización</label> <span className="disabled-input">(Opcional)</span>
                                <input type="date" className="form-control"
                                    name="id_vigencia_fk.fecha_fin"
                                    id="id_vigencia_fk.fecha_fin"
                                    value={formData.id_vigencia_fk.fecha_fin
                                        ? new Date(formData.id_vigencia_fk.fecha_fin).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} disabled={isInvestigador}/>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="id_oficio_fk.detalle" className="label-personalizado mb-2">Detalle del oficio   </label>
                                <textarea className="form-control" name="id_oficio_fk.detalle" id="id_oficio_fk.detalle" value={formData.id_oficio_fk.detalle} onChange={handleChange} required disabled={isInvestigador}/>

                            </div>
                            <div className="col">
                                <label htmlFor="id_oficio_fk.ruta_archivo" className="label-personalizado mb-2" style={{ display: 'block' }}>
                                    Oficio
                                </label>
                                <input
                                    type="file"
                                    className={isInvestigador ? "form-control disabled-input" : "form-control"}
                                    name="id_oficio_fk.ruta_archivo"
                                    id="id_oficio_fk.ruta_archivo"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    required={mode == 1}
                                    disabled={isInvestigador}
                                />
                                <label htmlFor="id_oficio_fk.ruta_archivo" style={{ cursor: 'pointer', display: 'block' }}>
                                    {selectedFileName ? (
                                        <span>Nombre del archivo: {selectedFileName}</span>
                                    ) : (
                                        <div className="file-upload-icon-container">
                                            <img src={icono2} alt="Seleccionar archivo" className="file-upload-icon" />
                                        </div>
                                    )}
                                </label>
                                {mode == 2 && formData.id_oficio_fk?.ruta_archivo && (
                                    <Tooltip title={formData.id_oficio_fk.ruta_archivo.split('/').pop()} placement="right-start">
                                        <a
                                            href={"http://localhost:8000" + formData.id_oficio_fk.ruta_archivo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
                                        >
                                            Ver documento
                                        </a>
                                    </Tooltip>
                                )}
                                <div className="row mb-4"></div>
                            </div>
                            
                            <div className="d-flex flex-column 4"> 
                                <label htmlFor="colaboradores" className="label-personalizado mb-2 h5">Colaboradores Secundarios <span className="disabled-input">(Opcional)</span> </label> 
                                <FormularioDinamicoCheck configuracion={configuracionColaborador} items={colaboradores} setItems={setColaboradores}  itemName="Colaborador" academicos={academicos}/>
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
          
                <div className="modal-footer justify-content-center position-sticky bottom-0">
                    <div className="row">
                        {!isInvestigador && (
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
                        )}
                    </div>
                </div>
            </form>
        </>
    )};


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
