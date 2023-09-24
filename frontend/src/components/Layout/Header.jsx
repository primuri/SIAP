import logo from '../../assets/logo.png';
import user from '../../assets/user_placeholder.png';
import {Link} from 'react-router-dom'
export const Header = () => {
  const usuarioGuardado = JSON.parse(localStorage.getItem('user'));
  const handleLogout = () =>{
    localStorage.clear();
    window.location.href = '/login' 
  }
  return (
    <header className="bg-light w-100 d-flex justify-content-between align-items-center position-fixed top-0 end-0 start-0 shadow">
      <Link to="/" className='w-100'><img src={logo} className='logo' alt='Logo a página principal' /></Link>
      {usuarioGuardado && (
        <div className='d-flex align-items-center justify-content-center column-gap-2 me-5'>
          <div>
            <p className=' mb-0'>{usuarioGuardado.username}</p>
            <p onClick={handleLogout} style={{color: "var(--celeste-ucr)",cursor:"pointer"}} className='mb-0'>Cerrar sesión</p>
          </div>
          <img src={user} alt="Imagen de perfil" />
        </div>
      )}
    </header>
  );
};
