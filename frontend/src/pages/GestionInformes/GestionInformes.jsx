import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { Back } from "../../utils/Back"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerInforme, agregarInforme, editarInforme, eliminarInforme, buscarVersionProyecto, obtenerInformesProyecto, obtenerInformePorId } from "../../api/gestionInformes"
import { InformesForm } from "../../components/GestionInformes/InformesForm"
import { GestionVersionInforme } from "./GestionVersionInforme"
import { obtenerVersionProyectos } from '../../api/gestionProyectos';

export const GestionInformes = () => {

    const { proyectoID } = useParams();

    // Estados                                                                   // Son objetos que contienen información para un componente y puede cambiar
    const user = JSON.parse(localStorage.getItem('user'))                        // Se recupera el usuario local del navegador, el que está usando el sistema
    const location = useLocation()
    const navigate = useNavigate()
    const [reload, setReload] = useState(false)                                  // Para controlar cuándo se debe de recargar la página
    const [informes, setInformes] = useState([])                                 // Estado para almacenar todos los informes
    const [cargado, setCargado] = useState(false)                                // Para controlar si los informes se cargaron o no  
    //const [showVersions, setShowVersions] = useState(false);
    const [data, setData] = useState([])                                         // Todos los informes.                          
    const [informe, setInforme] = useState(null)                                 // Informe al que se le da click en la tabla.
    const [addClick, setAddClick] = useState(false)                              // Cuando se da click en agregar
    const [edit, setEdit] = useState(false)                                      // Cuando se da click en editar
    const [error, setError] = useState(false)
    const [numVersion, setNumVersion] = useState(null)
    const [id_proyecto, setIdProyecto] = useState(null)                          // Cuando hay un error
    const columns = ['Identificador', 'Estado', 'Tipo', 'Versiones', 'Acciones']
    const dataKeys = ['id_informe', 'estado', 'tipo', 'Versiones']

    user.groups[0] !== "administrador" ? setError(true) : null                   // Si no es administrador, pone el error en true

    useEffect(() => {                                                            // Cuando reload cambia, se llama a load()
        async function fetchData() {
            loadInformes()
            setCargado(true);
            const id_version_proyecto = await loadInformeById(proyectoID);

            setIdProyecto(id_version_proyecto[2]);
            setNumVersion(id_version_proyecto[1]);
        }
        fetchData();
    }, [reload]);

    async function loadInformes() {
        try {
            const response = await obtenerInformesProyecto(localStorage.getItem('token'), proyectoID) // Se envía el token y se obtienen todos los informes
            setData(response.data)                                                                    // Se guardan en data todos los informes
            setInformes(response.data)                                                                // Se guardan todos los informes
            setCargado(true)                                                                          // Como se cargaron, se pone cargado en true
        } catch (error) {
        
        }
    }

    // Manejo de datos que se van a enviar para agregar
    const addInforme = async (formData) => {
        try {

            const Data = JSON.parse(formData)

            Data.id_version_proyecto_fk = proyectoID;
            await agregarInforme(Data, localStorage.getItem("token"))

            toast.success('Informe agregado correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setAddClick(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');

        } catch (error) {
        }
    }


    // Manejo de los datos del formulario de editar 
    const editInforme = async (formData) => {
        try {
            const Data = JSON.parse(formData)
            Data.id_version_proyecto_fk = proyectoID;

            await editarInforme(informe.id_informe, Data, localStorage.getItem("token"))
            toast.success('Informe editado correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setEdit(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');
        } catch (error) {
            
        }
    }

    // Manejo del eliminar
    const deleteInforme = async (informe) => {
        try {
            await eliminarInforme(informe.id_informe, localStorage.getItem('token'))

            toast.success('Informe eliminado correctamente', {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    background: 'var(--celeste-ucr)',
                    color: '#fff',
                },
            })
            setEdit(false)
            setReload(!reload)
            document.body.classList.remove('modal-open');
        } catch (error) {
            
        }
        setEdit(false)
    }


    // Al darle click a cancelar, se cierra el modal
    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
        document.body.classList.remove('modal-open');
    }

    // Al darle click a agregar, muestra el modal
    const addClicked = () => {
        setAddClick(true)
        setEdit(false)
        document.body.classList.add('modal-open');

    }

    // Al hacer click en la tabla
    const elementClicked = (selectedInforme) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            navigate(`${location.pathname}/${selectedInforme.id_informe}/gestion-versiones`)
        } else {
            setInforme(selectedInforme);
            setEdit(true);
            setAddClick(false);
            document.body.classList.add('modal-open');
        }
    };

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
        setInformes(matches)
    }


    const volver = () => {
        const pathParts = location.pathname.split('/').filter(part => part !== '');
        const newPathParts = pathParts.slice(0, -2);
        const newPath = `/${newPathParts.join('/')}`;
        navigate(newPath);
    }


    async function loadInformeById(informeId) {
        try {
            const versiones = await obtenerVersionProyectos(localStorage.getItem('token'));
            let idCodigoVi = null;
            let numVersion = null;
            let descripcion = null;

            for (let version of versiones.data) {
                if (version.id_version_proyecto == informeId) {
                    idCodigoVi = version.id_codigo_vi_fk.id_codigo_vi;
                    numVersion = version.numero_version;                 
                    descripcion = version.id_codigo_vi_fk.id_codigo_cimpa_fk.descripcion;                
                    break;
                }
            }

            if (idCodigoVi && numVersion && descripcion) {
                return [idCodigoVi, numVersion, descripcion];  // Devuelve las variables como un array
            } else {
                throw new Error('No se encontró una versión de proyecto que coincida con el informe');
            }

        } catch (error) {
        
            return null;
        }
    }

    // if (informe && showVersions === true) {
    //     return <GestionVersionInforme informeID={informe.id_informe} />;
    // }

    return (
        <main>
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <div className=" flex-row">
                        <h1>Gestión de informes de la versión {numVersion} de: </h1>
                        <br></br>
                        <h3>{id_proyecto}</h3>
                    </div>

                    {(!cargado) && (
                        <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                    )}             

                    <div className="d-flex justify-content-between mt-4">
                        <Add onClick={addClicked}></Add>
                        <Search colNames={columns.slice(0, -1)} columns={dataKeys.slice(0, -1)} onSearch={search}></Search>
                    </div>
                    <Table columns={columns} data={informes} dataKeys={dataKeys} onDoubleClick ={elementClicked} hasButtonColumn={true} buttonText="Gestionar" />
                    {/* <div>
                        <Back onClick={handleVolverClick}>Regresar a versiones proyecto</Back>
                    </div> */}
                    {addClick && (
                        <Modal><InformesForm onSubmit={addInforme} onCancel={onCancel} mode={1}></InformesForm></Modal>
                    )}
                    {edit && (
                        <Modal>
                            <InformesForm
                                mode={2}
                                onSubmit={editInforme}
                                onCancel={onCancel}
                                onDelete={() => deleteInforme(informe)}
                                informe={informe}
                            >
                            </InformesForm>
                        </Modal>
                    )}
                    <Toaster></Toaster>
                    <div className="d-flex justify-content-start">
                        <Back onClick={volver}>Regresar</Back>
                    </div>
                </div>
            ) : (
                <PermisoDenegado></PermisoDenegado>
            )}
        </main>
    );
    
}    
