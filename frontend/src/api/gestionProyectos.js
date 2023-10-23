import axios from 'axios'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerProyectos = async (token) => {
    return await SIAPAPI.get('version_proyecto/proyectos/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const obtenerVersionProyectos = async (token) => {
    return await SIAPAPI.get('version_proyecto/versionproyecto/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


export const agregarVigencia = async (vigencia, token) => {
    try {
        const response_vigencia = await SIAPAPI.post('propuesta_proyecto/vigencia/', vigencia, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_vigencia_creada = response_vigencia.data.id_vigencia;
        return id_vigencia_creada;
    } catch(error) {
        console.error("Error agregando vigencia: ", error);
        throw error;
    } 
};



export const editarVigencia = async (id, vigencia, token) => {
    const responseVigencia = await SIAPAPI.put(`propuesta_proyecto/vigencia/${id}/`, vigencia, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseVigencia;
};


export const eliminarVigencia = async (id, token) => {
    return await SIAPAPI.delete(`propuesta_proyecto/vigencia/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


export const editarOficio = async (id, oficio, token) => {
    const responseOficio = await SIAPAPI.patch(`version_proyecto/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return responseOficio;
};


export const eliminarOficio = async (id, token) => {
    return await SIAPAPI.delete(`version_proyecto/oficios/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};