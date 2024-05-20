import PropTypes from 'prop-types'
import icono from '../../assets/budget.svg';
import icono2 from '../../assets/upload_doc.svg'
import { Confirmar } from '../../utils/Confirmar';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { obtenerProveedores, obtenerProductosServicios, obtenerFactura, obtenerGastos } from '../../api/gestionGastos';

const filter = createFilterOptions();

export const GastoForm = ({ onSubmit, mode, gasto, id_partida, onCancel, onDelete }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [proveedor, setProveedor] = useState([]);
    const [producto, setProductoServicio] = useState([]);
    const [factura, setFactura] = useState([]);
    const [documentoData, setDocumentoData] = useState(null);
    const [selectedFactura, setSelectedFactura] = useState("");
    const [selectedProveedor, setSelectedProveedor] = useState('');
    const [value, setValue] = useState(null);
    const [selectedFileName, setSelectedFileName] = useState('');
    const detalle = gasto ? gasto.id_factura_fk.id_producto_servicio_fk.detalle : ""

    const user = JSON.parse(localStorage.getItem('user'))
    const isInvestigador = user.groups.some((grupo) => {
        return grupo === 'investigador';
    });

    const [formData, setFormData] = useState({
        id_partida_fk: gasto ? gasto.id_partida_fk.id_partida : id_partida,
        id_gasto: gasto ? gasto.id_gasto : "",
        monto: gasto ? gasto.monto : "",
        fecha: gasto ? gasto.fecha.split('T')[0] : "",
        detalle: gasto ? gasto.detalle : "",
        id_factura_fk: gasto ? gasto.id_factura_fk : { id_cedula_proveedor_fk: { detalle: "" }, id_producto_servicio_fk: {detalle: ""} },
        id_documento_fk: gasto ? { ...gasto.id_documento_fk } : { tipo: "Documento factura", detalle: "", documento: "" }
    });

    useEffect(() => {
        if(mode == 2){
            setValue(detalle)
        }
        loadProveedores()
        loadProductosServicios()
        loadFacturas()
        
    }, [])

    useEffect(() =>{
        formData.id_factura_fk.id_producto_servicio_fk.detalle = value
    }, [value])
    
    useEffect(() => {
        if (mode === 2) {
            setSelectedProveedor(formData.id_factura_fk.id_cedula_proveedor_fk);
        }
    }, [mode, formData]);

    const loadProveedores = async () => {
        try {
            const res = await obtenerProveedores(localStorage.getItem('token'))
            setProveedor(res.data)

        } catch (error) {
            toast.error('Error al cargar proveedores', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    const loadProductosServicios = async () => {
        try {
            const res = await obtenerProductosServicios(localStorage.getItem('token'))
            setProductoServicio(res.data)
        } catch (error) {
            toast.error('Error al cargar productos y servicios', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    const loadFacturas = async () => {
        try {
            const res = await obtenerFactura(localStorage.getItem('token'));
            setFactura(res.data);
            if (mode === 2) {
                setSelectedFactura(gasto.id_factura_fk);
            }
        } catch (error) {
            toast.error('Error al cargar facturas', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            });
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target

        if (name.includes('.')) {
            const keys = name.split('.')
            setFormData(prev => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value
                }
            }))

        } else {
            setFormData({
                ...formData,
                [name]: value,
            })
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setSelectedFileName(file.name);
        }
   
        setDocumentoData(file);
    }

    const sendForm = (event) => {
        event.preventDefault()

        let sendingForm = { ...formData}
        if(documentoData){
            sendingForm.id_documento_fk.documento = documentoData
        }
        onSubmit(sendingForm);
        sendingForm = { ...formData}
    }

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
                                <img src={icono}/>
                            </div>
                        </div>
                        <div className="col-10 mb-0 text-center">
                            <h2 className="headerForm">
                                {mode === 1 ? "Agregar gasto" :  isInvestigador ? "Visualizar gasto" : "Editar gasto"}
                            </h2>
                        </div>
                        <div className="col-1 mb-0 text-center">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="close"
                                data-dismiss="modal"
                            >
                                <span aria-hidden="true" className="close-icon">
                                    &times;
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={sendForm} className='d-flex flex-column position-relative justify-content-center' encType="multipart/form-data">
                <div className="modal-body justify-content-center" style={{ padding: '3vh 4vw' }}>
                    <div className="container">
                        <div className="row mb-4">
                            {mode === 2 && (
                                <div className="col">
                                    <label htmlFor="id_factura_fk.id_factura" className="label-personalizado mb-2"> Código de factura   </label>
                                    <input type="text" className="form-control" name="id_factura_fk.id_factura" id="id_factura_fk.id_factura" value={formData.id_factura_fk.id_factura} onChange={handleChange} disabled={true} />
                                </div>
                            )}
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="fecha" className="label-personalizado mb-2"> Fecha   </label>
                                <input type="date" className="form-control" name="fecha" id="fecha" value={formData.fecha} onChange={handleChange} required disabled={isInvestigador}/>
                            </div>
                            {mode === 2 && (<div className="col-md-6">
                                <label htmlFor="id_gasto" className="label-personalizado mb-2">Código de gasto</label>
                                <input type="text" className="form-control disabled-input" name="id_gasto" id="id_gasto" value={mode === 2 ? formData.id_gasto : "Auto - generado"} onChange={handleChange} disabled={true} />
                            </div>)}
                        </div>
                        <div className='row mb-4'>
                            <div className="col-md-6">
                                <label htmlFor="detalle" className="label-personalizado mb-2">Detalle   </label>
                                <textarea className="form-control" name="detalle" id="detalle" value={formData.detalle} onChange={handleChange} required disabled={isInvestigador}/>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="monto" className="label-personalizado mb-2">Monto   </label>
                                <input type="number" className="form-control" name="monto" id="monto" value={formData.monto} onChange={handleChange} required disabled={isInvestigador}/>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="id_cedula_proveedor_fk" className="label-personalizado mb-2">Proveedor  </label>
                                <select
                                    id="id_cedula_proveedor_fk"
                                    name="id_cedula_proveedor_fk"
                                    className="form-control"
                                    onChange={(event) => {
                                        const selectedProveedorId = event.target.value;
                                        setFormData((prevFormData) => ({
                                            ...prevFormData,
                                            id_factura_fk: {
                                                ...prevFormData.id_factura_fk,
                                                id_cedula_proveedor_fk: selectedProveedorId
                                            }
                                        }));
                                    }}
                                    value={mode === 2 ? formData.id_factura_fk.id_cedula_proveedor_fk.id_cedula_proveedor : formData.id_factura_fk.id_cedula_proveedor_fk || ''}
                                required disabled={isInvestigador}>
                                    <option value="">Seleccione un proveedor</option>
                                    {proveedor.map((proveedorItem) => (
                                        <option key={proveedorItem.id_cedula_proveedor} value={proveedorItem.id_cedula_proveedor}>
                                            {proveedorItem.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="id_producto_servicio_fk" className="label-personalizado mb-2 mr-2">Producto o Servicio</label>
                                <Autocomplete
                                    value={value}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            setValue({
                                                detalle: newValue,
                                            });
                                        } else if (newValue && newValue.inputValue) {
                                            setValue({
                                                detalle: newValue.inputValue,
                                            });
                                        } else {
                                            setValue(newValue);
                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);

                                        const { inputValue } = params;
                                        const isExisting = options.some((option) => inputValue === option.detalle);
                                        if (inputValue !== '' && !isExisting) {
                                            filtered.push({
                                                inputValue,
                                                detalle: `Add "${inputValue}"`,
                                            });
                                        }

                                        return filtered;
                                    }}
                                    selectOnFocus
                                    clearOnBlur
                                    handleHomeEndKeys
                                    id="free-solo-with-text-demo"
                                    disabled={isInvestigador}
                                    options={producto}
                                    getOptionLabel={(option) => {
                                        if (typeof option === 'string') {
                                            return option;
                                        }
                                        if (option.inputValue) {
                                            return option.inputValue;
                                        }
                                        return option.detalle;
                                    }}
                                    renderOption={(props, option) => <li {...props}>{option.detalle}</li>}
                                    sx={{ width: 300 }}
                                    freeSolo
                                    renderInput={(params) => (
                                        <TextField {...params} required/>
                                    )}
                                />

                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="id_documento_fk" className="label-personalizado mb-2" style={{ display: 'block' }}>
                                    Factura
                                    <span className="disabled-input">(Opcional)</span>
                                </label>
                                <input
                                    type="file"
                                    className={isInvestigador ? "form-control disabled-input" : "form-control"}
                                    name="id_documento_fk.documento"
                                    id="id_documento_fk"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    disabled={isInvestigador}
                                />
                                <label htmlFor="id_documento_fk" style={{ cursor: 'pointer', display: 'block' }}>
                                    {selectedFileName ? (
                                        <span>Nombre del archivo: {selectedFileName}</span>
                                    ) : (
                                        <div className="file-upload-icon-container">
                                            <img src={icono2} alt="Seleccionar archivo" className="file-upload-icon" />
                                        </div>
                                    )}
                                </label>
                                {typeof formData.id_documento_fk.documento === 'string' && (
                                    <a
                                        href={'http://localhost:8000' + formData.id_documento_fk.documento}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
                                    >
                                        {formData.id_documento_fk.documento.split('/').pop()}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {!isInvestigador && (
                <div className="modal-footer justify-content-center position-sticky bottom-0">
                    <div className="row">
                        <div className="col">
                            {mode === 1 ? (
                                <button id="boton-personalizado" type="submit" className='table-button border-0 p-2 rounded text-white'>Agregar</button>
                            ) : (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleEditClick} className='table-button border-0 p-2 rounded text-white'>Guardar</button>
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="gasto" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="gasto" />)}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                )}
            </form>
            <Toaster></Toaster>
        </div>
    );
}

GastoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    gasto: PropTypes.object,
}