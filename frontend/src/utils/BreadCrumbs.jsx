import { useLocation, Link } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';


const noLinks = ['p_id=', 'inf_id=', 'o_id='];

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
    'gestion-partidas': 'Partidas',
    'gestion-gastos': 'Gastos',
    'gestion-acciones': 'Acciones',
    'evaluacion-proyectos': 'Evaluaciones',
    'gestion-organos-colegiados': 'Órganos Colegiados',
    'gestion-evaluaciones': 'Evaluaciones',
    'gestion-asistentes': 'Asistentes', 
    'organos-colegiados': 'Órganos Colegiados',
    'gestion-integrantes': 'Integrantes',
    'gestion-sesiones': 'Sesiones',
    'gestion-acuerdos': 'Acuerdos'
};

const excludedRoutes = new Set(['/inicio-administrador', '/inicio-evaluador', '/inicio-invitado', '/inicio-investigador', '/inicio-investigador-evaluador', '/login', '/']);

const BreadcrumbsCustom = () => {
    const location = useLocation();

    if (excludedRoutes.has(location.pathname)) {
        return null;
    }

    let pathnames = location.pathname.split('/').filter(x => x);

    const homeBreadcrumb = { name: 'Inicio', path: '/inicio-administrador', variant: 'h6'};
    pathnames = [homeBreadcrumb, ...pathnames.map((value, index, array) => {
        const isNoLink = noLinks.some(noLink => value.includes(noLink));
        const displayName = isNoLink ? value.split('=')[1] : (routeNames[value] || value);

        const path = `/${array.slice(0, index + 1).join('/')}`;

        return { name: displayName, path, isNoLink };
    })];

    return (
        <Breadcrumbs aria-label="breadcrumb" className='bread_custom' id="breadcrums" >
            {pathnames.map((breadcrumb, index) => {
                const last = index === pathnames.length - 1;

                return breadcrumb.isNoLink || last ? (
                    <Typography variant="h6" color="text.primary" key={breadcrumb.path}  className={`${breadcrumb.isNoLink? 'no_link': 'last_bread'}`}>
                        {breadcrumb.name}
                    </Typography>
                ) : (
                    <Link to={breadcrumb.path} key={breadcrumb.path} style={{ textDecoration: 'none', color: 'black'}} >
                        {breadcrumb.name}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
};

export default BreadcrumbsCustom;
