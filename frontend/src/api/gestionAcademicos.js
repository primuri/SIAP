import axios from 'axios'

/* 
  Formato JSON academico (al hacer get, no post, para hacer post, el FK es solo un número, no un obj):

    {     
        {
        "id_academico": 1,
        "id_nombre_completo_fk": 1
        "id_area_especialidad_fk": 1
        "universidad_fk": 1
        "cedula": "asd",
        "foto": "foto",
        "sitio_web": "asdas",
        "grado_maximo": "dasd",
        "correo": "asdasd",
        "area_de_trabajo": "asdasd",
        "categoria_en_regimen": "asd",
        "pais_procedencia": "asd"
    }
    }

  Formato JSON academico para hacer POST
    [
    {
        "id_titulos": 1,
        "anio": 2010,
        "grado": "121",
        "detalle": "asda",
        "institución": "AS",
        "id_academico_fk": 1
    },
    {
        "id_titulos": 2,
        "anio": 2000,
        "grado": "12",
        "detalle": "12",
        "institución": "12",
        "id_academico_fk": 1
    }
    ]

  Formato JSON telefonos para hacer POST
    {
        "id_telefono": 1,
        "numero_tel": "84441212",
        "id_academico_fk": 1
    }
*/

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerAcademicos = async (token) => {
    return await SIAPAPI.get('personas/academico', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const agregarAcademico = async (academico,  token) => {

    try {
        const id_nombre_creado = await obtenerNombre(academico.id_nombre_completo_fk,token);
        delete academico.id_nombre_completo_fk;
        academico.id_nombre_completo_fk = id_nombre_creado;
        
        const id_area_creada = await obtenerArea(academico.id_area_especialidad_fk,token);
        delete academico.id_area_especialidad_fk;
        academico.id_area_especialidad_fk = id_area_creada;

        const id_universidad_creada = await obtenerUniversidad(academico.universidad_fk,token);
        delete academico.universidad_fk;
        academico.universidad_fk = id_universidad_creada;
        
        const response_academico = await SIAPAPI.post('personas/academico/', academico, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        //await agregarTitulos(titulos, response_academico.data.id_academico, token);
        //await agregarTelefonos(telefonos, response_academico.data.id_academico, token);
        return response_academico;
    } catch(error) {
        console.error("Error agregando académico: ", error);
        throw error;
    }
};

export const editarAcademico = async (id, academico, token) => {
    const responseAcademico = await SIAPAPI.put(`personas/academico/${id}/`, academico, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });

    // await actualizarTitulos(titulos, token);
    // await actualizarTelefonos(telefonos, token);

    return responseAcademico;
};

export const eliminarAcademico = async (id, token) => {
    return await SIAPAPI.delete(`personas/academico/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


const obtenerNombre = async (nombre, token) => {
    try {
        const response_nombre = await SIAPAPI.post('personas/nombre_completo/', nombre, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_nombre_creado = response_nombre.data.id_nombre_completo;
        return id_nombre_creado;
    } catch(error) {
        console.error("Error agregando nombre: ", error);
        throw error;
    } 
};

export const editarNombre = async (id, nombre, token) => {
    const responseNombre = await SIAPAPI.put(`personas/nombre_completo/${id}/`, nombre, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseNombre;
};

export const eliminarNombre = async (id, token) => {
    return await SIAPAPI.delete(`personas/nombre_completo/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

const obtenerArea = async (area, token) => {
     try {
        const response_area = await SIAPAPI.post('personas/area_especialidad/', area, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_area_creada = response_area.data.id_area_especialidad;
        return id_area_creada;
    } catch(error) {
        console.error("Error agregando area de especialidad: ", error);
        throw error;
    }
};

export const editarArea = async (id, area, token) => {
    const responseArea = await SIAPAPI.put(`personas/area_especialidad/${id}/`, area, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseArea;
};

export const eliminarArea = async (id, token) => {
    return await SIAPAPI.delete(`personas/area_especialidad/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


const obtenerUniversidad = async (universidad, token) => {
    try {
        const response_universidad = await SIAPAPI.post('personas/universidad/', universidad, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_universidad_creada = response_universidad.data.id_universidad;
        return id_universidad_creada;
    } catch(error) {
        console.error("Error agregando universidad: ", error);
        throw error;
    }
};

export const editarUniversidad = async (id, universidad, token) => {
    const responseUniversidad = await SIAPAPI.put(`personas/universidad/${id}/`, universidad, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseUniversidad;
};

export const eliminarUniversidad = async (id, token) => {
    return await SIAPAPI.delete(`personas/universidad/${id}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};


const agregarTitulos = (titulos, id_academico, token) => {
    titulos.forEach(async titulo => {
        titulo.id_academico_fk = id_academico;
        await SIAPAPI.post('personas/titulos', titulo, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
    });
};

const agregarTelefonos = (telefonos, id_academico, token) => {
    telefonos.forEach(async telefono => {
        telefono.id_academico_fk = id_academico;
        await SIAPAPI.post('personas/telefono', telefono, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
    });
};

const actualizarTitulos = (titulos, token) => {
    titulos.forEach(async titulo => {
        await SIAPAPI.put(`personas/titulos/${titulo.id_titulos}`, titulo, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
    });
};

const actualizarTelefonos = (telefonos, token) => {
    telefonos.forEach(async telefono => {
        await SIAPAPI.put(`personas/telefono/${telefono.id_telefono}/`, telefono, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
    });
};