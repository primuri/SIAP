import axios from 'axios'
import {manejarErrores} from './errorHandler'
/*
    {
    "gasto": {
        "id_gasto": 1,
        "fecha": 01/01/2023,
        "detalle": "equipo",
        "monto": 100000,
        "id_partida_fk": 1,
        "id_factura_fk": 1,
        "id_documento_fk": 1
    },
    "partida": {
        "id_partida": 1,
        // ... otros campos del modelo Partida
    },
    "factura": {
        "id_factura": 1,
        "id_cedula_proveedor_fk": 1,
        "id_producto_servicio_fk": 1
    },
    "productoServicio": {
        "id_producto_servicio": 1,
        "detalle": "equipo"
    },
    "proveedor": {
        "id_cedula_proveedor": 1
        // ... otros campos del modelo Proveedor
    }
}
*/

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerGastos = async (id_partida, token) => {
    return await manejarErrores(SIAPAPI.get(`presupuesto/gastos/?id_partida_fk=${id_partida}`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarGasto = async (gasto, documento, token) => {
    let facturaResponse = await agregarFacturaDocumento(documento, token);
    gasto.id_factura_fk = facturaResponse.data.id_factura;
    return await manejarErrores(SIAPAPI.post('presupuesto/gastos/', gasto, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const actualizarGasto = async (id, gasto, documento, token) => {
    const id_factura = factura.get('id_factura');
    gasto.id_factura_fk = id_factura;
    documento.delete('id_factura');
    await actualizarFacturaDocumento(id_factura, documento, token);
    return await manejarErrores(SIAPAPI.put(`presupuesto/gastos/${id}/`, gasto, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const eliminarGasto = async (id, token) => {
    return await manejarErrores(SIAPAPI.delete(`presupuesto/gastos/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const obtenerProveedores = async (token) => {
    return await manejarErrores(SIAPAPI.get('presupuesto/proveedores', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const obtenerProductosServicios = async (token) => {
    return await manejarErrores(SIAPAPI.get('presupuesto/productos_servicios', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarProductoServicio = async (productoServicio, token) => {
    return await manejarErrores(SIAPAPI.post('presupuesto/productos_servicios/', productoServicio, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const obtenerFactura = async (token) => {
    return await manejarErrores( SIAPAPI.get('presupuesto/facturas/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarFactura = async (factura, token) => {
    return await manejarErrores(SIAPAPI.post('presupuesto/facturas/', factura, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const actualizarFactura = async (id, factura, token) => {
    return await manejarErrores(SIAPAPI.patch(`presupuesto/facturas/${id}/`, factura, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const agregarFacturaDocumento = async (documento, token) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/documentos/', documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};

export const actualizarFacturaDocumento = async (id, documento, token) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};
