import PropTypes from 'prop-types';
export const Confirmar = () => {
    return(
        <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" >
            <div className="modal-header">
                <h2>ELIMINAR</h2>
            </div>
            <div className="modal-body">
              <p>Se eliminará el registro seleccionado permanentemente</p>
            </div>
            <div className="modal-footer">
                <div className="row">
                    <div className="col">
                        <button type="button" className='delete-button border-0 p-2 rounded text-white'> Eliminar </button>
                    </div>
                    <div className="col">
                        <button type="button" className='cancel-button border-0 p-2 rounded text-white' data-bs-dismiss="modal"> Cancelar </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      )
}
