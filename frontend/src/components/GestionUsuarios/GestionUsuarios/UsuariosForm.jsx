import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Toaster, toast } from "react-hot-toast";
import { obtenerAcademicos } from "../../../api/gestionAcademicos";
import { obtenerEvaluadores } from "../../../api/gestionEvaluadores";
import icono from '../../../assets/person-i.png';


export const UsuariosForm = ({onSubmit, mode, usuario, onCancel,onDelete,}) => {
    // Cargar informacion
    const [academicos, setAcademicos] = useState([]);
    const [academicosFilter, setAcademicosFilter] = useState([]);
    const [evaluadores, setEvaluadores] = useState([]);
    const [evaluadoresFilter, setEvaluadoresFilter] = useState([]);
    //Cargan todos los academicos y evaluadores, para poderlos asignar
    useEffect(() => {
        loadAcademicos();
        loadEvaluadores();
    }, []);

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
                                    <label htmlFor="correo" className="label-personalizado mb-2">Correo electrónico</label>
                                    <input type="email" className="form-control" name="correo" id="correo" value={formData.correo} onChange={handleChange} required/>
                                </div>
                            </div>  
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="rol" className="label-personalizado mb-2">Rol</label>
                                    <select className="form-select seleccion" name="rol" id="rol" value={formData.rol} onChange={handleChange} required>
                                        <option value="" disabled defaultValue={""}>Seleccione un rol</option>
                                        <option value="administrador">Administrador</option>
                                        <option value="academico">Investigador</option>
                                        <option value="evaluador">Evaluador</option>
                                        <option value="investigador-Evaluador">Investigador y Evaluador</option>
                                        <option value="invitado">Invitado</option>
                                    </select>
                                </div>
                            </div>  
                    </div> 


                    <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="contrasena" className="label-personalizado mb-2">Contraseña</label>
                                    <input type="password" className="form-control" name="password" id="contrasena" value={formData.password} onChange={handleChange} required={mode !== 2 ? true : undefined}/>
                                </div>
                            </div>  
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="confirmarContrasena" className="label-personalizado mb-2">Confirmar contraseña</label>
                                    <input type="password" className="form-control" name="confirmar_contrasena" id="confirmar_contrasena" value={formData.confirmar_contrasena} onChange={handleChange} required={mode !== 2 ? true : undefined}/>
                                </div>
                            </div>  
                    </div> 


                    
                    {formData.rol==="academico" && (
                        <>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="asociarAcademico" className="label-personalizado mb-2">Asociar Investigador</label>
                                        <div className="position-relative">
                                                <input type="text" className="form-control" name="asociar_academico" id="asociar_academico" value={formData.asociar_academico} onChange={handleChange}/>
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
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div> 
                            </div>  
                        </>
                    )}   
       
                    {formData.rol==="evaluador" && (
                        <>
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="asociarEvaluador" className="label-personalizado mb-2">Asociar Evaluador</label>
                                        <div className="position-relative">
                                        <input type="text" className="form-control" name="asociar_evaluador" id="asociar_evaluador" value={formData.asociar_evaluador} onChange={handleChange}/>
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
                            </div>  
                        </>
                    )}
                </div>
            </div>
                 
            <div className="modal-footer justify-content-center">
                <div className="row">
                    <div className="col">
                        <button id="boton-personalizado2" type="submit" className="table-button border-0 p-2 rounded text-white">
                            {mode === 1 ? "Agregar" : "Guardar"}
                        </button>
                        </div>
                    <div className="col">
                        {mode === 2 && (
                            <button id="boton-personalizado2" type="button" onClick={onDelete} className="delete-button border-0 p-2 rounded text-white">
                                {" "}
                                Eliminar{" "}
                            </button>
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
