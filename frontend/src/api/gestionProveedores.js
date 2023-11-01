import axios from 'axios'
import {manejarErrores} from './errorHandler'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerProveedores = async (token) => {
    return await SIAPAPI.get('presupuesto/proveedores', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const agregarProveedor = async (formData, token) => {
    try {

        const proveedor = formData;
        const cuentaBancaria = proveedor?.cuentaBancaria;
        delete proveedor.cuentaBancaria;
        
        const response_proveedor = await SIAPAPI.post('presupuesto/proveedores/', proveedor, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        agregarCuentasBancarias(cuentaBancaria, response_proveedor.data.id_cedula_proveedor, token);

        return response_proveedor;
    } catch (error) {
        console.error("Error agregando proveedor: ", error);
        throw error;
    }
};

export const editarProveedor = async (id, proveedor, token) => {

    const responseProveedor = await SIAPAPI.put(`presupuesto/proveedores/${id}/`, proveedor, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseProveedor;
};

export const eliminarProveedor = (id, token) => {
    return SIAPAPI.delete(`presupuesto/proveedores/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const obtenerCuentasBancarias = async (token) => {
    return await SIAPAPI.get('presupuesto/cuentas_bancarias', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const agregarCuentasBancarias = (cuentasBancarias, id_cedula_proveedor, token) => {
    try {
        cuentasBancarias.forEach(async cuentaBancaria => {
            cuentaBancaria.id_proveedor_fk = id_cedula_proveedor;
            await SIAPAPI.post('presupuesto/cuentas_bancarias/', cuentaBancaria, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        });
    } catch (error) {
        console.error(error)
        throw (error)
    }
};

export const agregarCuentaBancaria  = async (cuentaBancaria, id_cedula_proveedor, token) => {
    try {
        cuentaBancaria.id_proveedor_fk = id_cedula_proveedor;
        await SIAPAPI.post('presupuesto/cuentas_bancarias/', cuentaBancaria, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error(error)
        throw (error)
    }
};

export const actualizarCuentasBancarias = (cuentasBancarias, proveedor_ID, token) => {
    try {
        cuentasBancarias.forEach(async cuenta => {
            try{
                let id_numero = cuenta.id_numero;
                let id_cedula_proveedor = cuenta.id_proveedor_fk.id_cedula_proveedor;
                delete cuenta.id_proveedor_fk;
                cuenta.id_proveedor_fk = id_cedula_proveedor;
                cuenta.cuenta_principal === "" ? cuenta.cuenta_principal = false : cuenta.cuenta_principal = true

                await SIAPAPI.put(`presupuesto/cuentas_bancarias/${id_numero}/`, cuenta, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
            } catch (error){
                await agregarCuentaBancaria(cuenta, proveedor_ID, token)
            }
        });
    } catch (error) {
        console.error(error)
        throw (error)
    }
};

export const eliminarCuentasBancarias = (id, token) => {
    return SIAPAPI.delete(`presupuesto/cuentas_bancarias/${id}/`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
    });
};

// Editar documento cuentas 
export const editarDocumentoCuentaAndDocumento = async (id, documento, token) => {
    return await manejarErrores(SIAPAPI.put(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Agregar documento cuentas
export const agregarDocumentoCuenta = async (documento, token) => {
    return await manejarErrores(SIAPAPI.post('version_proyecto/documentos/', documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    }));
};

// Editar documento cuentas solo detalle
export const editarDocumentoCuenta = async (id, documento, token) => {
    return await manejarErrores(SIAPAPI.patch(`version_proyecto/documentos/${id}/`, documento, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    }));
};