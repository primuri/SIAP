import axios from 'axios'
import {manejarErrores} from './errorHandler'

const token = localStorage.getItem('token')                                      // Token para los request

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



// RF-018 Gestionar sesiones 


//get

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


//POST


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


export const agregarSesion = async (sesion, o_colegiado) => {

    console.log(sesion)
    const acta_file = sesion.get('acta_file');
    const sesion_json = JSON.parse(sesion.get('json'))
    const acta_form_data = new FormData();
    acta_form_data.append('documento',  acta_file);
    acta_form_data.append("detalle", "acta");
    acta_form_data.append("tipo", "acta");
    const acta = await addActa(acta_form_data)

    const agenda = await addAgenda(sesion)

    const sesion_data = {'id_sesion': sesion_json.id_sesion, 'fecha': sesion_json.fecha, 'id_organo_colegiado_fk': o_colegiado, 'medio': sesion_json.medio, 'link_carpeta': sesion_json.link_carpeta, 'id_acta_fk':acta.data.id_acta, 'id_agenda_fk': agenda.data.id_agenda }
    return await manejarErrores(SIAPAPI.post('organo_colegiado/sesion/',sesion_data, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
}

export const addActa = async (acta) => {
    const acta_data = {'id_documento_acta_fk': await agregarDocumento(acta)}
    return await manejarErrores(SIAPAPI.post('organo_colegiado/acta/', acta_data,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
    )
}

export const addAgenda = async (sesion) => {

    const convocatoria_file2 = sesion.get('convocatoria_file');
    const convocatoria_file = new FormData();
    const sesion_json = JSON.parse(sesion.get('json'));
    convocatoria_file.append('documento',  convocatoria_file2);
    convocatoria_file.append("detalle", "acta");
    convocatoria_file.append("tipo", "acta");

    
    const convocatoria_data = {'id_documento_convocatoria_fk': await agregarDocumento(convocatoria_file)};

    const convocatoria_ = await manejarErrores(SIAPAPI.post('organo_colegiado/convocatoria/', convocatoria_data,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )

    const agenda_data = {'tipo':sesion_json.tipo_agenda, 'detalle': sesion_json.detalle_agenda, 'id_convocatoria_fk': convocatoria_.data.id_convocatoria }

    return await manejarErrores(SIAPAPI.post('organo_colegiado/agenda/', agenda_data,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    })
    )
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



export const editarSesion = async (sesion_id, sesion) => {
    return "none"
}


export const eliminarSesion = async (sesion_id) => {
    return "none"
}
