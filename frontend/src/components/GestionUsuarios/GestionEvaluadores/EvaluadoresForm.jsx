import PropTypes from 'prop-types';
export const EvaluadoresForm = ({onSubmit, mode, user, onCancel, onDelete}) => {
    //Si el modo es 2 (editar) entonces se llenan los campos con los datos del user. 
    if(user){
        //rellena los campos. Sino nada.
    }
    return(
        <>
        <h1>
            {mode == 1? ("Agregar un evaluador(a)"):("Editar evaluador(a)")}
        </h1>
        <form onSubmit={onSubmit} className='d-flex flex-column'>
            <div class="container">
                <div class="row">
                    <div class="col">
                    <label class="col-sm-4 control-label">Id:</label>
                        <div class="col-sm-8">
                            <input type="text" name="id" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Correo:</label>
                        <div class="col-sm-8">
                            <input type="text" name="correo" id="" /> 
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label class="col-sm-4 control-label">Nombre:</label>
                        <div class="col-sm-8">
                            <input type="text" name="nombre" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Apellido:</label>
                        <div class="col-sm-8">
                            <input type="text" name="apellido" id="" /> 
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label class="col-sm-4 control-label">Universidad:</label>
                        <div class="col-sm-8">
                            <input type="text" name="universidad" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">País:</label>
                        <div class="col-sm-8">
                            Countries
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label class="col-sm-4 control-label">Área de especialidad:</label>
                        <div class="col-sm-8">
                            <input type="text" name="especialidad" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Tipo:</label>
                        <div class="col-sm-8">
                            <input type="text" name="tipo" id="" /> 
                        </div>
                    </div>
                </div>
            </div>

            <br></br>
            <div>
                <div class="row">
                    <div class="col">
                        <button 
                            type="submit"
                            className='table-button border-0 p-2 rounded text-white'>
                                Agregar
                        </button>
                    </div>
                    <div class="col">
                        {mode == 2 && (
                        <button 
                            type="button" 
                            onClick={onDelete}
                            className='delete-button border-0 p-2 rounded text-white'>
                            Eliminar
                        </button>)}
                    </div>
                    <div class="col">
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            className='cancel-button border-0 p-2 rounded text-white'>
                                Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </form>
        </>)
}

EvaluadoresForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    user: PropTypes.object
};