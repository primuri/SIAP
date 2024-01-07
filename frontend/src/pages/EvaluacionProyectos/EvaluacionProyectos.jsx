import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Modal } from "../../utils/Modal"
import { TableEvaluaciones } from "../../utils/TableEvaluaciones"
import { Search } from "../../utils/Search"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { Back } from "../../utils/Back"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerEvaluacionesPorEvaluador, obtenerPreguntasPorEvaluación} from "../../api/evaluacionProyectos"
import { EvaluacionForm } from "../../components/EvaluacionProyectos/EvaluacionForm"

export const EvaluacionProyectos = () => {

    const user = JSON.parse(localStorage.getItem('user'))                                  
    const navigate = useNavigate()
    const [reload, setReload] = useState(false)    
    const [cargado, setCargado] = useState(false)                                     
    const [evaluacion, setEvaluacion] = useState(null)           
    const [evaluaciones, setEvaluaciones] = useState([])                                       
    const [data, setData] = useState([])                                                                                                         
    const [error, setError] = useState(false)                                                  
    //const columns = ['Código VI', 'Nombre', 'Descripción', 'Actividad', 'Estado', 'Acciones']
    const columns = ['id_evaluacion', 'detalle', 'id_version_proyecto_fk']
    const dataKeys = ['id_evaluacion', 'detalle', 'id_version_proyecto_fk']

    const evaluadorID = user.evaluador_fk.id_evaluador;

    user.groups[0] !== "evaluador" ? setError(true) : null                                          

    useEffect(() => {                                                                           
        async function fetchData() {
            loadEvaluaciones()
        }
        fetchData();
    }, [reload]);

    async function loadEvaluaciones() {
        try {
            const response = await obtenerEvaluacionesPorEvaluador(localStorage.getItem('token'), evaluadorID) 
            setData(response.data)                                                           
            setEvaluaciones(response.data)                                                               
            setCargado(true)                                                                       
        } catch (error) {
        }
    }

    // Al darle click a cancelar, se cierra el modal
    const onCancel = () => {
        //setAddClick(false)
        //document.body.classList.remove('modal-open');
    }

    // Al darle click a agregar, muestra el modal
    const addClicked = () => {
        //setAddClick(true)
        //document.body.classList.add('modal-open');

    }

    // Obtener atributo de un objeto 
    function getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }

    // Búsqueda filtrada
    const search = (col, filter) => {
        const matches = data.filter((e) => {
            if (col.includes('.')) {
                const value = getValueByPath(e, col)
                return value && value.toString().includes(filter)
            }
            return e[col].toString().includes(filter)
        })
        setEvaluaciones(matches)
    }

    console.log("data");
    console.log(data);
    console.log("evaluaciones");
    console.log(evaluaciones);

    return (
        <main>
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <div className=" flex-row">
                        <h1>Evaluaciones</h1>
                    </div>

                    {(!cargado) && (
                        <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                    )}             

                    <div className="d-flex justify-content-between mt-4">
                        <Search colNames={columns.slice(0, -1)} columns={dataKeys.slice(0, -1)} onSearch={search}></Search>
                    </div>
                    <TableEvaluaciones columns={columns} data={data} dataKeys={dataKeys}/>
                    <Toaster></Toaster>
                </div>
            ) : (
                <PermisoDenegado></PermisoDenegado>
            )}
        </main>
    );
}    

// 