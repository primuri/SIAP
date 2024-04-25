import axios from 'axios'
import {manejarErrores} from './errorHandler'


const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
})

export const login = (user) => {
    return manejarErrores(SIAPAPI.post('login', user));
};

export const signup = (user, token) => {
    return manejarErrores(SIAPAPI.post('signup', user, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const obtenerUsuarios = (token) => {
    return manejarErrores(SIAPAPI.get('obtener_usuarios',{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type':'application/json'
        }
    }));
};

export const eliminarUsuario = (id, token) => {
    return manejarErrores(SIAPAPI.delete(`eliminar_usuario/${id}/`,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type':'application/json'
        }
    }));
};

export const actualizarUsuario = (id, usuario, token) => {
    return manejarErrores(SIAPAPI.patch(`actualizar_usuario/${id}/`, usuario, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type':'application/json'
        }
    })); 
};

