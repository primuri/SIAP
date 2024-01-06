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

// Obtener evaluaciones por id de evaluador
export const obtenerEvaluacionesPorEvaluador = async (token, id) => {
    return await manejarErrores(SIAPAPI.get(`version_proyecto/evaluaciones/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Obtener preguntas de una evaluación específica
export const obtenerPreguntasPorEvaluación = async (token, id) => {
    return await manejarErrores(SIAPAPI.get(`version_proyecto/preguntasevaluaciones/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};