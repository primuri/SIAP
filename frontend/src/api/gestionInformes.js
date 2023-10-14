import axios from 'axios'
import {manejarErrores} from './errorHandler'

/* 
    Formato JSON para agregar informe

    {
        "id_version_proyecto_fk": 1,
        "estado": "Aprobado",
        "tipo": "1",
        "fecha_presentacion": "2023-10-11T17:26:02Z",
        "fecha_debe_presentar": "2023-10-11T17:26:06Z"
    }

    Formato JSON para agregar evaluacion CC

    {
        "id_evaluacion_cc": 1,
        "id_documento_evualuacion_fk": 1,
        "detalle": "Evaluacion CC 1"
    }
    
    Formato JSON para agregar oficios

    {
        "id_oficio": 1,
        "ruta_archivo": "www.google.com",
        "detalle": "Google"
    }

    Formato JSON para agregar documento

    {
        "id_documento": 1,
        "tipo": "Prueba",
        "detalle": "Prueba",
        "ruta_archivo": "www.google.com"
    }

    Formato JSON para agregar version informe

    {
        "id_version_informe": 1,
        "id_informe_fk": 1,
        "id_evaluacion_cc_fk": 1,
        "id_oficio_fk": 1,
        "id_documento_informe_fk": 1,
        "numero_version": "1",
        "fecha_presentacion": "2023-10-11T20:25:16Z"
    }

    Formato JSON para agregar accion

    [
        {
            "id_accion": 1,
            "id_version_informe_fk": 1,
            "id_documento_accion_fk": 3,
            "fecha": "2023-10-13T20:39:07Z",
            "origen": "A",
            "destino": "B",
            "estado": "Aprobado"
        }
    ]


*/

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
export const obtenerEvaluacionCC = async (token) => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/evaluacionescc', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Agregar evaluacion CC
export const agregarEvaluacionCC = async (evaluacionCC, token) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/evaluacionescc/', evaluacionCC, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Editar evaluacion CC
export const editarEvaluacionCC = async (id, evaluacionCC, token) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/evaluacionescc/${id}/`, evaluacionCC, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Eliminar evaluacion CC
export const eliminarEvaluacionCC = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`version_proyecto/evaluacionescc/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Obtener oficio
export const obtenerOficio = async (token) => {
    return await manejarErrores(SIAPAPI.get('informe/oficios', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Agregar oficio
export const agregarOficio = async (oficio, token) => {
    return await manejarErrores(SIAPAPI.post('informe/oficios/', oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Editar oficio
export const editarOficio = async (id, oficio, token) => {
    return await manejarErrores(SIAPAPI.put(`informe/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Eliminar oficio
export const eliminarOficio = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`informe/oficios/${id}`,{
        headers: {'Authorization': `token ${token}`, 
                  'Content-Type':'application/json'}
     }));
};

// Obtener documento informe
export const obtenerDocumentoInforme = async (token) => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/documentos', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Agregar documento informe
export const agregarDocumentoInforme = async (documento, token) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/documentos/', documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Editar documento informe
export const editarDocumentoInforme = async (id, documento, token) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Eliminar documento informe
export const eliminarDocumentoInforme = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`version_proyecto/documentos/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Obtener version de informe
export const obtenerVersionInforme = async (token) => {
    return await manejarErrores(SIAPAPI.get('informe/versioninformes', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Agregar version de informe
export const agregarVersionInforme = async (versionInforme, token) => {
    return await manejarErrores(SIAPAPI.post('informe/versioninformes/', versionInforme, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Editar version de informe
export const editarVersionInforme = async (id, versionInforme, token) => {
    return await manejarErrores(SIAPAPI.put(`informe/versioninformes/${id}/`, versionInforme, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Eliminar version de informe
export const eliminarVersionInforme = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`informe/versioninformes/${id}`,{
        headers: {'Authorization': `token ${token}`, 
                  'Content-Type':'application/json'}
     }));
};

// Obtener accion
export const obtenerAccion = async (token) => {
    return await manejarErrores(SIAPAPI.get('informe/acciones', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Agregar accion
export const agregarAccion = async (accion, token) => {
    return await manejarErrores(SIAPAPI.post('informe/acciones/', accion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Editar accion
export const editarAccion = async (id, accion, token) => {
    return await manejarErrores(SIAPAPI.put(`informe/acciones/${id}/`, accion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Eliminar accion
export const eliminarAccion = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`informe/acciones/${id}`,{
        headers: {'Authorization': `token ${token}`, 
                  'Content-Type':'application/json'}
     }));
};

