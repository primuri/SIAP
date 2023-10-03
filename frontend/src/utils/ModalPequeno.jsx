import PropTypes from 'prop-types';
export const ModalPequeno = ({children}) => {
    return(
        <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content" >
            <div className="modal-body">
              {children}
            </div>
          </div>
        </div>
      </div>
      )
}


ModalPequeno.propTypes = {
    children: PropTypes.object.isRequired,
};