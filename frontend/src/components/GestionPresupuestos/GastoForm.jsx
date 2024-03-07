import PropTypes from 'prop-types'
import icono from '../../assets/person-i.png';
import { Confirmar } from '../../utils/Confirmar';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { createFilterOptions } from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { obtenerProveedores, obtenerProductosServicios, obtenerFactura } from '../../api/gestionGastos';

const filter = createFilterOptions();
const currentYear = new Date().getFullYear();

export const GastoForm = ({ onSubmit, mode, gasto, id_partida, onCancel, onDelete }) => {  //id_partida esta extra
    const [showConfirmationEdit, setShowConfirmationEdit]           = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete]       = useState(false);
    const [proveedor, setProveedor]                                  = useState([]); //extra
    const [producto, setProductoServicio]                           = useState([]); //extra
    const [factura, setFactura]                                     = useState([]);
    const [documentoData, setDocumentoData]                         = useState(null);
    const [selectedFactura, setSelectedFactura]                     = useState("");
    const [formData, setFormData]                                   = useState({
        "id_partida_fk": gasto? gasto.id_partida_fk.id_partida : id_partida,
        "id_gasto": gasto ? gasto.id_gasto : "",
        "monto": gasto ? gasto.monto : "",
        "fecha": gasto ? gasto.fecha.split('T')[0] : "",
        "detalle": gasto ? gasto.detalle : "",
        factura: {
            id_factura_fk: gasto ? gasto.id_factura_fk : "",
        },
        documento: {
            id_documento_fk: gasto ? gasto.id_documento_fk.id_documento : "",
            ruta_archivo: gasto ? gasto.id_documento_fk.ruta_archivo : "",
        },    
    });

    useEffect(() => {
        loadProveedores()
        loadProductosServicios()
        loadFacturas()
    }, [])

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
        event.preventDefault()
        const combinedData = new FormData();
        if (documentoData) {
            combinedData.append('ruta_archivo', documentoData);
        }
        combinedData.append('json', JSON.stringify(formData))
        onSubmit(combinedData)
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
                    <div className="container ">
                        <div className="row mb-4">
                            {mode === 2 && (<div className="col-md-6">
                                <label htmlFor="id_gasto" className="label-personalizado mb-2">Código   </label>
                                <input type="number" className="form-control disabled-input" name="id_gasto" id="id_gasto" value={mode === 2 ? formData.id_gasto : "Auto - generado"} onChange={handleChange} disabled={true} />
                            </div>)}
                            <div className="col">
                            <label htmlFor="fecha" className="label-personalizado mb-2"> Fecha   </label>
                                <input type="date" className="form-control" name="fecha" id="fecha" value={formData.fecha} onChange={handleChange} required />
                            </div> 
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
                        <div className='row mb-4'>
                            {mode === 2 && (<div className="col-md-6">
                                <label htmlFor="id_factura_fk" className="label-personalizado mb-2">Número de factura   </label>
                                <input type="number" className="form-control disabled-input" name="id_factura_fk.id_factura" id="id_factura_fk.id_factura" value={mode === 2 ? formData.id_gasto : "Auto - generado"} onChange={handleChange} disabled={true} />
                            </div>)}
                            <div className="col">
                                <label htmlFor="id_documento_fk" className="label-personalizado mb-2">Factura   </label>
                                <input type="file" className="form-control" name="documento" id="documento" onChange={handleFileChange}
                                    required={mode == 1 ? true : ''} />
                                {mode == 2 ? (
                                    <Tooltip title={formData.documento?.ruta_archivo?.split('/')?.pop()} placement="right-start">
                                        <a href={'http://localhost:8000' + formData.documento.ruta_archivo} target="blank_"
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                            {"Ver Factura"}
                                        </a>
                                    </Tooltip>

                                )
                                    : ""} 
                            </div>
                        </div>
                        <div className='row mb-4'>
                            <div className="col-md-6">
                                <label htmlFor="id_cedula_proveedor_fk" className="label-personalizado mb-2">ID del proveedor   </label>
                                <select
                                    id="id_cedula_proveedor_fk"
                                    name="id_cedula_proveedor_fk"
                                    className="form-control"
                                    value={selectedFactura ? selectedFactura.id_cedula_proveedor_fk.nombre : ''}
                                    onChange={(event) => {
                                        setSelectedFactura(factura.find(f => f.id_factura === event.target.value));
                                    }}>
                                    <option value="">Seleccione un proveedor</option>
                                    {factura.map((factura) => (
                                        <option key={factura.id_factura} value={factura.id_factura}>
                                            {factura.id_cedula_proveedor_fk.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="id_producto_servicio_fk" className="label-personalizado mb-2">Identificador del producto   </label>
                                <select
                                    id="id_producto_servicio_fk"
                                    name="id_producto_servicio_fk"
                                    className="form-control"
                                    onChange={(event) => {
                                        
                                    }}>
                                    <option value="">Seleccione un producto o servicio</option>
                                    {producto.map((producto) => (
                                        <option key={producto.id_producto_servicio} value={producto.id_producto_servicio}>
                                            {producto.detalle}
                                        </option>
                                    ))}
                                </select> 
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
    )
}


GastoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    gasto: PropTypes.object,
}

