import axios from 'axios'

/* 
  Formato JSON academico (al hacer get, no post, para hacer post, el FK es solo un número, no un obj):

    {     
        {
        "id_academico": 1,
        "id_nombre_completo_fk": {
        "id_nombre_completo": 1,
        "nombre": "asd",
        "apellido": "asda",
        "segundo_apellido": "sd"
        },
        "id_area_especialidad_fk": {
        "id_area_especialidad": 1,
        "nombre": "asd"
        },
        "universidad_fk": {
        "id_universidad": 1,
        "pais": "asdas",
        "nombre": "asdasd"
        },
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

export const obtenerAcademicos = (token) => {
    return SIAPAPI.get('personas/academico', {
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

        //await agregarTitulos(titulos, responseAcademico.data.id_academico, token);
        //await agregarTelefonos(telefonos, responseAcademico.data.id_academico, token);
        return response_academico;
    } catch(error) {
        console.error("Error agregando académico: ", error);
        throw error;
    }
};

export const editarAcademico = (academico, titulos, telefonos, token) => {
    const responseAcademico = SIAPAPI.put(`personas/academico/${academico.id_academico}/`, academico, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });

    actualizarTitulos(titulos, token);
    actualizarTelefonos(telefonos, token);

    return responseAcademico;
};

export const eliminarAcademico = (id, token) => {
    return SIAPAPI.delete(`personas/academico/${id}`, {
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

const agregarTitulos = (titulos, id_academico, token) => {
    titulos.forEach(titulo => {
        titulo.id_academico_fk = id_academico;
        SIAPAPI.post('personas/titulos', titulo, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
    });
};

const agregarTelefonos = (telefonos, id_academico, token) => {
    telefonos.forEach(telefono => {
        telefono.id_academico_fk = id_academico;
        SIAPAPI.post('personas/telefono', telefono, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
    });
};

const actualizarTitulos = (titulos, token) => {
    titulos.forEach(titulo => {
        SIAPAPI.put(`personas/titulos/${titulo.id_titulos}`, titulo, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
    });
};

const actualizarTelefonos = (telefonos, token) => {
    telefonos.forEach(telefono => {
        SIAPAPI.put(`personas/telefono/${telefono.id_telefono}/`, telefono, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
    });
};
