import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Toaster, toast } from "react-hot-toast";
import { obtenerAcademicos } from "../../../api/gestionAcademicos";
import { obtenerEvaluadores } from "../../../api/gestionEvaluadores";
import icono from '../../../assets/person-i.png';
import { Confirmar } from '../../../utils/Confirmar'

export const UsuariosForm = ({ onSubmit, mode, usuario, onCancel, onDelete, }) => {
    // Cargar informacion
    const [academicos, setAcademicos] = useState([]);
    const [academicosFilter, setAcademicosFilter] = useState([]);
    const [evaluadores, setEvaluadores] = useState([]);
    const [evaluadoresFilter, setEvaluadoresFilter] = useState([]);
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);

    //Cargan todos los academicos y evaluadores, para poderlos asignar
    useEffect(() => {
        loadAcademicos();
        loadEvaluadores();
    }, []);

    const [showPassword, setShowPassword] = useState(false);

    async function loadAcademicos() {
        try {
            const res = await obtenerAcademicos(localStorage.getItem("token"));
            setAcademicos(res.data);
        } catch (error) {
            toast.error("Error al cargar los datos de academicos", {
                duration: 4000,
                position: "bottom-right",
                style: {
                    background: "#670000",
                    color: "#fff",
                },
            });
        }
    }
    async function loadEvaluadores() {
        try {
            const res = await obtenerEvaluadores(localStorage.getItem("token"));
            setEvaluadores(res.data);
        } catch (error) {
            toast.error("Error al cargar los datos de evaluadores", {
                duration: 4000,
                position: "bottom-right",
                style: {
                    background: "#670000",
                    color: "#fff",
                },
            });
        }
    }

    const [formData, setFormData] = useState({
        id: usuario ? usuario.id : "",
        correo: usuario ? usuario.correo : "",
        rol: usuario ? usuario.groups[0] : "",
        password: "",
        confirmar_contrasena: "",
        academico_fk: usuario
            ? usuario.academico_fk.id_nombre_completo_fk
                ? usuario.academico_fk.id_academico
                : ""
            : "",
        evaluador_fk: usuario
            ? usuario.evaluador_fk.id_nombre_completo_fk
                ? usuario.evaluador_fk.id_evaluador
                : ""
            : "",
        asociar_academico: usuario
            ? usuario.academico_fk.id_nombre_completo_fk
                ? usuario.academico_fk.correo
                : ""
            : "",
        asociar_evaluador: usuario
            ? usuario.evaluador_fk.id_nombre_completo_fk
                ? usuario.evaluador_fk.correo
                : ""
            : "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        // Actualizar el estado del formulario primero
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "asociar_academico") {
            if (value === "") {
                setAcademicosFilter([]);
            } else {
                const filteredAcademicos = academicos.filter((academico) =>
                    academico.correo.toLowerCase().includes(value.toLowerCase())
                );
                setAcademicosFilter(filteredAcademicos);
            }
        } else if (name === "asociar_evaluador") {
            if (value === "") {
                setEvaluadoresFilter([]);
            } else {
                const filteredEvaluadores = evaluadores.filter((evaluador) =>
                    evaluador.correo.toLowerCase().includes(value.toLowerCase())
                );
                setEvaluadoresFilter(filteredEvaluadores);
            }
        } else if (name.includes(".")) {
            const keys = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value,
                },
            }));
        }
    };

    const handleSelectAcademico = (e, academico) => {
        setFormData((prev) => ({
            ...prev,
            asociar_academico: academico.correo,
            academico_fk: academico.id_academico,
        }));
        setAcademicosFilter([]); // Limpiar la lista desplegable
    };
    const handleSelectEvaluador = (e, evaluador) => {
        setFormData((prev) => ({
            ...prev,
            asociar_evaluador: evaluador.correo,
            evaluador_fk: evaluador.id_evaluador,
        }));
        setEvaluadoresFilter([]); // Limpiar la lista desplegable
    };

    const validatePassword = (contrasena) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&.*])[A-Za-z\d!@#$%^&.*]{8,}$/;
        return passwordRegex.test(contrasena);
    };

    const sendForm = (event) => {
        event.preventDefault();

        // Validación de contraseña para el modo de creación o si en el modo de edición se proporciona una contraseña
        if ((mode === 1 || (mode === 2 && formData.password !== "")) && validatePassword(formData.password) === false) {
            alert("La contraseña debe contener mínimo 8 caracteres, que combine mayúsculas, minúsculas, números y símbolos !@#$%^&.");
            return;
        }

        // Validación de coincidencia de contraseña para el modo de creación o si en el modo de edición se proporciona una contraseña
        if ((mode === 1 || (mode === 2 && formData.password !== "")) && formData.password !== formData.confirmar_contrasena) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const dataToSend = { ...formData };

        // Limpieza de datos que no se enviarán
        delete dataToSend.confirmar_contrasena;
        delete dataToSend.asociar_academico;
        delete dataToSend.asociar_evaluador;
        if (dataToSend.rol === 'evaluador') {
            if (dataToSend.academico_fk) {
                dataToSend.academico_fk = null
            }
        } else if (dataToSend.rol === 'academico') {
            if (dataToSend.evaluador_fk) {
                dataToSend.evaluador_fk = null
            }
        }
        // Asignar el rol al array de grupos
        dataToSend.groups = [dataToSend.rol];
        delete dataToSend.rol;

        // Si estamos en modo de edición y la contraseña está vacía, la eliminamos
        if (mode === 2 && dataToSend.password === "") {
            delete dataToSend.password;
        }

        const jsonData = JSON.stringify(dataToSend);
        console.log(dataToSend);
        onSubmit(jsonData);
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
        <>
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
                                {mode === 1 ? "Agregar usuario(a)" : "Editar usuario(a)"}
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
            <form onSubmit={sendForm} className="d-flex flex-column">
                <div className="modal-body" >
                    <div className="container">


                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="correo" className="label-personalizado mb-2">Correo electrónico <span className="required">*</span> </label>
                                    <input type="email" className="form-control" name="correo" id="correo" value={formData.correo} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="rol" className="label-personalizado mb-2">Rol <span className="required">*</span> </label>
                                    <select className="form-select seleccion" name="rol" id="rol" value={formData.rol} onChange={handleChange} required>
                                        <option value="" disabled defaultValue={""}>Seleccione un rol</option>
                                        <option value="administrador">Administrador(a)</option>
                                        <option value="academico">Investigador(a)</option>
                                        <option value="evaluador">Evaluador(a)</option>
                                        <option value="investigador-evaluador">Investigador(a) y Evaluador(a)</option>
                                        <option value="invitado">Invitado(a)</option>
                                    </select>
                                </div>
                            </div>
                        </div>


                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="contrasena" className="label-personalizado mb-2">Contraseña <span className="required">*</span> </label>
                                    <input type={showPassword ? 'text' : 'password'} className="form-control" name="password" id="contrasena" value={formData.password} onChange={handleChange} required={mode !== 2 ? true : undefined} />
                                    <button type="button" className="btn ojo" style={{ position: 'absolute', top: '58.5%', right: '52%' }} onClick={() => setShowPassword(!showPassword)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4AACE1" className="bi bi-eye" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                    </svg> </button>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="confirmarContrasena" className="label-personalizado mb-2">Confirmar contraseña <span className="required">*</span> </label>
                                    <input type={showPassword ? 'text' : 'password'} className="form-control" name="confirmar_contrasena" id="confirmar_contrasena" value={formData.confirmar_contrasena} onChange={handleChange} required={mode !== 2 ? true : undefined} />
                                </div>
                            </div>
                        </div>


                        <div className="row mb-4">
                            {(formData.rol === "academico" || formData.rol === "investigador-evaluador") && (
                                <>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="asociarAcademico" className="label-personalizado mb-2">Asociar Investigador(a)</label>
                                            <div className="position-relative">
                                                <input type="text" className="form-control" name="asociar_academico" id="asociar_academico" value={formData.asociar_academico} onChange={handleChange} />
                                                {(academicosFilter.length > 0) && (
                                                    <div
                                                        className=" bg-light position-absolute d-flex flex-column justify-content-center shadow ps-1 pe-1 row-gap-1 overflow-y-scroll pt-2"
                                                        style={{ maxHeight: "40px" }}
                                                    >
                                                        {academicosFilter.map((academico) => {
                                                            return (
                                                                <div
                                                                    key={academico.id_academico}
                                                                    className=" pointer-event ms-1"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={(e) => {
                                                                        handleSelectAcademico(e, academico);
                                                                    }}
                                                                >
                                                                    {academico.correo}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )}

                            {(formData.rol === "evaluador" || formData.rol === "investigador-evaluador") && (
                                <>

                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="asociarEvaluador" className="label-personalizado mb-2">Asociar Evaluador(a)</label>
                                            <div className="position-relative">
                                                <input type="text" className="form-control" name="asociar_evaluador" id="asociar_evaluador" value={formData.asociar_evaluador} onChange={handleChange} />
                                                {evaluadoresFilter.length > 0 && (
                                                    <div
                                                        className=" bg-light position-absolute d-flex flex-column justify-content-center shadow ps-1 pe-1 row-gap-1 overflow-y-scroll pt-2"
                                                        style={{ maxHeight: "40px" }}
                                                    >
                                                        {evaluadoresFilter.map((evaluador) => {
                                                            return (
                                                                <div
                                                                    key={evaluador.id_evaluador}
                                                                    className=" pointer-event ms-1"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={(e) => {
                                                                        handleSelectEvaluador(e, evaluador);
                                                                    }}
                                                                >
                                                                    {evaluador.correo}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </>
                            )}
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
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="usuario(a)" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="usuario(a)" />)}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            <Toaster></Toaster>
        </>
    );
};

UsuariosForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    usuario: PropTypes.object,
};
