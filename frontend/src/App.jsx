
import {BrowserRouter, Route, Routes} from 'react-router-dom' 
import { Header } from './components/Layout/Header'
import './App.css'
import GestionUsuarios from "./routes/GestionUsuarios"
import GestionPropuestas from "./routes/GestionPropuestas"
import GestionInformes from "./routes/GestionInformes"
import  GestionPresupuestos from './routes/GestionPresupuestos'
import  GestionProveedores from './routes/GestionProveedores'
import { useEffect } from 'react'
import { Home } from './pages/Home'
import { Sidebar } from './components/Layout/Sidebar'
import { Footer } from './components/Layout/Footer'

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
        <Routes>
          {GestionUsuarios}
          {GestionPropuestas}
          {GestionInformes}
          {GestionPresupuestos}
          {GestionProveedores}
          <Route path='/' element={<Home></Home>}></Route>
        </Routes>
      </div>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
