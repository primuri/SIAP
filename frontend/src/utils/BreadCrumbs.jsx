import { useLocation, Link } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';


//Estos son los links que no se deberian de poder dar click
const noLinks = ['p_id=', 'inf_id='];
//Esto es como se van a mostrar las distintas rutas en los breadcrumbs
const routeNames = {
    'gestion-proyectos': 'Proyectos',
    'gestion-informes': 'Informes',
    'gestion-versiones': 'Versiones',
    'gestion-propuestas': 'Propuestas',
    'gestion-usuarios': 'Usuarios',
    'gestion-investigadores': 'Investigadores',
    'gestion-evaluadores': 'Evaluadores',
    'gestion-proveedores': 'Proveedores',
    'gestion-presupuestos': 'Presupuesto',
    'gestion-acciones': 'Acciones',
    'evaluacion-proyectos': 'Evaluaciones',
    'gestion-organos-colegiados': 'Órganos Colegiados',
    'gestion-evaluaciones': 'Evaluaciones',
};
//Esto es para las rutas que no deberian de mostrar la url.
const excludedRoutes = new Set(['/inicio-administrador', '/inicio-evaluador', '/login', '/']);

const BreadcrumbsCustom = () => {
    const location = useLocation();

    if (excludedRoutes.has(location.pathname)) {
        return null;
    }

    let pathnames = location.pathname.split('/').filter(x => x);

    const homeBreadcrumb = { name: 'Inicio', path: '/inicio-administrador' };
    pathnames = [homeBreadcrumb, ...pathnames.map((value, index, array) => {
        const isNoLink = noLinks.some(noLink => value.includes(noLink));
        const displayName = isNoLink ? value.split('=')[1] : (routeNames[value] || value);

        const path = `/${array.slice(0, index + 1).join('/')}`;

        return { name: displayName, path, isNoLink };
    })];

    return (
        <Breadcrumbs aria-label="breadcrumb" className='bread_custom'>
            {pathnames.map((breadcrumb, index) => {
                const last = index === pathnames.length - 1;

                return breadcrumb.isNoLink || last ? (
                    <Typography color="text.primary" key={breadcrumb.path}  className={`${breadcrumb.isNoLink? 'no_link': 'last_bread'}`}>
                        {breadcrumb.name}
                    </Typography>
                ) : (
                    <Link to={breadcrumb.path} key={breadcrumb.path} style={{ textDecoration: 'none', color: 'black' }}  >
                        {breadcrumb.name}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
};

export default BreadcrumbsCustom;
