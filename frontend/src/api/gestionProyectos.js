import axios from 'axios'
import {manejarErrores} from './errorHandler'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerProyectos = async (token) => {
    return await manejarErrores( SIAPAPI.get('version_proyecto/proyectos/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarProyectos = async (proyecto, token) => {
    try { 
        return await manejarErrores( SIAPAPI.post('version_proyecto/proyectos/', proyecto, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
       
    } catch(error) {
        console.error("Error agregando proyecto: ", error);
        throw error;
    } 
};

export const obtenerVersionProyectos = async (token) => {
    return await manejarErrores( SIAPAPI.get('version_proyecto/versionproyecto/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


export const agregarVersionProyectos = async (version_proyecto, token) => {
    try { 
        const response_version =  await manejarErrores( SIAPAPI.post('version_proyecto/versionproyecto/', version_proyecto, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
        const id_version_creada = response_version.data.id_version_proyecto;
        return id_version_creada;
    } catch(error) {
        console.error("Error agregando version de proyecto: ", error);
        throw error;
    } 
};


export const editarVersionProyectos = async (id, version_proyecto, token) => {
    try { 
        return await manejarErrores( SIAPAPI.put(`version_proyecto/versionproyecto/${id}/`, version_proyecto, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
       
    } catch(error) {
        console.error("Error editar version de proyecto: ", error);
        throw error;
    } 
};



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



export const editarVigencia = async (id, vigencia, token) => {
    const responseVigencia = await manejarErrores( SIAPAPI.put(`propuesta_proyecto/vigencia/${id}/`, vigencia, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
    return responseVigencia;
};


export const eliminarVigencia = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`propuesta_proyecto/vigencia/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};




export const editarOficio = async (id, oficio, token) => {
    const responseOficio = await manejarErrores( SIAPAPI.patch(`version_proyecto/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
    return responseOficio;
};


export const eliminarOficio = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`version_proyecto/oficios/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const eliminarVersion = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`version_proyecto/versionproyecto/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const eliminarProyecto = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`version_proyecto/proyectos/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};


export const agregarColaboradorSecundario = async (colaboradores_secundarios, id_version, token) => {
    try {
        if(colaboradores_secundarios != undefined){
            colaboradores_secundarios.forEach(async colaborador_secundario => {
                colaborador_secundario.id_version_proyecto_fk = id_version;
                let fecha_ini = colaborador_secundario.fecha_inicio;
                let fecha_fi = colaborador_secundario.fecha_fin;
    
                if (!fecha_ini || fecha_ini.trim() === "") {
                    fecha_ini = null;
                }
    
                if (!fecha_fi || fecha_fi.trim() === "") {
                    fecha_fi = null;
                }
                const vigencia = {
                    fecha_inicio: fecha_ini,
                    fecha_fin: fecha_fi
                }
                const id_vigencia_creado = await agregarVigencia(vigencia, token)
                delete colaborador_secundario.fecha_inicio
                delete colaborador_secundario.fecha_fin
                colaborador_secundario.id_vigencia_fk = id_vigencia_creado;
                colaborador_secundario.tipo = "Secundario"
                await manejarErrores(SIAPAPI.post('version_proyecto/colaboradorsecundario/', colaborador_secundario, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }))
            });
        }
       
    } catch (error) {
        console.error("Error agregando colaborador secundario:", error)
        throw (error)
    }
};


export const editarColaboradorSecundario = async (colaboradores_secundarios, id_version , token) => {
    try { 
        colaboradores_secundarios.forEach(async colaborador_secundario => {
            if(colaborador_secundario.id_colaborador_secundario){
                let id_colaborador_secundario = colaborador_secundario.id_colaborador_secundario;
                let id_version_proyecto = colaborador_secundario.id_version_proyecto_fk.id_version_proyecto;
                let fecha_ini = colaborador_secundario.fecha_inicio;
                let fecha_fi = colaborador_secundario.fecha_fin;
                let id_vigencia = colaborador_secundario.id_vigencia_fk.id_vigencia
                let id_academic = colaborador_secundario.id_academico_fk
    
                if (!fecha_ini || fecha_ini.trim() === "") {
                    fecha_ini = null;
                }
    
                if (!fecha_fi || fecha_fi.trim() === "") {
                    fecha_fi = null;
                }
                const vigencia = {
                    fecha_inicio: fecha_ini,
                    fecha_fin: fecha_fi
                }
               
                delete colaborador_secundario.id_version_proyecto_fk;
                delete colaborador_secundario.id_colaborador_secundario;
                delete colaborador_secundario.id_vigencia_fk
                delete colaborador_secundario.fecha_fin
                delete colaborador_secundario.fecha_inicio

                if (colaborador_secundario.id_academico_fk.id_academico){
                    id_academic = colaborador_secundario.id_academico_fk.id_academico
                }
                
                colaborador_secundario.id_vigencia_fk = id_vigencia
                const colaborador = {
                    id_version_proyecto_fk: id_version_proyecto,
                    id_vigencia_fk: id_vigencia,
                    id_academico_fk: id_academic,
                    tipo: colaborador_secundario.tipo,
                    carga: colaborador_secundario.carga,
                    estado: colaborador_secundario.estado

                }
                await editarVigencia(id_vigencia, vigencia, token)
                await manejarErrores(SIAPAPI.put(`version_proyecto/colaboradorsecundario/${id_colaborador_secundario}/`, colaborador, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }))
            }else{
                colaborador_secundario.id_version_proyecto_fk = id_version;
                let fecha_ini = colaborador_secundario.fecha_inicio;
                let fecha_fi = colaborador_secundario.fecha_fin;
    
                if (!fecha_ini || fecha_ini.trim() === "") {
                    fecha_ini = null;
                }
    
                if (!fecha_fi || fecha_fi.trim() === "") {
                    fecha_fi = null;
                }
                const vigencia = {
                    fecha_inicio: fecha_ini,
                    fecha_fin: fecha_fi
                }
                const id_vigencia_creado = await agregarVigencia(vigencia, token)
                delete colaborador_secundario.fecha_inicio
                delete colaborador_secundario.fecha_fin
                colaborador_secundario.id_vigencia_fk = id_vigencia_creado;
                colaborador_secundario.tipo = "Secundario"
                await manejarErrores(SIAPAPI.post('version_proyecto/colaboradorsecundario/', colaborador_secundario, {
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

export const obtenerColaboradorSecundario = async (token) => {
    return await manejarErrores( SIAPAPI.get('version_proyecto/colaboradorsecundario', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const eliminarColaboradorSecundario = async (id, token) => {
    return await manejarErrores( SIAPAPI.delete(`version_proyecto/colaboradorsecundario/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};
