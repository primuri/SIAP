import axios from 'axios'

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

        const proveedor = JSON.parse(formData.get('json'))
        formData.delete('json')
        const cuentaBancaria = proveedor?.cuentaBancaria;
        delete proveedor.cuentaBancaria;

        const response_proveedor = await SIAPAPI.post('presupuesto/proveedores/', proveedor, {
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

export const editarProveedor = async (id_cedula_proveedor, proveedor, token) => {

    console.log(proveedor)

    const responseProveedor = await SIAPAPI.put(`presupuesto/proveedores/${id_cedula_proveedor}/`, proveedor, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return responseProveedor;
};

export const eliminarProveedor = async (id, token) => {
    return await SIAPAPI.delete(`presupuesto/proveedores/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const obtenerCuentaBancaria = async (token) => {
    return await SIAPAPI.get('presupuesto/cuentas_bancarias/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const agregarCuentaBancaria = (cuentasBancarias, id_cedula_proveedor, token) => {
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

export const actualizarCuentaBancaria = (cuentaBancaria, token) => {
    try {
        cuentaBancaria.forEach(async cuenta => {
            let id_numero = cuenta.id_numero;
            let id_cedula_proveedor = cuenta.id_proveedor_fk.id_cedula_proveedor;
            delete cuenta.id_proveedor_fk;
            delete cuenta.id_numero;
            cuenta.id_proveedor_fk = id_cedula_proveedor;
            await SIAPAPI.put(`presupuesto/cuentas_bancarias/${id_numero}/`, cuenta, {
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
    return SIAPAPI.delete(`presupuesto/cuentas_bancarias/${id}/`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Content-Type': 'application/json'
                }
    });
};