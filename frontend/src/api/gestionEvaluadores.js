import axios from 'axios'
import { buscarUniversidad, obtenerUniversidad } from './gestionAcademicos';
import { manejarErrores } from './errorHandler'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerEvaluadores = async (token) => {
    return await manejarErrores(SIAPAPI.get('personas/evaluador', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarEvaluador = async (evaluador, token) => {
    try {
        const id_nombre_creado = await manejarErrores(obtenerNombre(evaluador.id_nombre_completo_fk, token));
        delete evaluador.id_nombre_completo_fk;
        evaluador.id_nombre_completo_fk = id_nombre_creado;

        const id_area_creada = await manejarErrores(obtenerArea(evaluador.id_area_especialidad_fk, token));
        delete evaluador.id_area_especialidad_fk;
        evaluador.id_area_especialidad_fk = id_area_creada;

        const response_evaluador = await manejarErrores(SIAPAPI.post('personas/evaluador/', evaluador, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));

        return response_evaluador;
    } catch (error) {
        console.error("Error agregando evaluador: ", error);
        throw error;
    }
};

export const editarEvaluador = async (id, evaluador, token) => {
    const id_nom = evaluador.id_nombre_completo_fk.id_nombre_completo;
    await manejarErrores(editarNombre(id_nom, evaluador.id_nombre_completo_fk, localStorage.getItem("token")));
    const id_nombre_editado = evaluador.id_nombre_completo_fk.id_nombre_completo;
    delete evaluador.id_nombre_completo_fk;
    evaluador.id_nombre_completo_fk = id_nombre_editado;

    const id_are = evaluador.id_area_especialidad_fk.id_area_especialidad;
    await manejarErrores(editarArea(id_are, evaluador.id_area_especialidad_fk, localStorage.getItem("token")));
    const id_area_editada = evaluador.id_area_especialidad_fk.id_area_especialidad;
    delete evaluador.id_area_especialidad_fk;
    evaluador.id_area_especialidad_fk = id_area_editada;

    let nombre = evaluador.universidad_fk.nombre;
    let pais = evaluador.universidad_fk.pais;

    const responseUniversidad = await manejarErrores(buscarUniversidad(nombre, pais, localStorage.getItem("token")));

    var id_univ = {};

    if (responseUniversidad !== undefined) {
        id_univ = responseUniversidad.id_universidad;
    } else {
        id_univ = await manejarErrores(obtenerUniversidad(evaluador.universidad_fk, localStorage.getItem("token")));
    }

    delete evaluador.universidad_fk;
    evaluador.universidad_fk = id_univ;


    const responseEvaluador = await manejarErrores(SIAPAPI.put(`personas/evaluador/${id}/`, evaluador, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
    return responseEvaluador;
};

export const eliminarEvaluador = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`personas/evaluador/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

const obtenerNombre = async (nombre, token) => {
    try {
        const response_nombre = await manejarErrores(SIAPAPI.post('personas/nombre_completo/', nombre, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
        const id_nombre_creado = response_nombre.data.id_nombre_completo;
        return id_nombre_creado;
    } catch (error) {
        console.error("Error agregando nombre: ", error);
        throw error;
    }
};

export const editarNombre = async (id, nombre, token) => {
    const responseNombre = await manejarErrores(SIAPAPI.put(`personas/nombre_completo/${id}/`, nombre, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
    return responseNombre;
};

export const eliminarNombre = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`personas/nombre_completo/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

const obtenerArea = async (area, token) => {
    try {
        const response_area = await manejarErrores(SIAPAPI.post('personas/area_especialidad/', area, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
        const id_area_creada = response_area.data.id_area_especialidad;
        return id_area_creada;
    } catch (error) {
        console.error("Error agregando area de especialidad: ", error);
        throw error;
    }
};

export const editarArea = async (id, area, token) => {
    const responseArea = await manejarErrores(SIAPAPI.put(`personas/area_especialidad/${id}/`, area, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
    return responseArea;
};

export const eliminarArea = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`personas/area_especialidad/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


export const editarUniversidad = async (id, universidad, token) => {
    const responseUniversidad = await manejarErrores(SIAPAPI.put(`personas/universidad/${id}/`, universidad, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
    return responseUniversidad;
};

export const eliminarUniversidad = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`personas/universidad/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};
