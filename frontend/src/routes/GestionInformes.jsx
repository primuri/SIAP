import { Route } from "react-router-dom"
import { GestionInformes } from "../pages/GestionInformes/GestionInformes"

export default[
    <Route path="gestion-proyectos/:id/gestion-versiones/:proyectoID/gestion-informes/" Component={GestionInformes} key="gestion-informes"></Route>,
    
]