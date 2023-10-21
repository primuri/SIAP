import { Route } from "react-router-dom"
import { GestionPresupuestos } from "../pages/GestionPresupuestos/GestionPresupuestos"
import { Proveedores } from "../pages/GestionPresupuestos/Proveedores"
export default[
    <Route path="/gestion-presupuestos" Component={GestionPresupuestos} key="gestion-presupuestos"></Route>,
    <Route path="/proveedores" Component={Proveedores} key="proveedores"></Route>
]