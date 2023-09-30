import { Route } from "react-router-dom"
import { InicioSesion } from "../components/GestionUsuarios/InicioSesion/InicioSesion"
import { GestionAcademicos } from "../pages/GestionUsuarios/GestionAcademicos"
import { GestionEvaluadores } from "../pages/GestionUsuarios/GestionEvaluadores"
import { GestionUsuarios } from "../pages/GestionUsuarios/GestionUsuarios"
export default[
    <Route path="/login" Component={InicioSesion} key="login"></Route>,
    <Route path="/gestion-academicos" Component={GestionAcademicos} key="gestion-academicos"></Route>,
    <Route path="/gestion-evaluadores" Component={GestionEvaluadores} key="gestion-evaluadores"></Route>,
    <Route path="/gestion-usuarios" Component={GestionUsuarios} key="gestion-usuarios"></Route>
]