import PropTypes from 'prop-types'
import icono from '../../assets/person-i.png';
import { Confirmar } from '../../utils/Confirmar';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { obtenerProveedores, obtenerProductosServicios, obtenerFactura } from '../../api/gestionGastos';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const filter = createFilterOptions();
const currentYear = new Date().getFullYear();

export const GastoForm = ({ onSubmit, mode, gasto, id_partida, onCancel, onDelete }) => { 
    const [showConfirmationEdit, setShowConfirmationEdit]           = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete]       = useState(false);
    const [proveedor, setProveedor]                                 = useState([]); //extra
    const [producto, setProductoServicio]                           = useState([]); //extra
    const [productoNuevo, setProductoServicioNuevo]                 = useState([]); //extra
    const [factura, setFactura]                                     = useState([]);
    const [documentoData, setDocumentoData]                         = useState(null);
    const [selectedFactura, setSelectedFactura]                     = useState("");
    const [selectedProveedor, setSelectedProveedor]                 = useState('');
    const [accordionOpen, setAccordionOpen]                         = useState(false);
    const toggleAccordion = () => {
        setAccordionOpen(!accordionOpen);
    };
    const [formData, setFormData]                                   = useState({
        id_partida_fk: gasto? gasto.id_partida_fk.id_partida : id_partida,
        id_gasto: gasto ? gasto.id_gasto : "",
        monto: gasto ? gasto.monto : "",
        fecha: gasto ? gasto.fecha.split('T')[0] : "",
        detalle: gasto ? gasto.detalle : "",
        id_factura_fk: gasto ? gasto.id_factura_fk : {id_cedula_proveedor_fk: "", id_producto_servicio_fk: ""},
        id_documento_fk: gasto && mode !== 2 ? { ...gasto.id_documento_fk } : { tipo: "Documento factura", detalle: "", documento: "" }   
    });

    useEffect(() => {
        loadProveedores()
        loadProductosServicios()
        loadFacturas()
    }, [])

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
        const foto = event.target.files[0];
        setDocumentoData(foto);
    }

    const sendForm = (event) => {
        event.preventDefault();
    
        if (formData.id_factura_fk.id_producto_servicio_fk.id_producto_servicio === "0") {
            if (formData.id_factura_fk.id_producto_servicio_fk.id_producto_servicio !== "" && formData.id_factura_fk.id_producto_servicio_fk.detalle !== "") {
    
                // Crear un FormData con los datos del formulario y enviarlo
                const combinedData = new FormData();
                if (documentoData) {
                    combinedData.append('documento', documentoData);
                }
                combinedData.append('json', JSON.stringify(formData));
                onSubmit(combinedData);
            } else {
                console.log("Producto-Servicio incompleto");
            }
        } else {
            // No se está agregando un nuevo Producto-Servicio, enviar el formulario con los datos actuales
            const combinedData = new FormData();
            if (documentoData) {
                combinedData.append('documento', documentoData);
            }
            combinedData.append('json', JSON.stringify(formData));
            onSubmit(combinedData);
        }
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
                                {mode === 1 ? "Agregar gasto" : "Editar gasto"}
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
                            <div className="col">
                                <label htmlFor="fecha" className="label-personalizado mb-2"> Fecha   </label>
                                <input type="date" className="form-control" name="fecha" id="fecha" value={formData.fecha} onChange={handleChange} required />
                            </div>
                            {mode === 2 && (<div className="col-md-6">
                                <label htmlFor="id_gasto" className="label-personalizado mb-2">Código de gasto</label>
                                <input type="text" className="form-control disabled-input" name="id_gasto" id="id_gasto" value={mode === 2 ? formData.id_gasto : "Auto - generado"} onChange={handleChange} disabled={true} />
                            </div>)}
                        </div>
                        <div className='row mb-4'>
                            <div className="col-md-6">
                                <label htmlFor="detalle" className="label-personalizado mb-2">Detalle   </label>
                                <input type="text" className="form-control" name="detalle" id="detalle" value={formData.detalle} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="monto" className="label-personalizado mb-2">Monto   </label>
                                <input type="number" className="form-control" name="monto" id="monto" value={formData.monto} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col">
                                <h5>Información de factura</h5>
                                {mode === 2 && (
                                    <p>Código de factura: {formData.id_factura_fk.id_factura}</p>
                                )}
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="id_cedula_proveedor_fk" className="label-personalizado mb-2">Proveedor</label>
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
                                    value={formData.id_factura_fk.id_cedula_proveedor_fk.id_cedula_proveedor}
                                >
                                    {mode === 1 && (
                                        <>
                                            <option value="">Seleccione un proveedor</option>
                                            {proveedor.map(proveedorItem => (
                                                <option key={proveedorItem.id_cedula_proveedor} value={proveedorItem.id_cedula_proveedor}>
                                                    {proveedorItem.nombre}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                    {mode === 2 && (
                                        <>
                                            {/* Mostrar las opciones y seleccionar la opción almacenada */}
                                            {proveedor.map(proveedorItem => (
                                                <option key={proveedorItem.id_cedula_proveedor} value={proveedorItem.id_cedula_proveedor} selected={proveedorItem.id_cedula_proveedor === formData.id_factura_fk.id_cedula_proveedor_fk}>
                                                    {proveedorItem.nombre}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="id_producto_servicio_fk" className="label-personalizado mb-2 mr-2">Producto o Servicio</label>
                                <select
                                    id="id_producto_servicio_fk"
                                    name="id_producto_servicio_fk"
                                    className="form-control"
                                    onChange={(event) => {
                                        const selectedProductoId = event.target.value;
                                        setFormData((prevFormData) => ({
                                            ...prevFormData,
                                            id_factura_fk: {
                                                ...prevFormData.id_factura_fk,
                                                id_producto_servicio_fk: selectedProductoId
                                            }
                                        }));
                                        if (selectedProductoId === "0") {
                                            toggleAccordion(); // Abre el Accordion para agregar un nuevo Producto-Servicio
                                        }
                                    }}
                                    value={formData.id_factura_fk.id_producto_servicio_fk.id_producto_servicio}
                                >
                                    <option value="">Seleccione un producto</option>
                                    {producto.map(productoItem => (
                                        <option key={productoItem.id_producto_servicio} value={productoItem.id_producto_servicio}>
                                            {productoItem.detalle}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {accordionOpen && (
                            <>
                                <div className="row mb-4">
                                    <h5>Agregar nuevo Producto-Servicio</h5>
                                </div>
                                <div className="row mb-4">
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                                            <Typography>Nuevo Producto-Servicio</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <div className='row mb-4'>
                                                <div className="col-md-6">
                                                    <label htmlFor="id_producto_servicio_fk.id_producto_servicio" className="label-personalizado mb-2">Código Producto-Servicio</label>
                                                    <input type="number" className="form-control" name="id_producto_servicio_fk.id_producto_servicio" id="id_producto_servicio_fk.id_producto_servicio" value={formData.id_factura_fk.id_producto_servicio_fk.id_producto_servicio} onChange={handleChange} required/>
                                                </div>
                                                <div className="col-md-6">
                                                    <label htmlFor="id_producto_servicio_fk.detalle" className="label-personalizado mb-2">Detalle</label>
                                                    <input type="text" className="form-control" name="id_producto_servicio_fk.detalle" id="id_producto_servicio_fk.detalle" value={formData.id_factura_fk.id_producto_servicio_fk.detalle} onChange={handleChange} required />
                                                </div>
                                            </div>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </>
                        )}
                        <div className="row mb-4">
                            <div className="col">
                                <label htmlFor="id_documento_fk" className="label-personalizado mb-2">Factura</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    name="id_documento_fk" 
                                    id="id_documento_fk" 
                                    onChange={handleFileChange} 
                                    required={mode === 1}  // Solo necesitas establecer 'required' como true si 'mode' es 1
                                />

                                {mode === 2 && typeof formData.id_documento_fk.documento === 'string' && (
                                    <>
                                        <a 
                                            href={'http://localhost:8000' + formData.id_documento_fk.documento} 
                                            target="_blank" 
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2"
                                        >
                                            {formData.id_documento_fk.documento.split('/').pop()}
                                        </a>
                                    </>
                                )}
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