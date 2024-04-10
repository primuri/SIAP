import axios from 'axios'
import {manejarErrores} from './errorHandler'

/*
    {
    "integrante": {
        "id_integrante": 1,
        "id_organo_colegiado_fk": 1,
        "nombre_integrante": "nombre",
        "id_oficio_fk": 1,
        "id_vigencia_fk": 1,
        "puesto": "Secretario",
        "normativa_reguladora": "sin detalle",
        "inicio_funciones": 01/01/2023
    },
    "organoColegiado": {
        "id_organo_colegiado": 1,
        // ... otros campos del modelo 
    },
    "oficio": {
        "id_oficio": 1,
        // ... otros campos del modelo 
    },
    "vigencia": {
        "id_vigencia": 1
        // ... otros campos del modelo 
    }
}
*/

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

//Organos colegiados

export const obtenerOrganosColegiados = async (token) => {
    return await manejarErrores(SIAPAPI.get(`organo_colegiado/organo_colegiado/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

// Obtener integrante de un organo colegiado
export const obtenerIntegranteOrganoColegiado = async (token, id_organo_colegiado) => {
    return await manejarErrores(SIAPAPI.get(`organo_colegiado/integrante/?id_organo_colegiado_fk=${id_organo_colegiado}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

//Integrante

export const obtenerIntegrantes = async (token) => {
    return await manejarErrores(SIAPAPI.get(`organo_colegiado/integrante/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarIntegrante = async (integrante, oficio, token) => {
    //Separamos los datos ya que hay que subir un documento
    data.delete('id_integrante')

    let ofk = await agregarOficio(oficio,token);
    integrante.id_oficio_fk = ofk.data.id_oficio
    return await manejarErrores(SIAPAPI.post('organo_colegiado/integrante/', integrante, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};
/*
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
*/

/*export const editarIntegrante = async (id, integrante, oficio, token) => {
    data.delete('id_integrante')
    const id_oficio = oficio.get('id_oficio')
    integrante.id_oficio_fk = id_oficio
    oficio.delete('id_oficio')
    await actualizarOficio(id_oficio, oficio,token)
    return await manejarErrores(SIAPAPI.put(`organo_colegiado/integrante/${id}/`, integrante, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};*/

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

//Vigencia

export const agregarVigencia = async (vigencia, token) => {
    return await manejarErrores( SIAPAPI.post('propuesta_proyecto/vigencia/', vigencia, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })); 
};
/*
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
*/

export const editarVigencia = async (id, vigencia, token) => {
    return await manejarErrores( SIAPAPI.put(`propuesta_proyecto/vigencia/${id}/`, vigencia, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};
/* 
export const editarVigencia = async (id, vigencia, token) => {
    const responseVigencia = await manejarErrores( SIAPAPI.put(`propuesta_proyecto/vigencia/${id}/`, vigencia, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
    return responseVigencia;
};
*/

export const eliminarVigencia = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`propuesta_proyecto/vigencia/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

//Oficio

export const agregarOficio = async (oficio, token) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/oficios/', oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};
/*
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
*/

export const editarOficio = async (id, oficio, token) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};
/*
export const editarOficio = async (id, oficio, token) => {
    const responseOficio = await manejarErrores( SIAPAPI.patch(`version_proyecto/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
    return responseOficio;
};
*/

export const eliminarOficio = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`version_proyecto/oficios/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


