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

export const agregarAcademico = (academico, nombre, area, universidad, titulos, telefonos, token) => {
    const id_nombre_completo = obtenerNombre(nombre, token);
    const id_area_especialidad = obtenerArea(area, token);
    const id_universidad = obtenerUniversidad(universidad, token);

    academico.id_nombre_completo_fk = id_nombre_completo;
    academico.id_area_especialidad_fk = id_area_especialidad;
    academico.universidad_fk = id_universidad;

    const responseAcademico = SIAPAPI.post('personas/academico', academico, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });

    agregarTitulos(titulos, responseAcademico.data.id_academico, token);
    agregarTelefonos(telefonos, responseAcademico.data.id_academico, token);

    return responseAcademico;
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

export const eliminarAcademico = (academico, token) => {
    return SIAPAPI.delete(`personas/academico/${academico.id_academico}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

const obtenerNombre = (nombre, token) => {
    const responseNombre = SIAPAPI.get('personas/nombre_completo', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const nombreEncontrado = responseNombre.data.find((nombreActual) =>
        (
            nombreActual.nombre === nombre.nombre &&
            nombreActual.apellido === nombre.apellido &&
            nombreActual.segundo_apellido === nombre.segundo_apellido
        ));

    if (nombreEncontrado) {
        return nombreEncontrado.id_nombre_completo;
    } else {
        const responseNombre = SIAPAPI.post('personas/nombre_completo', nombre, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return responseNombre.data.id_nombre_completo;
    }
};

const obtenerArea = (area, token) => {
    const responseArea = SIAPAPI.get('personas/area_especialidad', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const areaEncontrada = responseArea.data.find((areaActual) =>
        (
            areaActual.nombre === area.nombre
        ));

    if (areaEncontrada) {
        return areaEncontrada.id_area_especialidad;
    } else {
        const responseArea = SIAPAPI.post('personas/area_especialidad', area, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return responseArea.data.id_area_especialidad;
    }
};

const obtenerUniversidad = (universidad, token) => {
    const responseUniversidad = SIAPAPI.get('personas/universidad', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });

    const universidadEncontrada = responseUniversidad.data.find((universidadActual) =>
        (
            universidadActual.nombre === universidad.nombre &&
            universidadActual.pais === universidad.pais
        ));

    if (universidadEncontrada) {
        return universidadEncontrada.id_universidad;
    } else {
        const responseUniversidad = SIAPAPI.post('personas/universidad', universidad, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return responseUniversidad.data.id_universidad;
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
