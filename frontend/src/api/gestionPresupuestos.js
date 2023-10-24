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

export const agregarPresupuesto = async (presupuesto, oficio, token) => {
    //Separamos los datos ya que hay que subir un documento
    let ofk = await agregarOficio(oficio,token);
    presupuesto.id_oficio_fk = ofk.data.id_oficio
    return await manejarErrores(SIAPAPI.post('presupuesto/presupuestos/',presupuesto,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
}

export const actualizarPresupuesto = async (id,presupuesto,oficio, token) => {
    const id_oficio = oficio.get('id_oficio')
    presupuesto.id_oficio_fk = id_oficio
    oficio.delete('id_oficio')
    await actualizarOficio(id_oficio, oficio,token)
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


//Metodos para los objetos relacionados que se crean en el form.
export const agregarOficio = async (oficio,token) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/oficios/',oficio,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }))
}

const actualizarOficio = async (id,oficio,token) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/oficios/${id}/`,oficio,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }))
}
//Metodos para los objetos relacionados para los selects.

export const obtenerTiposDePresupuestos = async (token) => {
    return await manejarErrores(SIAPAPI.get('presupuesto/tipo_presupuestos', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
}

export const obtenerProyectos = async (token) => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/proyectos', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
}


export const agregarEnte = async (ente,token) => {
    return await manejarErrores(SIAPAPI.post('presupuesto/ente_financieros/',ente,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
}
export const obtenerEntesFinancieros = async (token) => {
    return await manejarErrores(SIAPAPI.get('presupuesto/ente_financieros', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
}


//Metodos auxiliares

export const buscaEnteFinanciero = async (nombre, token) => {
    const response = await SIAPAPI.get('presupuesto/ente_financieros', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data.find(entidad => entidad.nombre === nombre);
}