import axios from 'axios'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});


export const obtenerPropuestas = async (token) => {
    return await SIAPAPI.get('propuesta_proyecto/documento_asociado/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


export const agregarDocumento = async (propuesta,  token) => {

    try {
        const vigencia = {
            fecha_inicio: propuesta.colaborador_principal.id_vigencia_fk.fecha_inicio,
            fecha_fin: propuesta.colaborador_principal.id_vigencia_fk.fecha_fin
        };
        
        const id_vigencia_creado = await agregarVigencia(vigencia,token);
        delete propuesta.colaborador_principal.id_vigencia_fk;
        propuesta.colaborador_principal.id_vigencia_fk = id_vigencia_creado;
        propuesta.colaborador_principal.id_academico_fk = parseInt(propuesta.colaborador_principal.id_academico_fk, 10);

        const id_colaborador_creado = await agregarColaborador(propuesta.colaborador_principal,token);
        delete propuesta.colaborador_principal;
        propuesta.id_colaborador_principal_fk = id_colaborador_creado;

        const documento = propuesta.documento_asociado;
        delete propuesta.documento_asociado;

        const id_propuesta_creada = await agregarPropuestas(propuesta,token);
        documento.id_codigo_cimpa_fk = id_propuesta_creada;
        
        const response_documento = await SIAPAPI.post('propuesta_proyecto/documento_asociado/', documento, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response_documento;
    } catch(error) {
        console.error("Error agregando documento del proyecto: ", error);
        throw error;
    }
};

export const agregarColaborador = async (colaborador, token) => {
    try {
        const response_colaborador = await SIAPAPI.post('propuesta_proyecto/colaborador_principal/', colaborador, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_colaborador_creado = response_colaborador.data.id_colaborador_principal;
        return id_colaborador_creado;
    } catch(error) {
        console.error("Error agregando colaborador: ", error);
        throw error;
    } 
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

export const agregarPropuestas = async (propuesta, token) => {
    try {
        const response_propuesta = await SIAPAPI.post('propuesta_proyecto/propuesta_proyecto/', propuesta, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_propuesta_creada = response_propuesta.data.id_codigo_cimpa;
        return id_propuesta_creada;
    } catch(error) {
        console.error("Error agregando propuesta: ", error);
        throw error;
    } 
};
