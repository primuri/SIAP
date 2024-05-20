import { Route } from "react-router-dom"
import { GestionInformes } from "../pages/GestionInformes/GestionInformes"
import { GestionVersionInforme } from "../pages/GestionInformes/GestionVersionInforme"
import { GestionAcciones } from "../pages/GestionInformes/GestionAcciones"

export default [
    <Route path="gestion-proyectos/:id/gestion-versiones/:proyectoID/gestion-informes/" Component={GestionInformes} key="gestion-informes"></Route>,
    <Route path="gestion-proyectos/:id/gestion-versiones/:proyectoID/gestion-informes/:informeID/gestion-versiones/" Component={GestionVersionInforme} key="gestion-version-informes"></Route>,
    <Route path="gestion-proyectos/:id/gestion-versiones/:proyectoID/gestion-informes/:informeId/gestion-versiones/:versionID/gestion-acciones" Component={GestionAcciones} key="gestion-accion-version-informes"></Route>
]