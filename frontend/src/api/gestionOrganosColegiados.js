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

export const obtenerOrganoColegiadoPorId = async (token, organoID) => {
    return await manejarErrores(SIAPAPI.get(`organo_colegiado/organo_colegiado/${organoID}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarOrganoColegiado = async (organo_colegiado) => {
    return await manejarErrores(SIAPAPI.post('organo_colegiado/organo_colegiado/', organo_colegiado, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

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

export const obtenerSesiones = async () => {
    return await manejarErrores(SIAPAPI.get('organo_colegiado/sesion/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const obtenerActa = async () => {
    return await manejarErrores(SIAPAPI.get('organo_colegiado/acta/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const obtenerAgenda = async () => {
    return await manejarErrores(SIAPAPI.get('organo_colegiado/agenda/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const obtenerInvitados = async () => {
    return await manejarErrores(SIAPAPI.get('organo_colegiado/invitado/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const obtenerConvocatorias = async () => {
    return await manejarErrores(SIAPAPI.get('organo_colegiado/convocatoria/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const obtenerNumeroAcuerdos = async (id_sesion) => {
    const response = await manejarErrores(SIAPAPI.get('organo_colegiado/acuerdo/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));

    const acuerdosFiltrados = response.data.filter(acuerdo => 
        acuerdo.id_sesion_fk.id_sesion == id_sesion
    );

    return acuerdosFiltrados.length;
}

export const obtenerAcuerdos = async () => {
    return await manejarErrores(SIAPAPI.get('organo_colegiado/acuerdo/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
}

export const obtenerIntegrantes = async (id_organo_colegiado) => {
    const response = await manejarErrores(SIAPAPI.get('organo_colegiado/integrante/', {
        headers:{
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
    const integrantesFiltrados = response.data.filter( integrante => 
        integrante.id_organo_colegiado_fk == id_organo_colegiado
    );
    return integrantesFiltrados;
}

export const agregarDocumento = async (documento) => {
    const uploadDoc = await manejarErrores(SIAPAPI.post('version_proyecto/documentos/', documento,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
    );
    return uploadDoc.data.id_documento
}


export const editarDocumento = async (id, documento) => {
    try { 
        return await manejarErrores( SIAPAPI.patch(`version_proyecto/documentos/${id}/`, documento, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        }));
       
    } catch(error) {
        console.error("Error editar Documento sesion: ", error);
        throw error;
    } 
}


export const editarAgenda = async (id, agenda) => {
    return await manejarErrores(SIAPAPI.patch(`organo_colegiado/agenda/${id}/`, agenda, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};




export const agregarSesion = async (sesion) => {
    return await manejarErrores(SIAPAPI.post('organo_colegiado/sesion/', sesion,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const addActa = async (acta) => {
    const actaid = await manejarErrores(SIAPAPI.post('organo_colegiado/acta/', acta,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
    return actaid.data.id_acta
}

export const addConvocatoria = async (convocatoria) => {

    let convocatoriaid = await manejarErrores(SIAPAPI.post('organo_colegiado/convocatoria/', convocatoria,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
    return convocatoriaid.data.id_convocatoria;
}


export const addAgenda = async (agenda) => {

    let agendaid = await manejarErrores(SIAPAPI.post('organo_colegiado/agenda/', agenda,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
    return agendaid.data.id_agenda;
}

export const addInvitados = async (invitados) => {
    const promesas = invitados.map(invitado =>
        manejarErrores(SIAPAPI.post('organo_colegiado/invitado/', invitado, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }))
    );

    const resultados = await Promise.allSettled(promesas);
    const exitosos = resultados.filter(resultado => resultado.status === 'fulfilled');
    const fallos = resultados.filter(resultado => resultado.status === 'rejected');

    return { exitosos, fallos };
}


export const editarSesion = async (id, sesion) => {
    return await manejarErrores(SIAPAPI.patch(`organo_colegiado/sesion/${id}/`, sesion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const eliminarSesion = async (sesion_id) => {
    return await manejarErrores(SIAPAPI.delete(`organo_colegiado/sesion/${sesion_id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const eliminarDocumento = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`version_proyecto/documentos/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const eliminarActa = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`organo_colegiado/acta//${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}


export const agregarOficio = async (oficio) => {
    const ofi = await manejarErrores(SIAPAPI.post('version_proyecto/oficios/', oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
    return ofi.data.id_oficio
};


export const agregarSeguimiento = async (seguimiento) => {

    const seguimientoid = await manejarErrores(SIAPAPI.post('organo_colegiado/seguimiento/', seguimiento,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
    return seguimientoid.data.id_seguimiento;
}


export const agregarAcuerdo = async (acuerdo) => {
    return await manejarErrores(SIAPAPI.post('organo_colegiado/acuerdo/', acuerdo,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}


export const eliminarOficio = async (id) => {
    return await manejarErrores(SIAPAPI.delete(`version_proyecto/oficios/${id}`,{
        headers: {'Authorization': `token ${token}`, 
                  'Content-Type':'application/json'}
     }));
};



export const editarOficio = async (id, oficio) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};


export const editarAcuerdo = async (id, acuerdo) => {
    return await manejarErrores(SIAPAPI.patch(`organo_colegiado/acuerdo/${id}/`, acuerdo, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};