import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom'


export const ReportHeader = ({ nombreReporte }) => {
  return (
    <header className="bg-light w-100 d-flex align-items-center shadow">
      <img src={logo} className='logo mx-auto' alt='Logo a página principal' />
      <h5 className='mx-auto'>Reporte {nombreReporte}</h5>
    </header>
  );
};
