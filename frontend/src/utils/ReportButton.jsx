import { useState } from "react";
import PropTypes from 'prop-types';
import reporte from '../assets/reporte.png'

export const ReportButton = ({tableData, reportTittle, colNames, dataKeys}) => {
    const [selectedOption, setSelectedOption] = useState("PDF");
    const [buttonClicked, setButtonClicked] = useState(false);

    const handleButtonClick = () => {
        if(buttonClicked){
            console.log("ADELANTE!");
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
        <div style={{marginRight: '1vw'}}>
            <button type="button" className="background-color-celeste-ucr border-0 text-light rounded-3 p-2 d-flex" onClick={handleButtonClick}> 
                <span className='icono'><img width={"20px"} src={reporte}/></span> 
                <select className="rounded-start-3 selectPersonalized form-select d-inline p-2 shadow-sm" onBlur={handleBlur} onFocus={handleFocus} onChange={(event) => setSelectedOption(event.target.value)} value={selectedOption} style={{ fontSize: '12px', lineHeight: '80%', width: '3.5rem', backgroundPosition: 'right 0rem center'}}> 
                    <option>PDF</option>
                    <option>EXCEL</option>
                    <option>CALC</option>
                </select>
            </button>
        </div>
    );
};

ReportButton.propTypes = {
    tableData: PropTypes.array.isRequired,
    reportTittle: PropTypes.string.isRequired,
    colNames: PropTypes.array.isRequired,
    dataKeys: PropTypes.array.isRequired
};
