import { useState } from "react";
import PropTypes from 'prop-types';
import search from '../assets/search.svg'

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
    //"Esto es para buscar cuando se le de al enter"
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      };
    
    return (
        <div>
            <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="rounded-start-3 form-select d-inline p-2 shadow-sm" id="selectCol"
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
                placeholder=""
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="p-2 buscar-input shadow-sm"
                
            />
            <button 
            onClick={handleSearch} 
            type="button" 
            className="background-color-celeste-ucr border-0 text-light rounded-end-3 p-2"
            > <span className='icono'><img width={"20px"} src={search}/></span> Buscar
            </button>
        </div>
    );
};

Search.propTypes = {
    columns: PropTypes.array,
    colNames: PropTypes.array.isRequired,
    onSearch: PropTypes.func.isRequired,
  };