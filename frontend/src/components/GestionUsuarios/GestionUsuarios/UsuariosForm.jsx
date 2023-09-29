import PropTypes from 'prop-types';

export const UsuariosForm = ({onSubmit, mode, user, onCancel, onDelete}) => {
    //Si el modo es 2 (editar) entonces se llenan los campos con los datos del user. 
    if(user){
        //rellena los campos. Sino nada.
    }
    return(
        <>
        <h1>
            {mode == 1? ("Agregar un usuario(a)"):("Editar usuario(a)")}
        </h1>
        <form onSubmit={onSubmit} className='d-flex flex-column'>
            <div class="container">
                <div class="row">
                    <div class="col">
                    <label class="col-sm-4 control-label">Correo electrónico:</label>
                        <div class="col-sm-8">
                            <input type="text" name="correo" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Rol:</label>
                        <div class="col-sm-8">
                            <select name="rol" class="form-control">
                                <option value="">--</option>
                                <option value="Académico">Académico</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Asistente">Asistente</option>
                                <option value="Evaluador">Evaluador</option>
                                <option value="Evaluador-Investigador">Evaluador-Investigador</option>
                                <option value="Investigador">Investigador</option>
                                <option value="Invitado">Invitado</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label class="col-sm-4 control-label">Contraseña:</label>
                        <div class="col-sm-8">
                            <input type="text" name="contrasena" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Confirmar contraseña:</label>
                        <div class="col-sm-8">
                            <input type="text" name="confirmar" id="" /> 
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label class="col-sm-4 control-label">Asociar a un académico:</label>
                        <div class="col-sm-8">
                            <input type="text" name="academico" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Asociar a un evaluador:</label>
                        <div class="col-sm-8">
                            <input type="text" name="evaluador" id="" /> 
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

UsuariosForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    user: PropTypes.object
};