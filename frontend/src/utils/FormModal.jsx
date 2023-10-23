import PropTypes from 'prop-types';
import { Confirmar } from './Confirmar'

export const FormModal = ({ icono, mode, nombreForm, onCancel, handleEditClick, handleDeleteClick, handleDeleteConfirm, handleEditCancel, handleDeleteCancel, showConfirmationDelete, showConfirmationEdit, sendForm, children }) => {
  return (
    <>
      <div className="modal-header pb-0 position-sticky top-0">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-1 mb-0 text-center">
              <div className="img-space">
                <img src={icono} alt="" width={'72px'} />
              </div>
            </div>
            <div className="col-10 mb-0 text-center">
              <h2 className="headerForm">
                {mode === 1 ? `Agregar ${nombreForm}` : `Editar ${nombreForm}`}
              </h2>
            </div>
            <div className="col-1 mb-0 text-center">
              <button
                type="button"
                onClick={onCancel}
                className="close"
                data-dismiss="modal"
              >
                <span aria-hidden="true" className="close-icon">
                  &times;
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={sendForm} className='d-flex flex-column'>
        <div className="modal-body" style={{ padding: '0px' }} > 
          {children}  {/*Se agrega el body del form*/}
        </div>
        <div className="modal-footer justify-content-center position-sticky bottom-0">
          <div className="row">
            <div className="col">
              {mode === 1 ? (
                <button id="boton-personalizado" type="submit" className='table-button border-0 p-2 rounded text-white'>Agregar</button>
              ) : (
                <>
                  <button id="boton-personalizado" type="button" onClick={handleEditClick} className='table-button border-0 p-2 rounded text-white'>Guardar</button>
                  {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto={nombreForm} />)}
                </>
              )}
            </div>
            <div className="col">
              {mode === 2 && (
                <>
                  <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                  {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto={nombreForm} />)}
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  )
}


FormModal.propTypes = {
  children: PropTypes.object.isRequired,
};