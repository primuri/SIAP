import PropTypes from 'prop-types';
import back from '../assets/back.png'
export const Boton = ({onClick, text}) =>{
    return (
        <button
            type='button'
            className='table-button border-0 p-2 rounded-3 text-white d-flex align-items-center justify-content-center'
            onClick={() => onClick(text)}>
            {text}
        </button>
    )
}

Boton.propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
};