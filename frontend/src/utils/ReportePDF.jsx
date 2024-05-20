import { useState, useEffect } from "react";
import { ReportHeader } from "../components/Layout/ReportHeader";
import { TableReport } from "./TableReport";

function getValueByPath(obj, path) {
    try{
        var value = path.split('.').reduce((acc, part) => acc && acc[part], obj);

        const fechaRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
        if (typeof value === 'string' && fechaRegex.test(value)) {
            return value.split('T')[0];
        }
    
        if(typeof value === 'object'){
            if(value !== null){

                try {
                    value = value.nombre + ' ' + value.apellido + ' ' + value.segundo_apellido
        
                } catch (ex){

                    console.error('error al obtener nombre completo: ')
                    console.error(ex)
                    return ""
                }
            }else{
                return ""
            }
            
        }
        
       
        return value;
    }catch(error){
        console.error(error)
    }
    return "";
   
}

function getLength(value) {
    return value ? value.length : 0;
}

export const ReportePDF = ({ reportData, reportTitle, colNames, dataKeys, idKey }) => {
    useEffect(() => {
    }, [reportData])

    const ajustarAlturaTarjetas = () => {
        const filas = document.querySelectorAll('.row');
        filas.forEach((fila) => {
            let alturaMaxima = 0;
            fila.querySelectorAll('.card').forEach((tarjeta) => {
                const alturaTarjeta = tarjeta.clientHeight;
                if (alturaTarjeta > alturaMaxima) {
                    alturaMaxima = alturaTarjeta;
                }
            });
            fila.querySelectorAll('.card').forEach((tarjeta) => {
                tarjeta.style.height = `${alturaMaxima}px`;
            });
        });
    };

    useEffect(() => {
        ajustarAlturaTarjetas();
        window.addEventListener('resize', ajustarAlturaTarjetas);
        return () => {
            window.removeEventListener('resize', ajustarAlturaTarjetas);
        };
    }, []);

    if(Array.isArray(colNames)){
        return (
            <div className="reporteGeneral" >
                <ReportHeader nombreReporte={reportTitle} />
    
                <div className="container" style={{ width: "840px" }}>
                    {reportData.map((data) => (
                        <div className="row page-report">
                            <div className="row">
                                <h5 className="nombrePage">{reportTitle + " " + getValueByPath(data, idKey)}</h5>
                            </div>
                            {colNames.map((colName, index) => (
                                (typeof dataKeys[index] !== 'object' ? (
                                <div key={index} className={`col-md-4 mb-4 ${getLength(getValueByPath(data, dataKeys[index])) > 300 ? 'col-md-12' : getLength(getValueByPath(data, dataKeys[index])) > 40 ? 'col-md-8' : getLength(getValueByPath(data, dataKeys[index])) > 10 ? 'col-md-4' : 'col-md-2'} flex-grow-1`}>
                                <div className="card d-flex flex-column h-100 border-0 container-fluid elemento-reporte" >
                                    <div className="card-body item-padding">
                                        <h6 className="card-title">{colName}:</h6>
                                        <p className="card-text flex-grow-1 text-break">{(getValueByPath(data, dataKeys[index]) ? getValueByPath(data, dataKeys[index])  : "" )}</p>
                                    </div>
                                </div>
                            </div>
                            ):
                            <div key={index} className="col-md-12 flex-grow-1"  style={{marginBottom: '20px'}}>
                                <div className="card d-flex flex-column h-100 border-0 container-fluid elemento-reporte" >
                                    <div className="card-body item-padding">
                                        <h6 className="card-title">{colName.tableName}:</h6>
                                        <TableReport columns={colName.colNames} data={data[index]} dataKeys={dataKeys[index]}/> 
                                    </div>
                                </div>
                            </div>
                            )
                            ))}
                        </div>
                    ))}
    
                </div>
            </div>
        );
    }
    else {
        return (<></>)
    }
    
};