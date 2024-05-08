import { Route } from "react-router-dom"
import { GestionOrganosColegiados } from "../pages/GestionOrganosColegiados/GestionOrganosColegiados"
import { GestionSesionesOrganosColegiados } from "../pages/GestionOrganosColegiados/GestionSesiones/GestionSesionesOrganosColegiados"
import { GestionAcuerdos } from "../pages/GestionOrganosColegiados/GestionAcuerdos/GestionAcuerdosSesiones"
import { GestionIntegranteOrganoColegiado } from "../pages/GestionOrganosColegiados/GestionIntegranteOrganoColegiado"


export default[
    <Route path="gestion-organos-colegiados/" Component={GestionOrganosColegiados} key="evaluacion-organos-colegiados"></Route>,
    <Route path="gestion-organos-colegiados/:id/gestion-integrantes" Component={GestionIntegranteOrganoColegiado} key="gestion-integrantes"></Route>,
    <Route path="gestion-organos-colegiados/:IdOrganoC/gestion-sesiones" Component={GestionSesionesOrganosColegiados} key="sesiones-organos-colegiados"></Route>,
    <Route path="gestion-organos-colegiados/:IdOrganoC/gestion-sesiones/:idSesion/gestion-acuerdos" Component={GestionAcuerdos} key="acuerdos-sesiones"></Route>

]