import PropTypes from 'prop-types';

export const PropuestasForm = ({onSubmit, mode, user, onCancel, onDelete}) => {
    //Si el modo es 2 (editar) entonces se llenan los campos con los datos del user. 
    if(user){
        //rellena los campos. Sino nada.
    }
    return(
        <>
        <h1>
            {mode == 1? ("Agregar una propuesta"):("Editar propuesta")}
        </h1>
        <form onSubmit={onSubmit} className='d-flex flex-column'>
            <div class="container">
                <div class="row">
                    <div class="col">
                    <label class="col-sm-4 control-label">Código CIMPA:</label>
                        <div class="col-sm-8">
                            <input type="text" name="codigo" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Nombre:</label>
                        <div class="col-sm-8">
                            <input type="text" name="nombre" id="" /> 
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label class="col-sm-4 control-label">Estado:</label>
                        <div class="col-sm-8">
                            <input type="text" name="estado" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Fecha vigencia:</label>
                        <div class="col-sm-8">
                            <input type="date" id="fecha-vigencia" name="fecha-vigencia" value="2023-09-29" min="2023-01-01" max="2025-12-31" /> 
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label class="col-sm-4 control-label">Descripción:</label>
                        <div class="col-sm-8">
                            <input type="text" name="descripcion" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Actividad:</label>
                        <div class="col-sm-8">
                            <input type="text" name="actividad" id="" /> 
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label class="col-sm-4 control-label">Detalle:</label>
                        <div class="col-sm-8">
                            <input type="text" name="detalle" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Documento:</label>
                        <div class="col-sm-8">
                            <form name="documento" type="post" enctype="multipart/formdata">
                                <input type="file" name="documento"/>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label class="col-sm-4 control-label">Colaborador(a) principal:</label>
                        <div class="col-sm-8">
                            <input type="text" name="colaborador" id="" /> 
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Estado:</label>
                        <div class="col-sm-8">
                            <input type="text" name="estado" id="" /> 
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <label class="col-sm-4 control-label">Carga:</label>
                        <div class="col-sm-8">
                            <select name="carga" class="form-control">
                                <option value="">--</option>
                                <option value="1/8">1/8</option>
                                <option value="1/4">1/4</option>
                                <option value="3/8">3/8</option>
                                <option value="1/2">1/2</option>
                                <option value="5/8">5/8</option>
                            </select>
                        </div>
                    </div>
                    <div class="col">
                    <label class="col-sm-4 control-label">Vigencia:</label>
                        <div class="col-sm-8">
                            <input type="text" name="vigencia" id="" /> 
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

PropuestasForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    user: PropTypes.object
};