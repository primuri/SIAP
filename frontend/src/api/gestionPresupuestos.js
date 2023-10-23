import axios from 'axios'
import {manejarErrores} from './errorHandler'
/*
    {
    "presupuesto": {
        "id_presupuesto": 1,
        "anio_aprobacion": 2023,
        "codigo_financiero": 123456,
        "id_tipo_presupuesto_fk": 1,
        "id_ente_financiero_fk": 1,
        "id_oficio_fk": 1,
        "id_codigo_vi": 1
    },
    "tipoPresupuesto": {
        "id_tipo_presupuesto": 1,
        "tipo": "Tipo de Presupuesto",
        "detalle": "Detalle del Tipo de Presupuesto"
    },
    "enteFinanciero": {
        "id_ente_financiero": 1,
        "nombre": "Nombre del Ente Financiero"
    },
    "oficio": {
        "id_oficio": 1
        // ... otros campos del modelo Oficio
    },
    "proyecto": {
        "id_codigo_vi": 1
        // ... otros campos del modelo Proyecto
    }
}



*/

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});


export const obtenerPresupuestos = async (token) => {
    return await manejarErrores(SIAPAPI.get('presupuesto/presupuestos', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarPresupuesto = async (presupuesto, token) => {
    return await manejarErrores(SIAPAPI.post('presupuesto/presupuestos',presupuesto,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
}

export const actualizarPresupuesto = async (id,presupuesto, token) => {
    return await manejarErrores(SIAPAPI.put(`presupuesto/presupuestos/${id}/`,presupuesto,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
}

export const eliminarPresupuesto = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`presupuesto/presupuestos/${id}/`,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
}