import axios from 'axios'
import {manejarErrores} from './errorHandler'

/* Formato JSON usuario (para agregar / editar):

 {     
    "correo": "root@root.com",
    "password": "pbkdf2_sha256$600000$ay6PJv1IXJDpIL04K3PLr9$k1MTr3ow1cavWXCPKTwbh/FNtBpCPK1CB5pzcD+tXDg=", (hash necesario para actualizar)     
    "groups": [         
      "administrador"
    ]
  }

*/

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

