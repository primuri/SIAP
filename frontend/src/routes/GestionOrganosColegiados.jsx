import { Route } from "react-router-dom"
import { GestionOrganosColegiados } from "../pages/GestionOrganosColegiados/GestionOrganosColegiados"
import { GestionIntegranteOrganoColegiado } from "../pages/GestionOrganosColegiados/GestionIntegranteOrganoColegiado"

export default[
    <Route path="gestion-organos-colegiados/" Component={GestionOrganosColegiados} key="evaluacion-organos-colegiados"></Route>,
    <Route path="organos-colegiados/:id/integrantes" Component={GestionIntegranteOrganoColegiado} key="integrantes"></Route>,
    <Route path="organos-colegiados/" Component={GestionOrganosColegiados} key="organos-colegiados"></Route>,
    <Route path="gestion-organos-colegiados/:id/gestion-integrantes" Component={GestionIntegranteOrganoColegiado} key="gestion-integrantes"></Route>
]