import { Route } from "react-router-dom"
import { GestionProveedores } from "../pages/GestionProveedores/GestionProveedores"
export default[
    <Route path="/gestion-proveedores" Component={GestionProveedores} key="gestion-proveedores"></Route>,
    <Route path="/gestion-proveedores/:id_cedula_proveedor" Component={GestionProveedores} key="gestion-proveedores"></Route>
]