import PropTypes from 'prop-types';
import add from '../assets/plus-i.png'
export const Add = ({onClick}) =>{
    return(
        <button 
        type='button'
        className='table-button border-0 p-2 ps-3 pe-3 rounded-3 text-white fs-5 d-flex align-items-center'
        onClick={onClick}>
          <span><img src={add}/></span> Agregar
        </button>
    )
}

Add.propTypes = {
    onClick: PropTypes.func.isRequired,
};