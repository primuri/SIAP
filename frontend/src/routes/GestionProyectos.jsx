import { Route } from "react-router-dom"
import { GestionProyectos } from "../pages/GestionProyectos/GestionProyectos"
import { GestionVersiones } from "../pages/GestionProyectos/GestionVersiones"

export default [
    <Route path="/gestion-proyectos" Component={GestionProyectos} key="gestion-proyectos"></Route>,
    <Route path="/gestion-proyectos/:id/gestion-versiones" Component={GestionVersiones} key="gestion-versiones"></Route>,
    <Route path="/gestion-proyectos/:id/gestion-versiones/:id_version" Component={GestionVersiones} key="gestion-versiones-id"></Route>
]