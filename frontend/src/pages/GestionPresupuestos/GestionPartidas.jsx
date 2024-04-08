import { columnsPartidas, dataKeyPartidas} from "./utils"
import { useEffect, useState }  from "react"
import { PartidaForm }   from "../../components/GestionPresupuestos/PartidaForm"
import { toast, Toaster }       from 'react-hot-toast'
import { Search }               from "../../utils/Search"
import { Modal }                from "../../utils/Modal"
import { Back }                 from "../../utils/Back"
import { Table }                from "../../utils/Table"
import { Add }                  from "../../utils/Add"
import * as API                 from "../../api/gestionPresupuestos"
import { useLocation, useNavigate, useParams } from "react-router-dom"

export const GestionPartidas = () => {   
    let {versionPresupuestoID, presupuestoID} = useParams()      
    const navigate = useNavigate()
    const location = useLocation()                      // Versiones de un infome   
    const [PartidaData, setPartidaData] = useState([])             // Datos completos
    const [PartidaList, setPartidaList] = useState([])             // Datos filtrados
    const [Partida, setPartida]             = useState(null)           // Version actual
    const [loaded, setLoaded]                             = useState(false)          // Data cargada
    const [reload, setReload]                             = useState(false)          // Para recargar tabla
    const [addClicked, setAddClicked]                     = useState(false)          // Para evento de agregar
    const [editClicked, setEditClicked]                   = useState(false)          // Para evento de editar

    useEffect(() => { loadPartidaData() }, [reload])                        // Carga los datos tras detectar cambios

    async function loadPartidaData() {
        try{
            var response = await API.obtenerPartidas(localStorage.getItem('token'))
            console.log(response.data)
            let filteredResponse = response.data.filter(element => element.id_version_presupuesto_fk.id_version_presupuesto == versionPresupuestoID);
            console.log("load",filteredResponse)
            setPartidaData(filteredResponse)
            setPartidaList(filteredResponse)

            setLoaded(true)
        } catch (error){
            console.log(error)
        }
    }

    async function addPartida(formData) {
        try{
            console.log('entra a addversion')
            await API.agregarPartidas(formData, localStorage.getItem('token'))
            setAddClicked(false)
            setReload(!reload)
            mostrarExito("Partida agregada correctamente")
        } catch(error){
            console.log(error)
        }
    }

    async function editPartida(dataForm) {
        try{
            await API.editarPartidas(Partida.id_partida, localStorage.getItem('token'), dataForm)
            setEditClicked(false)
            setReload(!reload)
            mostrarExito("Partida editada correctamente")
            console.log(Partida)
        }catch(error){
        }
    }

    async function deletePartida(id_partida) {
        try{
            await API.eliminarPartidas(id_partida, localStorage.getItem('token'))
            setEditClicked(false)
            setReload(!reload)
            mostrarExito("Partida borrada correctamente")
        }catch(error){
        }
    }

    function filtrarVersionesInfome (col, filter) {
        setPartidaList(filtrar(col, filter, PartidaData))
    }

    function addBtnClicked () {
        setAddClicked(true)
        setEditClicked(false)
    }


    const elementClicked = (selectedPartida) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            setPartida(selectedPartida);
            navigate(`${location.pathname}${selectedPartida.id_partida}/gestion-gastos/`)
        } else {
            setPartida(selectedPartida)
            setEditClicked(true)
            setAddClicked(false)
        }
    };

    function onCancel () {
        setAddClicked(false)
        setEditClicked(false)
    }

    function volverVersiones() {
        const pathParts = location.pathname.split('/').filter(part => part !== '');
        const newPathParts = pathParts.slice(0, -2);
        const newPath = `/${newPathParts.join('/')}`;
        navigate(newPath);
    }

    // if(returnPresupuestos === true) {
    //     return <GestionPresupuestos/>;
    // }

    // else if (Partida && showAcciones === true) {
    //     return <GestionAcciones versionID={Partida.id_version_Presupuesto} PresupuestoID={PresupuestoID}/>;
    // }

    return (
        <main>
            <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                <div className="d-flex flex-row">
                    <h1>Partida de la versión del presupuesto {presupuestoID} </h1>{(!loaded) && (<div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>)}
                </div>
                <div className="d-flex justify-content-between mt-4">
                    <Add onClick={addBtnClicked}></Add>
                    <Search colNames={columnsPartidas} columns={dataKeyPartidas} onSearch={filtrarVersionesInfome}></Search>
                </div>
                <Table columns={columnsPartidas} data={PartidaList} dataKeys={dataKeyPartidas} onDoubleClick ={elementClicked} hasButtonColumn={true} buttonText="Gestionar"></Table>
                <div>
                    <Back onClick={volverVersiones}>Regresar a Versiones</Back>
                </div>
                {(addClicked || editClicked) && (
                    <Modal>
                        <PartidaForm
                            mode={editClicked ? 2 : 1}
                            onSubmit={editClicked ? editPartida : addPartida}
                            onCancel={onCancel}
                            onDelete={editClicked ? () => deletePartida(Partida.id_partida) : undefined}
                            version={editClicked ? Partida : null}
                            id_version={versionPresupuestoID}
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

function formatearFecha(response) {
    return response?.map((obj) => {
      const fechaISO = obj.fecha_presentacion;
      const dateObj = new Date(fechaISO);
      const fechaFormateada = dateObj.toISOString().split('T')[0];
      
      return { ...obj, fecha_presentacion: fechaFormateada };
    });
}
  