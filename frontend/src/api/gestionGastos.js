import axios from 'axios'
import {manejarErrores} from './errorHandler'

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

export const agregarGasto = async (gasto, token) => {
    try {
        return await manejarErrores(SIAPAPI.post('presupuesto/gastos/', gasto, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
    } catch (error) {
        console.error("Error agregando gasto: ", error);
        throw error;
    }
};

export const actualizarGasto = async (id, gasto, token) => {
    try {
        return await manejarErrores(SIAPAPI.patch(`presupuesto/gastos/${id}/`, gasto, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        }));
    } catch (error) {
        console.error("Error actualizando gasto: ", error);
        throw error;
    }
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
            'Content-Type': 'multipart/form-data'
        }
    }));
};

export const actualizarFacturaDocumento = async (id, documento, token) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};