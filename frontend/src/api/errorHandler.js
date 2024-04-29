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
    const inputStr = error.request.response;
    const matches = inputStr.match(/"(.*?)"/g);

    let resultStr = "";
    if (matches) {
        matches.forEach((match, index) => {
            const words = match.split(' ');
            const processedWords = words.map((word, i) => (i === 0 && index === 0) ? word.charAt(0).toUpperCase() + word.slice(1) : word);
            const processedStr = processedWords.join(' ');
            resultStr += processedStr + (index < matches.length - 1 ? ' - ' : '');
        });
    }else{
        resultStr = "Error no identificado."
    }

    resultStr = resultStr.replace(/"/g, '');

    resultStr = resultStr.replace(/_/g, ' ');

    toast.error(`Error: ${resultStr}`, {
        duration: 10000,
        position: 'bottom-right',
        style: {
            background: '#670000',
            color: '#fff',
        },
    });
};

