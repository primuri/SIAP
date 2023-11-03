import axios from 'axios'
import { agregarProyectos } from './gestionProyectos';
import { toast, Toaster } from 'react-hot-toast'

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


export const agregarDocumento = async (combinedData,  token) => {

    try {
        const documento_asociado = JSON.parse(combinedData.get('json'));
        combinedData.delete('json');
        let fecha_ini = documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_inicio;
        let fecha_fi = documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk.fecha_fin;
       

        if (!fecha_ini || fecha_ini.trim() === "") {
            fecha_ini = null;
        }
        
        if (!fecha_fi || fecha_fi.trim() === ""){
            fecha_fi = null;
        }
        const vigencia = {
                fecha_inicio: fecha_ini,
                fecha_fin: fecha_fi
        } 
        const id_vigencia_creado = await agregarVigencia(vigencia,token)
        
        delete documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk;
        documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_vigencia_fk = id_vigencia_creado;

        const id_academi = documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk.id_academico
        delete documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk
        documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk = id_academi
        documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk = parseInt(documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk.id_academico_fk, 10);

        const id_colaborador_creado = await agregarColaborador(documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk,token);
        delete documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk;
        documento_asociado.id_codigo_cimpa_fk.id_colaborador_principal_fk = id_colaborador_creado;

        combinedData.append('detalle', documento_asociado.detalle);
        delete documento_asociado.documento
        delete documento_asociado.detalle

        const id_propuesta_creada = await agregarPropuestas(documento_asociado.id_codigo_cimpa_fk ,token);
        combinedData.append('id_codigo_cimpa_fk',id_propuesta_creada)
        if(documento_asociado.id_codigo_cimpa_fk.estado == "Aprobada"){
            const proyecto = {
                id_codigo_vi : id_propuesta_creada,
                id_codigo_cimpa_fk : id_propuesta_creada
            }
             await agregarProyectos(proyecto, localStorage.getItem("token"));
             toast.success('Se agregó un proyecto asociado a esa propuesta', {
                 duration: 4000,
                 position: 'bottom-right',
                 style: {
                     background: '#003DA5',
                     color: '#fff',
                 },
             })
        }
        
        const response_documento = await SIAPAPI.post('propuesta_proyecto/documento_asociado/', combinedData, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        return response_documento;
    } catch(error) {
        console.error("Error agregando documento del proyecto: ", error);
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

export const agregarPropuestas = async (propuesta, token) => {
    try {
        console.log("propuesta:", propuesta)
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

export const editarVigencia = async (id, vigencia, token) => {
    const responseVigencia = await SIAPAPI.put(`propuesta_proyecto/vigencia/${id}/`, vigencia, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseVigencia;
};

export const editarColaborador = async (id, colaborador, token) => {
    const responseColaborador = await SIAPAPI.put(`propuesta_proyecto/colaborador_principal/${id}/`, colaborador, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseColaborador;
};

export const editarPropuesta = async (id, propuesta, token) => {
    const responseColaborador = await SIAPAPI.put(`propuesta_proyecto/propuesta_proyecto/${id}/`, propuesta, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseColaborador;
};

export const editarDocumento = async (id, documento, token) => {
    const responseDocumento = await SIAPAPI.patch(`propuesta_proyecto/documento_asociado/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    return responseDocumento;
};


export const eliminarDocumento = async (id, token) => {
    return await SIAPAPI.delete(`propuesta_proyecto/documento_asociado/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


export const eliminarPropuesta = async (id, token) => {
    return await SIAPAPI.delete(`propuesta_proyecto/propuesta_proyecto/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


export const eliminarColaborador = async (id, token) => {
    return await SIAPAPI.delete(`propuesta_proyecto/colaborador_principal/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


export const eliminarVigencia = async (id, token) => {
    return await SIAPAPI.delete(`propuesta_proyecto/vigencia/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


