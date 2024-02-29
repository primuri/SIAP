import axios from 'axios'
import { manejarErrores } from './errorHandler'

const token = localStorage.getItem('token');

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
})

export const obtenerEvaluaciones = async () => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/evaluaciones/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const agregarEvaluacion = async (evaluacion) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/evaluaciones/', evaluacion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const editarEvaluacion = async (evaluacion) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/evaluaciones/${evaluacion.id_evaluacion}`, evaluacion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const eliminarEvaluacion = async (id_evaluacion) => {
    return await manejarErrores(SIAPAPI.delete(`version_proyecto/evaluaciones/${id_evaluacion}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const agregarDocumento = async (documento) => {
    return await manejarErrores(SIAPAPI.put(`propuesta_proyecto/documento_asociado/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};


export const editarDocumento = async (documento) => {
    return await manejarErrores(SIAPAPI.patch(`propuesta_proyecto/documento_asociado/${documento.id_documento}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

export const obtenerEvaluadores = async () => {
    return await manejarErrores(SIAPAPI.get('personas/evaluador/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const obtenerProyectos = async () => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/proyectos/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const obtenerVersionesProyecto = async (idProyecto) => {
    return await manejarErrores(SIAPAPI.get(`version_proyecto/versionproyecto/?id_codigo_vi_fk=${idProyecto}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}