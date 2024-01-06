import {NavLink} from 'react-router-dom'
import { useLocation } from 'react-router-dom';

export const Sidebar = () => {
   const usuario = JSON.parse(localStorage.getItem('user'));
   const menu = {
    "administrador": [
      { label: 'Inicio',        link: '/inicio-administrador' },
      { label: 'Gestión de<br/>usuarios',        link: '/gestion-usuarios' },
      { label: 'Gestión de<br/> propuestas',     link: '/gestion-propuestas' },
      { label: 'Gestión de<br/> proyectos',      link: '/gestion-proyectos' },
      { label: 'Gestión de<br/> investigadores', link: '/gestion-investigadores' },
      { label: 'Gestión de<br/> evaluadores',    link: '/gestion-evaluadores' },
      { label: 'Gestión de<br/> proveedores',    link: '/gestion-proveedores' },
    ],
    "evaluador": [
      { label: 'Inicio',        link: '/inicio-evaluador' },

      { label: 'Evaluación de proyectos', link: '/evaluaciones' },
    ],
    "academico": [
      { label: 'Inicio',        link: '/inicio-investigador' },
      { label: 'Perfil', link: '/perfil' },
    ],
  };
   return(
    <>
        {usuario && (
            <nav className='d-flex justify-content-center'>
                <ul className='d-flex flex-column justify-content-start list-unstyled pt-5 row-gap-3 side-bar'>
                {menu[usuario.groups[0]].map((e)=>{
                    return(<>
                        <li key={e.link} className='d-flex align-items-center'>
                            <NavLink
                                to={e.link}
                                className={`text-decoration-none text-black fs-5 ${useLocation().pathname.includes("/gestion-informes/") && (e.link === '/gestion-proyectos') ? "active" : ""}`}
                            >
                                {e.label.split('<br/>').map((text, i) => (
                                    <>
                                        {text}
                                        {i !== e.label.split('<br/>').length - 1 && <br />}
                                    </>
                                ))}
                            </NavLink>

                        </li>
                        <hr></hr>
                    </>
                    )
                })}
                </ul>
            </nav>
        )}
    </>
   )
}