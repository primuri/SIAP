import { Route } from "react-router-dom"
import { InicioSesion } from "../components/GestionUsuarios/InicioSesion/InicioSesion"
import { GestionAcademicos } from "../pages/GestionUsuarios/GestionAcademicos"
export default[
    <Route path="/login" Component={InicioSesion} key="login"></Route>,
    <Route path="/gestion-academicos" Component={GestionAcademicos} key="gestion-usuarios"></Route>
]