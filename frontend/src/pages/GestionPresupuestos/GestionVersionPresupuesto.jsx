import { columnsVI, dataKeyVI} from "./utils"
import { useEffect, useState }  from "react"
import { VersionPresupuestoForm }   from "../../components/GestionPresupuestos/VersionPresupuestoForm"
import { toast, Toaster }       from 'react-hot-toast'
import { Search }               from "../../utils/Search"
import { Modal }                from "../../utils/Modal"
import { Back }                 from "../../utils/Back"
import { Table }                from "../../utils/Table"
import { Add }                  from "../../utils/Add"
import * as API                 from "../../api/gestionPresupuestos"
import { useLocation, useNavigate, useParams } from "react-router-dom"

export const GestionVersionPresupuesto = () => {   
    let {presupuestoID} = useParams()      
    const navigate = useNavigate()
    const location = useLocation()                  
    const [versionesPresupuestoData, setVersionesPresupuestoData] = useState([])            
    const [versionesPresupuestoList, setVersionesPresupuestoList] = useState([])             
    const [versionPresupuesto, setVersionPresupuesto]             = useState(null)          
    const [loaded, setLoaded]                             = useState(false)          
    const [reload, setReload]                             = useState(false)          
    const [addClicked, setAddClicked]                     = useState(false)         
    const [editClicked, setEditClicked]                   = useState(false)          

    useEffect(() => { loadVersionesPresupuestoData() }, [reload])                    

    async function loadVersionesPresupuestoData() {
        try{
            var response = await API.obtenerVersionesPresupuesto(localStorage.getItem('token'))
            let filteredResponse = response.data.filter(element => element.id_presupuesto_fk.id_presupuesto == presupuestoID);
            setVersionesPresupuestoData(filteredResponse)
            setVersionesPresupuestoList(filteredResponse)

            setLoaded(true)
        } catch (error){
            console.error(error)
        }
    }

    async function addVersionPresupuesto (formData) {
        try{
            await API.agregarVersionPresupuesto(formData, localStorage.getItem('token'))
            setAddClicked(false)
            setReload(!reload)
            mostrarExito("Versión Presupuesto agregada correctamente")
        } catch(error){
            console.error(error)
        }
    }

    async function editVersionPresupuesto(dataForm) {
        try{
            console.log(dataForm)
            await API.editarVersionesPresupuesto(versionPresupuesto.id_version_presupuesto, localStorage.getItem('token'), dataForm)
            setEditClicked(false)
            setReload(!reload)
            mostrarExito("Versión Presupuesto editada correctamente")
        }catch(error){
        }
    }

    async function deleteVersionPresupuesto(id_version_Presupuesto) {
        try{
            await API.eliminarVersionPresupuesto(id_version_Presupuesto, localStorage.getItem('token'))
            setEditClicked(false)
            setReload(!reload)
            mostrarExito("Versión Presupuesto borrada correctamente")
        }catch(error){
        }
    }

    function filtrarVersionesInfome (col, filter) {
        setVersionesPresupuestoList(filtrar(col, filter, versionesPresupuestoData))
    }

    function addBtnClicked () {
        setAddClicked(true)
        setEditClicked(false)
    }

    const elementClicked = (selectedVersionPresupuesto) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            setVersionPresupuesto(selectedVersionPresupuesto);
            navigate(`${location.pathname}/${selectedVersionPresupuesto.id_version_presupuesto}/gestion-partidas`)
            
        } else {
            setVersionPresupuesto(selectedVersionPresupuesto)
            setEditClicked(true)
            setAddClicked(false)
        }
    };

    function onCancel () {
        setAddClicked(false)
        setEditClicked(false)
    }

    function volverPresupuestos() {
        const pathParts = location.pathname.split('/').filter(part => part !== '');
        const newPathParts = pathParts.slice(0, -2);
        const newPath = `/${newPathParts.join('/')}`;
        navigate(newPath);
    }

    return (
        <main>
            <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                <div className="d-flex flex-row">
                    <h1>Versiones del presupuesto {presupuestoID} </h1>{(!loaded) && (<div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}
                </div>
                <div className="d-flex justify-content-between mt-4">
                    <Add onClick={addBtnClicked}></Add>
                    <Search colNames={columnsVI.slice(0, -1)} columns={dataKeyVI.slice(0, -1)} onSearch={filtrarVersionesInfome}></Search>
                </div>
                <Table columns={columnsVI} data={versionesPresupuestoList} dataKeys={dataKeyVI} onDoubleClick ={elementClicked} onClickButton2 ={elementClicked} hasButtonColumn={true} buttonText="Gestionar"></Table>
                <div>
                    <Back onClick={volverPresupuestos}>Regresar a presupuestos</Back>
                </div>
                {(addClicked || editClicked) && (
                    <Modal>
                        <VersionPresupuestoForm
                            mode={editClicked ? 2 : 1}
                            onSubmit={editClicked ? editVersionPresupuesto : addVersionPresupuesto}
                            onCancel={onCancel}
                            onDelete={editClicked ? () => deleteVersionPresupuesto(versionPresupuesto.id_version_presupuesto) : undefined}
                            version={editClicked ? versionPresupuesto : null}
                            id_presupuesto={presupuestoID}
                        />
                    </Modal>
                )}
                <Toaster></Toaster>
            </div>
        </main>
    );
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

