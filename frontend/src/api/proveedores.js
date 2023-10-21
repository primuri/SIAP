import axios from 'axios'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});

export const obtenerProveedores = async (token) => {
    return await SIAPAPI.get('presupuesto/proveedor', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const agregarProveedor = async (formData, token) => {
    try {

        const proveedor = JSON.parse(formData.get('json'))
        formData.delete('json')
        const cuentaBancaria = proveedor?.cuentaBancaria;
        delete proveedor.cuentaBancaria;

        const response_proveedor = await SIAPAPI.post('presupuesto/proveedor/', formData, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        agregarCuentaBancaria(cuentaBancaria, response_proveedor.data.id_cedula_proveedor, token);

        return response_proveedor;
    } catch (error) {
        console.error("Error agregando proveedor: ", error);
        throw error;
    }
};

export const editarProveedor = async (id, proveedor, token) => {

    const responseProveedor = await SIAPAPI.put(`presupuesto/proveedor/${id}/`, proveedor, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseProveedor;
};

export const eliminarProveedor = async (id, token) => {
    return await SIAPAPI.delete(`presupuesto/proveedor/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const obtenerCuentaBancaria = async (token) => {
    return await SIAPAPI.get('presupuesto/cuentaBancaria', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const agregarCuentaBancaria = (cuentaBancaria, id_cedula_proveedor, token) => {
    try {
        cuentaBancaria.forEach(async cuentaBancaria => {
            cuentaBancaria.id_proveedor_fk = id_cedula_proveedor;
            await SIAPAPI.post('presupuesto/cuentaBancaria/', cuentaBancaria, {
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

export const actualizarCuentaBancaria = (cuentaBancaria, token) => {
    try {
        cuentaBancaria.forEach(async cuenta => {
            let id_numero = cuenta.id_numero;
            let id_cedula_proveedor = cuenta.id_proveedor_fk.id_cedula_proveedor;
            delete cuenta.id_proveedor_fk;
            delete cuenta.id_numero;
            cuenta.id_proveedor_fk = id_cedula_proveedor;
            await SIAPAPI.put(`presupuesto/cuentaBancaria/${id_numero}/`, cuenta, {
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

export const eliminarCuentaBancaria = (id, token) => {
    return SIAPAPI.delete(`presupuesto/cuentaBancaria/${id}/`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
    });
};