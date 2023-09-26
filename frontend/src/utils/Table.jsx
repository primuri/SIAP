import { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';

export const Table = ({ columns, data, onClick, dataKeys}) => {
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage, setItemsPerPage] = useState(10); 


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
    <div>
      <div style={{ minHeight: "400px", backgroundColor: "#EEEDED" }}>
        <table className="fs-5">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}><span className='p-3'>{column}</span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, rowIndex) => (
              <tr key={rowIndex} onClick={() => onClick(row)}>
                {dataKeys.map((column, colIndex) => (
                  <td key={colIndex}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex column-gap-2 justify-content-end me-2 pt-2">
        <div>
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
          style={{maxWidth:"60px"}}
          />
        </div>
        {renderPageNumbers()}
      </div>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  dataKeys: PropTypes.array.isRequired,
};
