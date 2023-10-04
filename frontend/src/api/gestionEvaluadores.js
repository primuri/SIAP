import axios from 'axios'

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
        const id_nombre_creado = await obtenerNombre(evaluador.id_nombre_completo_fk, token);
        delete evaluador.id_nombre_completo_fk;
        evaluador.id_nombre_completo_fk = id_nombre_creado;

        const id_area_creada = await obtenerArea(evaluador.id_area_especialidad_fk, token);
        delete evaluador.id_area_especialidad_fk;
        evaluador.id_area_especialidad_fk = id_area_creada;

        if(evaluador.universidad_fk.id_universidad){
            let id_uni = evaluador.universidad_fk.id_universidad
            delete evaluador.universidad_fk
            evaluador.universidad_fk = id_uni
        }else{
            const id_universidad_creada = await obtenerUniversidad(evaluador.universidad_fk,token);
            delete evaluador.universidad_fk;
            console.log("id_universidad_creada", id_universidad_creada)
            evaluador.universidad_fk = id_universidad_creada;
        }

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
    const id_nom = evaluador.id_nombre_completo_fk.id_nombre_completo;
    await editarNombre(id_nom,evaluador.id_nombre_completo_fk, localStorage.getItem("token"));
    const id_nombre_editado = evaluador.id_nombre_completo_fk.id_nombre_completo;
    delete evaluador.id_nombre_completo_fk;
    evaluador.id_nombre_completo_fk = id_nombre_editado;

    const id_are = evaluador.id_area_especialidad_fk.id_area_especialidad;
    await editarArea(id_are,evaluador.id_area_especialidad_fk, localStorage.getItem("token"));
    const id_area_editada = evaluador.id_area_especialidad_fk.id_area_especialidad;
    delete evaluador.id_area_especialidad_fk;
    evaluador.id_area_especialidad_fk = id_area_editada;

    const id_univ = evaluador.universidad_fk.id_universidad;
    await editarUniversidad(id_univ,evaluador.universidad_fk, localStorage.getItem("token"));
    const id_universidad_editada = evaluador.universidad_fk.id_universidad;
    delete evaluador.universidad_fk;
    evaluador.universidad_fk = id_universidad_editada;
    
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

const obtenerNombre = async (nombre, token) => {
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

const obtenerArea = async (area, token) => {
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


const obtenerUniversidad = async (universidad, token) => {
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
