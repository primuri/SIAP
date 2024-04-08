import axios from 'axios'
import {manejarErrores} from './errorHandler'
const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerAcademicos = async (token) => {
    return await manejarErrores(SIAPAPI.get('personas/academico', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarAcademico = async (formData, token) => {

    try {
        const academico = JSON.parse(formData.get('json'))
        formData.delete('json')
        const titulos = academico?.titulos;
        const telefonos = academico?.telefonos;
        delete academico.titulos;
        delete academico.telefonos;

        const id_nombre_creado = await manejarErrores(obtenerNombre(academico.id_nombre_completo_fk, token));
        delete academico.id_nombre_completo_fk;
        academico.id_nombre_completo_fk = id_nombre_creado;

        const id_area_creada = await manejarErrores(obtenerArea(academico.id_area_especialidad_fk, token));
        delete academico.id_area_especialidad_fk;
        academico.id_area_especialidad_fk = id_area_creada;
        if(academico.id_area_especialidad_secundaria_fk){
            const id_area_sec_creada = await manejarErrores(obtenerArea(academico.id_area_especialidad_secundaria_fk, token));
            delete academico.id_area_especialidad_secundaria_fk;
            academico.id_area_especialidad_secundaria_fk = id_area_sec_creada;
        }else{
            delete academico.id_area_especialidad_secundaria_fk
        }
       
        delete academico.foto
        for (const key in academico) {
            if (Object.prototype.hasOwnProperty.call(academico, key)) {
                formData.append(key, academico[key]);
            }
        }
        
        const response_academico = await manejarErrores(SIAPAPI.post('personas/academico/', formData, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }))
        if (titulos) {
            agregarTitulos(titulos, response_academico.data.id_academico, token);
        }
        if (telefonos) {
            agregarTelefonos(telefonos, response_academico.data.id_academico, token);
        }
        return response_academico;
    } catch (error) {
        console.error("Error agregando académico: ", error);
        throw error;
    }
};

export const editarAcademico = async (id, academico, token) => {
    const responseAcademico = await manejarErrores(SIAPAPI.patch(`personas/academico/${id}/`, academico, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));

    return responseAcademico;
};

export const eliminarAcademico = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`personas/academico/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
};


export const obtenerTitulos = async (token) => {
    return await manejarErrores(SIAPAPI.get('personas/titulos', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
};

export const obtenerPropuestas = async (token) => {
    return await manejarErrores(SIAPAPI.get('propuesta_proyecto/propuesta_proyecto/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
};

export const obtenerTelefonos = async (token) => {
    return await manejarErrores(SIAPAPI.get('personas/telefono', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
};

export const agregarTitulos = (titulos, id_academico, token) => {
    try {
        titulos.forEach(async titulo => {
            titulo.id_academico_fk = id_academico;
            await manejarErrores(SIAPAPI.post('personas/titulos/', titulo, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
            }))
        });
    } catch (error) {
        console.error(error)
        throw (error)
    }
};

export const agregarTelefonos = (telefonos, id_academico, token) => {
    try {
        telefonos.forEach(async telefono => {
            telefono.id_academico_fk = id_academico;
            await manejarErrores(SIAPAPI.post('personas/telefono/', telefono, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
            }))
        });
    } catch (error) {
        console.error(error)
        throw (error)
    }
};

export const actualizarTitulos = (titulos, academico, token) => {
    try {
        //Dos casos si el titulo tiene un id significa que ya existia en la base de datos, sino hay que crearlo.
        titulos.forEach(async titulo => {
            if(titulo.id_titulos){
                let id_titulos = titulo.id_titulos;
                let id_academico = titulo.id_academico_fk.id_academico;
                delete titulo.id_academico_fk;
                delete titulo.id_titulos;
                titulo.id_academico_fk = id_academico;
                await manejarErrores(SIAPAPI.put(`personas/titulos/${id_titulos}/`, titulo, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }))
            }else{
                titulo.id_academico_fk = academico;
                await manejarErrores(SIAPAPI.post('personas/titulos/', titulo, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }))
            }
            
        });
    } catch (error) {
        console.error(error)
        throw (error)
    }
};

export const actualizarTelefonos = (telefonos, academico, token) => {
    try {
        telefonos.forEach(async telefono => {
            if(telefono.id_telefono){
                let id_academico = telefono.id_academico_fk.id_academico;
                let id_telefono = telefono.id_telefono;
                delete telefono.id_academico_fk;
                delete telefono.id_telefono;
                telefono.id_academico_fk = id_academico;
                await manejarErrores(SIAPAPI.put(`personas/telefono/${id_telefono}/`, telefono, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }))
            }else{
                telefono.id_academico_fk = academico;
                await manejarErrores(SIAPAPI.post('personas/telefono/', telefono, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }))
            }

        });
    } catch (error) {
        console.error(error)
        throw (error)
    }
};

export const eliminarTelefonos = (id, token) => {
    return SIAPAPI.delete(`personas/telefono/${id}/`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
    });
};

export const eliminarTitulos = (id, token) => {
    return SIAPAPI.delete(`personas/titulos/${id}/`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
    });
};


export const obtenerNombre = async (nombre, token) => {
    try {
        const response_nombre = await manejarErrores(SIAPAPI.post('personas/nombre_completo/', nombre, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }))
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
    }))
    return responseNombre;
};

export const eliminarNombre = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`personas/nombre_completo/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
};

const obtenerArea = async (area, token) => {
    try {
        const response_area = await manejarErrores(SIAPAPI.post('personas/area_especialidad/', area, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }))
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
    }))
    return responseArea;
};

export const eliminarArea = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`personas/area_especialidad/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
};

export const obtenerUniversidades = async (token) => {
    return await manejarErrores(SIAPAPI.get('personas/universidad/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
};

export const obtenerUniversidad = async (universidad, token) => {
    try {
        const response_universidad = await manejarErrores(SIAPAPI.post('personas/universidad/', universidad, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }))
        const id_universidad_creada = response_universidad.data.id_universidad;
        return id_universidad_creada;
    } catch (error) {
        console.error("Error agregando universidad: ", error);
        throw error;
    }
};

export const obtenerUniversidadCompleta = async (universidad, token) => {
    try {
        const response_universidad = await manejarErrores(SIAPAPI.post('personas/universidad/', universidad, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }))
        return response_universidad.data;
    } catch (error) {
        console.error("Error agregando universidad: ", error);
        throw error;
    }
};

export const editarUniversidad = async (id, universidad, token) => {
    const responseUniversidad = await manejarErrores(SIAPAPI.put(`personas/universidad/${id}/`, universidad, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
    return responseUniversidad;
};

export const eliminarUniversidad = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`personas/universidad/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
};

export const buscarUniversidad = async (nombre, pais, token) => {
    const response = await manejarErrores(SIAPAPI.get('personas/universidad/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
    return response.data.find(universidad => universidad.nombre === nombre && universidad.pais === pais);
}