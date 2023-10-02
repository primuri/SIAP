import axios from 'axios'
import * as utils from './gestionAcademicos'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerEvaluadores = async (token) => {
    return await SIAPAPI.get('personas/evaluador', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const agregarEvaluador = async (evaluador, token) => {
    try {
        const id_nombre_creado = await utils.obtenerNombre(evaluador.id_nombre_completo_fk, token);
        delete evaluador.id_nombre_completo_fk;
        evaluador.id_nombre_completo_fk = id_nombre_creado;

        const id_area_creada = await utils.obtenerArea(evaluador.id_area_especialidad_fk, token);
        delete evaluador.id_area_especialidad_fk;
        evaluador.id_area_especialidad_fk = id_area_creada;

        const id_universidad_creada = await utils.obtenerUniversidad(evaluador.universidad_fk, token);
        delete evaluador.universidad_fk;
        evaluador.universidad_fk = id_universidad_creada;

        const response_evaluador = await SIAPAPI.post('personas/evaluador/', evaluador, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response_evaluador;
    } catch (error) {
        console.error("Error agregando evaluador: ", error);
        throw error;
    }
};

export const editarEvaluador = async (id, evaluador, token) => {
    const responseEvaluador = await SIAPAPI.put(`personas/evaluador/${id}/`, evaluador, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseEvaluador;
};

export const eliminarEvaluador = async (id, token) => {
    return await SIAPAPI.delete(`personas/evaluador/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};