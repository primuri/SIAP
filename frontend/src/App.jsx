
import {BrowserRouter, Route, Routes} from 'react-router-dom' 
import { Header } from './components/Layout/Header'
import { useEffect } from 'react'
import { Sidebar } from './components/Layout/Sidebar'
import { Footer } from './components/Layout/Footer'
import BreadcrumbsCustom from './utils/BreadCrumbs'
import GestionUsuarios from "./routes/GestionUsuarios"
import GestionPropuestas from "./routes/GestionPropuestas"
import GestionInformes from "./routes/GestionInformes"
import GestionPresupuestos from './routes/GestionPresupuestos'
import GestionProveedores from './routes/GestionProveedores'
import GestionProyectos from "./routes/GestionProyectos"
import GestionEvaluaciones from './routes/GestionEvaluaciones'
import EvaluacionProyectos from './routes/EvaluacionProyectos'
import GestionOrganosColegiados from "./routes/GestionOrganosColegiados"
import GestionAsistentes from "./routes/GestionAsistentes"
import GestionPáginasInicio from './routes/GestionPáginasInicio'
import './App.css'

function App() {

    const user = localStorage.getItem('user');
    const currentPath = window.location.pathname;
  
    let rol = "";
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (usuario) {
      rol = usuario.groups[0];
      if(usuario.groups[1]) {
        rol += "-" + usuario.groups[1];
      }
    }

    if (!user && currentPath !== '/inicio-sesion') {
      window.location.href = '/inicio-sesion';
    }

    if (user && currentPath === '/') {
      window.location.href = `/inicio-${rol}`;
    }

    if (user && currentPath === '/inicio-sesion') {
      window.location.href = `/inicio-${rol}`;
    }



  return (
    <BrowserRouter>
      <Header/>
      <div className='d-flex' id='content-box'>
        <Sidebar></Sidebar>
        <div className='overflow-hidden mr-4'>
          <BreadcrumbsCustom></BreadcrumbsCustom>
          <hr id="divider"></hr>
          <div style={{ marginRight: '2rem' }}>
            <Routes>
              {GestionUsuarios}
              {GestionPropuestas}
              {GestionInformes}
              {GestionPresupuestos}
              {GestionProveedores}
              {GestionProyectos}
              {EvaluacionProyectos}
              {GestionEvaluaciones}
              {GestionOrganosColegiados}
              {GestionAsistentes}
              {GestionPáginasInicio}
            </Routes> 
          </div>
        </div>
      </div>
      <Footer/>
    </BrowserRouter>
  )
}
export default App
