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


// Agregar documento informe

// Editar documento informe

// Eliminar documento informe


// 3. ------------------------------------------------------------

// Obtener version de informe

// Agregar version de informe

// Editar version de informe

// Eliminar version de informe



// 4. ------------------------------------------------------------

// Obtener documento accion

// Agregar documento accion

// Editar documento accion

// Eliminar documento accion


// 5. ------------------------------------------------------------

// Obtener accion

// Agregar accion 

// Editar accion

// Eliminar accion


