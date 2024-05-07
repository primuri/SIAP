
import {BrowserRouter, Route, Routes} from 'react-router-dom' 
import { Header } from './components/Layout/Header'
import './App.css'
import { useEffect } from 'react'
import { InicioAdministrador } from './pages/Inicio/InicioAdministrador'
import { InicioInvestigador } from './pages/Inicio/InicioInvestigador'
import { InicioEvaluador } from './pages/Inicio/InicioEvaluador'
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
import pruebaReporte from './routes/pruebaReporte'

import GestionAsistentes from "./routes/GestionAsistentes"
import { InicioInvitado } from './pages/Inicio/InicioInvitado'

function App() {
  useEffect(() => {
    const user = localStorage.getItem('user');
    const currentPath = window.location.pathname;
  
    if (!user && currentPath !== '/login') {
      window.location.href = '/login';
    }

  }, []);

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
              {pruebaReporte}
              <Route path='/inicio-administrador' element={<InicioAdministrador usuario={localStorage.getItem('user')} />}></Route>
              <Route path='/inicio-invitado' element={<InicioInvitado usuario={localStorage.getItem('user')} />}></Route>
              <Route path='/inicio-evaluador' element={<InicioEvaluador></InicioEvaluador>}></Route>
              <Route path='/inicio-investigador' element={<InicioInvestigador></InicioInvestigador>}></Route>
            </Routes> 
          </div>
        </div>
      </div>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
