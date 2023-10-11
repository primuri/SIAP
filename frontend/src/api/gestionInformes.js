import axios from 'axios'

/* 
    Formato JSON para agregar informe

  [
  {
    "id_version_proyecto_fk": 1,
    "estado": "Aprobado",
    "tipo": "1",
    "fecha_presentacion": "2023-10-11T17:26:02Z",
    "fecha_debe_presentar": "2023-10-11T17:26:06Z"
  }
]

    Formato JSON para agregar evaluacion CC

  [
  {
    "id_evaluacion_cc": 1,
    "id_documento_evualuacion_fk": 1,
    "detalle": "Evaluacion CC 1"
  }
]

    Formato JSON para agregar oficios

    [
  {
    "id_oficio": 1,
    "ruta_archivo": "www.google.com",
    "detalle": "Google"
  }
]

Formato JSON para agregar documento

  {
    "id_documento": 1,
    "tipo": "Prueba",
    "detalle": "Prueba",
    "ruta_archivo": "www.google.com"
  }
]


Formato JSON para agregar version informe

[
  {
    "id_version_informe": 1,
    "id_informe_fk": 1,
    "id_evaluacion_cc_fk": 1,
    "id_oficio_fk": 1,
    "id_documento_informe_fk": 1,
    "numero_version": "1",
    "fecha_presentacion": "2023-10-11T20:25:16Z"
  }
]

*/

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});


// Obtener version de proyecto
export const obtenerVersionProyecto = async (token) => {
    return await SIAPAPI.get('version_proyecto/versionproyecto', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


// Obtener informe
export const obtenerInforme = async (token) => {
    return await SIAPAPI.get('informe/informes', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


// Agregar informe
export const agregarInforme = async (informe, token) => {
    try {
        const response_informe = await SIAPAPI.post('informe/informes/', informe, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_informe_creado = response_informe.data.id_informe;
        return id_informe_creado;
    } catch (error) {
        console.error("Error agregando informe: ", error);
        throw error;
    }
};

// Editar informe
export const editarInforme = async (id, informe, token) => {
    return await SIAPAPI.put(`informe/informes/${id}/`, informe, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Eliminar informe
export const eliminarInforme = async (id, token) => {
    return await SIAPAPI.delete(`informe/informes/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Obtener evaluacion CC
export const obtenerEvaluacionCC = async (token) => {
    return await SIAPAPI.get('version_proyecto/evaluacionescc', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Agregar evaluacion CC
export const agregarEvaluacionCC = async (evaluacionCC, token) => {
    try {
        const response_evaluacionCC = await SIAPAPI.post('version_proyecto/evaluacionescc/', evaluacionCC, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_evaluacionCC_creada = response_evaluacionCC.data.id_evaluacion_cc;
        return id_evaluacionCC_creada;
    } catch (error) {
        console.error("Error agregando evaluación CC: ", error);
        throw error;
    }
};

// Editar evaluacion CC
export const editarEvaluacionCC = async (id, evaluacionCC, token) => {
    return await SIAPAPI.put(`version_proyecto/evaluacionescc/${id}/`, evaluacionCC, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Eliminar evaluacion CC
export const eliminarEvaluacionCC = async (id, token) => {
    return await SIAPAPI.delete(`version_proyecto/evaluacionescc/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Obtener oficio
export const obtenerOficio = async (token) => {
    return await SIAPAPI.get('informe/oficios', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Agregar oficio
export const agregarOficio = async (oficio, token) => {
    try {
        const response_oficio = await SIAPAPI.post('informe/oficios/', oficio, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_oficio_creado = response_oficio.data.id_oficio;
        return id_oficio_creado;
    } catch (error) {
        console.error("Error agregando oficio: ", error);
        throw error;
    }
};

// Editar oficio
export const editarOficio = async (id, oficio, token) => {
    return await SIAPAPI.put(`informe/oficios/${id}/`, oficio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Eliminar oficio
export const eliminarOficio = async (id, token) => {
    return await SIAPAPI.delete(`informe/oficios/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Obtener documento informe
export const obtenerDocumentoInforme = async (token) => {
    return await SIAPAPI.get('version_proyecto/documentos', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Agregar documento informe
export const agregarDocumentoInforme = async (documento, token) => {
    try {
        const response_documento = await SIAPAPI.post('version_proyecto/documentos/', documento, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_documento_creado = response_documento.data.documento;
        return id_documento_creado;
    } catch (error) {
        console.error("Error agregando documento de informe: ", error);
        throw error;
    }
};

// Editar documento informe
export const editarDocumentoInforme = async (id, documento, token) => {
    return await SIAPAPI.put(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


// Eliminar documento informe
export const eliminarDocumentoInforme = async (id, token) => {
    return await SIAPAPI.delete(`version_proyecto/documentos/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};



// Obtener version de informe
export const obtenerVersionInforme = async (token) => {
    return await SIAPAPI.get('informe/versioninformes', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

// Agregar version de informe
export const agregarVersionInforme = async (versionInforme, token) => {
    try {
        const response_version_informe = await SIAPAPI.post('informe/versioninformes/', versionInforme, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_version_informe_creado = response_version_informe.data.id_version_informe;
        return id_version_informe_creado;
    } catch (error) {
        console.error("Error agregando version de informe: ", error);
        throw error;
    }
};


// Editar version de informe
export const editarVersionInforme = async (id, versionInforme, token) => {
    return await SIAPAPI.put(`informe/versioninformes/${id}/`, versionInforme, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


// Eliminar version de informe
export const eliminarVersionInforme = async (id, token) => {
    return await SIAPAPI.delete(`informe/versioninformes/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


// 5. ------------------------------------------------------------

// Obtener accion

// Agregar accion 

// Editar accion

// Eliminar accion


