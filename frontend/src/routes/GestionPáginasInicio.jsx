import { Route } from "react-router-dom"
import {InicioAdministrador} from "../pages/Inicio/InicioAdministrador"
import {InicioEvaluador} from "../pages/Inicio/InicioEvaluador"
import {InicioInvestigador} from "../pages/Inicio/InicioInvestigador"
import {InicioInvestigadorEvaluador} from "../pages/Inicio/InicioInvestigadorEvaluador"
import {InicioInvitado} from "../pages/Inicio/InicioInvitado"

export default [
    <Route path='/inicio-administrador' element={<InicioAdministrador usuario={localStorage.getItem('user')} />}></Route>,
    <Route path='/inicio-invitado' element={<InicioInvitado usuario={localStorage.getItem('user')} />}></Route>,
    <Route path='/inicio-evaluador'  element={<InicioEvaluador usuario={localStorage.getItem('user')} />}></Route>,
    <Route path='/inicio-investigador' element={<InicioInvestigador usuario={localStorage.getItem('user')}/>}></Route>,
    <Route path='/inicio-investigador-evaluador' element={<InicioInvestigadorEvaluador usuario={localStorage.getItem('user')}/>}></Route>,
    <Route path='/inicio-evaluador-investigador' element={<InicioInvestigadorEvaluador usuario={localStorage.getItem('user')}/>}></Route>,
]