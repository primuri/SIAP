import { useState, useEffect } from "react";
import { ReportHeader } from "../components/Layout/ReportHeader";
import { TableReport } from "./TableReport";

function getValueByPath(obj, path) {
    const value = path.split('.').reduce((acc, part) => acc && acc[part], obj);

    const fechaRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    if (typeof value === 'string' && fechaRegex.test(value)) {
        return value.split('T')[0];
    }

    return value;
}

function getLength(value) {
    return value ? value.length : 0;
}

export const ReportePDF = () => {

    var tableData = [
        {
            "id_codigo_vi": "1-2024",
            "id_codigo_cimpa_fk": {
                "id_codigo_cimpa": "1-2024",
                "estado": "Aprobada",
                "nombre": "Proyecto de manufactura",
                "descripcion": "lorem ipsumipsumisumipsumipsumipsumsumipsumipsumipsumsumipsumipsumipsumsumipsumipsumipsumpsumipsumipsum lorem ipsumipsumipsumipsumipsumpsums ipsumipsumipsumipsumipsumpsums sssssassssssas dasda  sssssss as adas  asdas d asd as dasda asdasdad   asdasda sd sda as dasdad daasassipsum lorem ipsum lorem m lorem ipsumlorem ipsum lorem ipsum lorem ipsum lorem ipsum",
                "fecha_vigencia": "2023-02-08",
                "actividad": "Investigación actvia"
            },
            
                7: [{
                    "prop": '1abcd',
                    "elemento": {
                        "a": 1,
                        "b": 2,
                    }
                },
                {
                    "prop": '2abcd',
                    "elemento": {
                        "a": 11,
                        "b": 22,
                    }
                },
                {
                    "prop": '3abcd',
                    "elemento": {
                        "a": 111,
                        "b": 222,
                    }
                }
                ],

                8: [{
                    "papaya": '11abcd',
                    "manzana": {
                        "a": 1,
                        "b": 2,
                    }
                },
                {
                    "papaya": '21abcd',
                    "manzana": {
                        "a": 11,
                        "b": 22,
                    }
                },
               
                ]
            
            
        }
    ]

    var reportTitle = "Proyecto";

    var colNames = ['Codigo VI', 'Código CIMPA', 'Vigencia', 'Nombre', 'Estado', 'Descripción', 'Actividad', {'tableName': 'Tabla1', 'colNames' :['Properties','A', 'B']}, {'tableName': 'Tabla2', 'colNames' :['Papaya','A', 'B']}];



    var dataKeys = ['id_codigo_vi', 'id_codigo_cimpa_fk.id_codigo_cimpa', 'id_codigo_cimpa_fk.fecha_vigencia', 'id_codigo_cimpa_fk.nombre', 'id_codigo_cimpa_fk.estado', 'id_codigo_cimpa_fk.descripcion', 'id_codigo_cimpa_fk.actividad', 
                   ['prop', 'elemento.a','elemento.b'], ['papaya', 'manzana.a', 'manzana.b']];

    var idKey = "id_codigo_vi"

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
        <div className="reporteGeneral" >
            <ReportHeader nombreReporte={reportTitle} />

            <div className="container" style={{ width: "700px" }}>
                {tableData.map((data) => (
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
                                    <p className="card-text flex-grow-1 text-break">{getValueByPath(data, dataKeys[index])}</p>
                                </div>
                            </div>
                        </div>
                        ):
                        <div key={index} className="col-md-12 flex-grow-1">
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
};