const manejarErrores = async (peticion) => {
    try {
        const respuesta = await peticion;
        return respuesta;
    } catch (error) {
        console.error("Error en la petición: ", error);
        throw error; 
    }
};