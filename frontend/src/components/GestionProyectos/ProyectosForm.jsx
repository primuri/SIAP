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


export const ProyectosForm = ({ onSubmit, mode, proyecto, producto, onCancel, onDelete, id_codigo, tipo, saveState, canVersiones }) => {

    // Cargar informacion
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
        numero_version: proyecto ? proyecto.numero_version : canVersiones + 1
    });
    console.log(canVersiones)

    useEffect(() => {
        if (mode === 2) {
            setActiveForm(tipo);
        }
    }, [mode, tipo]);


    //Este handleChange acepta hasta 4 grados de anidacion
    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === "numero_version") {
            if (value.includes('e') || value.includes('+') || value.includes('-')) {
                return;
            }
            if (!/^[0-9]*$/.test(value)) {
                return;
            }
        }
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
        //console.log("Software Data before sending:", softwareData);
        //console.log("Article Data before sending:", articuloData);
        console.log("Event Data before sending:", eventoData);
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
        navigate(`/gestion-informes/${proyecto.id_version_proyecto}`);
    };

    const handlePresupuestoClick = () => {
        saveState()
        navigate(`/gestion-presupuestos/${proyecto.id_version_proyecto}`)
    };

    const setCambios = (changes) => {
        //console.log("Received changes:", changes);
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
                        <img src={icono} alt="" width={'72px'} />
                    </div>
                </div>
                <div className="text-center" style={{ marginLeft: '3.5vw' }}>
                    <h2>{mode === 1 ? ("Agregar una versión de proyecto") : ("Editar versión de proyecto")}</h2>
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
                                <input type="text" className="form-control" name="detalle" id="detalle" onChange={handleChange} value={formData.detalle} required />
                            </div>

                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="fecha_fin" className="label-personalizado mb-2">Fecha finalización <span className="optional"> (Opcional)</span></label>
                                <input type="date" className="form-control"
                                    name="id_vigencia_fk.fecha_fin"
                                    id="id_vigencia_fk.fecha_fin"
                                    value={formData.id_vigencia_fk.fecha_fin
                                        ? new Date(formData.id_vigencia_fk.fecha_fin).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>
                            <div className="col">
                                <label htmlFor="fecha_inicio" className="label-personalizado mb-2">Fecha de inicio <span className="optional"> (Opcional)</span></label>
                                <input type="date" className="form-control" name="id_vigencia_fk.fecha_inicio"
                                    id="id_vigencia_fk.fecha_inicio"
                                    value={formData.id_vigencia_fk.fecha_inicio
                                        ? new Date(formData.id_vigencia_fk.fecha_inicio).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>

                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="id_oficio_fk.detalle" className="label-personalizado mb-2">Detalle del oficio   </label>
                                <input type="text" className="form-control" name="id_oficio_fk.detalle" id="id_oficio_fk.detalle" value={formData.id_oficio_fk.detalle} onChange={handleChange} required />
                            </div>
                            <div className="col">
                                <label htmlFor="id_oficio_fk.ruta_archivo" className="label-personalizado mb-2">Oficio   </label>
                                <input type="file" className="form-control" name="id_oficio_fk.ruta_archivo" id="id_oficio_fk.ruta_archivo" onChange={handleFileChange}
                                    required={mode == 1 ? true : ''} />
                                {mode == 2 ? (
                                    <Tooltip title={formData.id_oficio_fk.ruta_archivo.split('/').pop()} placement="right-start">
                                        <a href={"http://localhost:8000" + formData.id_oficio_fk.ruta_archivo} target="blank_"
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                            {"Ver documento"}
                                        </a>
                                    </Tooltip>

                                )
                                    : ""}
                            </div>
                        </div>
                        <hr></hr>
                        <div className="row mb-2">
                            <div className="col"> </div>
                            <h5 className="label-personalizado mb-2 col-sm-auto control-label">Agregar un producto asociado</h5>
                            <div className="col"> </div>
                        </div>

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
    tipo: PropTypes.oneOf(['evento', 'software', 'articulo'])
};
