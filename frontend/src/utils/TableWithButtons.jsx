import { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';

export const TableWithButtons = ({ columns, data, onClick, dataKeys, hasButtonColumn = false, buttonText = "" , navigate=null , saveState=null}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);


  function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }


  const getTotalPages = useCallback(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data, itemsPerPage]);

  // Calcular el índice del último y primer elemento en la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = getTotalPages();

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [data, currentPage, totalPages]);

  const renderPageNumbers = () => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`page-number ${i === currentPage ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination d-flex column-gap-1">
        {pageNumbers}
      </div>
    );
  };

  return (
    <div className="w-100">
      <div className="table-responsive-xl w-100" id="table-box" style={{ backgroundColor: "#EEEDED" }}>
        <table className="table table-striped table-hover rounded-table table-resizable fs-5">
          <thead className="rounded">
            <tr>
              {columns.map((column, index) => (
                <th key={index}><span>{column}</span></th>
              ))}
            </tr>
          </thead>
          <tbody>
          {currentItems.map((row, rowIndex) => (
          <tr key={rowIndex} onClick={() => onClick(row)}>
          {dataKeys.map((column, colIndex) => (
            <td className="mx-2" key={colIndex}>
              {(colIndex === dataKeys.length - 2 && hasButtonColumn) ? ( // Comprueba si se necesita boton y si está en la última columna
                 <button id="acciones-button" className="btn btn-primary" onClick={() => {
                    saveState();
                    navigate(`/gestion-informes/${row.id_version_proyecto}`);
                 }}>Gestionar</button>

              ) : (colIndex === dataKeys.length -   1) ? (
                <button id="acciones-button" className="btn btn-primary" onClick={() => {
                    saveState();
                    navigate(`/gestion-presupuestos/${row.id_version_proyecto}`);
                 }}>Gestionar</button>
              ): (
                typeof getValueByPath(row, column) === 'string' && getValueByPath(row, column).includes('/')
                  ? getValueByPath(row, column).split('/').pop()
                  : getValueByPath(row, column) === 'academico' ? 'investigador' : getValueByPath(row, column)
                )}
            </td>
          ))}
        </tr>
        ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex column-gap-2 justify-content-end me-2 pt-2">
        <div className="form-group">
          <input
            type="number"
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (!isNaN(inputValue) && inputValue >= 1) {
                const newValue = parseInt(inputValue, 10);
                setItemsPerPage(newValue);
              } else {
                setItemsPerPage(1);
              }
            }}
            min="1"
            className="form-control"
            style={{ maxWidth: "60px" }}
          />
        </div>
        {renderPageNumbers()}
      </div>

    </div>
  );
};

TableWithButtons.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  dataKeys: PropTypes.array.isRequired,
};
