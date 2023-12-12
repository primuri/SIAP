import React from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const BreadcrumbsCustom = () => {
    const location = useLocation();
    
    // Verificar si la ruta actual es '/inicio-administrador'
    if (location.pathname === '/inicio-administrador') {
        return null; // No renderizar nada si estamos en '/inicio-administrador'
    }

    let pathnames = location.pathname.split('/').filter(x => x);

    // Definimos el breadcrumb "Home"
    const homeBreadcrumb = { name: 'Home', path: '/inicio-administrador' };

    // Insertamos el breadcrumb "Home" al principio del array
    pathnames = [homeBreadcrumb, ...pathnames.map(value => ({ name: value, path: '' }))];

    return (
        <Breadcrumbs aria-label="breadcrumb" className='bread_custom'>
            {pathnames.map((breadcrumb, index) => {
                const last = index === pathnames.length - 1;
                const to = index === 0 ? breadcrumb.path : `/${pathnames.slice(1, index + 1).map(b => b.name).join('/')}`;

                return last ? (
                    <Typography color="text.primary" key={to}>
                        {breadcrumb.name}
                    </Typography>
                ) : (
                    <Link underline="hover" color="inherit" href={to} key={to}>
                        {breadcrumb.name}
                    </Link>
                );
            })}
        </Breadcrumbs>
    );
};

export default BreadcrumbsCustom;
