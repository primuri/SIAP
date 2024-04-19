import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import reporte from '../assets/reporte.png'
import { ReportHeader } from "../components/Layout/ReportHeader";
import { usePDF } from 'react-to-pdf';
import { ReportePDF } from "./ReportePDF";


export const ReportButton = ({ tableData, reportTittle, colNames, dataKeys }) => {
    const [selectedOption, setSelectedOption] = useState("PDF");
    const [buttonClicked, setButtonClicked] = useState(true);
    const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' });

    const handleButtonClick = () => {
        if (buttonClicked) {
            console.log("ADELANTE!");
            if (selectedOption === 'PDF') {
                setTimeout(() => {
                    toPDF();
                }, 0);
            }

        } else {
            console.log("No se tocó botón");
        }
    };

    const handleBlur = () => {
        setButtonClicked(true);
    };

    const handleFocus = () => {
        setButtonClicked(false);
    };

    return (
        <div style={{ marginRight: '1vw' }}>
            <button type="button" className="background-color-celeste-ucr border-0 text-light rounded-3 p-2 d-flex" onClick={handleButtonClick}>
                <span className='icono'><img width={"20px"} src={reporte} /></span>
                <select className="rounded-start-3 selectPersonalized form-select d-inline p-2 shadow-sm" onBlur={handleBlur} onFocus={handleFocus} onChange={(event) => setSelectedOption(event.target.value)} value={selectedOption} style={{ fontSize: '12px', lineHeight: '80%', width: '3.5rem', backgroundPosition: 'right 0rem center' }}>
                    <option>PDF</option>
                    <option>EXCEL</option>
                    <option>CALC</option>
                </select>
            </button>
            {
                (buttonClicked && (
                    <div style={{ position: 'absolute', left: -9999, top: -9999, margin: '0px' }}>
                        <div  ref={targetRef}>
                            <ReportePDF />
                        </div>
                    </div>
                ))
            }

        </div>
    );
};

ReportButton.propTypes = {
    tableData: PropTypes.array.isRequired,
    reportTittle: PropTypes.string.isRequired,
    colNames: PropTypes.array.isRequired,
    dataKeys: PropTypes.array.isRequired
};


