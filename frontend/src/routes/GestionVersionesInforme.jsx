import { Route } from "react-router-dom"
import { GestionVersionInforme } from "../pages/GestionInformes/GestionVersionInforme"

export default[
    <Route path="/gestion-versiones-informe" Component={(props) => <GestionVersionInforme informeID={1} />} key="gestion-versiones-informe"></Route>
]
