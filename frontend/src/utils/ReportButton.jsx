import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import React from 'react';
import * as XLSX from 'xlsx';
import reporte from '../assets/upload_doc.svg'
import { ReportHeader } from "../components/Layout/ReportHeader";
import { usePDF } from 'react-to-pdf';
import { ReportePDF } from "./ReportePDF";


export const ReportButton = ({ reportData, reportTitle, colNames, dataKeys, idKey }) => {
    const [selectedOption, setSelectedOption] = useState("PDF");
    const [buttonClicked, setButtonClicked] = useState(true);
    const { toPDF, targetRef } = usePDF({ filename: ('Reporte de ' + reportTitle) });

    const handleButtonClick = () => {
        if (buttonClicked) {
            if (selectedOption === 'PDF') {
                setTimeout(() => {
                    toPDF();
                }, 0);

            } else {
                if (selectedOption === 'EXCEL') {
                    generarReporteExcel(reportData, colNames, dataKeys, reportTitle)
                }
            }
        }
    };

    const handleBlur = () => {
        setButtonClicked(true);
    };

    const handleFocus = () => {
        setButtonClicked(false);
    };

    function getValueByPath(obj, path) {
        try {
            var value = path.split('.').reduce((acc, part) => acc && acc[part], obj);

            const fechaRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
            if (typeof value === 'string' && fechaRegex.test(value)) {
                return value.split('T')[0];
            }

            if (typeof value === 'object') {
                if (value !== null) {

                    try {
                        value = value.nombre + ' ' + value.apellido + ' ' + value.segundo_apellido

                    } catch (ex) {
                        console.error(ex)
                        return ""
                    }
                } else {
                    return ""
                }

            }

            return value;
        } catch (error) {
            console.error(error)
        }
        return "";

    }

    const generarReporteExcel = (tableData, colNames, dataKeys, fileName) => {
        const flattenData = tableData.map(item => {
            const flattenedItem = {};
            colNames.forEach((col, index) => {
                if (typeof col === 'string') {
                    flattenedItem[col] = getValueByPath(item, dataKeys[index]);
                } else {
                    const tableName = col.tableName;
                    const subColNames = col.colNames;
                    const subDataKeys = dataKeys[index];
                    const subData = item[index];
                    subDataKeys.forEach((subKey, subKeyIndex) => {
                        const subDataValues = subData.map(subItem => getValueByPath(subItem, subKey));
                        const maxLength = Math.max(...subDataValues.map(value => String(value).length));
                        flattenedItem[`${tableName} ${subColNames[subKeyIndex]}`] = subDataValues.join(', ');
                    });
                }
            });
            return flattenedItem;
        });

        const ws = XLSX.utils.json_to_sheet(flattenData);

        const columnWidths = Object.keys(flattenData[0]).map(columnName => {
            const columnData = flattenData.map(item => item[columnName] || ''); 
            const dataMaxLength = Math.max(...columnData.map(value => String(value).length));
            const nameLength = columnName.length;
            return { wch: Math.max(dataMaxLength, nameLength) + 2 }; 
        });

        ws['!cols'] = columnWidths;

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
        XLSX.writeFile(wb, `Reporte de ${fileName}.xlsx`);
    };

    if (reportData.length < 1) {
        return (<></>)
    }
    return (
        <div style={{ marginRight: '1vw' }}>
            <div class="mi-boton-wrapper">
                <button type="button" class="boton-reporte" onClick={handleButtonClick}>
                    <div class="texto-boton">
                        <p>Generar reporte</p>
                    </div>
                    <div class="contenedor-icono-selector">
                        <span class='icono'><img width="35px" src={reporte} /></span>
                        <select className="rounded-start-3 selectPersonalized form-select d-inline p-2 shadow-sm" onBlur={handleBlur} onFocus={handleFocus} onChange={(event) => setSelectedOption(event.target.value)} value={selectedOption} style={{ fontSize: '12px', lineHeight: '80%', width: '3.5rem', backgroundPosition: 'right 0rem center' }}>
                            <option>PDF</option>
                            <option>EXCEL</option>
                        </select>
                    </div>
                </button>
                <span class="hover-text">Generar reporte de la información en pantalla</span>
            </div>

            {
                (buttonClicked && (
                    <div style={{ position: 'absolute', left: -9999, top: -9999, margin: '0px' }}>
                        <div ref={targetRef}>
                            <ReportePDF reportData={reportData} reportTitle={reportTitle} colNames={colNames} dataKeys={dataKeys} idKey={idKey} />
                        </div>
                    </div>
                ))
            }

        </div>
    );
}


