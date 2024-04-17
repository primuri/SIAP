import { useState, useEffect } from "react";
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

// La idea es que este componente se envíe a un react-to-pdf. Por ende el div debe tener el ancho de un pdf.
// Además, necesito un css responsive de modo que los datos que vengan se acomoden en 3 columnas por fila si la
// longitud del texto es corta, en dos si es un poco más larga y en 1 si es mucho texto.

// Necesito un código que dado los data keys y los colnames, pueda obtener adecuadamente la información. Con cualquier nivel de anidación

// Función para obtener el valor de un objeto dado un camino (path) de claves
function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

import React from 'react';

// Función para obtener la longitud de un valor
function getLength(value) {
    return value ? value.length : 0;
}


export const ReportePDF = () => {
    var tableData = {
        "id_codigo_vi": "1-2024",
        "id_codigo_cimpa_fk": {
            "id_codigo_cimpa": "1-2024",
            "id_colaborador_principal_fk": {
                "id_colaborador_principal": 7,
                "id_vigencia_fk": {
                    "id_vigencia": 63,
                    "fecha_inicio": null,
                    "fecha_fin": null
                },
                "id_academico_fk": {
                    "id_academico": 18,
                    "id_nombre_completo_fk": {
                        "id_nombre_completo": 83,
                        "nombre": "Jorge",
                        "apellido": "Poltronieri",
                        "segundo_apellido": "Vargas"
                    },
                    "id_area_especialidad_fk": {
                        "id_area_especialidad": 37,
                        "nombre": "Estadística"
                    },
                    "id_area_especialidad_secundaria_fk": {
                        "id_area_especialidad": 38,
                        "nombre": ""
                    },
                    "universidad_fk": {
                        "id_universidad": 18,
                        "pais": "Costa Rica",
                        "nombre": "UCR"
                    },
                    "cedula": "104051422",
                    "foto": null,
                    "sitio_web": "",
                    "grado_maximo": "Dr",
                    "correo": "JORGE.POLTRONIERI@ucr.ac.cr",
                    "correo_secundario": "",
                    "unidad_base": "Estadística",
                    "categoria_en_regimen": "Catedrático",
                    "pais_procedencia": "Costa Rica"
                },
                "tipo": "Principal",
                "carga": "1/2",
                "estado": "Activo"
            },
            "objetivo_general": "",
            "estado": "Aprobada",
            "nombre": "Proyecto de manufactura",
            "descripcion": "lorem ipsumipsumisumipsumipsumipsumsumipsumipsumipsumsumipsumipsumipsumsumipsumipsumipsumpsumipsumipsum lorem ipsumipsumipsumipsumipsumpsums ipsumipsumipsumipsumipsumpsums sssssassssssas dasda  sssssss as adas  asdas d asd as dasda asdasdad   asdasda sd sda as dasdad daasassipsum lorem ipsum lorem m lorem ipsumlorem ipsum lorem ipsum lorem ipsum lorem ipsum",
            "fecha_vigencia": "2023-02-08",
            "actividad": "Investigación actvia"
        }
    }

    var reportTitle = "Proyectos";

    var colNames = ['Codigo VI', 'Código CIMPA', 'Vigencia', 'Nombre', 'Estado', 'Descripción', 'Actividad'];

    var dataKeys = ['id_codigo_vi', 'id_codigo_cimpa_fk.id_codigo_cimpa', 'id_codigo_cimpa_fk.fecha_vigencia', 'id_codigo_cimpa_fk.nombre', 'id_codigo_cimpa_fk.estado', 'id_codigo_cimpa_fk.descripcion', 'id_codigo_cimpa_fk.actividad'];

    // Función para ajustar la altura de las tarjetas dentro de una fila
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
        // Reajustar la altura de las tarjetas cuando el tamaño de la ventana cambie
        window.addEventListener('resize', ajustarAlturaTarjetas);
        return () => {
            window.removeEventListener('resize', ajustarAlturaTarjetas);
        };
    }, []);

    return (
        <div className="container" style={{width: "700px"}}>
            <h1>{reportTitle}</h1>
            <div className="row">
                {colNames.map((colName, index) => (
                    <div key={index} className={`col-md-4 mb-4 ${getLength(getValueByPath(tableData, dataKeys[index])) > 300 ? 'col-md-12' : getLength(getValueByPath(tableData, dataKeys[index])) > 40 ? 'col-md-8' : getLength(getValueByPath(tableData, dataKeys[index])) > 10 ? 'col-md-4' : 'col-md-2'} flex-grow-1`}>
                        <div className="card d-flex flex-column h-100 border-0 container-fluid" >
                            <div className="card-body item-padding">
                                <h5 className="card-title">{colName}:</h5>
                                <p className="card-text flex-grow-1 text-break">{getValueByPath(tableData, dataKeys[index])}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


ReportButton.propTypes = {
    tableData: PropTypes.array.isRequired,
    reportTittle: PropTypes.string.isRequired,
    colNames: PropTypes.array.isRequired,
    dataKeys: PropTypes.array.isRequired
};
