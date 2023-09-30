import { useState } from "react";
import PropTypes from 'prop-types';

export const Search = ({ columns, colNames, onSearch }) => {
    const [selectedColumn, setSelectedColumn] = useState(""); // Estado para almacenar la columna seleccionada
    const [searchText, setSearchText] = useState(""); // Estado para almacenar el texto de búsqueda

    const handleSearch = () => {
        // Verifica que se haya seleccionado una columna antes de realizar la búsqueda
        if (selectedColumn) {
            // Llama a la función onSearch con la columna y el texto de búsqueda
            onSearch(selectedColumn, searchText || "");
        }
    };
    
    return (
        <div>
            <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="rounded-start-3 p-2 border-1 "
            > 
                <option value="">Seleccionar columna</option>
                { 
                    colNames.map((colName, index) => (
                        <option key={index} value={columns[index]}>
                            {colName}
                        </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Buscar"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="p-2"
            />
            <button 
            onClick={handleSearch} 
            type="button" 
            className="background-color-celeste-ucr border-0 text-light rounded-end-3 p-2"
            >Buscar
            </button>
        </div>
    );
};

Search.propTypes = {
    columns: PropTypes.array,
    colNames: PropTypes.array.isRequired,
    onSearch: PropTypes.func.isRequired,
  };