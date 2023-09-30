
import {BrowserRouter, Route, Routes} from 'react-router-dom' 
import { Header } from './components/Layout/Header'
import './App.css'
import GestionUsuarios from "./routes/GestionUsuarios"
import GestionPropuestas from "./routes/GestionPropuestas"
import { useEffect } from 'react'
import { Home } from './pages/Home'
import { Sidebar } from './components/Layout/Sidebar'
import { Footer } from './components/Layout/Footer'

function App() {
  useEffect(() => {
    const user = localStorage.getItem('user');
    const currentPath = window.location.pathname;
  
    // Si no se encuentra un usuario en el localStorage(o sea que no ha iniciado sesion) y la ruta actual no es /log-in, redirige a /log-in
    if (!user && currentPath !== '/login') {
      window.location.href = '/login';
    }
  }, []);
  return (
    <BrowserRouter>
      <Header/>
      <div className='d-flex'>
        <Sidebar></Sidebar>
        <Routes>
          {GestionUsuarios}
          {GestionPropuestas}
          <Route path='/' element={<Home></Home>}></Route>
        </Routes>
      </div>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
