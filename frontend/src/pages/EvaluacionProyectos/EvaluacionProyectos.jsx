import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
    const [evaluarClick, setEvaluarClick] = useState(false)                    
    const columns = ['Código VI', 'Nombre', 'Descripción', 'Actividad', 'Estado evaluación', 'Acciones']
    const dataKeys = ['id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi', 'id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre', 'id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.descripcion', 'id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.actividad', 'estado', '']

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
            const response = await obtenerEvaluacionesPorEvaluador(localStorage.getItem('token'), evaluadorID);
            const responseData = Array.isArray(response.data) ? response.data : [response.data];
            setData(responseData);
            setEvaluaciones(responseData);
            setCargado(true);
        } catch (error) {
            console.error("Error al cargar evaluaciones:", error);
        }
    }

    const elementClicked = (selectedEvaluacion) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            setEvaluacion(selectedEvaluacion);
            setEvaluarClick(true)
            console.log(evaluacion)
        } else {
        }
    };

    // Al darle click a cancelar, se cierra el modal
    const onCancel = () => {
        setEvaluarClick(false)
        document.body.classList.remove('modal-open');
    }

    const sendAnswers = async (/*formData*/) => {
        try {

            /*const Data = JSON.parse(formData)

            Data.id_version_proyecto_fk = proyectoID;
            await agregarInforme(Data, localStorage.getItem("token"))

            toast.success('Informe agregado correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })*/
            setEvaluarClick(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');

        } catch (error) {
        }
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

    return (
        <main>
          {!error ? (
            <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                <div className="row">
                    <div className="col">
                        <h1>Evaluaciones</h1>
                    </div>
                    <div className="col-10">
                    {!cargado && (
                        <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                    )}      
                    </div>      
                </div>     
                <div className="d-flex justify-content-between mt-4">
                    <div className="row w-100">
                        <div className="col">                
                        </div>
                        <div className="col-auto">
                        <Search colNames={columns.slice(0, -1)} columns={dataKeys.slice(0, -1)} onSearch={search}></Search>
                    </div>
                </div>
            </div>
      
            <TableEvaluaciones columns={columns} data={evaluaciones} dataKeys={dataKeys} onClick ={elementClicked}/>
            {evaluarClick && (
                    <Modal><EvaluacionForm onCancel={onCancel} onSubmit={sendAnswers} evaluacion={evaluacion} mode={1}></EvaluacionForm></Modal>
            )}
            <Toaster></Toaster>
            </div>
          ) : (
            <PermisoDenegado></PermisoDenegado>
          )}
        </main>
      );
}    