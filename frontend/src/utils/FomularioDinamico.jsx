import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { eliminarTelefonos, eliminarTitulos } from '../api/gestionAcademicos';
import { eliminarCuentasBancarias } from '../api/gestionProveedores';
import { agregarProductoServicio } from '../api/gestionGastos'; // Importar la función
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const FormularioDinamico = ({ items, setItems, configuracion, itemName }) => {
    const [productoNuevo, setProductoNuevo] = useState({});

    const agregarItem = () => {
        const nuevoItem = {};
        configuracion.forEach(conf => {
            nuevoItem[conf.campo] = '';
        });
        setItems(prevItems => [...prevItems, nuevoItem]);
    };

    const handleInputChange = (event, index, campo) => {
        const nuevosItems = [...items];

        let valor = event.target.value;

        if (campo === 'anio' && valor < '1930') {
            valor = '1930';
        }

        nuevosItems[index][campo] = valor;
        setItems(nuevosItems);
    };

    const eliminarItem = async (index) => {
        try {
            if (itemName === "Producto Servicio") {
                await agregarProductoServicio(items[index], localStorage.getItem("token")); // Llamar a la función del API para guardar
            } else {
                if (Object.keys(items[0])[0] === "id_telefono") {
                    eliminarTelefonos(items[index].id_telefono, localStorage.getItem("token"));
                }
                if (Object.keys(items[0])[0] === "id_titulos") {
                    eliminarTitulos(items[index].id_titulos, localStorage.getItem("token"));
                }
                if (Object.keys(items[0])[0] === "id_numero") {
                    eliminarCuentasBancarias(items[index].id_numero, localStorage.getItem("token"));
                }
            }
            const nuevosItems = [...items];
            nuevosItems.splice(index, 1);
            setItems(nuevosItems);
        } catch (error) {
            console.error('Error al agregar producto/servicio:', error);
            // Manejar el error apropiadamente (mensaje de error, notificación, etc.)
        }
    };

    const dividirEnGruposDeDos = (array) => {
        let grupos = [];
        for (let i = 0; i < array.length; i += 2) {
            grupos.push(array.slice(i, i + 2));
        }
        return grupos;
    };

    const grupos = dividirEnGruposDeDos(configuracion);

    return (
        <>
            {items.map((item, index) => (
                <Accordion key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                        <Typography>{itemName}  {index + 1}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {grupos.map((grupo, grupoIndex) => (
                            <div key={grupoIndex} className="row mb-4">
                                {grupo.map(conf => (
                                    <div key={conf.campo} className="col-md-6">
                                        <label htmlFor={conf.campo} className="label-personalizado mb-2">{conf.placeholder}</label>
                                        {conf.tipo === 'select' ? (
                                            <select
                                                name={conf.campo}
                                                value={item[conf.campo]}
                                                onChange={e => handleInputChange(e, index, conf.campo)}
                                                required={conf.required}
                                                className="form-control"
                                            >
                                                <option value="" disabled>Selecciona una opción</option>
                                                {conf.opciones.map((opcion, opcionIndex) => (
                                                    <option key={opcionIndex} value={opcion}>{opcion}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={conf.tipo}
                                                name={conf.campo}
                                                value={item[conf.campo]}
                                                onChange={e => handleInputChange(e, index, conf.campo)}
                                                required={conf.required}
                                                className="form-control"
                                                min={conf.campo === 'anio' ? '1930' : undefined}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                        {itemName === "Producto Servicio" ? (
                            <button type="button" className="mb-2 eliminarBtn" onClick={() => eliminarItem(index)}>Guardar</button>
                        ) : (
                            <button type="button" className="mb-2 eliminarBtn" onClick={() => eliminarItem(index)}>Eliminar</button>
                        )}
                    </AccordionDetails>
                </Accordion>
            ))}
            <button type="button" className={items.length === 0 ? "agregarBtn" : "agregarBtnMod"} style={{ width: "100%" }} onClick={agregarItem}>+</button>
        </>
    );
};

FormularioDinamico.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    setItems: PropTypes.func.isRequired,
    configuracion: PropTypes.arrayOf(
        PropTypes.shape({
            campo: PropTypes.string.isRequired,
            placeholder: PropTypes.string,
            tipo: PropTypes.string.isRequired,
            opciones: PropTypes.array,
            label: PropTypes.string,
            required: PropTypes.bool.isRequired,
        })
    ).isRequired,
    itemName: PropTypes.string.isRequired,
};