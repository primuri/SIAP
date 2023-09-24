import PropTypes from 'prop-types';
export const AcademicosForm = ({onSubmit, mode, user, onCancel, onDelete}) => {
    //Si el modo es 2 (editar) entonces se llenan los campos con los datos del user. 
    if(user){
        //rellena los campos. Sino nada.
    }
    return(
        <>
        <h1>
            {mode == 1? ("Agregar un académico(a)"):("Editar académico(a)")}
        </h1>
        <form onSubmit={onSubmit} className='d-flex flex-column'>
            <>
                <label>Nombre</label>
                <input type="text" name="nombre" id="" />   
            </>
            <div>
                <button 
                type="submit"
                className='table-button border-0 p-2 rounded text-white'>
                    Agregar
                </button>
                {mode == 2 && (
                <button 
                type="button" 
                onClick={onDelete}
                className='delete-button border-0 p-2 rounded text-white'>
                    Eliminar
                </button>)}
                <button 
                type="button" 
                onClick={onCancel} 
                className='cancel-button border-0 p-2 rounded text-white'>
                    Cancelar
                </button>
            </div>
        </form>
        </>)
}

AcademicosForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    user: PropTypes.object
};