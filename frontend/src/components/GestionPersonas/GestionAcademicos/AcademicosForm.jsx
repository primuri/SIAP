import { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { FormularioDinamico } from "../../../utils/FomularioDinamico"
import { obtenerTelefonos, obtenerTitulos, obtenerUniversidades, obtenerPropuestas } from "../../../api/gestionAcademicos"
import { toast, Toaster } from 'react-hot-toast'
import icono from '../../../assets/person-i.png';
import icono2 from '../../../assets/upload_image.svg';
import Upload from '../../../utils/UploadImage';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Confirmar } from '../../../utils/Confirmar'
import Paises from '../../../utils/Paises.json'
import Tooltip from '@mui/material/Tooltip';
import { Modal } from "../../../utils/Modal"
import { Table } from "../../../utils/Table"
const filter = createFilterOptions();
const columns = ['Numeros de Telefono']
const dataKeys = ['numero_tel']

const columns2 = ['Institucion', 'Año', 'Grado', 'Detalle']
const dataKeys2 = ['institución', 'anio','grado', 'detalle']

const configuracionTitulos = [
    { campo: 'anio', placeholder: 'Año', tipo: 'number', required: true },
    { campo: 'grado', placeholder: 'Grado', tipo: 'text', required: true },
    { campo: 'detalle', placeholder: 'Detalle', tipo: 'text', required: true },
    { campo: 'institución', placeholder: 'Institución', tipo: 'text', required: true }
]

const configuracionTelefonos = [
    { campo: 'numero_tel', placeholder: 'Número', tipo: 'tel', required: true},
]
export const AcademicosForm = ({ onSubmit, mode, academico, onCancel, onDelete }) => {
    const [titulos, setTitulos] = useState([])
    const [telefonos, setTelefonos] = useState([])
    const [universidades, setUniversidades] = useState([])
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [paisSeleccionado, setPaisSeleccionado] = useState(academico ? academico.pais_procedencia : "");
    const [fotoData, setFotoData] = useState(null);
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false)
    const [propuestas, setPropuestas] = useState([]);
    const [togglePropuestas, setTogglePropuestas] = useState(false);

    // Si hay informacion en el academico, la almacena en formData, sino queda vacía
    const [formData, setFormData] = useState({
        cedula: academico ? academico.cedula : "",
        foto: academico ? academico.foto : "",
        sitio_web: academico ? academico.sitio_web : "",
        unidad_base: academico ? academico.unidad_base : "",
        grado_maximo: academico ? academico.grado_maximo : "",
        correo: academico ? academico.correo : "",
        correo_secundario: academico ? academico.correo_secundario : "",
        categoria_en_regimen: academico ? academico.categoria_en_regimen : "",
        pais_procedencia: academico ? academico.pais_procedencia : "",
        id_nombre_completo_fk: academico ? academico.id_nombre_completo_fk : { nombre: "", apellido: "", segundo_apellido: "" },
        id_area_especialidad_fk: academico ? academico.id_area_especialidad_fk : { nombre: "" },
        id_area_especialidad_secundaria_fk: academico ? academico.id_area_especialidad_secundaria_fk : { nombre: "" },
        universidad_fk: academico ? academico.universidad_fk : { pais: "", nombre: "" }
    })
    //si hay titulos o telefonos los carga
    useEffect(() => {
        if (academico) {
            loadTitulos()
            loadTelefonos()
        }
        loadUniversidades()
        if(mode === 2){
            loadPropuestas()
        }
        
    }, [academico]) 

    const loadPropuestas = async () => {
        try {
            const resultados = [];
            const res = await obtenerPropuestas(localStorage.getItem('token'))
            if (res.data && res.data.length > 0) {
                res.data.map((prop) => {
                    const colaboradorPrincipal = prop.id_colaborador_principal_fk;
                    if (colaboradorPrincipal && colaboradorPrincipal.id_academico_fk.cedula === academico.cedula) {
                        const resultado = prop.nombre;
                        resultados.push(resultado);
                       
                        console.log(prop.nombre);
                    }
                  });
               
            }
            setPropuestas(resultados);
        } catch (error) {
            toast.error('Error al cargar los propuestas', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }

    const loadTitulos = async () => {
        try {
            const res = await obtenerTitulos(localStorage.getItem('token'))
            if (res.data && res.data.length > 0) {
                const titulosFiltrados = res.data.filter(titulo => titulo.id_academico_fk.id_academico === academico.id_academico)
                setTitulos(titulosFiltrados)
            } else {
                setTitulos([]) // Establecer el estado a un array vacío si la respuesta es un array vacío
            }

        } catch (error) {
            toast.error('Error al cargar los titulos', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }
    const loadTelefonos = async () => {
        try {
            const res = await obtenerTelefonos(localStorage.getItem('token'))
            if (res.data && res.data.length > 0) {
                const telefonosFiltrados = res.data.filter(telefono => telefono.id_academico_fk.id_academico === academico.id_academico)
                setTelefonos(telefonosFiltrados)
            } else {
                setTelefonos([]) // Establecer el estado a un array vacío si la respuesta es un array vacío
            }

        } catch (error) {
            toast.error('Error al cargar los telefonos', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: '#670000',
                    color: '#fff',
                },
            })
        }
    }
    const loadUniversidades = async () => {
        try {
            const res = await obtenerUniversidades(localStorage.getItem('token'))
            setUniversidades(res.data)

        } catch (error) {
            toast.error('Error al cargar universidades', {
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

        if (name === "pais_procedencia") {
            setPaisSeleccionado(value);
            setFormData({
                ...formData,
                [name]: value,
            });
        }

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
        setFotoData(foto);
    }

    const sendForm = (event) => {
        event.preventDefault()
        if (titulos.length > 0) {
            formData.titulos = titulos
            console.log(titulos)
        }
        if (telefonos.length > 0) {
            formData.telefonos = telefonos
            console.log(telefonos)
        }
        const combinedData = new FormData();
        if (fotoData) {
            combinedData.append('foto', fotoData);
        }
        combinedData.append('json', JSON.stringify(formData))
        onSubmit(combinedData)
    }

    const obtenerUniversidadesUnicasPorPais = (universidades) => {
        const paisesUnicos = [...new Set(universidades.map(u => u.pais))];
        return paisesUnicos.map(pais => universidades.find(u => u.pais === pais));
    };

    const obtenerUniversidadesUnicasPorNombre = (universidades) => {
        const nombresUnicos = [...new Set(universidades.map(u => u.nombre))];
        return nombresUnicos.map(nombre => universidades.find(u => u.nombre === nombre));
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

    const handleToggleClick = () => {
        setTogglePropuestas(!togglePropuestas);
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
                                {mode === 1 ? "Agregar investigador(a)" : "Editar investigador(a)"}
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
                                    <label htmlFor="cedula" className="label-personalizado mb-2">Cédula </label>
                                    <input type="text" className="form-control" name="cedula" id="cedula" value={formData.cedula} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="nombre" className="label-personalizado mb-2">Nombre </label>
                                    <input type="text" className="form-control" name="id_nombre_completo_fk.nombre" id="nombre" value={formData.id_nombre_completo_fk.nombre || ""} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="apellido" className="label-personalizado mb-2">Primer apellido </label>
                                    <input type="text" className="form-control" name="id_nombre_completo_fk.apellido" id="apellido" value={formData.id_nombre_completo_fk.apellido || ""} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="segundoApellido" className="label-personalizado mb-2">Segundo apellido</label>
                                    <input type="text" className="form-control" name="id_nombre_completo_fk.segundo_apellido" id="segundo_apellido" value={formData.id_nombre_completo_fk.segundo_apellido || ""} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="correo" className="label-personalizado mb-2">Correo electrónico</label>
                                <input type="email" className="form-control" name="correo" id="correo" value={formData.correo} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="correo_secundario" className="label-personalizado mb-2">Correo electrónico secundario </label>
                                <input type="email" className="form-control" name="correo_secundario" id="correo" value={formData.correo_secundario} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="paisProcedencia" className="label-personalizado mb-2">País de procedencia </label>
                                <select className="form-control" name="pais_procedencia" id="pais_procedencia" value={formData.pais_procedencia} onChange={handleChange} required>
                                    <option value="">Seleccione un país</option>
                                    {Paises.map((pais) => (
                                        <option key={pais.value} value={pais.value}> {pais.label} </option>))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="sitioWeb" className="label-personalizado mb-2" >Página personal</label>
                                <input type="text" className="form-control" name="sitio_web" id="sitio_web" value={formData.sitio_web} onChange={handleChange} pattern="^[^\s]+(\.[^\s]+)+$" />
                            </div>

                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6 position-relative">
                                <label htmlFor="categoriaEnRegimen" className="label-personalizado mb-2">Categoría en régimen </label>
                                <select className="form-select seleccion" name="categoria_en_regimen" id="categoria_en_regimen" value={formData.categoria_en_regimen} onChange={handleChange} required>
                                    <option value="">Seleccionar categoría</option>
                                    <option value="Catedrático">Catedrático</option>
                                    <option value="Exbecario">Exbecario</option>
                                    <option value="Instructor">Instructor</option>
                                    <option value="Interino Bachiller">Interino Bachiller</option>
                                    <option value="Interino Licenciado">Interino Licenciado</option>
                                    <option value="Profesor Adjunto">Profesor Adjunto</option>
                                    <option value="Profesor Asociado">Profesor Asociado</option>
                                    <option value="No Aplica">No Aplica</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="unidad_base" className="label-personalizado mb-2">Unidad base</label>
                                <input type="text" className="form-control" name="unidad_base" id="unidad_base" value={formData.unidad_base} onChange={handleChange} required />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="universidadNombre" className="label-personalizado mb-2">Universidad </label>
                                <Autocomplete className="universidadAuto"
                                    value={formData.universidad_fk}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            setFormData({
                                                ...formData,
                                                universidad_fk: { nombre: newValue, pais: formData.universidad_fk.pais },
                                            });
                                        } else if (newValue && newValue.inputValue) {
                                            // Create a new value from the user input
                                            setFormData({
                                                ...formData,
                                                universidad_fk: { nombre: newValue.inputValue, pais: formData.universidad_fk.pais },
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                universidad_fk: { nombre: newValue.nombre, pais: formData.universidad_fk.pais },
                                            });
                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);

                                        const { inputValue } = params;
                                        // Suggest the creation of a new value
                                        const isExisting = options.some((option) => inputValue === option.nombre);
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
                                    id="universidad_nombre"
                                    options={obtenerUniversidadesUnicasPorNombre(universidades)}
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
                            </div >
                            <div className="col-md-6">
                                <label htmlFor="universidadPais" className="label-personalizado mb-2">País de la Universidad</label>
                                <Autocomplete
                                    value={formData.universidad_fk}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            setFormData({
                                                ...formData,
                                                universidad_fk: { nombre: formData.universidad_fk.nombre, pais: newValue },
                                            });
                                        } else if (newValue && newValue.inputValue) {
                                            // Create a new value from the user input
                                            setFormData({
                                                ...formData,
                                                universidad_fk: { nombre: formData.universidad_fk.nombre, pais: newValue.inputValue },
                                            });
                                        } else {
                                            setFormData({
                                                ...formData,
                                                universidad_fk: { nombre: formData.universidad_fk.nombre, pais: newValue.pais },
                                            });
                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);

                                        const { inputValue } = params;
                                        // Suggest the creation of a new value
                                        const isExisting = options.some((option) => inputValue === option.pais);
                                        if (inputValue !== '' && !isExisting) {
                                            filtered.push({
                                                inputValue,
                                                pais: `Añadir "${inputValue}"`,
                                            });
                                        }

                                        return filtered;
                                    }}
                                    selectOnFocus
                                    clearOnBlur
                                    handleHomeEndKeys
                                    id="universidad_pais"
                                    options={obtenerUniversidadesUnicasPorPais(universidades)}
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
                                        return option.pais;
                                    }}
                                    renderOption={(props, option) => <li {...props}>{option.pais}</li>}
                                    sx={{ width: 300 }}
                                    freeSolo
                                    renderInput={(params) => (
                                        <TextField {...params} className="form-control" />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="row mb-4 mt-4">
                            <div className="col-md-6 position-relative">
                                <label htmlFor="gradoMaximo" className="label-personalizado mb-2">Grado máximo </label>
                                <select className="form-select seleccion" name="grado_maximo" id="grado_maximo" value={formData.grado_maximo} onChange={handleChange}>
                                    <option value="">Seleccionar grado</option>
                                    <option value="Br">Bachiller</option>
                                    <option value="Lic">Licenciado</option>
                                    <option value="Mtr">Máster</option>
                                    <option value="Dr">Doctor</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="areaEspecialidad" className="label-personalizado mb-2">Área de especialidad </label>
                                <input type="text" className="form-control" name="id_area_especialidad_fk.nombre" id="areaEspecialidad" value={formData.id_area_especialidad_fk.nombre} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mt-4">
                                <Tooltip title="Separar areas secundarias con coma" placement="right-start">
                                    <label data-toggle="tooltip" data-placement="top" title="Este es un tooltip de Bootstrap" htmlFor="areaEspecialidadSecundaria" className="label-personalizado mb-2">Áreas de especialidad secundarias</label>
                                </Tooltip>
                                <input type="text" className="form-control" name="id_area_especialidad_secundaria_fk.nombre" id="areaEspecialidadSecundaria" value={formData.id_area_especialidad_secundaria_fk.nombre} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <Upload mode={mode} handleFileChange={handleFileChange} formData={formData} icono2={icono2} />
                            </div>
                        </div>
                        <hr></hr>
                        {mode === 2 && (
                            <>
                        <div>
                        {togglePropuestas && propuestas.length > 0 && (
                            <div>
                            <label className="label-personalizado mb-2 h4" htmlFor="propuestas">Propuestas Asociadas </label>
                            <ul>
                                {propuestas.map((propuesta, index) => (
                                <li key={index}>{propuesta}</li>
                                ))}
                            </ul>
                            </div>
                        )}
                            <div className="d-flex justify-content-center align-items-center">
                                <button id="boton-personalizado" type="button" className='table-button border-0 p-2 rounded text-white' onClick={handleToggleClick}>
                                {togglePropuestas ? 'Ocultar Propuestas' : 'Mostrar Propuestas'}
                                </button>
                            </div>
                        </div>
                        <hr></hr>
                        </>
                        )}
                        <div className="d-flex flex-column">
                            <label htmlFor="titulos" className="label-personalizado mb-2 h5">Títulos</label>
                            <FormularioDinamico configuracion={configuracionTitulos} items={titulos} setItems={setTitulos}  itemName="Titulo"/>
                        </div>
                        <hr></hr>                        
                        <div className="d-flex flex-column">
                            <label htmlFor="telefonos" className="label-personalizado mb-2 h5">Teléfonos </label>
                             <FormularioDinamico configuracion={configuracionTelefonos} items={telefonos} setItems={setTelefonos} itemName="Telefono"/>
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

AcademicosForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    academico: PropTypes.object,
}