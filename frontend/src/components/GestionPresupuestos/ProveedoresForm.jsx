import { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { toast, Toaster } from 'react-hot-toast'
import icono from '../../assets/person-i.png';
import { Confirmar } from '../../utils/Confirmar'
import { FormularioDinamico } from "../../utils/FomularioDinamico"
import { obtenerCuentasBancarias } from "../../api/proveedores"

const configuracionCuentaBancaria = [
    { campo: 'id_numero', placeholder: 'Número', tipo: 'number', required: true },
    { campo: 'banco', placeholder: 'Banco', tipo: 'text', required: true },
    { campo: 'tipo', placeholder: 'Tipo de cuenta', tipo: 'select', opciones: ['Ahorros', 'Corriente'], required: true },
    { campo: 'moneda', placeholder: 'Moneda', tipo: 'text', required: true },
    { campo: 'cuenta_principal', label: ' Seleccionar como cuenta principal', tipo: 'checkbox', required: true }
]

export const ProveedoresForm = ({ onSubmit, mode, proveedor, onCancel, onDelete }) => {
    const [cuentaBancaria, setCuentaBancaria] = useState([])
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false)

    // Si hay informacion en el proveedor, la almacena en formData, sino queda vacía
    const [formData, setFormData] = useState({
        id_cedula_proveedor: proveedor ? proveedor.id_cedula_proveedor : "",
        correo: proveedor ? proveedor.correo : "",
        nombre: proveedor ? proveedor.nombre : "",
        telefono: proveedor ? proveedor.telefono : ""
    })

    useEffect(() => {
        if (proveedor) {
            loadCuentaBancaria()
        }
    }, [proveedor]) 

    const loadCuentaBancaria = async () => {
        try {
            const res = await obtenerCuentasBancarias(localStorage.getItem('token'))
            if (res.data && res.data.length > 0) {
                const cuentasFiltradas = res.data.filter(cuenta => cuenta.id_proveedor_fk.id_cedula_proveedor === proveedor.id_cedula_proveedor)
                setCuentaBancaria(cuentasFiltradas)
            } else {
                setCuentaBancaria([]) // Establecer el estado a un array vacío si la respuesta es un array vacío
            }

        } catch (error) {
            toast.error('Error al cargar las cuentas', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

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

    const sendForm = (event) => {
        event.preventDefault()

        formData.cuentaBancaria = cuentaBancaria
        const combinedData = new FormData();
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
                                {mode === 1 ? "Agregar proveedor(a)" : "Editar proveedor(a)"}
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

            <form onSubmit={sendForm} className='d-flex flex-column position-relative justify-content-center'>
                <div className="modal-body justify-content-center" style={{ padding: '3vh 4vw' }}>
                    <div className="container ">

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="cedula" className="label-personalizado mb-2">Cédula <span className="required">*</span> </label>
                                    <input type="text" className="form-control" name="id_cedula_proveedor" id="id_cedula_proveedor" value={formData.id_cedula_proveedor} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6 position-relative">
                                <label htmlFor="tipo" className="label-personalizado mb-2">Tipo de cédula <span className="required">*</span> </label>
                                <select className="form-select seleccion" name="tipo" id="tipo" value={formData.tipo} onChange={handleChange}>
                                    <option value="">Seleccionar tipo</option>
                                    <option value="Fisica">Física</option>
                                    <option value="Juridica">Jurídica</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="nombre" className="label-personalizado mb-2">Nombre <span className="required">*</span> </label>
                                    <input type="text" className="form-control" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="correo" className="label-personalizado mb-2">Correo electrónico <span className="required">*</span></label>
                                <input type="email" className="form-control" name="correo" id="correo" value={formData.correo} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="telefono" className="label-personalizado mb-2">Teléfono <span className="required">*</span> </label>
                                <input type="number" className="form-control" name="telefono" id="telefono" value={formData.telefono} onChange={handleChange} required/>
                            </div>

                        </div>

                        <div className="d-flex flex-column">
                            <label htmlFor="cuentaBancaria" className="label-personalizado mb-2 h5">Cuenta Bancaria <span className="required">*</span> </label>
                            <FormularioDinamico configuracion={configuracionCuentaBancaria} items={cuentaBancaria} setItems={setCuentaBancaria}  itemName="Cuenta Bancaria"/>
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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="investigador(a)" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="investigador(a)" />)}
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

ProveedoresForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    proveedor: PropTypes.object,
}