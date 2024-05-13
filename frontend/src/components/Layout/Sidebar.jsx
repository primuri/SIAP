import {NavLink} from 'react-router-dom'
import { useLocation } from 'react-router-dom';

export const Sidebar = () => {
   const usuario = JSON.parse(localStorage.getItem('user'));
   const menu = {
    "administrador": [
      { label: 'Inicio',        link: '/inicio-administrador' },
      { label: 'Gestión usuarios',        link: '/gestion-usuarios' },
      { label: 'Gestión <br/> investigadores', link: '/gestion-investigadores' },
      { label: 'Gestión <br/> propuestas',     link: '/gestion-propuestas' },
      { label: 'Gestión <br/> proyectos',      link: '/gestion-proyectos' },
      { label: 'Gestión proveedores',    link: '/gestion-proveedores' },
      { label: 'Gestión <br/> evaluadores',    link: '/gestion-evaluadores' },
      { label: 'Gestión <br/> evaluaciones',    link: '/gestion-evaluaciones' },
      { label: 'Gestión órganos <br/> colegiados',    link: '/gestion-organos-colegiados' },

    ],
    "evaluador": [
      { label: 'Inicio',        link: '/inicio-evaluador' },
      { label: 'Evaluación de proyectos', link: '/evaluacion-proyectos' },
    ],
    "investigador": [
      { label: 'Inicio',        link: '/inicio-investigador' },
      { label: 'Visualización Propuestas', link: '/gestion-propuestas' },
      { label: 'Visualización Proyectos', link: '/gestion-proyectos' },

    ],
    "invitado": [
        { label: 'Inicio',        link: '/inicio-invitado' },
        { label: 'Órganos <br/> colegiados',    link: '/gestion-organos-colegiados' },
      ],
    "evaluador-investigador": [
//      { label: 'Inicio',        link: '/inicio-evaluador-investigador' },
        { label: 'Evaluación de proyectos', link: '/evaluacion-proyectos' },
        { label: 'Visualización Propuestas', link: '/gestion-propuestas' },
        { label: 'Visualización Proyectos', link: '/gestion-proyectos' },
    ],
    "investigador-evaluador": [
//      { label: 'Inicio',        link: '/inicio-evaluador-investigador' },
        { label: 'Evaluación de proyectos', link: '/evaluacion-proyectos' },
        { label: 'Visualización Propuestas', link: '/gestion-propuestas' },
        { label: 'Visualización Proyectos', link: '/gestion-proyectos' },
    ]
  };
    
  var keyForSidebar = usuario.groups[0]
  usuario.groups[1] ? keyForSidebar += "-" + usuario.groups[1] : "";
  console.log(keyForSidebar)

   return(
    <>
        {usuario && (
            <nav className='d-flex justify-content-center'>
                <ul className='d-flex flex-column justify-content-start list-unstyled pt-5 row-gap-3 side-bar'>
                {menu[keyForSidebar].map((e)=>{
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