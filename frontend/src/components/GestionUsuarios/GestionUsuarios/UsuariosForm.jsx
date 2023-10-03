import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {Toaster, toast} from 'react-hot-toast'
import { obtenerAcademicos } from "../../../api/gestionAcademicos";
import {obtenerEvaluadores} from "../../../api/gestionEvaluadores"
export const UsuariosForm = ({onSubmit, mode, usuario, onCancel, onDelete }) => {
  // Cargar informacion
  const [academicos, setAcademicos] = useState([]);
  const [academicosFilter, setAcademicosFilter] = useState([]);
  const [evaluadores, setEvaluadores] = useState([]);
  //Cargan todos los academicos y evaluadores, para poderlos asignar
  useEffect(()=>{

  },[])
  const [formData, setFormData] = useState({
    correo: usuario ? usuario.correo : "",
    rol: usuario ? usuario.groups[0] : "",
    password:"",
    confirmar_contrasena:"",
    academico_fk: usuario ? usuario.id_academico_fk : {},
    evaluador_fk: usuario ? usuario.id_evaluador_fk : {}
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.includes('.')) {
        const keys = name.split('.');
        setFormData(prev => ({
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value
          }
        }));
      } else {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
  };

//   const validatePassword = (contrasena) => {
//     const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&.*])[A-Za-z\d!@#$%^&.*]{8,}$/;
//     return passwordRegex.test(contrasena);
// };

  const sendForm = (event) => {
    event.preventDefault();
    console.log(formData.contrasena)
    // if (validatePassword(formData.contrasena) == false) {
    //     alert("La contraseña debe contener mínimo 8 caracteres, que combine mayúsculas, minúsculas, números y símbolos !@#$%^&.");
    //     return;
    // }

    if (formData.contrasena != formData.confirmar_contrasena) {
        alert("Las contraseñas no coinciden.");
        return;
    }
    const dataToSend = { ...formData };
    delete dataToSend.confirmar_contrasena;

    const jsonData = JSON.stringify(dataToSend);
    onSubmit(jsonData);
  };

    return(
        <>
        <div className="modal-header">
            <h2>{mode == 1? ("Agregar usuario(a)"):("Editar usuario(a)")}</h2>
        </div>
        <form onSubmit={sendForm} className='d-flex flex-column'>
            <div className="modal-body">
                <div className="container">
                    <div className="col">
                        <div className="row"> 
                            <label className="col-sm-4 control-label" htmlFor="correo">Correo electrónico</label>      
                            <div className="col-sm-8">
                                <input type="email" name="id_correo" id="id_correo" value={formData.correo} onChange={handleChange} required/> 
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <label className="col-sm-4 control-label" htmlFor="rol">Rol</label>
                                <div className="col-sm-8">
                                    <select name="rol" id="rol" value={formData.rol} onChange={handleChange}>
                                        <option value="">Seleccione un rol</option>
                                        <option value="administrador">Administrador</option>
                                        <option value="investigador">Investigador</option>                        
                                        <option value="evaluador">Evaluador</option>
                                        <option value="investigador-Evaluador">Investigador y Evaluador</option>
                                        <option value="invitado">Invitado</option>
                                    </select>
                                </div>
                        </div>
                        <br/>
                        <div className="row">
                            <label className="col-sm-4 control-label" htmlFor="contrasena">Contraseña</label>
                            <div className="col-sm-8">
                                <input type="password" name="password" id="contrasena" value={formData.password} onChange={handleChange} required/>
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <label className="col-sm-4 control-label" htmlFor="confirmarContrasena">Confirmar contraseña</label>
                                <div className="col-sm-8">
                                    <input type="password" name="confirmar_contrasena" id="confirmar_contrasena" value={formData.confirmar_contrasena} onChange={handleChange} required/>
                                </div>
                        </div>
                        <br/>
                        <div className="row">
                            <label className="col-sm-4 control-label" htmlFor="asociarAcademico">Asociar académico</label>
                            <div className="col-sm-8">
                                <input type="text" name="asociar_academico" id="asociar_academico" value={formData.asociar_academico} onChange={handleChange}/> 
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <label className="col-sm-4 control-label" htmlFor="asociarEvaluador">Asociar evaluador</label>
                            <div className="col-sm-8">
                                <input type="text" name="asociar_evaluador" id="asociar_evaluador" value={formData.asociar_evaluador} onChange={handleChange}/> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-footer">
                <div className="row">
                    <div className="col">
                        <button type="submit" className='table-button border-0 p-2 rounded text-white'>
                            {mode === 1 ? "Agregar" : "Editar"}
                        </button>
                    </div>
                    <div className="col">
                        {mode === 2 && (
                            <button type="button" onClick={onDelete} className='delete-button border-0 p-2 rounded text-white'> Eliminar </button>
                        )}
                    </div>
                    <div className="col">
                        <button type="button" onClick={onCancel} className='cancel-button border-0 p-2 rounded text-white'> Cancelar </button>
                    </div>
                </div>
            </div>
        
        </form>
    </>)
}

UsuariosForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    usuario: PropTypes.object
};