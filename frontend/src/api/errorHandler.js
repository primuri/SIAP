import { toast, Toaster }       from 'react-hot-toast'

export const manejarErrores = async (peticion) => {
    try {
        const respuesta = await peticion;
        return respuesta;
    } catch (error) {
        mostrarError(error)
        console.error(error)
        throw error; 
    }
};

const mostrarError = (error) => {
    const mensaje = (error.request.response.match(/\["(.*?)"\]/) || ["Ocurrió un error sin identificar."])[1]
    toast.error(`Error: ${mensaje}`, {
        duration: 10000,
        position: 'bottom-right',
        style: {
          background: '#670000',
          color: '#fff',
        },
      })
}