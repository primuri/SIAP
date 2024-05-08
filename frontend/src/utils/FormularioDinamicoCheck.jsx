import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { eliminarColaboradorSecundario } from '../api/gestionProyectos';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const FormularioDinamicoCheck = ({ items, setItems, configuracion, itemName, academicos }) => {
    const [academicosFilter, setAcademicosFilter] = useState([]);
    const [showDropdown, setShowDropdown] = useState(items.map(() => false));

    const agregarItem = () => {
        const nuevoItem = configuracion.reduce((acc, conf) => {
            acc[conf.campo] = conf.default || '';
            return acc;
        }, {});
        setShowDropdown([...showDropdown, false]);
        setItems(prevItems => [...prevItems, nuevoItem]);
    };

    const handleInputChange = (event, index, campo) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        if (event.target.type === 'date' && value.includes('T')) {
            value = value.split('T')[0]; // Extrae solo la parte de la fecha
        }
        let updatedItems = [...items];
        let keys = campo.split('.');
        let currentObj = updatedItems[index];

        
        for (let i = 0; i < keys.length - 1; i++) {
            currentObj = currentObj[keys[i]] = currentObj[keys[i]] || {};
        }
    
        currentObj[keys[keys.length - 1]] = value;
    
        // Validar fechas si se cambia fecha_inicio o fecha_fin
        if (campo.includes('fecha_inicio') || campo.includes('fecha_fin')) {
            const vigencia = updatedItems[index]['id_vigencia_fk'];
            const fechaInicio = new Date(vigencia['fecha_inicio']);
            const fechaFin = new Date(vigencia['fecha_fin']);
            if (fechaInicio > fechaFin) {
                alert('La fecha de inicio no puede ser mayor que la fecha de fin.');
                return; // No actualizar si la fecha de inicio es mayor que la fecha de fin
            }
        }
    
        if (campo === 'id_academico_fk' && value) {
            const filtered = academicos.filter(academico =>
                academico.id_nombre_completo_fk.nombre.toLowerCase().includes(value.toLowerCase()) ||
                academico.id_nombre_completo_fk.apellido.toLowerCase().includes(value.toLowerCase()) ||
                academico.id_nombre_completo_fk.segundo_apellido.toLowerCase().includes(value.toLowerCase())
            );
            setAcademicosFilter(filtered);
            setShowDropdown(showDropdown.map((dropdown, idx) => index === idx ? true : dropdown));
        } else {
            setItems(updatedItems);
            if (campo === 'id_academico_fk') {
                setAcademicosFilter([]);
                setShowDropdown(showDropdown.map((dropdown, idx) => index === idx ? false : dropdown));
            }
        }
    };

    const eliminarItem = (index) => {
        const itemToDelete = items[index];
        if (itemToDelete.id_colaborador_secundario) {
            eliminarColaboradorSecundario(itemToDelete.id_colaborador_secundario, localStorage.getItem("token"));
        }
        setItems(items.filter((_, idx) => idx !== index));
        setShowDropdown(showDropdown.filter((_, idx) => idx !== index));
    };
    const handleSelectAcademico = (index, academico) => {
        let updatedItems = [...items];
        updatedItems[index]['id_academico_fk'] = academico.id_academico; // Guarda el ID, pero muestra el nombre completo
        updatedItems[index]['id_academico_nombre'] = `${academico.id_nombre_completo_fk.nombre} ${academico.id_nombre_completo_fk.apellido} ${academico.id_nombre_completo_fk.segundo_apellido}`; // Opcional para mostrar en UI
        setItems(updatedItems);
        setAcademicosFilter([]);
        setShowDropdown(showDropdown.map((dropdown, idx) => idx === index ? false : dropdown));
    };
  
    return (
        <>
            {items.map((item, index) => (
                <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        <Typography>{itemName} {index + 1}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="row mb-4">
                            {configuracion.map((conf, idx) => (
                                <div key={idx} className="col-md-6">
                                    <label htmlFor={`${conf.campo}-${index}`} className="label-personalizado mb-2">{conf.placeholder}</label>
                                    {conf.tipo === 'select' ? (
                                        <select
                                            id={`${conf.campo}-${index}`}
                                            name={conf.campo}
                                            value={item[conf.campo]}
                                            onChange={e => handleInputChange(e, index, conf.campo)}
                                            className="form-control"
                                            required={conf.required}
                                        >
                                            <option value="">Selecciona una opción</option>
                                            {conf.opciones?.map((opcion, opcionIdx) => (
                                                <option key={opcionIdx} value={opcion}>{opcion}</option>
                                    ))}
                                        </select>
                                    ) : conf.tipo === 'text' && conf.campo === 'id_academico_fk' ? (
                                        <>
                                            <input
                                                id={`${conf.campo}-${index}`}
                                                type="text"
                                                name={conf.campo}
                                                value={item[conf.campo]}
                                                onFocus={() => setShowDropdown(showDropdown.map((dropdown, idx) => index === idx ? true : dropdown))}
                                                onBlur={() => setTimeout(() => setShowDropdown(showDropdown.map((dropdown, idx) => index === idx ? false : dropdown)), 300)}
                                                onChange={e => handleInputChange(e, index, conf.campo)}
                                                className="form-control"
                                                required={conf.required}
                                            />
                                            {showDropdown[index] && academicosFilter.length > 0 && (
                                                <div className="autocomplete-dropdown-container">
                                                    {academicosFilter.map((academico, acadIdx) => (
                                                        <div
                                                            key={acadIdx}
                                                            onClick={() => handleSelectAcademico(index, academico)}
                                                            className="autocomplete-item"
                                                        >
                                                            {`${academico.id_nombre_completo_fk.nombre} ${academico.id_nombre_completo_fk.apellido} ${academico.id_nombre_completo_fk.segundo_apellido}`}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <input
                                            id={`${conf.campo}-${index}`}
                                            type={conf.tipo}
                                            name={conf.campo}
                                            value={item[conf.campo]}
                                            onChange={e => handleInputChange(e, index, conf.campo)}
                                            className="form-control"
                                            required={conf.required}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <button type="button" className="mb-2 eliminarBtn" onClick={() => eliminarItem(index)}>Eliminar</button>
                    </AccordionDetails>
                </Accordion>
            ))}
            <button type="button" className="agregarBtn" style={{ width: "6%", backgroundColor: "#005da4", color: "white" }} onClick={agregarItem}>+</button>
        </>
    );
};

FormularioDinamicoCheck.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    setItems: PropTypes.func.isRequired,
    configuracion: PropTypes.arrayOf(
        PropTypes.shape({
            campo: PropTypes.string.isRequired,
            placeholder: PropTypes.string,
            tipo: PropTypes.string.isRequired,
            opciones: PropTypes.arrayOf(PropTypes.string),
            label: PropTypes.string,
            required: PropTypes.bool,
            default: PropTypes.any
        })
    ).isRequired,
    itemName: PropTypes.string.isRequired,
    academicos: PropTypes.arrayOf(PropTypes.object).isRequired
};