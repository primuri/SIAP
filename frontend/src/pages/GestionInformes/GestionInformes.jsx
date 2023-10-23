import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { AcademicosForm } from "../../components/GestionPersonas/GestionAcademicos/AcademicosForm"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerInforme, agregarInforme, editarInforme, eliminarInforme } from "../../api/gestionInformes"

export const GestionInformes = () => {

    const user = JSON.parse(localStorage.getItem('user'))
    const [reload, setReload] = useState(false)                           // Definir cuando se debe de actualizar la pagina.
    const [informes, setInformes] = useState([])  
    const [cargado, setCargado] = useState(false)                         // Informes que se muestran
    const [data, setData] = useState([])                                  // Todos los académicos
    const [informe, setInforme] = useState(null)                          // Informe al que se le da click en la tabla 
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false)
    const [error, setError] = useState(false)      
    const columns = ['Identificador', 'Estado','Tipo','Fecha de presentacion', 'Fecha que debe presentarse', 'Versión actual', 'Proyecto asociado']
    //const dataKeys = ['cedula','id_nombre_completo_fk.nombre','correo', 'universidad_fk.nombre']

    user.groups[0] !== "administrador" ? setError(true) : null           // Si no es administrador, pone el error en true

    return (
        <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
            <div className="d-flex flex-row"><h1>Gestión de informes</h1></div>
        </div>
    )
}

