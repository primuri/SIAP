import { useState } from "react";
import PropTypes from 'prop-types';

export const PropuestasForm = ({onSubmit, mode, propuesta, onCancel, onDelete }) => {
    // Cargar informacion
  const [formData, setFormData] = useState({
    id_codigo_cimpa: propuesta ? propuesta.id_codigo_cimpa : "",
    nombre: propuesta ? propuesta.nombre : "",
    detalle: propuesta ? propuesta.detalle : "",
    estado: propuesta ? propuesta.estado : "",
    descripcion: propuesta ? propuesta.descripcion : "",
    fecha_vigencia: propuesta ? propuesta.fecha_vigencia : "",
    actividad: propuesta ? propuesta.actividad : "",
    documento_asociado: propuesta ? propuesta.documento_asociado : "null",
    colaborador_principal: propuesta ? propuesta.colaborador_principal : { tipo: "Principal", carga: "", estado: "", id_vigencia_fk: {fecha_inicio: "", fecha_fin: ""}}
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
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileName = file ? file.name : ""; 
    setFormData({
      ...formData,
      documento_asociado: fileName,
    });
  };

  const sendForm = (event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(formData);
    onSubmit(jsonData);
  };

    return(
        <>
        <div class="modal-header">
            <h2>{mode == 1? ("Agregar una propuesta"):("Editar propuesta")}</h2>
        </div>

        <form onSubmit={sendForm} className='d-flex flex-column'>
            <div class="modal-body">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="codigoCimpa">Código CIMPA</label>
                            <input type="text" name="id_codigo_cimpa" id="codigoCimpa" value={formData.id_codigo_cimpa} onChange={handleChange} required/> 
                        </div>
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="nombre">Nombre</label>
                            <input type="text" name="nombre" id="nombre" value={formData.nombre} onChange={handleChange} required/> 
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="estado">Estado</label>
                            <input type="text" name="estado" id="estado" value={formData.estado} onChange={handleChange} required/> 
                        </div>
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="fechaVigencia">Fecha vigencia</label>
                            <input type="date" name="fecha_vigencia" id="fecha_vigencia" value={formData.fecha_vigencia} onChange={handleChange} required/> 
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="descripcion">Descripción</label>
                            <input type="text" name="descripcion" id="descripcion" value={formData.descripcion} onChange={handleChange} required/> 
                        </div>
                        <div className="col">
                        <label className="col-sm-4 control-label" htmlFor="actividad">Actividad</label>
                        <select name="actividad" id="actividad" value={formData.actividad} onChange={handleChange}>
                                <option value="">Seleccione la actividad</option>
                                <option value="Acción social">Acción social</option>
                                <option value="Investigación">Investigación</option>
                            </select> 
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="detalle">Detalle</label>
                            <input type="text" name="detalle" id="detalle" value={formData.detalle} onChange={handleChange}/> 
                        </div>
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="colaboradorPrincipal">Colaborador(a) principal</label>
                            <input type="text" name="colaborador_principal.id_academico_fk" id="id_academico_fk" value={formData.colaborador_principal.id_academico_fk} onChange={handleChange} required/>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="estadoColaborador">Estado del colaborador</label>
                            <input type="text" name="colaborador_principal.estado" id="estado" value={formData.colaborador_principal.estado} onChange={handleChange} required/> 
                        </div>
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="cargaColaborador">Carga del colaborador</label>
                            <select name="colaborador_principal.carga" id="carga" value={formData.colaborador_principal.carga} onChange={handleChange}>
                                <option value="">Seleccione la carga</option>
                                <option value="1/8">1/8</option>
                                <option value="1/4">1/4</option>
                                <option value="3/8">3/8</option>
                                <option value="1/2">1/2</option>
                                <option value="5/8">5/8</option>
                            </select>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-auto control-label">Vigencia del colaborador</label>
                        </div>
                        <div className="col">
                            <label className="col-sm-auto control-label" htmlFor="inicioVigenciaColaborador">Fecha de inicio</label>
                            <input type="date" name="colaborador_principal.id_vigencia_fk.fecha_inicio" id="id_vigencia_fk.fecha_inicio" value={formData.colaborador_principal.id_vigencia_fk.fecha_inicio} onChange={handleChange}/>
                        </div>
                        <div className="col">
                            <label className="col-sm-auto control-label" htmlFor="finVigenciaColaborador">Fecha finalización</label>
                            <input type="date" name="colaborador_principal.id_vigencia_fk.fecha_fin" id="id_vigencia_fk.fecha_fin" value={formData.colaborador_principal.id_vigencia_fk.fecha_fin} onChange={handleChange}/>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="documentoAsociado">Documento</label>
                            <input type="file" name="documento_asociado" id="documento_asociado" onChange={handleFileChange}/>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
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

PropuestasForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    propuesta: PropTypes.object
};