import { Route } from "react-router-dom"
import { GestionInformes } from "../pages/GestionInformes/GestionInformes"

export default[
    <Route path="/gestion-informes/:proyectoID" Component={GestionInformes} key="gestion-informes"></Route>
]