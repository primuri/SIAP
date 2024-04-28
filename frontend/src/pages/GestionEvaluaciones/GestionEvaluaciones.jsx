import { useEffect, useState } from "react"
import {toast, Toaster} from 'react-hot-toast'
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { TableOneButtom} from "../../utils/TableOneButtom"
import { Search } from "../../utils/Search"
import { ReportButton } from "../../utils/ReportButton";
import { EvaluacionForm } from "../../components/GestionEvaluaciones/EvaluacionForm"
import { EvaluacionListaForm } from "../../components/GestionEvaluaciones/EvaluacionListaForm"
import * as API from "../../api/gestionEvaluaciones"

export const GestionEvaluaciones = () => {
    const [evaluacionesData, setEvaluacionesData] = useState([])
    const [evaluacionesList, setEvaluacionesList] = useState([])
    const [evaluacionActual, setEvaluacionActual] = useState(null)
    const [loaded, setLoaded]                     = useState(false)        
    const [reload, setReload]                     = useState(false)         
    const [addClicked, setAddClicked]             = useState(false)         
    const [editClicked, setEditClicked]           = useState(false)      
    const [btnClicked, setBtnClicked]             = useState(false)
    const [preguntas, setPreguntas]               = useState([])
    const columns = ['Código VI', 'Nombre proyecto', 'Versión proyecto', 'Evaluador', '', 'Estado', 'Formulario']
    const dataKeys = ['id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi',
                      'id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre',
                      'id_version_proyecto_fk.numero_version',
                      'id_evaluador_fk.id_nombre_completo_fk.nombre',
                      'id_evaluador_fk.id_nombre_completo_fk.apellido',
                      'estado', 
                      'Formulario']
    const [JsonIsReady, setJsonIsReady] = useState(false)
    const [JsonForReport, setJsonForReport] = useState({ reportData: {}, reportTitle: {}, colNames: {}, dataKeys: {}, idKey: {} })
    
    useEffect(() => {
        setJsonIsReady(false)
        createJsonForReport()
    }, [evaluacionesList])

    const configureReportData = () => {
        if (evaluacionesList.length > 0) {
            try {
                const evaluaciones = evaluacionesList.map((evaluacion) => evaluacion);
                JsonForReport.reportData = evaluaciones;
    
                return true;
    
            } catch (exception) {
                console.error("Ocurrió un error al crear el JSON para reporte: ", exception);
                return false;
            }
        }
    }

    const createJsonForReport = () => {
        JsonForReport.reportTitle = "Evaluación";
        JsonForReport.idKey = "id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi";
        JsonForReport.dataKeys = [
            'id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_vi',
            'id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre',
            'id_version_proyecto_fk.numero_version',
            'id_evaluador_fk.id_nombre_completo_fk.nombre',
            'id_evaluador_fk.id_nombre_completo_fk.apellido',
            'estado', 
            'Formulario'
        ];
        JsonForReport.colNames = [
            'Código VI', 
            'Nombre del proyecto', 
            'Versión del proyecto', 
            'Nombre evaluador asignado',
            'Apellido evaluador asignado',
            'Estado de la evaluación',

        ];
        setJsonIsReady(false)
        setJsonIsReady(configureReportData());
    };
    

    useEffect(() => {
        loadEvaluaciones()
    }, [reload])

    async function loadEvaluaciones(){
        try {
            var response = await API.obtenerEvaluaciones()
            setEvaluacionesData(response.data)
            setEvaluacionesList(response.data)
            setLoaded(true)
        } catch (error) {
            console.error("Error: \n" + error)
        }
    }

    async function addEvaluacion(formData){
        try {
            var toastId = toastProcesando("Agregando...")

            const data = {...formData}
            var responseDocumento = await API.agregarDocumento(data.id_documento_evaluacion_fk)
            data.id_documento_evaluacion_fk = responseDocumento.data.id_documento

            await API.agregarEvaluacion(data)

            toastExito("Evaluación agregada correctamente", toastId)
            setReload(!reload)
            setAddClicked(false)
        } catch (error) {
            console.error("Error: \n" + error)
            toast.dismiss(toastId)

        }
    }

    async function editEvaluacion(formData){
        try {
            var toastId = toastProcesando("Editando...")

            var data = {... formData}
            
            if(typeof data.id_documento_evaluacion_fk.documento === 'object'){
                var responseDocumento = await API.editarDocumento(data.id_documento_evaluacion_fk)
                data.id_documento_evaluacion_fk = responseDocumento.data.id_documento
            }else{
                delete data.id_documento_evaluacion_fk
            }

            await API.editarEvaluacion(data)

            toastExito("Evaluación editada correctamente", toastId)
            setReload(!reload)
            setEditClicked(!editClicked)
        } catch (error) {
            console.error("Error: \n" + error)
            toast.dismiss(toastId)
        }
    }

    async function deleteEvaluacion() {
        try{
            var toastId = toastProcesando("Editando...")
            var canDelete = await API.canDelete(evaluacionActual.id_evaluacion)
            if (!canDelete) {
                throw new Error("No se puede eliminar la evaluación ya que contiene respuestas de otros evaluadores.");
            }else{
                await API.eliminarEvaluacion(evaluacionActual.id_evaluacion)
            }

            toastExito("Evaluación eliminada correctamente", toastId)
            setReload(!reload)
            setEditClicked(false)
        }catch(error){
            console.error("Error: \n" + error)
            toast.dismiss(toastId)
        }
    }


    function filtrarEvaluaciones (col, filter) {
        setEvaluacionesList(filtrar(col, filter, evaluacionesData));
        setJsonIsReady(false)
    }
    
    function addBtnClicked() {
        setAddClicked(true)
        setEditClicked(false)
    }
    
    const elementClicked = (selectedEvaluacion) => {
        setEvaluacionActual(selectedEvaluacion)
        setEditClicked(true)
        setAddClicked(false)
    };

    const buttonClicked = async (evaluacion)=>{
        setBtnClicked(true)
        var response = await API.obtenerPreguntasEvaluacion(evaluacion.id_evaluacion)
        setPreguntas(response.data)
    }
    
    function onCancel() {
        setAddClicked(false)
        setEditClicked(false)
    }

    function onCloseFormulario() {
        setBtnClicked(false)
        setPreguntas([])
    }


    return (
        <main>
            <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                <div className="d-flex flex-row">
                    <h1>Gestión evaluaciones de versiones de proyectos</h1>{(!loaded) && (<div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}
                </div>
                <div className="d-flex mt-4">
                    <div className="col">
                        <Add onClick={addBtnClicked}></Add>
                    </div> 
                    {(JsonIsReady && (<ReportButton reportData={JsonForReport.reportData} reportTitle={JsonForReport.reportTitle} colNames={JsonForReport.colNames} dataKeys={JsonForReport.dataKeys} idKey={JsonForReport.idKey}></ReportButton>))}
                    <Search colNames={columns.slice(0, -1)} columns={dataKeys.slice(0, -1)} onSearch={filtrarEvaluaciones}></Search> 
                </div>
                <TableOneButtom columns={columns} data={evaluacionesList} dataKeys={dataKeys} onDoubleClick={elementClicked} onButtonClick={buttonClicked} hasButtonColumn={true} buttonText="Ver formulario"></TableOneButtom>
                {(addClicked || editClicked) && (
                    <Modal>
                        <EvaluacionForm
                            mode={editClicked ? 2 : 1}
                            onSubmit={editClicked ? editEvaluacion : addEvaluacion}
                            onCancel={onCancel}
                            onDelete={editClicked ? () => deleteEvaluacion(evaluacionActual.id_evaluacion_fk) : undefined}
                            evaluacion={editClicked ? evaluacionActual : null}
                        />
                    </Modal>
                )}
                {(btnClicked) && (
                    <Modal>
                        <EvaluacionListaForm
                            onCancel={onCloseFormulario}
                            preguntas={preguntas}
                        />
                    </Modal>
                )}
                <Toaster></Toaster>
            </div>
        </main>
    )
}

function toastProcesando(mensaje) {
    var toastId = toast.loading(mensaje, {
        position: 'bottom-right',
        style: {
            background: 'var(--celeste-ucr)',
            color: '#fff',
            fontSize: '18px',
        },
    });

    return toastId
}

function toastExito(mensaje, toastId) {
    toast.success(mensaje, {
        id: toastId,
        duration: 1000,
        position: 'bottom-right',
        style: {
            background: 'var(--celeste-ucr)',
          color: '#fff',
        },
      })
}

function filtrar(col, filter, data) {
    return data.filter((element) => {
        const value = col.includes('.') ? getValueByPath(element, col) : element[col];
        return value && value.toString().includes(filter);
      })
}

function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}