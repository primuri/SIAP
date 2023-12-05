import axios from 'axios'
import {manejarErrores} from './errorHandler'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerProyectos = async (token) => {
    return await manejarErrores( SIAPAPI.get('version_proyecto/proyectos/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarProyectos = async (proyecto, token) => {
    try { 
        return await manejarErrores( SIAPAPI.post('version_proyecto/proyectos/', proyecto, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
       
    } catch(error) {
        console.error("Error agregando proyecto: ", error);
        throw error;
    } 
};

export const obtenerVersionProyectos = async (token) => {
    return await manejarErrores( SIAPAPI.get('version_proyecto/versionproyecto/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


export const agregarVersionProyectos = async (version_proyecto, token) => {
    try { 
        const response_version =  await manejarErrores( SIAPAPI.post('version_proyecto/versionproyecto/', version_proyecto, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
        const id_version_creada = response_version.data.id_version_proyecto;
        return id_version_creada;
    } catch(error) {
        console.error("Error agregando version de proyecto: ", error);
        throw error;
    } 
};


export const editarVersionProyectos = async (id, version_proyecto, token) => {
    try { 
        return await manejarErrores( SIAPAPI.put(`version_proyecto/versionproyecto/${id}/`, version_proyecto, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
       
    } catch(error) {
        console.error("Error editar version de proyecto: ", error);
        throw error;
    } 
};



export const agregarOficio = async (oficio, token) => {
    try {
        const response_oficio =  await manejarErrores( SIAPAPI.post('version_proyecto/oficios/', oficio, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }));
        const id_oficio_creada = response_oficio.data.id_oficio;
        return id_oficio_creada;
    } catch(error) {
        console.error("Error agregando oficio: ", error);
        throw error;
    } 
};

export const agregarVigencia = async (vigencia, token) => {
    try {
        const response_vigencia = await manejarErrores( SIAPAPI.post('propuesta_proyecto/vigencia/', vigencia, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
        const id_vigencia_creada = response_vigencia.data.id_vigencia;
        return id_vigencia_creada;
    } catch(error) {
        console.error("Error agregando vigencia: ", error);
        throw error;
    } 
};



export const editarVigencia = async (id, vigencia, token) => {
    const responseVigencia = await manejarErrores( SIAPAPI.put(`propuesta_proyecto/vigencia/${id}/`, vigencia, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
    return responseVigencia;
};


export const eliminarVigencia = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`propuesta_proyecto/vigencia/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};




export const editarOficio = async (id, oficio, token) => {
    const responseOficio = await manejarErrores( SIAPAPI.patch(`version_proyecto/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
    return responseOficio;
};


export const eliminarOficio = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`version_proyecto/oficios/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const eliminarVersion = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`version_proyecto/versionproyecto/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const eliminarProyecto = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`version_proyecto/proyectos/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};