import { useEffect, useState } from "react"
import { Add } from "../../utils/Add"
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
import { Search } from "../../utils/Search"
import { PermisoDenegado } from "../../utils/PermisoDenegado"
import { toast, Toaster } from 'react-hot-toast'
import { agregarAccion, editarAccion, eliminarAccion, obtenerAccionesVersion, editarDocumentoAccionAndDocumento, editarDocumentoAccion, agregarDocumentoAccion } from "../../api/gestionInformes"
import { AccionesForm } from "../../components/GestionInformes/AccionesForm"
import { GestionVersionInforme } from "./GestionVersionInforme"
import add from '../../assets/plus-i.png'

export const GestionAcciones = (versionID) => {

    // Estados                                                                  
    const user = JSON.parse(localStorage.getItem('user'))                        
    const [reload, setReload] = useState(false)                                
    const [acciones, setAcciones] = useState([])                            
    const [cargado, setCargado] = useState(false)                               
    const [data, setData] = useState([])                                                                
    const [accion, setAccion] = useState(null)                                 
    const [addClick, setAddClick] = useState(false)                          
    const [edit, setEdit] = useState(false)                                    
    const [error, setError] = useState(false)       
    const [returnVersionInformes, setReturnVersionInformes] = useState(false);                              
    const columns = ['Identificador', 'Fecha','Origen', 'Destino', 'Estado', 'Documento']
    const dataKeys = ['id_accion', 'fecha','origen', 'destino', 'estado', 'id_documento_accion_fk.documento']

    user.groups[0] !== "administrador" ? setError(true) : null                  
                                  
    useEffect(() => {                                                            
        async function fetchData() {
            loadAcciones()
            setCargado(true);
        }

        fetchData();
    }, [reload]);

    async function loadAcciones() {
        try {
            const response = await obtenerAccionesVersion(localStorage.getItem('token'), versionID.versionID)
            setData(response.data)                                                                    
            setAcciones(formatearFecha(response))                                                              
            setCargado(true)                                                                        
        } catch (error) {
            toast.error('Error al cargar los datos de acciones', {
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
    const addAccion = async (formData) => {       
        try {

            var responseDocumento = await agregarDocumentoAccion(formData.id_documento_accion_fk)
            formData.id_documento_accion_fk = responseDocumento.data.id_documento;
            formData.id_version_informe_fk = versionID.versionID;
            await agregarAccion(formData, localStorage.getItem("token"))

            toast.success('Acción agregada correctamente', {
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
            toast.error('Error al agregar la acción', {
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
   const editAccion = async (formData) => {       
        try {          
            formData.id_version_informe_fk = versionID.versionID;

            if(typeof formData.id_documento_accion_fk.documento === 'object') {
                var responseDocumento = await editarDocumentoAccionAndDocumento(formData.id_documento_accion_fk.id_documento, formData.id_documento_accion_fk)
            } else {
                delete formData.id_documento_accion_fk.documento
                var responseDocumento = await editarDocumentoAccion(formData.id_documento_accion_fk.id_documento, formData.id_documento_accion_fk)
            }
            
            formData.id_documento_accion_fk = responseDocumento.data.id_documento;
            await editarAccion(accion.id_accion, formData, localStorage.getItem("token"))
            toast.success('Acción editada correctamente', {
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
            toast.error('Error al editar la acción', {
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
    const deleteAccion = async (accion) => {
        try {
            await eliminarAccion(accion.id_accion, localStorage.getItem('token'))
            
            toast.success('Acción eliminada correctamente', {
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
            toast.error('Error al eliminar la acción', {
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
    const elementClicked = (selectedAccion) => {
          setAccion(selectedAccion);
          setEdit(true);
          setAddClick(false);
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
        setAcciones(matches)
    }

    function formatearFecha(response) {
        return response.data.map((obj) => {
          const fechaISO = obj.fecha;
          const dateObj = new Date(fechaISO);
          const fechaFormateada = dateObj.toISOString().split('T')[0];
          
          return { ...obj, fecha: fechaFormateada };
        });
      }

    function volverVersionInformes() {
        setReturnVersionInformes(true);
    }

    if(returnVersionInformes === true) {
        return <GestionVersionInforme informeID={versionID.informeID.informeID}/>;
    }

    return (
        <main>
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <div className="d-flex flex-row">
                        <h1>Acciones de la versión {versionID.versionID} del informe {versionID.informeID.informeID} </h1>
                        {(!cargado) && (
                            <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                        )}
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                        <Add onClick={addClicked}></Add>
                        <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
                    </div>
                    <Table columns={columns} data={acciones} dataKeys={dataKeys} onClick={elementClicked}/>
                    <div>
                        <button id="acciones-button" className="btn btn-primary" onClick={volverVersionInformes}>
                            <span className='icono'><img width={"20px"} src={add}/></span>
                            Regresar a versión de informe
                        </button>
                    </div>
                    {addClick && (
                        <Modal><AccionesForm onSubmit={addAccion} onCancel={onCancel} mode={1}></AccionesForm></Modal>
                    )}
                    {edit && (
                        <Modal>
                            <AccionesForm
                                mode={2}
                                onSubmit={editAccion}
                                onCancel={onCancel}
                                onDelete={() => deleteAccion(accion)}
                                accion={accion}
                            >
                            </AccionesForm>
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
