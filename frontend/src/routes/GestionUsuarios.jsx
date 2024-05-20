import { Route } from "react-router-dom"
import { InicioSesion } from "../components/GestionPersonas/InicioSesion/InicioSesion"
import { GestionAcademicos } from "../pages/GestionPersonas/GestionAcademicos"
import { GestionEvaluadores } from "../pages/GestionPersonas/GestionEvaluadores"
import { GestionUsuarios } from "../pages/GestionPersonas/GestionUsuarios"

export default [
    <Route path="/inicio-sesion" Component={InicioSesion} key="inicio-sesion"></Route>,
    <Route path="/gestion-investigadores" Component={GestionAcademicos} key="gestion-investigadores"></Route>,
    <Route path="/gestion-investigadores/:id_academico" Component={GestionAcademicos} key="gestion-investigadores"></Route>,
    <Route path="/gestion-evaluadores" Component={GestionEvaluadores} key="gestion-evaluadores"></Route>,
    <Route path="/gestion-evaluadores/:id_evaluador" Component={GestionEvaluadores} key="gestion-evaluadores"></Route>,
    <Route path="/gestion-usuarios" Component={GestionUsuarios} key="gestion-usuarios"></Route>,
    <Route path="/gestion-usuarios/:id" Component={GestionUsuarios} key="gestion-usuarios-id"></Route>
]