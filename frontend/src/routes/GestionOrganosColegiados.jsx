import { Route } from "react-router-dom"
import { GestionOrganosColegiados } from "../pages/GestionOrganosColegiados/GestionOrganosColegiados"
import { GestionSesionesOrganosColegiados } from "../pages/GestionOrganosColegiados/GestionSesiones/GestionSesionesOrganosColegiados"

export default[
    <Route path="gestion-organos-colegiados/" Component={GestionOrganosColegiados} key="evaluacion-organos-colegiados"></Route>,
    <Route path="gestion-organos-colegiados/:IdOrganoC/gestion-sesiones" Component={GestionSesionesOrganosColegiados} key="sesiones-organos-colegiados"></Route>
]