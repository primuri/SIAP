import { columnsVI, datakeysVI} from "./utils"
import { useEffect, useState }  from "react"
import { VersionInformeForm }   from "../../components/GestionInformes/VersionInformeForm"
import { toast, Toaster }       from 'react-hot-toast'
import { Search }               from "../../utils/Search"
import { Modal }                from "../../utils/Modal"
import { Table }                from "../../utils/Table"
import { Add }                  from "../../utils/Add"
import * as API                 from "../../api/gestionInformes"

export const GestionVersionInforme = (informeID) => {                                // Versiones de un infome   
    const [versionesInformeData, setVersionesInformeData] = useState([])             // Datos completos
    const [versionesInformeList, setVersionesInformeList] = useState([])             // Datos filtrados
    const [versionInforme, setVersionInforme]             = useState(null)           // Version actual
    const [loaded, setLoaded]                             = useState(false)          // Data cargada
    const [reload, setReload]                             = useState(false)          // Para recargar tabla
    const [addClicked, setAddClicked]                     = useState(false)          // Para evento de agregar
    const [editClicked, setEditClicked]                   = useState(false)          // Para evento de editar
    
    useEffect(() => { loadVersionesInformeData() }, [reload])                        // Carga los datos tras detectar cambios
    
    async function loadVersionesInformeData() {
        try{
            var response = await API.obtenerVersionesInforme(informeID)
            setVersionesInformeData(response.data)
            setVersionesInformeList(response.data)
            setLoaded(true)
        } catch (error){
            mostrarError(error)
        }
    }

    async function addVersionInforme (formData) {
        try{
            const data = JSON.parse(formData)

            let responseOficio = await API.agregarOficio(data.id_informe_fk)
            data.id_informe_fk = responseOficio.data.id_informe

            let responseDocumento = await API.agregarDocumentoInforme(data.id_documento_informe_fk)
            data.id_documento_informe_fk = responseDocumento.data.id_documento_informe

            await API.agregarVersionInforme(data)

            setAddClicked(false)
            setReload(!reload)
            mostrarExito("Versión proyecto agregado correctamente")
        }catch(error){
            mostrarError(error)
        }
    }

    async function editVersionInforme(formData) {
        try{
            const data = JSON.parse(formData)

            let responseOficio = await API.editarOficio(data.id_informe_fk)
            data.id_informe_fk = responseOficio.data.id_informe

            data.id_evaluacion_cc_fk = (data.id_evaluacion_cc_fk.id_evaluacion_cc ? data.id_evaluacion_cc_fk.id_evaluacion_cc : null)

            let responseDocumento = await API.editarDocumentoInforme(data.id_documento_informe_fk)
            data.id_documento_informe_fk = responseDocumento.data.id_documento_informe

            await API.editarVersionInforme(data)
            
            setEditClicked(false)
            setReload(!reload)
            mostrarExito("Versión proyecto editado correctamente")
        }catch(error){
            mostrarError(error)
        }
    }

    async function deleteVersionInforme(id_version_informe) {
        try{
            await API.eliminarVersionInforme(id_version_informe)
            setEditClicked(false)
            setReload(!reload)
            mostrarExito("Versión proyecto borrado correctamente")
        }catch(error){
            mostrarError(error)
        }
    }

    function filtrarVersionesInfome (col, filter) {
        setVersionesInformeList(filtrar(col, filter, versionesInformeData))
    }

    function addClicked () {
        setAddClicked(true)
        setEditClicked(false)
    }

    function elementClicked (element) {
        setEdit(true)
        setAddClick(false)
        setVersionInforme(element)
    }

    function onCancel () {
        setAddClicked(false)
        setEditClicked(false)
    }

    return (
        <main>
            <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                <div className="d-flex flex-row">
                    <h1>Versiones de informe</h1>{(!loaded) && (<div class="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}
                </div>
                <div className="d-flex justify-content-between mt-4">
                    <Add onClick={addClicked}></Add>
                    <Search colNames={columnsVI} columns={dataKeysVI} onSearch={filtrarVersionesInfome}></Search>
                </div>
                <Table columns={columnsVI} data={versionesInformeList} dataKeys={dataKeysVI} onClick={elementClicked}></Table>
                {addClicked || editClicked && (
                    <Modal>
                        <VersionInformeForm
                            mode={editClicked ? 2 : 1}
                            onSubmit={editClicked ? editVersionInforme : addVersionInforme}
                            onCancel={onCancel}
                            onDelete={editClicked ? () => deleteVersionInforme(versionInforme.id_version_informe) : undefined}
                            versionInforme={editClicked ? evaluador : null}
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
