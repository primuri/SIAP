import axios from 'axios'
import {manejarErrores} from './errorHandler'


const token = localStorage.getItem('token')

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerVersionesProyectos = async (token) => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/versionproyecto', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


export const buscarVersionProyecto = async (token, id) => {
    return await manejarErrores(SIAPAPI.get(`version_proyecto/versionproyecto/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const obtenerInforme = async (token) => {
    return await manejarErrores(SIAPAPI.get('informe/informes', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const obtenerInformePorId = async (token, informeId) => {
    return await manejarErrores(SIAPAPI.get(`informe/informes/${informeId}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


export const obtenerInformesProyecto = async (token, id_version_proyecto) => {
    return await manejarErrores(SIAPAPI.get(`informe/informes/?id_version_proyecto=${id_version_proyecto}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarInforme = async (informe, token) => {
    return await manejarErrores(SIAPAPI.post('informe/informes/', informe, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const editarInforme = async (id, informe, token) => {
    return await manejarErrores(SIAPAPI.put(`informe/informes/${id}/`, informe, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const eliminarInforme = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`informe/informes/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const obtenerEvaluacionCC = async () => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/evaluacionescc', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarEvaluacionCC = async (evaluacionCC) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/evaluacionescc/', evaluacionCC, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const editarEvaluacionCC = async (id, evaluacionCC) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/evaluacionescc/${id}/`, evaluacionCC, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const eliminarEvaluacionCC = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`version_proyecto/evaluacionescc/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const obtenerOficio = async () => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/oficios/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

export const agregarOficio = async (oficio) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/oficios/', oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

export const editarOficio = async (id, oficio) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const editarOficioAndDocumento = async (id, oficio) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

export const eliminarOficio = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`version_proyecto/oficios/${id}`,{
        headers: {'Authorization': `token ${token}`, 
                  'Content-Type':'application/json'}
     }));
};

export const obtenerDocumentoInforme = async () => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/documentos', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

export const agregarDocumentoInforme = async (documento) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/documentos/', documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

export const editarDocumentoInforme= async (id, documento) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const editarDocumentoInformeAndDocumento = async (id, documento) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

export const eliminarDocumentoInforme = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`version_proyecto/documentos/${id}`, {
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

export const agregarVersionInforme = async (versionInforme) => {
    return await manejarErrores(SIAPAPI.post('informe/versioninformes/', versionInforme, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const editarVersionInforme = async (id, versionInforme) => {
    return await manejarErrores(SIAPAPI.put(`informe/versioninformes/${id}/`, versionInforme, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const eliminarVersionInforme = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`informe/versioninformes/${id}`,{
        headers: {'Authorization': `token ${token}`, 
                  'Content-Type':'application/json'}
     }));
};

export const obtenerAccion = async () => {
    return await manejarErrores(SIAPAPI.get('informe/acciones', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const obtenerAccionesVersion = async (token, id_version_informe) => {
    return await manejarErrores(SIAPAPI.get(`informe/acciones/?id_version_informe=${id_version_informe}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarAccion = async (accion) => {
    return await manejarErrores(SIAPAPI.post('informe/acciones/', accion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const editarAccion = async (id, accion) => {
    return await manejarErrores(SIAPAPI.put(`informe/acciones/${id}/`, accion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};



export const editarDocumentoAccionAndDocumento = async (id, documento) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

export const agregarDocumentoAccion = async (documento) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/documentos/', documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

export const editarDocumentoAccion = async (id, documento) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const eliminarAccion = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`informe/acciones/${id}`,{
        headers: {'Authorization': `token ${token}`, 
                  'Content-Type':'application/json'
        }
     }));
};

