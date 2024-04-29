import React, { useState } from "react";
import PropTypes from 'prop-types';

export const TableReport = ({ columns = [], data = [], dataKeys }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  function getValueByPath(obj, path) {
    var value = path.split('.').reduce((acc, part) => acc && acc[part], obj);

    if (typeof value === 'object') {
      if (value !== null) {
        try {
          value = value.nombre + ' ' + value.apellido + ' ' + value.segundo_apellido;
        } catch (ex) {
          console.error('error al obtener nombre completo: ');
          console.error(ex);
          return "";
        }
      } else {
        return "";
      }
    }
    return value;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-100">
      <div className="table-responsive-xl w-100" id="table-box" style={{ backgroundColor: "#EEEDED" }}>
        <table className="table table-striped table-hover rounded-table table-resizable fs-7" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead className="rounded">
            <tr>
              {columns.map((column, index) => (
                <th key={index} className="th-report" style={{ padding: "8px", textAlign: "left" }}><span>{column}</span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {dataKeys.map((column, colIndex) => (
                  <td className="mx-2" key={colIndex} style={{ padding: "8px", textAlign: "left", height: "auto"}}>
                    <p style={{textWrap: "balance"}}>
                    {((
                      typeof getValueByPath(row, column) === 'string' && getValueByPath(row, column).includes('/')
                        ? getValueByPath(row, column).split('/').pop()
                        : getValueByPath(row, column) === 'academico' ? 'investigador' : getValueByPath(row, column)
                    )
                    )}
                    </p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TableReport.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  dataKeys: PropTypes.array.isRequired,
};
