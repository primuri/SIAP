import PropTypes from 'prop-types'
import icono from '../../assets/person-i.png';
import { Confirmar } from '../../utils/Confirmar';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { obtenerCodigosFinancieros, obtenerEntesFinancieros, obtenerTiposDePresupuestos } from '../../api/gestionPresupuestos';
import { Autocomplete, TextField } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';

const filter = createFilterOptions();
const currentYear = new Date().getFullYear();

export const PresupuestoForm = ({ onSubmit, mode, presupuesto, version, onCancel, onDelete }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [tiposDePresupuesto, setTiposDePresupuesto] = useState([]);
    const [entidades, setEntidades] = useState([]);
    const [codigoFinancieros, setCodigosFinancieros] = useState([]);
    const [oficioData, setOficioData] = useState(null);
    const [formData, setFormData] = useState({
        tipoPresupuesto: {
            id_tipo_presupuesto: presupuesto ? presupuesto.id_tipo_presupuesto_fk.id_tipo_presupuesto : "",
            tipo: presupuesto ? presupuesto.id_tipo_presupuesto_fk.tipo : "",
        },
        ente_financiero_fk: presupuesto ? presupuesto.id_ente_financiero_fk : { id_ente_financiero: "", nombre: "" },
        id_codigo_financiero_fk: presupuesto ? presupuesto.id_codigo_financiero_fk : { id_codigo_financiero: "", codigo: "" },
        presupuesto: {
            id_presupuesto: presupuesto ? presupuesto.id_presupuesto : "",
            anio_aprobacion: presupuesto ? presupuesto.anio_aprobacion : "",
            id_version_proyecto_fk: version?.id_version_proyecto,
        },
        oficio: {
            id_oficio_fk: presupuesto ? presupuesto.id_oficio_fk.id_oficio : "",
            ruta_archivo: presupuesto ? presupuesto.id_oficio_fk.ruta_archivo : "",
            detalle: presupuesto ? presupuesto.id_oficio_fk.detalle : "",
        },
        proyecto: {
            id_codigo_vi: version ? version.id_codigo_vi_fk.id_codigo_vi : "",
            nombre: version ? version.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre : "",
        }
    });

    useEffect(() => {
        loadTiposDePresupuesto()
        loadEntidades()
        loadCodigosFinancieros()
    }, [])

    const loadTiposDePresupuesto = async () => {
        try {
            const res = await obtenerTiposDePresupuestos(localStorage.getItem('token'))
            setTiposDePresupuesto(res.data)

        } catch (error) {
            toast.error('Error al cargar tipos de presupuestos', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    // const loadProyectos = async () => {
    //     try {
    //         const res = await obtenerProyectos(localStorage.getItem('token'))
    //         setProyectos(res.data)

    //     } catch (error) {
    //         toast.error('Error al cargar proyectos', {
    //             duration: 4000,
    //             position: 'bottom-right',
    //             style: {
    //                 background: '#670000',
    //                 color: '#fff',
    //             },
    //         })
    //     }
    // }

    const loadEntidades = async () => {
        try {
            const res = await obtenerEntesFinancieros(localStorage.getItem('token'))
            setEntidades(res.data)

        } catch (error) {
            toast.error('Error al cargar entidades financieras', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    const loadCodigosFinancieros = async () => {
        try {
            const res = await obtenerCodigosFinancieros(localStorage.getItem('token'))
            setCodigosFinancieros(res.data)

        } catch (error) {
            toast.error('Error al cargar codigos financieros', {
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

    const handleFileChange = (event) => {
        const foto = event.target.files[0];
        setOficioData(foto);
    }

    const sendForm = (event) => {
        event.preventDefault()
        const combinedData = new FormData();
        if (oficioData) {
            combinedData.append('ruta_archivo', oficioData);
        }
        combinedData.append('json', JSON.stringify(formData))
        onSubmit(combinedData)
    }

    const obtenerEntidadesPorNombre = (entes) => {
        const nombresUnicos = [...new Set(entes.map(e => e.nombre))];
        return nombresUnicos.map(nombre => entes.find(e => e.nombre === nombre));
    };

    const obtenerCodigosFinancierosPorCodigo = (codigos) => {
        const nombresUnicos = [...new Set(codigos.map(c => c.codigo))];
        return nombresUnicos.map(codigo => codigos.find(c => c.codigo === codigo));
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
                                {mode === 1 ? "Agregar presupuesto" : "Editar presupuesto"}
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
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="id" className="label-personalizado mb-2">Identificador <span className="required">*</span> </label>
                                    <input type="text" className="form-control disabled-input" name="presupuesto.id_presupuesto" id="id" value={mode === 2 ? formData.presupuesto.id_presupuesto : "Auto - generado"} onChange={handleChange} required disabled />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="proyecto" className="label-personalizado mb-2">Proyecto asociado <span className="required">*</span> </label>
                                <input type="text" className="form-control disabled-input" name="proyecto.id_codigo_vi" id="proyecto" value={version?.id_codigo_vi_fk.id_codigo_vi + "/" + version?.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre} required disabled />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="tipoDePresupuesto" className="label-personalizado mb-2">Tipo <span className="required">*</span> </label>
                                <select className="form-select seleccion" name="tipoPresupuesto.id_tipo_presupuesto" id="tipoDePresupuesto" value={formData.tipoPresupuesto.id_tipo_presupuesto} onChange={handleChange} required>
                                    <option value="" disabled defaultValue>Seleccione el tipo de presupuesto</option>
                                    {tiposDePresupuesto && (
                                        tiposDePresupuesto.map((tipo, index) => {
                                            return (
                                                <option value={tipo.id_tipo_presupuesto} key={index}>
                                                    {tipo.tipo}
                                                </option>
                                            )
                                        })
                                    )}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="version" className="label-personalizado mb-2">Versión del proyecto<span className="required">*</span> </label>
                                    <input type="text" className="form-control disabled-input" name="version" id="version" value={version?.numero_version} required disabled />
                                </div>
                            </div>
                        </div>
                        <div className='row mb-4'>
                            <div className="col-md-6">
                                <label htmlFor="ente_nombre" className="label-personalizado mb-2">Ente Financiero <span className="required">*</span> </label>
                                <Autocomplete className="universidadAuto"
                                    value={formData.ente_financiero_fk.nombre}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            setFormData({
                                                ...formData,
                                                ente_financiero_fk: { nombre: newValue, id_ente_financiero: formData.ente_financiero_fk.id_ente_financiero },
                                            });
                                        } else if (newValue && newValue.inputValue) {
                                            // Create a new value from the user input
                                            setFormData({
                                                ...formData,
                                                ente_financiero_fk: { nombre: newValue.inputValue, id_ente_financiero: formData.ente_financiero_fk.id_ente_financiero },
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                ente_financiero_fk: { nombre: newValue?.nombre, id_ente_financiero: formData.ente_financiero_fk.id_ente_financiero },
                                            });
                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);

                                        const { inputValue } = params;
                                        // Suggest the creation of a new value
                                        const isExisting = options.some((option) => inputValue === option?.nombre);
                                        if (inputValue !== '' && !isExisting) {
                                            let cadena = `Añadir "${inputValue}"`;
                                            filtered.push({
                                                inputValue,
                                                nombre: cadena.normalize(),
                                            });
                                        }

                                        return filtered;
                                    }}
                                    selectOnFocus
                                    clearOnBlur
                                    handleHomeEndKeys
                                    id="ente_nombre"
                                    options={obtenerEntidadesPorNombre(entidades)}
                                    getOptionLabel={(option) => {
                                        // Value selected with enter, right from the input
                                        if (typeof option === 'string') {
                                            return option;
                                        }
                                        // Add "xxx" option created dynamically
                                        if (option.inputValue) {
                                            return option.inputValue;
                                        }
                                        // Regular option
                                        return option.nombre;
                                    }}
                                    renderOption={(props, option) => <li {...props}>{option.nombre}</li>}
                                    freeSolo
                                    renderInput={(params) => (
                                        <TextField {...params} className="form-control" />
                                    )}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="codigoFinanciero" className="label-personalizado mb-2">Código Financiero<span className="required">*</span> </label>
                                <Autocomplete className="universidadAuto"
                                    value={formData.id_codigo_financiero_fk.codigo}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            setFormData({
                                                ...formData,
                                                id_codigo_financiero_fk: { id_codigo_financiero: formData.id_codigo_financiero_fk.id_codigo_financiero, codigo: newValue },
                                            });
                                        } else if (newValue && newValue.inputValue) {
                                            // Create a new value from the user input
                                            setFormData({
                                                ...formData,
                                                id_codigo_financiero_fk: { id_codigo_financiero: formData.id_codigo_financiero_fk.id_codigo_financiero, codigo: newValue.inputValue },
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                id_codigo_financiero_fk: { id_codigo_financiero: formData.id_codigo_financiero_fk.id_codigo_financiero, codigo: newValue?.codigo },
                                            });
                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);

                                        const { inputValue } = params;
                                        // Suggest the creation of a new value
                                        const isExisting = options.some((option) => inputValue === option.codigo);
                                        if (inputValue !== '' && !isExisting) {
                                            let cadena = `Añadir "${inputValue}"`;
                                            filtered.push({
                                                inputValue,
                                                codigo: cadena.normalize(),
                                            });
                                        }

                                        return filtered;
                                    }}
                                    selectOnFocus
                                    clearOnBlur
                                    handleHomeEndKeys
                                    id="codigoFinanciero"
                                    options={obtenerCodigosFinancierosPorCodigo(codigoFinancieros)}
                                    getOptionLabel={(option) => {
                                        // Value selected with enter, right from the input
                                        if (typeof option === 'string') {
                                            return option;
                                        }
                                        // Add "xxx" option created dynamically
                                        if (option.inputValue) {
                                            return option.inputValue;
                                        }
                                        // Regular option
                                        return option.codigo;
                                    }}
                                    renderOption={(props, option) => <li {...props}>{option.codigo}</li>}
                                    freeSolo
                                    renderInput={(params) => (
                                        <TextField {...params} className="form-control" />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="detalleOficio" className="label-personalizado mb-2">Detalle Oficio<span className="required">*</span> </label>
                                <input type="text" className="form-control" name="oficio.detalle" id="detalleOficio" value={formData.oficio.detalle} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="documento" className="label-personalizado mb-2">Oficio <span className="required">*</span> </label>
                                <input type="file" className="form-control" name="documento" id="documento" onChange={handleFileChange}
                                    required={mode == 1 ? true : ''} />
                                {mode == 2 ? (
                                    <Tooltip title={formData.oficio.ruta_archivo.split('/').pop()} placement="right-start">
                                        <a href={'http://localhost:8000' + formData.oficio.ruta_archivo} target="blank_"
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                            {"Ver Oficio"}
                                        </a>
                                    </Tooltip>

                                )
                                    : ""}
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="anioAprobacion" className="label-personalizado mb-2">Año de aprobación<span className="required">*</span> </label>
                                <input type="number" className="form-control" name="presupuesto.anio_aprobacion" id="anioAprobacion" value={formData.presupuesto.anio_aprobacion} onChange={handleChange} required min={2000} max={currentYear} />
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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="presupuesto" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="presupuesto" />)}
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


PresupuestoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    presupuesto: PropTypes.object,
    version: PropTypes.object,
}