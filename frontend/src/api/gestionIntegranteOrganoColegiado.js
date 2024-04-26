import axios from 'axios'
import {manejarErrores} from './errorHandler'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});


export const obtenerIntegrantes = async (token) => {
    return await manejarErrores(SIAPAPI.get(`organo_colegiado/integrante/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarIntegrante = async (integrante, token) => {
    try { 
        const response_integrante =  await manejarErrores( SIAPAPI.post('organo_colegiado/integrante/', integrante, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
        const id_integrante_creado = response_integrante.data.id_integrante;
        return id_integrante_creado;
    } catch(error) {
        console.error("Error agregando integrante: ", error);
        throw error;
    } 
};

export const editarIntegrante = async (id, integrante, token) => {
    try { 
        return await manejarErrores( SIAPAPI.put(`organo_colegiado/integrante/${id}/`, integrante, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
       
    } catch(error) {
        console.error("Error al editar integrante: ", error);
        throw error;
    } 
};

export const eliminarIntegrante = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`organo_colegiado/integrante/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
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
