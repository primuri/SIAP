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

export const editarDocumentacion = async (id, documentacion, token) => {
    try { 
        return await SIAPAPI.patch(`version_proyecto/documentos/${id}/`, documentacion, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
       
    } catch(error) {
        console.error("Error editar Documentacion Sotware: ", error);
        throw error;
    } 
};


export const editarProducto = async (id, producto, token) => {
    try { 
        return await SIAPAPI.put(`producto/productos/${id}/`, producto, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
       
    } catch(error) {
        console.error("Error editar Producto: ", error);
        throw error;
    } 
};

export const editarSoftware = async (id, software, token) => {
    try { 
        return await SIAPAPI.put(`producto/softwares/${id}/`, software, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
       
    } catch(error) {
        console.error("Error editar Software: ", error);
        throw error;
    } 
};