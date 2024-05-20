import React, { useState } from 'react';
import Paises from '../../utils/Paises.json'
import Tooltip from '@mui/material/Tooltip';
import icono2 from '../../assets/upload_doc.svg'

export const EventoForm = ({ mode, producto, setCambios }) => {
    const [fileData, setFileData] = useState(null);
    const [eventoPais, setEventoPais] = useState(producto ? producto.pais: "");
    const [selectedFileName, setSelectedFileName] = useState('');
    const defaultFormData = {
        id_producto_fk: {
            id_producto: "",
            fecha: "",
            detalle: ""
        },
        nombre: "",
        resumen: "",
        pais: "",
        tipo_participacion: "",
        enlace: "",
        id_institucion_fk:{ 
            id_institucion: "",
            nombre: "" 
        },
        id_area_fk: { 
            id_area: "",
            nombre: "" 
        },
        id_oficio_fk: {
            id_oficio: "",
            ruta_archivo: "",
            detalle: "",
        },
    };


    const initialFormData = producto || defaultFormData;
    const [formData, setFormData] = useState(initialFormData);

    const user = JSON.parse(localStorage.getItem('user'))

    const isInvestigador = user.groups.some((grupo) => {
        return grupo === 'investigador';
    });


    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name.includes('.')) {
            const keys = name.split('.');
            if (keys[0] === 'id_producto_fk' && keys[1] === 'fecha') {
                const year = new Date(value).getFullYear();
                if (year < 1980) {
                    event.target.setCustomValidity("La fecha no puede ser anterior a 1980.");
                    event.target.reportValidity();
                    return;
                } else {
                    event.target.setCustomValidity("");
                }
            }
            formData[keys[0]][keys[1]] = value;
        } else {
            formData[name] = value;
        }

        setCambios({ eventoData: { ...formData}, eventoFile: fileData });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedFileName(file.name);
        }

        setFileData(file);
        setCambios({ eventoData: formData, eventoFile: file }); 
    };

    return (
        <>       
           <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="producto_detalle" className="label-personalizado mb-2">Detalle del Producto   </label>
                    <textarea className="form-control" name="id_producto_fk.detalle" id="id_producto_fk.detalle" onChange={handleChange} value={formData.id_producto_fk.detalle} required disabled={isInvestigador}/>
                </div>
                <div className="col">
                    <label htmlFor="producto_fecha" className="label-personalizado mb-2">Fecha del Producto</label>
                    <input type="date" className="form-control"
                        name="id_producto_fk.fecha"
                        id="id_producto_fk.fecha"
                        value={formData.id_producto_fk.fecha
                            ? new Date(formData.id_producto_fk.fecha).toISOString().split('T')[0] : ""}
                        onChange={handleChange} required disabled={isInvestigador}/>
                </div>
            </div>
            <div className="row mb-2">
                <div className="col"> </div>
                    <h5 className="label-personalizado mb-2 col-sm-auto control-label">Evento</h5>
                <div className="col"> </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="nombre" className="label-personalizado mb-2"> Nombre del Evento   </label>
                    <textarea className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required disabled={isInvestigador}/>
                </div>
                <div className="col">
                    <label htmlFor="resumen" className="label-personalizado mb-2"> Resumen del Evento   </label>
                    <textarea className="form-control" name="resumen" id="resumen" value={formData.resumen} onChange={handleChange} required disabled={isInvestigador}/>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-6">
                    <label htmlFor="pais" className="label-personalizado mb-2">País del Evento   </label>
                    <select className="form-control" name="pais" id="pais" value={formData.pais} onChange={handleChange} required disabled={isInvestigador}>
                        <option value="" disabled defaultValue={""}>Seleccione un país</option>
                        {Paises.map((pais) => (
                            <option key={pais.value} value={pais.value}> {pais.label} </option>))}
                    </select>
                </div>
                <div className="col">
                    <label htmlFor="tipo_participacion" className="label-personalizado mb-2"> Tipo de Participación   </label>                
                    <select className="form-select seleccion" name="tipo_participacion" id="tipo_participacion" value={formData.tipo_participacion} onChange={handleChange}  required disabled={isInvestigador}>
                        <option value="" disabled defaultValue={""}>Seleccionar tipo</option>
                        <option value="Activa">Activa</option>
                        <option value="Pasiva">Pasiva</option>
                    </select>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="enlace" className="label-personalizado mb-2"> Enlace del evento </label> <span className="disabled-input">(Opcional)</span>
                    <textarea className="form-control" name="enlace" id="enlace" value={formData.enlace} onChange={handleChange}  disabled={isInvestigador}/>
                </div>
               
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="nombreArea" className="label-personalizado mb-2"> Nombre del Área del Evento   </label>
                    <textarea className="form-control" name="id_area_fk.nombre" id="nombreArea" value={formData.id_area_fk.nombre} onChange={handleChange} required disabled={isInvestigador} />
                </div>
                <div className="col">
                    <label htmlFor="nombreInstitucion" className="label-personalizado mb-2"> Nombre Institución del Evento   </label>
                    <textarea className="form-control" name="id_institucion_fk.nombre" id="nombreInstitucion" value={formData.id_institucion_fk.nombre} onChange={handleChange} required disabled={isInvestigador}/>
                </div>
            </div>
            <div className="row mb-4">
                <div className="col">
                    <label htmlFor="detalleOficio" className="label-personalizado mb-2"> Detalle del Oficio Del Evento   </label>
                    <textarea className="form-control" name="id_oficio_fk.detalle" id="detalleOficio" value={formData.id_oficio_fk.detalle} onChange={handleChange} required disabled={isInvestigador}/>
                </div>
                <div className="col">
                    <label htmlFor="id_oficio_fk.documento" className="label-personalizado mb-2" style={{ display: 'block' }}>
                        Documento del Oficio del Evento
                    </label>
                    <input
                        type="file"
                        className={isInvestigador ? "form-control disabled-input" : "form-control"}
                        name="id_oficio_fk.documento"
                        id="id_oficio_fk.documento"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        required={mode == 1}
                        disabled={isInvestigador}
                    />
                    <label htmlFor="id_oficio_fk.documento" style={{ cursor: 'pointer', display: 'block' }}>
                        {selectedFileName ? (
                            <span>Nombre del archivo: {selectedFileName}</span>
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
                                Descargar oficio
                            </a>
                        </Tooltip>
                    )}
                </div>

            </div>
        </>
    );
};
