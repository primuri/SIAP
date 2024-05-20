import PropTypes from 'prop-types';
import add from '../assets/plus-i.png'
export const Add = ({ onClick }) => {
    return (
        <button
            type='button'
            className='table-button border-0 p-2 rounded-3 text-white d-flex align-items-center'
            onClick={onClick}>
            <span className='icono'><img width={"20px"} src={add} /></span> Agregar
        </button>
    )
}

Add.propTypes = {
    onClick: PropTypes.func.isRequired,
};