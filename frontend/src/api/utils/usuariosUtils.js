import axios from "axios";

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerNombre = async (nombre, token) => {
    try {
        const response_nombre = await SIAPAPI.post('personas/nombre_completo/', nombre, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_nombre_creado = response_nombre.data.id_nombre_completo;
        return id_nombre_creado;
    } catch(error) {
        console.error("Error agregando nombre: ", error);
        throw error;
    } 
};

export const editarNombre = async (id, nombre, token) => {
    const responseNombre = await SIAPAPI.put(`personas/nombre_completo/${id}/`, nombre, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseNombre;
};

export const eliminarNombre = async (id, token) => {
    return await SIAPAPI.delete(`personas/nombre_completo/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const obtenerArea = async (area, token) => {
     try {
        const response_area = await SIAPAPI.post('personas/area_especialidad/', area, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_area_creada = response_area.data.id_area_especialidad;
        return id_area_creada;
    } catch(error) {
        console.error("Error agregando area de especialidad: ", error);
        throw error;
    }
};

export const editarArea = async (id, area, token) => {
    const responseArea = await SIAPAPI.put(`personas/area_especialidad/${id}/`, area, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseArea;
};

export const eliminarArea = async (id, token) => {
    return await SIAPAPI.delete(`personas/area_especialidad/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


export const obtenerUniversidad = async (universidad, token) => {
    try {
        const response_universidad = await SIAPAPI.post('personas/universidad/', universidad, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_universidad_creada = response_universidad.data.id_universidad;
        return id_universidad_creada;
    } catch(error) {
        console.error("Error agregando universidad: ", error);
        throw error;
    }
};

export const editarUniversidad = async (id, universidad, token) => {
    const responseUniversidad = await SIAPAPI.put(`personas/universidad/${id}/`, universidad, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseUniversidad;
};

export const eliminarUniversidad = async (id, token) => {
    return await SIAPAPI.delete(`personas/universidad/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};
