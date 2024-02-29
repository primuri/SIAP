import React from 'react';
import PropTypes from 'prop-types';


export const Confirmar = ({ onConfirm, onCancel, accion, objeto }) => {
  const accionMa = accion.charAt(0).toUpperCase() + accion.slice(1);
  const accionMi = accion.toLowerCase();

  const isAprobarAction = accion === 'aprobar';
  const reversibleMessage = isAprobarAction ? <p className="text-center"><strong>Esta acción no es reversible y creará un proyecto que no podrá ser eliminado.</strong><br /></p> : '';

  return (
    <div className="modal d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" >
          <div className="modal-header">
            <h4>{accionMa} {objeto}</h4>
            <button type="button" onClick={onCancel} className="close" data-dismiss="modal">
              <span aria-hidden="true" className="close-icon">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p className='text-center'>¿Está seguro(a) de {accionMi} {objeto}? {reversibleMessage}</p>
          </div>
          <div className="modal-footer">
              <button type="button" className={accion === 'eliminar' ? 'delete-button w-100 p-2 rounded text-white': 'table-button w-100 p-2 rounded text-white'} onClick={onConfirm}> {accionMa} </button>
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
