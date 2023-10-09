import PropTypes from 'prop-types';
export const FormularioDinamico = ({ items, setItems, configuracion }) => {
    
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

        // Establece anio en 1930 si es menor.
        if (campo === 'anio' && valor < '1930') {
            valor = '1930';
        }

        nuevosItems[index][campo] = valor;
        setItems(nuevosItems);
    };

    const eliminarItem = (index) => {
        const nuevosItems = [...items];
        nuevosItems.splice(index, 1);
        setItems(nuevosItems);
    };
    const dividirEnGruposDeDos = (array) => {
        let grupos = [];
        for (let i = 0; i < array.length; i += 2) {
            grupos.push(array.slice(i, i + 2));
        }
        return grupos;
    }
    const grupos = dividirEnGruposDeDos(configuracion);    
    return (
        <>
            {items.map((item, index) => (
                <>
                    
                        {grupos.map((grupo) => (
                            <div key={index} className="row mb-4">
                                {grupo.map(conf => (
                                    <div key={conf.campo} className="col-md-6">
                                        <label htmlFor={conf.campo} className="label-personalizado mb-2">{conf.placeholder}</label>
                                        <input 
                                            key={conf.campo}
                                            type={conf.tipo}
                                            value={item[conf.campo]}
                                            onChange={e => handleInputChange(e, index, conf.campo)}
                                            required={conf.required}
                                            className="form-control"
                                            min={conf.campo === 'anio' ? '1930' : undefined}
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    
                    
                        <button type="button" className="mb-2 eliminarBtn" onClick={() => eliminarItem(index)}>Eliminar</button>
                    
                </>
        ))}
            <button type="button" className="agregarBtn " style={{width:"100%"}} onClick={agregarItem}>+</button>
        </>
    );
};


FormularioDinamico.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    setItems: PropTypes.func.isRequired,
    configuracion: PropTypes.arrayOf(
        PropTypes.shape({
            campo: PropTypes.string.isRequired,
            placeholder: PropTypes.string.isRequired,
            tipo: PropTypes.string.isRequired
        })
    ).isRequired,
};