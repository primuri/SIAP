import {NavLink} from 'react-router-dom'
export const Sidebar = () => {
   const usuario = JSON.parse(localStorage.getItem('user'));
   const menu = {
    "administrador": [
      { label: 'Gestión de<br/>usuarios',        link: '/gestion-usuarios' },
      { label: 'Gestión de<br/> propuestas',     link: '/gestion-propuestas' },
      { label: 'Gestión de<br/> proyectos',      link: '' },
      { label: 'Gestión de<br/> investigadores', link: '/gestion-investigadores' },
      { label: 'Gestión de<br/> evaluadores',    link: '/gestion-evaluadores' },
      { label: 'Gestión de<br/> presupuestos',   link: '/gestion-presupuestos' },
      { label: 'Gestión de<br/> informes',       link: '/gestion-informes' },
      { label: 'Gestión de<br/> proveedores',       link: '/gestion-proveedores' },
    ],
    "evaluador": [
      { label: 'Dashboard', link: '/dashboard' },
      { label: 'Evaluaciones', link: '/evaluaciones' },
    ],
    "academico": [
      { label: 'Dashboard', link: '/dasdas' },
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
                                    to={e.link} className='text-decoration-none text-black fs-5'>
                                    {
                                        e.label.split('<br/>').map((text,i)=>(
                                            <>
                                                {text}
                                                {i !== e.label.split('<br/>').length - 1 && <br />}
                                            </>
                                        ))
                                    }
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