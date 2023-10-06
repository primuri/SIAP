import React from 'react';
import PropTypes from 'prop-types';

export const Confirmar = ({ onConfirm, onCancel }) => {
    return(
        <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" >
            <div className="modal-header">
                <h4>ELIMINAR</h4>
                <button type="button" onClick={onCancel} className="close" data-dismiss="modal">
                    <span aria-hidden="true" className="close-icon">&times;</span>
                </button>
            </div>
            <div className="modal-body">
              <p>¿Está seguro de que desea eliminar este registro?</p>
            </div>
            <div className="modal-footer">
                <div className="row">
                    <div className="col">
                        <button type="button" className='delete-button border-0 p-2 rounded text-white' onClick={onConfirm}> Eliminar </button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      )
}

Confirmar.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default Confirmar;
