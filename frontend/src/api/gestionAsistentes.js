import axios from 'axios'
import {manejarErrores} from './errorHandler'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});


export const agregarDesinacionAsistente = async (designacionAsistente, token) => {
    try { 
        const response_desinacion =  await manejarErrores( SIAPAPI.post('version_proyecto/designacionasistente/', designacionAsistente, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
        const id_desinacion_creada = response_desinacion.data.id_designacion_asistente;
        return id_desinacion_creada;
    } catch(error) {
        console.error("Error agregando desinacion de asistente del proyecto: ", error);
        throw error;
    } 
};

export const editarDesinacionAsistente = async (id, desinacion, token) => {
    const response_designacion = await manejarErrores( SIAPAPI.put(`version_proyecto/designacionasistente/${id}/`, desinacion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
    return response_designacion;
};

export const eliminarDesinacionAsistente = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`version_proyecto/designacionasistente/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


export const obtenerDesinacionAsistente = async (token) => {
    return await manejarErrores( SIAPAPI.get('version_proyecto/designacionasistente/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};



export const obtenerVersionesInforme = async (id_informe) => {
    return await manejarErrores(SIAPAPI.get(`informe/versioninformes/?id_informe=${id_informe}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


export const agregarAsistente = async (asistente, token) => {
    try { 
        const response_asistente =  await manejarErrores( SIAPAPI.post('personas/asistente/', asistente, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
        const id_asistente_creado = response_asistente.data.id_asistente_carnet;
        return id_asistente_creado;
    } catch(error) {
        console.error("Error agregando asistente del proyecto: ", error);
        throw error;
    } 
};

export const editarAsistente = async (id, asistente, token) => {
    const response_asistente = await manejarErrores( SIAPAPI.put(`personas/asistente/${id}/`, asistente, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
    return response_asistente;
};

export const eliminarAsistente = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`personas/asistente/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


export const obtenerAsistente = async (token) => {
    return await manejarErrores( SIAPAPI.get('personas/asistente/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};