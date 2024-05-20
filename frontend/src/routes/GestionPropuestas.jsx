import { Route } from "react-router-dom"
import { GestionPropuestas } from "../pages/GestionPropuestas/GestionPropuestas"

export default [
    <Route path="/gestion-propuestas" Component={GestionPropuestas} key="gestion-propuestas"></Route>,
    <Route path="/gestion-propuestas/:id_codigo_cimpa" Component={GestionPropuestas} key="gestion-propuestas"></Route>
]