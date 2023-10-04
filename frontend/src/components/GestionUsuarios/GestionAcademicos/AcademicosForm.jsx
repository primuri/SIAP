import { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { FormularioDinamico } from "../../../utils/FomularioDinamico"
import { obtenerTelefonos, obtenerTitulos, obtenerUniversidades } from "../../../api/gestionAcademicos"
import { toast, Toaster } from 'react-hot-toast'
import icono from '../../../assets/person-i.png';

const configuracionTitulos = [
    { campo: 'anio', placeholder: 'Año', tipo: 'number', required: true },
    { campo: 'grado', placeholder: 'Grado', tipo: 'text', required: true },
    { campo: 'detalle', placeholder: 'Detalle', tipo: 'text', required: true },
    { campo: 'institución', placeholder: 'Institución', tipo: 'text', required: true }
]

const configuracionTelefonos = [
    { campo: 'numero_tel', placeholder: 'Número', tipo: 'text', required: true },
]
export const AcademicosForm = ({ onSubmit, mode, academico, onCancel, onDelete }) => {
    const [titulos, setTitulos] = useState([])
    const [telefonos, setTelefonos] = useState([])
    const [universidades, setUniversidades] = useState([])
    const [universidadesFilter, setUniversidadesFilter] = useState([]);
    const [modoUniversidad, setModoUniversidad] = useState(mode == 1 ? "seleccionar" : "agregar")
    // Si hay informacion en el academico, la almacena en formData, sino queda vacía
    const [formData, setFormData] = useState({
        cedula: academico ? academico.cedula : "",
        foto: academico ? academico.foto : "null",
        sitio_web: academico ? academico.sitio_web : "",
        area_de_trabajo: academico ? academico.area_de_trabajo : "",
        grado_maximo: academico ? academico.grado_maximo : "",
        correo: academico ? academico.correo : "",
        categoria_en_regimen: academico ? academico.categoria_en_regimen : "",
        pais_procedencia: academico ? academico.pais_procedencia : "",
        id_nombre_completo_fk: academico ? academico.id_nombre_completo_fk : { nombre: "", apellido: "", segundo_apellido: "" },
        id_area_especialidad_fk: academico ? academico.id_area_especialidad_fk : { nombre: "" },
        universidad_fk: academico ? academico.universidad_fk : { pais: "", nombre: "" }
    })
    //si hay titulos o telefonos los carga
    useEffect(() => {
        if (academico) {
            loadTitulos()
            loadTelefonos()
        }
        loadUniversidades()
    }, [academico])
    useEffect(() => {
        if (modoUniversidad === "agregar" && formData.universidad_fk.id_universidad && mode === 1) {
            setFormData(prevState => ({
                ...prevState,
                universidad_fk: {
                    ...prevState.universidad_fk,
                    id_universidad: formData.universidad_fk.id_universidad,
                    nombre: "",
                    pais: ""
                }
            }));
        }
    }, [modoUniversidad]);
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
    const handleSelectUniversidad = (e, universidad) => {
        setFormData((prev) => ({
            ...prev,
            universidad_fk: universidad
        }));
        setUniversidadesFilter([]); // Limpiar la lista desplegable
    };
    const handleChange = (event) => {
        const { name, value } = event.target
        if (name === "universidad_fk.nombre") {
            if (value === "") {
                setUniversidadesFilter([]);
            } else {
                const filteredUniversidades = universidades.filter(universidad =>
                    universidad.nombre.toLowerCase().includes(value.toLowerCase()) ||
                    universidad.pais.toLowerCase().includes(value.toLowerCase())
                );
                setUniversidadesFilter(filteredUniversidades);
            }
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
        const file = event.target.files[0]
        const fileName = file ? file.name : ""
        setFormData({
            ...formData,
            foto: fileName,
        })
    }

    const sendForm = (event) => {
        event.preventDefault()
        if (titulos.length > 0) {
            formData.titulos = titulos
        }
        if (telefonos.length > 0) {
            formData.telefonos = telefonos
        }
        const jsonData = JSON.stringify(formData)
        onSubmit(jsonData)
    }



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
                                {mode === 1 ? "Agregar académico(a)" : "Editar académico(a)"}
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
                <div className="modal-body justify-content-center" style={{padding: '3vh 4vw'}}>
                    <div className="container ">

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="cedula" className="label-personalizado mb-2">Cédula</label>
                                    <input type="text" className="form-control" name="cedula" id="cedula" value={formData.cedula} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="nombre" className="label-personalizado mb-2">Nombre</label>
                                    <input type="text" className="form-control" name="id_nombre_completo_fk.nombre" id="nombre" value={formData.id_nombre_completo_fk.nombre || ""} onChange={handleChange} required />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="apellido" className="label-personalizado mb-2">Primer Apellido</label>
                                    <input type="text" className="form-control" name="id_nombre_completo_fk.apellido" id="apellido" value={formData.id_nombre_completo_fk.apellido || ""} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="segundoApellido" className="label-personalizado mb-2">Segundo Apellido</label>
                                    <input type="text" className="form-control" name="id_nombre_completo_fk.segundo_apellido" id="segundo_apellido" value={formData.id_nombre_completo_fk.segundo_apellido || ""} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="paisProcedencia" className="label-personalizado mb-2">País de Procedencia</label>
                                <input type="text" className="form-control" name="pais_procedencia" id="pais_procedencia" value={formData.pais_procedencia} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                    <label htmlFor="correo" className="label-personalizado mb-2">Correo electrónico</label>
                                    <input type="email" className="form-control" name="correo" id="correo" value={formData.correo} onChange={handleChange} required />
                            </div>

                        </div>
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="sitioWeb" className="label-personalizado mb-2" >Sitio Web</label>
                                <input type="url" className="form-control" name="sitio_web" id="sitio_web" value={formData.sitio_web} onChange={handleChange} pattern="^[^\s]+(\.[^\s]+)+$" />
                            </div>
                            <div className="col-md-6 position-relative">
                                <label htmlFor="categoriaEnRegimen" className="label-personalizado mb-2">Categoría en Régimen</label>
                                <select className="form-select seleccion" name="categoria_en_regimen" id="categoria_en_regimen" value={formData.categoria_en_regimen} onChange={handleChange}>
                                    <option value="">Seleccionar categoría</option>
                                    <option value="Instructor">Instructor</option>
                                    <option value="Profesor Adjunto">Profesor Adjunto</option>
                                    <option value="Profesor Asociado">Profesor Asociado</option>
                                    <option value="Catedrático">Catedrático</option>
                                </select>
                            </div>
                        </div>

                        <div className="row mb-4">
                            {modoUniversidad === 'seleccionar' ? (
                                <>
                                    <h4 className=" fs-5 mb-4 mt-2">Seleccione una universidad existente</h4>
                                    <div className="col-md-6">
                                        <label htmlFor="universidadNombre" className="label-personalizado mb-2">Universidad</label>
                                        <input
                                            type="text"
                                            name="universidad_fk.nombre"
                                            id="universidadNombre"
                                            value={formData.universidad_fk ? formData.universidad_fk.nombre : ""}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                        {universidadesFilter.length > 0 && (
                                            <div
                                                className=" bg-light position-absolute d-flex flex-column justify-content-center shadow ps-1 pe-1 row-gap-1 overflow-y-scroll pt-2"
                                                style={{ maxHeight: "60px" }}
                                            >
                                                {universidadesFilter.map((universidad) => {
                                                    return (
                                                        <div
                                                            key={universidad.id_universidad}
                                                            className=" pointer-event ms-1"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={(e) => {
                                                                handleSelectUniversidad(e, universidad);
                                                            }}
                                                        >
                                                            {universidad.nombre}-{universidad.pais}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="universidadPais" className="label-personalizado mb-2">País de la Universidad</label>
                                        <input
                                            id="pais_universidad"
                                            type="text"
                                            value={formData.universidad_fk ? formData.universidad_fk.pais : ""}
                                            disabled
                                            className="form-control"
                                        />

                                    </div>
                                    <button type="button" className="rounded mb-2 mt-4" style={{ width: "92%", marginLeft: "2%" }} onClick={(e) => { setModoUniversidad('agregar'); e.preventDefault() }}>Agregar nueva universidad</button>
                                </>
                            ) : (
                                <>
                                    <h4 className=" fs-5 mb-4 mt-2">Agregando una nueva universidad</h4>
                                    <div className="col-md-6">
                                        <label htmlFor="universidadNombre" className="label-personalizado mb-2">Universidad</label>
                                        <input type="text" className="form-control" name="universidad_fk.nombre" id="universidadNombre" value={formData.universidad_fk.nombre} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="universidadPais" className="label-personalizado mb-2">País de la Universidad</label>
                                        <input type="text" className="form-control" name="universidad_fk.pais" id="pais_universidad" value={formData.universidad_fk.pais} onChange={handleChange} required />
                                    </div>
                                    <button className="rounded mb-2 mt-4" style={{ width: "92%", marginLeft: "2%" }} onClick={(e) => { setModoUniversidad('seleccionar'); e.preventDefault() }}>Seleccionar una universidad existente</button>
                                </>
                            )}
                        </div>

                        <div className="d-flex flex-column">
                            <label htmlFor="titulos" className="label-personalizado mb-2">Títulos </label>
                            <FormularioDinamico configuracion={configuracionTitulos} items={titulos} setItems={setTitulos} />
                        </div>
                        <hr></hr>
                        <div className="d-flex flex-column">
                            <label htmlFor="titulos" className="label-personalizado mb-2">Telefonos </label>
                            <FormularioDinamico configuracion={configuracionTelefonos} items={telefonos} setItems={setTelefonos} />
                        </div>

                        <div className="row mb-4 mt-4">
                            <div className="col-md-6 position-relative">
                                <label htmlFor="gradoMaximo" className="label-personalizado mb-2">Grado Máximo</label>
                                <select className="form-control" name="grado_maximo" id="grado_maximo" value={formData.grado_maximo} onChange={handleChange}>
                                    <option value="">Seleccionar grado</option>
                                    <option value="Br">Bachiller</option>
                                    <option value="Lic">Licenciado</option>
                                    <option value="Mtr">Máster</option>
                                    <option value="Dr">Doctor</option>
                                </select><span className="select_arrow"></span>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="areaEspecialidad" className="label-personalizado mb-2">Área de Especialidad</label>
                                <input type="text" className="form-control" name="id_area_especialidad_fk.nombre" id="areaEspecialidad" value={formData.id_area_especialidad_fk.nombre} onChange={handleChange} />
                            </div>
                        </div>


                        <div className="row mb-4">

                            <div className="col-md-6">
                                <label htmlFor="areaTrabajo" className="label-personalizado mb-2">Área de Trabajo</label>
                                <input type="text" className="form-control" name="area_de_trabajo" id="area_de_trabajo" value={formData.area_de_trabajo} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <label className="label-personalizado mb-2" htmlFor="foto">Subir Foto</label>
                            <input type="file" className="form-control" name="foto" id="foto" onChange={handleFileChange} />
                        </div>

                    </div>
                </div>

                <div className="modal-footer justify-content-center position-sticky bottom-0">
                    <div className="row">
                        <div className="col">
                            <button id="boton-personalizado" type="submit" className='table-button border-0 p-2 rounded text-white'>
                                {mode === 1 ? "Agregar" : "Guardar"}
                            </button>
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <button id="boton-personalizado" type="button" onClick={onDelete} className='delete-button border-0 p-2 rounded text-white'> Eliminar </button>
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