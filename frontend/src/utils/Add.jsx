import PropTypes from 'prop-types';
import add from '../assets/plus-i.png'
export const Add = ({onClick}) =>{
    return(
        <button 
        className='table-button border-0 p-3 rounded text-white'
        onClick={onClick}>
          <span><img src={add}/></span> Agregar
        </button>
    )
}

Add.propTypes = {
    onClick: PropTypes.func.isRequired,
};