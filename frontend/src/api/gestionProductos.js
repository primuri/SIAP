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