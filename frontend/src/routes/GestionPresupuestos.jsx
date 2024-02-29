import { Route } from "react-router-dom"
import { GestionPresupuestos } from "../pages/GestionPresupuestos/GestionPresupuestos"
import { GestionGastos } from "../pages/GestionPresupuestos/GestionGastos"

//Route gastos para ver la page  --eliminar del sidebar tambien
export default[
    <Route path="gestion-proyectos/:id/gestion-versiones/:proyectoID/gestion-presupuestos" Component={GestionPresupuestos} key="gestion-presupuestos"></Route>,
    <Route path="gestion-gastos/" Component={GestionGastos} key="gestion-gastos"></Route>,
]