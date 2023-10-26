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

export const obtenerArticulo = async (token) => {
    return await SIAPAPI.get('producto/articulos/', {
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

export const eliminarDocumentacion = async (id, token) => {
    return await SIAPAPI.delete(`version_proyecto/documentos/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const agregarRevista = async (revista, token) => {
    try { 
        const response_revista =  await SIAPAPI.post('producto/revistas/', revista, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_revista_creado = response_revista.data.id_revista;
        return id_revista_creado;
    } catch(error) {
        console.error("Error agregando revista: ", error);
        throw error;
    } 
};


export const agregarAutor = async (autor, token) => {
    try { 
        const response_autor =  await SIAPAPI.post('personas/autor/', autor, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_autor_creado = response_autor.data.id_autor;
        return id_autor_creado;
    } catch(error) {
        console.error("Error agregando autor: ", error);
        throw error;
    } 
};


export const agregarArticulo = async (articulo, token) => {
    try { 
        const response_articulo =  await SIAPAPI.post('producto/articulos/', articulo, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_articulo_creado = response_articulo.data.id_articulo;
        return id_articulo_creado;
    } catch(error) {
        console.error("Error agregando articulo: ", error);
        throw error;
    } 
};

export const editarArticulo = async (id, articulo, token) => {
    try { 
        return await SIAPAPI.put(`producto/articulos/${id}/`, articulo, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
       
    } catch(error) {
        console.error("Error editar Articulo: ", error);
        throw error;
    } 
};

export const editarAutor = async (id, autor, token) => {
    try { 
        return await SIAPAPI.put(`personas/autor/${id}/`, autor, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
       
    } catch(error) {
        console.error("Error editar Autor: ", error);
        throw error;
    } 
};


export const editarRevista = async (id, revista, token) => {
    try { 
        return await SIAPAPI.put(`producto/revistas/${id}/`, revista, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
       
    } catch(error) {
        console.error("Error editar Revista: ", error);
        throw error;
    } 
};

export const eliminarRevista = async (id, token) => {
    return await SIAPAPI.delete(`producto/revistas/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const eliminarSoftware = async (id, token) => {
    return await SIAPAPI.delete(`producto/softwares/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const eliminarProducto = async (id, token) => {
    return await SIAPAPI.delete(`producto/productos/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};



export const eliminarArea = async (id, token) => {
    return await SIAPAPI.delete(`producto/areas/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const editarArea = async (id, area, token) => {
    try { 
        return await SIAPAPI.put(`producto/areas/${id}/`, area, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
       
    } catch(error) {
        console.error("Error editar Area: ", error);
        throw error;
    } 
};


export const agregarArea = async (area, token) => {
    try { 
        const response_area =  await SIAPAPI.post('producto/areas/', area, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_area_creado = response_area.data.id_area;
        return id_area_creado;
    } catch(error) {
        console.error("Error agregando area: ", error);
        throw error;
    } 
};



export const eliminarInstitucion = async (id, token) => {
    return await SIAPAPI.delete(`personas/institucion/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const editarInstitucion = async (id, institucion, token) => {
    try { 
        return await SIAPAPI.put(`personas/institucion/${id}/`, institucion, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
       
    } catch(error) {
        console.error("Error editar institucion: ", error);
        throw error;
    } 
};


export const agregarInstitucion = async (institucion, token) => {
    try { 
        const response_institucion =  await SIAPAPI.post('personas/institucion/', institucion, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_institucion_creado = response_institucion.data.id_institucion;
        return id_institucion_creado;
    } catch(error) {
        console.error("Error agregando institucion: ", error);
        throw error;
    } 
};


export const eliminarEvento = async (id, token) => {
    return await SIAPAPI.delete(`producto/eventos/${id}/`, {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export const editarevento = async (id, evento, token) => {
    try { 
        return await SIAPAPI.put(`producto/eventos/${id}/`, evento, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
       
    } catch(error) {
        console.error("Error editar evento: ", error);
        throw error;
    } 
};


export const agregarevento = async (evento, token) => {
    try { 
        const response_evento =  await SIAPAPI.post('producto/eventos/', evento, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const id_evento_creado = response_evento.data.id_evento;
        return id_evento_creado;
    } catch(error) {
        console.error("Error agregando evento: ", error);
        throw error;
    } 
};

export const obtenerEvento = async (token) => {
    return await SIAPAPI.get('producto/eventos/', {
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        }
    });
};





