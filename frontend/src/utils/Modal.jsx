import PropTypes from 'prop-types';
export const Modal = ({children}) => {
    return(
        <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg">
          <div className="modal-content" >
            <div className="modal-body" style={{padding: '0px'}} >
              {children}
            </div>
          </div>
        </div>
      </div>
      )
}


Modal.propTypes = {
    children: PropTypes.object.isRequired,
};