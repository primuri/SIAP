import { useState } from "react";
import PropTypes from 'prop-types';

export const PropuestasForm = ({onSubmit, mode, propuesta, onCancel, onDelete, academicos }) => {
    // Cargar informacion
    console.log(propuesta)
    const [formData, setFormData] = useState({
        detalle: propuesta ? propuesta.detalle : "",
        documento: propuesta ? propuesta.documento : "",
        id_codigo_cimpa_fk: propuesta ? propuesta.id_codigo_cimpa_fk : {
            nombre: propuesta ? propuesta.id_codigo_cimpa_fk.nombre : "",
            detalle: propuesta ? propuesta.id_codigo_cimpa_fk.detalle : "",
            estado: propuesta ? propuesta.id_codigo_cimpa_fk.estado : "",
            actividad: propuesta ? propuesta.id_codigo_cimpa_fk.actividad : "",
            fecha_vigencia: propuesta ? propuesta.id_codigo_cimpa_fk.fecha_vigencia : "",
            descripcion: propuesta ? propuesta.id_codigo_cimpa_fk.descripcion : "",
            id_codigo_cimpa : propuesta ? propuesta.id_codigo_cimpa_fk.id_codigo_cimpa : "",
            id_colaborador_principal_fk: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk : {
                tipo: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.tipo : "Principal",
                estado: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.estado : "",
                carga: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.carga : "",
                id_vigencia_fk: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk : {
                    fecha_inicio: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio : "",
                    fecha_fin: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin : ""
                },
                id_academico_fk: propuesta && propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk ? propuesta.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk : ""
            }
        }
    });


    
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        const keys = name.split('.');
        switch (keys.length) {
            case 1:
                setFormData(prev => ({ ...prev, [keys[0]]: value }));
                break;
            case 2:
                setFormData(prev => ({
                    ...prev,
                    [keys[0]]: {
                        ...prev[keys[0]],
                        [keys[1]]: value
                    }
                }));
                break;
            case 3:
                setFormData(prev => ({
                    ...prev,
                    [keys[0]]: {
                        ...prev[keys[0]],
                        [keys[1]]: {
                            ...prev[keys[0]][keys[1]],
                            [keys[2]]: value
                        }
                    }
                }));
                break;
            case 4:
                setFormData(prev => ({
                    ...prev,
                    [keys[0]]: {
                        ...prev[keys[0]],
                        [keys[1]]: {
                            ...prev[keys[0]][keys[1]],
                            [keys[2]]: {
                                ...prev[keys[0]][keys[1]][keys[2]],
                                [keys[3]]: value
                            }
                        }
                    }
                }));
                break;
            default:
                console.error("Unhandled form structure depth!");
        }
    };
    
  
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const fileName = file ? file.name : ""; 
        setFormData(prev => ({
            ...prev,
            documento: fileName
        }));
    };
    
    

  const sendForm = (event) => {
    event.preventDefault();
    const jsonData = JSON.stringify(formData);
    onSubmit(jsonData);
  };

    return(
        <>
        <div className="modal-header">
            <h2>{mode == 1? ("Agregar una propuesta"):("Editar propuesta")}</h2>
        </div>

        <form onSubmit={sendForm} className='d-flex flex-column'>
            <div className="modal-body">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="codigoCimpa">Código CIMPA</label>
                            <input type="text" name="id_codigo_cimpa_fk.id_codigo_cimpa" id="id_codigo_cimpa_fk.id_codigo_cimpa" value={formData.id_codigo_cimpa_fk.id_codigo_cimpa} onChange={handleChange} required/> 
                        </div>
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="nombre">Nombre</label>
                            <input type="text" name="id_codigo_cimpa_fk.nombre" id="id_codigo_cimpa_fk.nombre" value={formData.id_codigo_cimpa_fk.nombre} onChange={handleChange} required/> 
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="estado">Estado Propuesta</label>
                            <select name="id_codigo_cimpa_fk.estado" id="id_codigo_cimpa_fk.estado" value={formData.id_codigo_cimpa_fk.estado} onChange={handleChange} required>
                                <option value="">Seleccione el estado</option>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="fechaVigencia">Fecha vigencia</label>
                            <input type="date" name="id_codigo_cimpa_fk.fecha_vigencia" id="id_codigo_cimpa_fk.fecha_vigencia" value={formData.id_codigo_cimpa_fk.fecha_vigencia} onChange={handleChange} required/> 
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="descripcion">Descripción</label>
                            <input type="text" name="id_codigo_cimpa_fk.descripcion" id="id_codigo_cimpa_fk.descripcion" value={formData.id_codigo_cimpa_fk.descripcion} onChange={handleChange} required/> 
                        </div>
                        <div className="col">
                        <label className="col-sm-4 control-label" htmlFor="actividad">Actividad</label>
                        <select name="id_codigo_cimpa_fk.actividad" id="id_codigo_cimpa_fk.actividad" value={formData.id_codigo_cimpa_fk.actividad} onChange={handleChange}>
                                <option value="">Seleccione la actividad</option>
                                <option value="Acción social">Acción social</option>
                                <option value="Investigación">Investigación</option>
                            </select> 
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="detalle">Detalle de la propuesta</label>
                            <input type="text" name="id_codigo_cimpa_fk.detalle" id="id_codigo_cimpa_fk.detalle" value={formData.id_codigo_cimpa_fk.detalle} onChange={handleChange}/> 
                        </div>



                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk">Colaborador(a) principal</label>
                            <select name="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk" id="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk" value={formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk} onChange={handleChange}>
                                <option value="">Seleccione al Colaborador</option>
                                {academicos && academicos.length > 0 && academicos.map(academico => (
                                    <option key={academico.id_academico} value={academico.id_academico}>
                                        {academico.id_nombre_completo_fk.nombre + " " + academico.id_nombre_completo_fk.apellido + " " + academico.id_nombre_completo_fk.segundo_apellido}
                                    </option>
                                ))}
                            </select>
                        </div>


                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="estadoColaborador">Estado Colaborador</label>
                            <select name="id_codigo_cimpa_fk.id_colaborador_principal_fk.estado" id="id_codigo_cimpa_fk.id_colaborador_principal_fk.estado" value={formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.estado} onChange={handleChange} required>
                                <option value="">Seleccione el estado</option>
                                <option value="Activo">Activo</option>
                                <option value="Inactivo">Inactivo</option>
                            </select>
                        </div>
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="cargaColaborador">Carga del colaborador</label>
                            <select name="id_codigo_cimpa_fk.id_colaborador_principal_fk.carga" id="id_codigo_cimpa_fk.id_colaborador_principal_fk.carga" value={formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.carga} onChange={handleChange}>
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
                        <div className="col"> </div>
                        <div className="col"> 
                            <label className="col-sm-auto control-label">Vigencia del Colaborador</label>
                        </div>
                        <div className="col"> </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                             <label className="col-sm-4 control-label" htmlFor="inicioVigenciaColaborador">Fecha de inicio</label>
                            <input type="date" name="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio" id="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio" value={formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio} onChange={handleChange}/>
                       
                        </div>
                        <div className="col">
                            <label className="col-sm-5 control-label" htmlFor="finVigenciaColaborador">Fecha finalización</label>
                            <input type="date" name="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin" id="id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin" value={formData.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin} onChange={handleChange}/>
                        </div>
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="documento_asociado.documento">Documento</label>
                            <input type="file" name="documento" id="documento" onChange={handleFileChange}/>
                        </div>
                        <div className="col">
                            <label className="col-sm-4 control-label" htmlFor="documento_asociado.detalle">Detalle del Documento</label>
                            <input type="text" name="detalle" id="detalle" value={formData.detalle} onChange={handleChange}/>
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

PropuestasForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    propuesta: PropTypes.object,
    academicos: PropTypes.arrayOf(PropTypes.object).isRequired
};
