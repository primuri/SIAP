import PropTypes from 'prop-types';
import back from '../assets/back.png'
export const Back = ({onClick, children}) =>{
    return(
        <button
        type='button'
        className='table-button border-0 p-2 rounded-3 text-white d-flex align-items-center'
        onClick={onClick}>
          <span className='icono'><img width={"20px"} src={back}/></span> {children}
        </button>
    )
}

Back.propTypes = {
    onClick: PropTypes.func.isRequired,
};