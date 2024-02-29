import axios from 'axios'
import {manejarErrores} from './errorHandler'
/*
    {
    "gasto": {
        "id_gasto": 1,
        "fecha": 22-01-2023,
        "detalle": "informacion",
        "monto": 100497,
        "id_partida_fk": 1,
        "id_factura_fk": 1,
        "tipo": "info"
    },
    "factura": {
        "id_factura": 1,
        "id_cedula_proveedor_fk":  1,
        "id_producto_servicio_fk": 1
    },

}

*/

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerGastos = async (id_partida,token) => {
    return await manejarErrores(SIAPAPI.get(`presupuesto/gastos/?id_version_presupuesto=${id_partida}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarGasto = async (gasto, factura, token) => {
    //Separamos los datos ya que hay que subir un documento
    let ofk = await agregarFactura(factura,token);
    gasto.id_factura_fk = ofk.data.id_factura
    return await manejarErrores(SIAPAPI.post('presupuesto/gastos/',gasto,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
}

export const actualizarGasto= async (id,gasto,factura, token) => {
    const id_factura = factura.get('id_factura')
    gasto.id_factura_fk = id_factura
    factura.delete('id_factura')
    await actualizarFactura(id_factura, factura,token)
    return await manejarErrores(SIAPAPI.put(`presupuesto/gastos/${id}/`,gasto,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
}

export const eliminarGasto = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`presupuesto/gastos/${id}/`,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
}


//Metodos para los objetos relacionados que se crean en el form.
export const agregarOficio = async (oficio,token) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/oficios/',oficio,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }))
}

const actualizarOficio = async (id,oficio,token) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/oficios/${id}/`,oficio,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }))
}
//Metodos para los objetos relacionados para los selects.

export const obtenerTiposDePresupuestos = async (token) => {
    return await manejarErrores(SIAPAPI.get('presupuesto/tipo_presupuestos', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
}

export const obtenerProyectos = async (token) => {
    return await manejarErrores(SIAPAPI.get('version_proyecto/proyectos', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
}

export const obtenerVersionesProyectos = async (id_version, token) => {
    return await manejarErrores(SIAPAPI.get(`version_proyecto/versionproyecto/?id_version=${id_version}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
}

export const agregarEnte = async (ente,token) => {
    return await manejarErrores(SIAPAPI.post('presupuesto/ente_financieros/',ente,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
}
export const obtenerEntesFinancieros = async (token) => {
    return await manejarErrores(SIAPAPI.get('presupuesto/ente_financieros', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
}

export const agregarCodigosFinancieros = async (ente,token) => {
    return await manejarErrores(SIAPAPI.post('presupuesto/codigos_financieros/',ente,{
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }))
}

export const obtenerCodigosFinancieros = async (token) => {
    return await manejarErrores(SIAPAPI.get('presupuesto/codigos_financieros', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
}
//Metodos auxiliares

export const buscaEnteFinanciero = async (nombre, token) => {
    const response = await SIAPAPI.get('presupuesto/ente_financieros', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data.find(entidad => entidad.nombre === nombre);
}

export const buscaCodigoFinanciero = async (codigo, token) => {
    const response = await SIAPAPI.get('presupuesto/codigos_financieros', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data.find(entidad => entidad.codigo === codigo);
}