import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

export const ColaboradorSecundarioForm = ({ mode, colaborador, setCambios, academicos }) => {
  const [fileData, setFileData] = useState(null);
  const [academicosFilter, setAcademicosFilter] = useState([]);
  const [colaboradorData, setColaboradorData] = useState(colaborador || {});
  const defaultFormData = {
    id_colaborador_secundario: colaborador ? colaborador.id_colaborador_secundario : "",
    tipo: colaborador ? colaborador.tipo : "Secundario",
    estado: colaborador ? colaborador.estado : "",
    carga: colaborador ? colaborador.carga : "",
    id_vigencia_fk: {
        id_vigencia: "",
        fecha_inicio: "",
        fecha_fin: ""
    },
    id_academico_fk: {
        id_academico: ""
    },
    asociar_academico: ""
  };
  const initialFormData = colaborador || defaultFormData;
  const [formData, setFormData] = useState(initialFormData);

const handleChange = (event) => {
    const { name, value } = event.target;
    const keys = name.split('.');
    
    if (keys.includes('fecha_inicio') || keys.includes('fecha_fin')) {
        const startDateKey = keys.slice(0, -1).join('.') + '.fecha_inicio';
        const endDateKey = keys.slice(0, -1).join('.') + '.fecha_fin';
        const startDate = keys[keys.length - 1] === 'fecha_inicio' ? new Date(value) : new Date(getValueByPath(formData, startDateKey));
        const endDate = keys[keys.length - 1] === 'fecha_fin' ? new Date(value) : new Date(getValueByPath(formData, endDateKey));

        if (startDate > endDate) {
            console.log("La fecha de inicio no puede ser posterior a la fecha de fin.");
            return; // Detiene la ejecución si la fecha de inicio es mayor que la de fin
        }
    }

    if (name === "id_academico_fk.id_academico") {
      if (value === "") {
        setAcademicosFilter([]);
      } else {
        const filteredAcademicos = academicos.filter(academico =>
          `${academico.id_nombre_completo_fk.nombre} ${academico.id_nombre_completo_fk.apellido} ${academico.id_nombre_completo_fk.segundo_apellido}`
          .toLowerCase()
          .includes(value.toLowerCase())
        );
        setAcademicosFilter(filteredAcademicos);
      }
      setFormData(prev => ({ ...prev, asociar_academico: value }));
    } else {
      const keys = name.split('.');
      const lastKey = keys.pop();
      const lastObj = keys.reduce((obj, key) => (obj[key] = obj[key] || {}), formData);
      lastObj[lastKey] = value;
      setFormData({ ...formData });
    }

    const updatedColaboradorData = { ...formData, [name]: value };
        setColaboradorData(updatedColaboradorData);  // Actualizar el estado local
        setCambios({ colaboradorData: updatedColaboradorData });
};
function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
  }
const handleBlur = (event) => {
    if (event.target.name === "id_academico_fk.id_academico" && formData.id_academico_fk.id_academico !== 'number') {
        handleChange({ target: { name: "asociar_academico", value: '' }});
    }
}
const handleSelectAcademico = (e, academico) => {
    setFormData(prev => ({
      ...prev,
      id_academico_fk: {
        id_academico: academico.id_academico
      },
      asociar_academico: `${academico.id_nombre_completo_fk.nombre} ${academico.id_nombre_completo_fk.apellido} ${academico.id_nombre_completo_fk.segundo_apellido}`
    }));
    setAcademicosFilter([]);
  };

  
  return (
    <>  
        <div className="col">
            <label htmlFor="id_academico_fk" className="label-personalizado mb-2">Investigador(a) </label>
            <div className="position-relative">
                <input type="text" className="form-control" name="id_academico_fk.id_academico" id="id_academico_fk.id_academico" value={formData.asociar_academico} onChange={handleChange} onBlur={handleBlur} required/>
                {(academicosFilter.length > 0) && (
                    <div className="form-control bg-light position-absolute d-flex flex-column justify-content-center shadow ps-1 pe-1 row-gap-1 overflow-y-scroll pt-2" style={{ maxHeight: "40px" }}>
                        {academicosFilter.map((academico) => {
                        return (
                            <div key={academico.id_academico} className="pointer-event ms-1" style={{ cursor: "pointer" }} onClick={(e) => handleSelectAcademico(e, academico)}>
                                {`${academico.id_nombre_completo_fk.nombre} ${academico.id_nombre_completo_fk.apellido} ${academico.id_nombre_completo_fk.segundo_apellido}`}
                            </div>
                        );
                        })}
                    </div>
                )}
            </div>
        </div>
        <div className="row mb-4">
        <div className="col-md-6">
            <label htmlFor="estado" className="label-personalizado mb-2">Estado colaborador(a) </label>
            <select className="form-select seleccion" name="estado" id="estado" value={formData.estado} onChange={handleChange} required>
                <option value="">Seleccionar estado</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
            </select>
        </div>
        <div className="col-md-6">
            <label htmlFor="carga" className="label-personalizado mb-2">Carga colaborador(a) </label>
            <select className="form-select seleccion" name="carga" id="carga" value={formData.carga} onChange={handleChange} required>
                <option value="">Seleccionar carga</option>
                <option value="1/8">1/8</option>
                <option value="1/4">1/4</option>
                <option value="3/4">3/4</option>
                <option value="3/8">3/8</option>
                <option value="1/2">1/2</option>
                <option value="5/8">5/8</option>
                <option value="7/8">7/8</option>
                <option value="TS">TS</option>
                <option value="Sc">SC</option>
            </select>
        </div>
    </div>
    <div className="row mb-4">
        <div className="col-md-6">
            <label htmlFor="inicioVigenciaColaborador" className="label-personalizado mb-2">Fecha de inicio </label> <span className="disabled-input">(Opcional)</span>
            <input type="date" className="form-control" name="id_vigencia_fk.fecha_inicio"
                id="id_vigencia_fk.fecha_inicio"
                value={formData.id_vigencia_fk.fecha_inicio
                    ? new Date(formData.id_vigencia_fk.fecha_inicio).toISOString().split('T')[0] : ""}
                onChange={handleChange} />
        </div>
        <div className="col">
            <label htmlFor="finVigenciaColaborador" className="label-personalizado mb-2">Fecha finalización </label> <span className="disabled-input">(Opcional)</span>
            <input type="date" className="form-control"
                name="id_vigencia_fk.fecha_fin"
                id="id_vigencia_fk.fecha_fin"
                value={formData.id_vigencia_fk.fecha_fin
                    ? new Date(formData.id_vigencia_fk.fecha_fin).toISOString().split('T')[0] : ""}
                onChange={handleChange} />
        </div>
    </div>
    <br />
    
    </>
  );
};
