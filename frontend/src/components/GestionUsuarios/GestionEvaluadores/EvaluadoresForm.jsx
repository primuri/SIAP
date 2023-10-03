import { useState } from "react";
import PropTypes from 'prop-types';

export const EvaluadoresForm = ({onSubmit, mode, evaluador, onCancel, onDelete }) => {
    // Cargar informacion
  const [formData, setFormData] = useState({
    cedula: evaluador ? evaluador.cedula : "",
    correo: evaluador ? evaluador.correo : "",
    pais_procedencia: evaluador ? evaluador.pais_procedencia : "",
    id_nombre_completo_fk: evaluador ? evaluador.id_nombre_completo_fk : { nombre: "", apellido: "", segundo_apellido: "" },
    id_area_especialidad_fk: evaluador ? evaluador.id_area_especialidad_fk : { nombre: "" },
    universidad: evaluador ? evaluador.universidad : { pais: "", nombre: "" }
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

  const sendForm = (event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(formData);
    onSubmit(jsonData);
  };

    return(
        <>
        <div className="modal-header">
            <h2>{mode == 1? ("Agregar un evaluador(a)"):("Editar evaluador(a)")}</h2>
        </div>

        <form onSubmit={sendForm} className='d-flex flex-column'>
            <div className="modal-body">
                <div className="container">
                    <div className="row">
                        <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="cedula">Cédula</label>
                          <input type="text" name="cedula" id="cedula" value={formData.cedula} onChange={handleChange} required/>
                        </div>
                        <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="nombre">Nombre</label>
                          <input type="text" name="id_nombre_completo_fk.nombre" id="nombre" value={formData.id_nombre_completo_fk.nombre || ""} onChange={handleChange} required/>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="apellido">Apellido</label>
                          <input type="text" name="id_nombre_completo_fk.apellido" id="apellido" value={formData.id_nombre_completo_fk.apellido || ""} onChange={handleChange} required/>
                        </div>
                        <div className="col">
                          <label className="col-sm-4 control-label" htmlFor="segundoApellido">Segundo apellido</label>
                          <input type="text" name="id_nombre_completo_fk.segundo_apellido" id="segundo_apellido" value={formData.id_nombre_completo_fk.segundo_apellido || ""} onChange={handleChange}/>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="correo">Correo</label>
                            <input type="email" name="correo" id="correo" value={formData.correo} onChange={handleChange} required/>
                        </div>
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="paisProcedencia">País de Procedencia</label>
                            <input type="text" name="pais_procedencia" id="pais_procedencia" value={formData.pais_procedencia} onChange={handleChange}/>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="universidadPais">País de la Universidad</label>
                            <input type="text" name="universidad.pais" id="universidadPais" value={formData.universidad.pais} onChange={handleChange} required/>
                        </div>
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="universidadNombre">Nombre de la Universidad</label>
                            <input type="text" name="universidad.nombre" id="universidadNombre" value={formData.universidad.nombre} onChange={handleChange} required/> 
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="areaEspecialidad">Área de especialidad</label>
                            <input type="text" name="id_area_especialidad_fk.nombre" id="areaEspecialidad" value={formData.id_area_especialidad_fk.nombre} onChange={handleChange}/>
                        </div>
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="tipo">Tipo</label>
                            <input type="text" name="tipo" id="tipo" value={formData.tipo} onChange={handleChange}/>
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

EvaluadoresForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    evaluador: PropTypes.object
};