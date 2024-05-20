import { Route } from "react-router-dom"
import { GestionPresupuestos } from "../pages/GestionPresupuestos/GestionPresupuestos"
import { GestionVersionPresupuesto } from "../pages/GestionPresupuestos/GestionVersionPresupuesto"
import { GestionPartidas } from "../pages/GestionPresupuestos/GestionPartidas"
import { GestionGastos } from "../pages/GestionPresupuestos/GestionGastos"

export default [
    <Route path="gestion-proyectos/:id/gestion-versiones/:proyectoID/gestion-presupuestos" Component={GestionPresupuestos} key="gestion-presupuestos"></Route>,
    <Route path="gestion-proyectos/:id/gestion-versiones/:proyectoID/gestion-presupuestos/:presupuestoID/gestion-versiones" Component={GestionVersionPresupuesto} key="gestion-versiones-presupuesto"></Route>,
    <Route path="gestion-proyectos/:id/gestion-versiones/:proyectoID/gestion-presupuestos/:presupuestoID/gestion-versiones/:versionPresupuestoID/gestion-partidas" Component={GestionPartidas} key="gestion-partidas"></Route>,
    <Route path="gestion-proyectos/:id/gestion-versiones/:proyectoID/gestion-presupuestos/:presupuestoID/gestion-versiones/:versionPresupuestoID/gestion-partidas/:partidaID/gestion-gastos" Component={GestionGastos} key="gestion-gastos"></Route>
]