import axios from 'axios'

const SIAPAPI = axios.create({
    baseURL: 'http://localhost:8000/'
});


export const agregarProducto = async (producto, token) => {
    try { 
        const response_producto =  await SIAPAPI.post('producto/productos/', producto, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_producto_creado = response_producto.data.id_producto;
        return id_producto_creado;
    } catch(error) {
        console.error("Error agregando producto: ", error);
        throw error;
    } 
};

export const agregarDocumentacion = async(documentacion, token) => {
    try {
        const response_documento =  await SIAPAPI.post('version_proyecto/documentos/', documentacion, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
        });
        const id_documento_creado = response_documento.data.id_documento;
        return id_documento_creado;
    } catch(error) {
    console.error("Error agregando documento: ", error);
    throw error;
    } 
};

export const agregarSoftware = async (software, token) => {
    try { 
        const response_software =  await SIAPAPI.post('producto/softwares/', software, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_software_creado = response_software.data.id_software;
        return id_software_creado;
    } catch(error) {
        console.error("Error agregando software: ", error);
        throw error;
    } 
};

export const obtenerSoftware = async (token) => {
    return await SIAPAPI.get('producto/softwares/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};
