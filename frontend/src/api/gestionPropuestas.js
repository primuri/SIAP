import axios from 'axios'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});


export const obtenerPropuestas = async (token) => {
    return await SIAPAPI.get('propuesta_proyecto/propuesta_proyecto', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};
