import { columnsVI, dataKeyVI} from "./utils"
import { useEffect, useState }  from "react"
import { VersionInformeForm }   from "../../components/GestionInformes/VersionInformeForm"
import { toast, Toaster }       from 'react-hot-toast'
import { Search }               from "../../utils/Search"
import { Modal }                from "../../utils/Modal"
import { Table }                from "../../utils/Table"
import { Add }                  from "../../utils/Add"
import * as API                 from "../../api/gestionInformes"
import { GestionInformes } from "./GestionInformes"
import add from '../../assets/plus-i.png'

export const GestionVersionInforme = (informeID, returnToInformes) => {                                // Versiones de un infome   
    const [versionesInformeData, setVersionesInformeData] = useState([])             // Datos completos
    const [versionesInformeList, setVersionesInformeList] = useState([])             // Datos filtrados
    const [versionInforme, setVersionInforme]             = useState(null)           // Version actual
    const [loaded, setLoaded]                             = useState(false)          // Data cargada
    const [reload, setReload]                             = useState(false)          // Para recargar tabla
    const [addClicked, setAddClicked]                     = useState(false)          // Para evento de agregar
    const [editClicked, setEditClicked]                   = useState(false)          // Para evento de editar
    const [returnInformes, setReturnInformes] = useState(false); 
    
    useEffect(() => { loadVersionesInformeData() }, [reload])                        // Carga los datos tras detectar cambios
    
    async function loadVersionesInformeData() {
        try{
            var response = await API.obtenerVersionesInforme(informeID)
            
            setVersionesInformeData(formatearFecha(response))
            setVersionesInformeList(formatearFecha(response))

            setLoaded(true)
        } catch (error){
            mostrarError(error)
        }
    }

    async function addVersionInforme (formData) {
        try{
            const data = { ...formData}

            let responseOficio = await API.agregarOficio(data.id_oficio_fk)
            data.id_oficio_fk = responseOficio.data.id_oficio

            let responseDocumento = await API.agregarDocumentoInforme(data.id_documento_informe_fk)
            data.id_documento_informe_fk = responseDocumento.data.id_documento
            data.id_informe_fk = informeID.informeID

            await API.agregarVersionInforme(data)

            setAddClicked(false)
            setReload(!reload)
            mostrarExito("Versión informe agregada correctamente")
        } catch(error){
            mostrarError(error)
        }
    }

    async function editVersionInforme(dataForm) {
        try{
            var data = { ...dataForm}
            if (typeof data.id_oficio_fk.ruta_archivo === 'object') {
                var responseOficio = await API.editarOficioAndDocumento(data.id_oficio_fk.id_oficio, data.id_oficio_fk);
            } else {
                delete data.id_oficio_fk.ruta_archivo
                var responseOficio = await API.editarOficio(data.id_oficio_fk.id_oficio, data.id_oficio_fk);
            }
            
            data.id_oficio_fk = responseOficio.data.id_oficio;
            
            if (typeof data.id_documento_informe_fk.documento === 'object') {
                var responseDocumento = await API.editarDocumentoInformeAndDocumento(data.id_documento_informe_fk.id_documento, data.id_documento_informe_fk);
            } else {
                delete data.id_documento_informe_fk.documento
                var responseDocumento = await API.editarDocumentoInforme(data.id_documento_informe_fk.id_documento, data.id_documento_informe_fk);
            }
            
            data.id_documento_informe_fk = responseDocumento.data.id_documento;

            data.id_evaluacion_cc_fk = (data.id_evaluacion_cc_fk.id_evaluacion_cc ? data.id_evaluacion_cc_fk.id_evaluacion_cc : null)
            data.id_informe_fk = informeID.informeID
            await API.editarVersionInforme(versionInforme.id_version_informe, data)
            
            setEditClicked(false)
            setReload(!reload)
            mostrarExito("Versión informe editada correctamente")
            console.log(versionInforme)
        }catch(error){
            mostrarError(error)
        }
    }

    async function deleteVersionInforme(id_version_informe) {
        try{
            await API.eliminarVersionInforme(id_version_informe)
            setEditClicked(false)
            setReload(!reload)
            mostrarExito("Versión informe borrada correctamente")
        }catch(error){
            mostrarError(error)
        }
    }

    function filtrarVersionesInfome (col, filter) {
        setVersionesInformeList(filtrar(col, filter, versionesInformeData))
    }

    function addBtnClicked () {
        setAddClicked(true)
        setEditClicked(false)
    }

    function elementClicked (element) {
        setEditClicked(true)
        setAddClicked(false)
        setVersionInforme(element)
    }

    function onCancel () {
        setAddClicked(false)
        setEditClicked(false)
    }

    function volverInformes() {
        setReturnInformes(true);
    }

    if(returnInformes === true) {
        return <GestionInformes/>;
    }

    return (
        <main>
            <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                <div className="d-flex flex-row">
                    <h1>Versiones del informe {informeID.informeID} </h1>{(!loaded) && (<div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}
                </div>
                <div className="d-flex justify-content-between mt-4">
                    <Add onClick={addBtnClicked}></Add>
                    <Search colNames={columnsVI} columns={dataKeyVI} onSearch={filtrarVersionesInfome}></Search>
                </div>
                <Table columns={columnsVI} data={versionesInformeList} dataKeys={dataKeyVI} onClick={elementClicked}></Table>
                <div>
                    <button id="acciones-button" className="btn btn-primary" onClick={volverInformes}>
                        <span className='icono'><img width={"20px"} src={add}/></span>
                        Regresar a Informes
                    </button>
                </div>
                {(addClicked || editClicked) && (
                    <Modal>
                        <VersionInformeForm
                            mode={editClicked ? 2 : 1}
                            onSubmit={editClicked ? editVersionInforme : addVersionInforme}
                            onCancel={onCancel}
                            onDelete={editClicked ? () => deleteVersionInforme(versionInforme.id_version_informe) : undefined}
                            versionInforme={editClicked ? versionInforme : null}
                        />
                    </Modal>
                )}
                <Toaster></Toaster>
            </div>
        </main>
    );
}

function mostrarError (error) {
    toast.error(`Error: ${error.response.data}`, {
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: '#670000',
          color: '#fff',
        },
      })
}

function mostrarExito (mensaje) {
    toast.success(mensaje, {
        duration: 4000,
        position: 'bottom-right',
        style: {
          background: 'var(--celeste-ucr)',
          color: '#fff',
        },
      })
}

function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

function filtrar(col, filter, data) {
    return data.filter((element) => {
        const value = col.includes('.') ? getValueByPath(element, col) : element[col];
        return value && value.toString().includes(filter);
      })
}

function formatearFecha(response) {
    return response.data.map((obj) => {
      const fechaISO = obj.fecha_presentacion;
      const dateObj = new Date(fechaISO);
      const fechaFormateada = dateObj.toISOString().split('T')[0];
      
      return { ...obj, fecha_presentacion: fechaFormateada };
    });
  }
  