
import {BrowserRouter, Route, Routes} from 'react-router-dom' 
import { Header } from './components/Layout/Header'
import './App.css'
import GestionUsuarios from "./routes/GestionUsuarios"
import GestionPropuestas from "./routes/GestionPropuestas"
import GestionInformes from "./routes/GestionInformes"
import GestionPresupuestos from './routes/GestionPresupuestos'
import GestionProveedores from './routes/GestionProveedores'
import GestionProyectos from "./routes/GestionProyectos"
import { useEffect } from 'react'
import { InicioAdministrador } from './pages/Inicio/InicioAdministrador'
import { InicioInvestigador } from './pages/Inicio/InicioInvestigador'
import { InicioEvaluador } from './pages/Inicio/InicioEvaluador'
import { Sidebar } from './components/Layout/Sidebar'
import { Footer } from './components/Layout/Footer'
import BreadcrumbsCustom from './utils/BreadCrumbs'
import EvaluacionProyectos from './routes/EvaluacionProyectos'

function App() {
  useEffect(() => {
    const user = localStorage.getItem('user');
    const currentPath = window.location.pathname;
  
    // Si no se encuentra un usuario en el localStorage (sin iniciar sesión) y la ruta actual no es /log-in, redirige a /log-in
    if (!user && currentPath !== '/login') {
      window.location.href = '/login';
    }

  }, []);

  return (
    <BrowserRouter>
      <Header/>
      <div className='d-flex' id='content-box'>
        <Sidebar></Sidebar>
        <div className=' overflow-hidden'>
          <BreadcrumbsCustom></BreadcrumbsCustom>
          <Routes>
            {GestionUsuarios}
            {GestionPropuestas}
            {GestionInformes}
            {GestionPresupuestos}
            {GestionProveedores}
            {GestionProyectos}
            {EvaluacionProyectos}
            <Route path='/inicio-administrador' element={<InicioAdministrador usuario={localStorage.getItem('user')} />}></Route>
            <Route path='/inicio-evaluador' element={<InicioEvaluador></InicioEvaluador>}></Route>
            <Route path='/inicio-investigador' element={<InicioInvestigador></InicioInvestigador>}></Route>
          </Routes> 
        </div>
      </div>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
