import axios from 'axios'
import {manejarErrores} from './errorHandler'

const token = localStorage.getItem('token')   

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

// Obtener evaluaciones 
export const obtenerEvaluacionesProyectos = async (token) => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/evaluaciones', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Obtener evaluaciones por id
export const obtenerEvaluacionPorID = async (token, id) => {
    return await manejarErrores(SIAPAPI.get(`version_proyecto/evaluaciones/?id_evaluacion=${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


// Editar evaluacion
export const editarEvaluacion = async (id, evaluacion, token) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/evaluaciones/${id}/`, evaluacion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Obtener evaluaciones por id de evaluador
export const obtenerEvaluacionesPorEvaluador = async (token, id) => {
    return await manejarErrores(SIAPAPI.get(`version_proyecto/evaluaciones/?id_evaluador=${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const enviarRespuesta = async (token, pregunta, respuesta, evaluacionID) => {

    const respuestaData = {
        pregunta: pregunta,
        respuesta: respuesta,
        id_evaluacion_fk: evaluacionID
    };

    return await manejarErrores(SIAPAPI.post('version_proyecto/respuestasevaluaciones/', respuestaData, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};
