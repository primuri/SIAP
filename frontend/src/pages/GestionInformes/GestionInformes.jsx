import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { toast, Toaster } from 'react-hot-toast'
import { obtenerInforme, agregarInforme, editarInforme, eliminarInforme, buscarVersionProyecto, obtenerInformesProyecto } from "../../api/gestionInformes"
import { InformesForm } from "../../components/GestionInformes/InformesForm"
import { GestionVersionInforme } from "./GestionVersionInforme"

export const GestionInformes = (/* proyectoID */) => {

    var proyectoID = 1;

    // Estados                                                                   // Son objetos que contienen información para un componente y puede cambiar
    const user = JSON.parse(localStorage.getItem('user'))                        // Se recupera el usuario local del navegador, el que está usando el sistema
    const [reload, setReload] = useState(false)                                  // Para controlar cuándo se debe de recargar la página
    const [informes, setInformes] = useState([])                                 // Estado para almacenar todos los informes
    const [cargado, setCargado] = useState(false)                                // Para controlar si los informes se cargaron o no  
    const [showVersions, setShowVersions] = useState(false); 
    const [data, setData] = useState([])                                         // Todos los informes.                          
    const [informe, setInforme] = useState(null)                                 // Informe al que se le da click en la tabla.
    const [addClick, setAddClick] = useState(false)                              // Cuando se da click en agregar
    const [edit, setEdit] = useState(false)                                      // Cuando se da click en editar
    const [error, setError] = useState(false)                                    // Cuando hay un error
    const columns = ['Identificador', 'Estado','Tipo', 'Acciones']
    const dataKeys = ['id_informe', 'estado','tipo', 'Acciones']

    user.groups[0] !== "administrador" ? setError(true) : null                   // Si no es administrador, pone el error en true
                                  
    useEffect(() => {                                                            // Cuando reload cambia, se llama a load()
        async function fetchData() {
            loadInformes()
            setCargado(true);
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
            toast.error('Error al cargar los datos de informes', {
                duration: 4000,
                position: 'bottom-right', 
                style: {
                  background: '#670000',
                  color: '#fff',
                },
              })
        }
    }

    // Manejo de datos que se van a enviar para agregar
    const addInforme = async (formData) => {       
        try {

            const Data = JSON.parse(formData)

            /*
                // Buscar si esa version de proyecto existe
                let response_VersionProyecto = await buscarVersionProyecto(localStorage.getItem("token"), Data.id_version_proyecto);

                // Crea una variable para almacenar solo el id de la version que ya se verifico existe.
                var id_Version = {}

                // Si la respuesta es diferente de undefined, almacena el id de la version que se obtuvo
                if(response_VersionProyecto !== undefined) {
                    id_Version = response_VersionProyecto.Data.id_version_proyecto;
                } else {
                }
                
                response_VersionProyecto = id_Version;
                delete Data.id_version_proyecto;
                Data.id_version_proyecto = response_VersionProyecto;

                formData.append('json', JSON.stringify(Data))
            */
            await agregarInforme(formData, localStorage.getItem("token"))

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
        } catch (error) {
            toast.error('Error al agregar el informe', {
                duration: 4000, 
                position: 'bottom-right',
                style: {
                  background: '#670000',
                  color: '#fff',
                },
              })
        }
    }

   // Manejo de los datos del formulario de editar 
   const editInforme = async (formData) => {       
        try {          
            await editarInforme(informe.id_informe, formData, localStorage.getItem("token"))
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
        } catch (error) {
            toast.error('Error al editar el informe', {
                duration: 4000, 
                position: 'bottom-right',
                style: {
                background: '#670000',
                color: '#fff',
                },
            })
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
        } catch (error) {
            toast.error('Error al eliminar el informe', {
                duration: 4000, 
                position: 'bottom-right',
                style: {
                background: '#670000',
                color: '#fff',
                },
            })
        }
        setEdit(false)
    }


    // Al darle click a cancelar, se cierra el modal
    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
    }

    // Al darle click a agregar, muestra el modal
    const addClicked = () => {
        setAddClick(true)
        setEdit(false)
    }

    // Al hacer click en la tabla
    const elementClicked = (selectedInforme) => {
        if (event.target.tagName.toLowerCase() === 'button') {
            setShowVersions(true);
            setInforme(selectedInforme);
        } else {
          setInforme(selectedInforme);
          setEdit(true);
          setAddClick(false);
        }
    };
      
    // Devolverse de version de informe a informe
    const returnToInformes = () => {
        console.log("Return to informes")
        setShowVersions(false);
        setInforme(null);
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


    if (informe && showVersions === true) {
        return <GestionVersionInforme informeID={informe.id_informe} returnToInformes={returnToInformes}/>;
    }

    else {
        return (
            <main>
                {!error ? (
                    <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                        <div className="d-flex flex-row">
                            <h1>Informes del proyecto {proyectoID}</h1>
                            {(!cargado) && (
                                <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                            )}
                        </div>
                        <div className="d-flex justify-content-between mt-4">
                            <Add onClick={addClicked}></Add>
                            <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
                        </div>
                        <Table columns={columns} data={informes} dataKeys={dataKeys} onClick={elementClicked} hasButtonColumn={true} buttonText="Visualizar versiones" />
    
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
                    </div>
                ) : (
                    <PermisoDenegado></PermisoDenegado>
                )}
            </main>
        );
    }
}    
