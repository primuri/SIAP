import axios from 'axios'
import {manejarErrores} from './errorHandler'
/*
    {
    "gasto": {
        "id_gasto": 1,
        "fecha": 22-01-2023,
        "detalle": "informacion",
        "monto": 100497,
        "id_partida_fk": 1,
        "id_factura_fk": 1,
        "tipo": "info"
    },
    "factura": {
        "id_factura": 1,
        "id_cedula_proveedor_fk":  1,
        "id_producto_servicio_fk": 1
    },

}

*/

const token = localStorage.getItem('token')                                      // Token para los request

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

// Obtener versiones de proyectos
export const obtenerVersionesProyectos = async (token) => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/versionproyecto', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


// Obtener version de proyecto
export const buscarVersionProyecto = async (token, id) => {
    return await manejarErrores(SIAPAPI.get(`version_proyecto/versionproyecto/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Obtener informe
export const obtenerInforme = async (token) => {
    return await manejarErrores(SIAPAPI.get('informe/informes', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

//Obtener informe por id
export const obtenerInformePorId = async (token, informeId) => {
    return await manejarErrores(SIAPAPI.get(`informe/informes/${informeId}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


// Obtener informes de un proyecto
export const obtenerInformesProyecto = async (token, id_version_proyecto) => {
    return await manejarErrores(SIAPAPI.get(`informe/informes/?id_version_proyecto=${id_version_proyecto}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Agregar informe
export const agregarInforme = async (informe, token) => {
    return await manejarErrores(SIAPAPI.post('informe/informes/', informe, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Editar informe
export const editarInforme = async (id, informe, token) => {
    return await manejarErrores(SIAPAPI.put(`informe/informes/${id}/`, informe, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Eliminar informe
export const eliminarInforme = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`informe/informes/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Obtener evaluacion CC
export const obtenerEvaluacionCC = async () => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/evaluacionescc', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Agregar evaluacion CC
export const agregarEvaluacionCC = async (evaluacionCC) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/evaluacionescc/', evaluacionCC, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Editar evaluacion CC
export const editarEvaluacionCC = async (id, evaluacionCC) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/evaluacionescc/${id}/`, evaluacionCC, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Eliminar evaluacion CC
export const eliminarEvaluacionCC = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`version_proyecto/evaluacionescc/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Obtener oficio
export const obtenerOficio = async () => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/oficios/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Agregar oficio
export const agregarOficio = async (oficio) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/oficios/', oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Editar oficio
export const editarOficio = async (id, oficio) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Editar oficio con archivo adjunto
export const editarOficioAndDocumento = async (id, oficio) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Eliminar oficio
export const eliminarOficio = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`version_proyecto/oficios/${id}`,{
        headers: {'Authorization': `token ${token}`, 
                  'Content-Type':'application/json'}
     }));
};

// Obtener documento informe
export const obtenerDocumentoInforme = async () => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/documentos', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Agregar documento informe
export const agregarDocumentoInforme = async (documento) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/documentos/', documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Editar documento informe
export const editarDocumentoInforme= async (id, documento) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Editar documento informe con archivo adjunto
export const editarDocumentoInformeAndDocumento = async (id, documento) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Eliminar documento informe
export const eliminarDocumentoInforme = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`version_proyecto/documentos/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Obtener version de informe
export const obtenerVersionesInforme = async (id_informe) => {
    return await manejarErrores(SIAPAPI.get(`informe/versioninformes/?id_informe=${id_informe}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Agregar version de informe
export const agregarVersionInforme = async (versionInforme) => {
    return await manejarErrores(SIAPAPI.post('informe/versioninformes/', versionInforme, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Editar version de informe
export const editarVersionInforme = async (id, versionInforme) => {
    return await manejarErrores(SIAPAPI.put(`informe/versioninformes/${id}/`, versionInforme, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Eliminar version de informe
export const eliminarVersionInforme = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`informe/versioninformes/${id}`,{
        headers: {'Authorization': `token ${token}`, 
                  'Content-Type':'application/json'}
     }));
};

// Obtener todas las acciones
export const obtenerAccion = async () => {
    return await manejarErrores(SIAPAPI.get('informe/acciones', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Obtener todas las acciones de una version de informe
export const obtenerAccionesVersion = async (token, id_version_informe) => {
    return await manejarErrores(SIAPAPI.get(`informe/acciones/?id_version_informe=${id_version_informe}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Agregar accion
export const agregarAccion = async (accion) => {
    return await manejarErrores(SIAPAPI.post('informe/acciones/', accion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Editar accion
export const editarAccion = async (id, accion) => {
    return await manejarErrores(SIAPAPI.put(`informe/acciones/${id}/`, accion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


// Editar documento accion con archivo adjunto
export const editarDocumentoAccionAndDocumento = async (id, documento) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Agregar documento informe
export const agregarDocumentoAccion = async (documento) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/documentos/', documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Editar documento accion con archivo adjunto
export const editarDocumentoAccion = async (id, documento) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Eliminar accion
export const eliminarAccion = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`informe/acciones/${id}`,{
        headers: {'Authorization': `token ${token}`, 
                  'Content-Type':'application/json'
        }
     }));
};


