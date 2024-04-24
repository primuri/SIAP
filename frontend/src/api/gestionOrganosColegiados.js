import axios from 'axios'
import {manejarErrores} from './errorHandler'

const token = localStorage.getItem('token')

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerOrganosColegiados = async () => {
    return await manejarErrores(SIAPAPI.get('organo_colegiado/organo_colegiado/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const agregarOrganoColegiado = async (organo_colegiado) => {
    return await manejarErrores(SIAPAPI.post('organo_colegiado/organo_colegiado/', organo_colegiado, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

/*export const editarOrganoColegiado = async (organo_colegiado) => {
    return await manejarErrores(SIAPAPI.patch(`organo_colegiado/organo_colegiado/${organo_colegiado.id_organo_colegiado}`, organo_colegiado, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}*/

export const editarOrganoColegiado = async (id_organo_colegiado, organo_colegiado, token) => {
    return await manejarErrores(SIAPAPI.patch(`organo_colegiado/organo_colegiado/${id_organo_colegiado}/`, organo_colegiado, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


export const eliminarOrganoColegiado = async (id_organo_colegiado) => {
    return await manejarErrores(SIAPAPI.delete(`organo_colegiado/organo_colegiado/${id_organo_colegiado}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}