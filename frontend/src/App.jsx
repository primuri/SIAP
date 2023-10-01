
import {BrowserRouter, Route, Routes} from 'react-router-dom' 
import { Header } from './components/Layout/Header'
import './App.css'
import GestionUsuarios from "./routes/GestionUsuarios"
import { useEffect } from 'react'
import { Home } from './pages/Home'
import { Sidebar } from './components/Layout/Sidebar'
import GestionPropuestas from './routes/GestionPropuestas'

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
      <div className='d-flex'>
        <Sidebar></Sidebar>
        <Routes>
          {GestionUsuarios}
          {GestionPropuestas}
          <Route path='/' element={<Home></Home>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
