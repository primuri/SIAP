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
import { Back } from "../../utils/Back"

import add from '../../assets/plus-i.png'
import { useNavigate, useParams } from "react-router-dom"

export const GestionAcciones = () => {
    let {versionID,informeID} = useParams() 
    const navigate = useNavigate()                                                              
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
    const columns = ['Identificador', 'Fecha', 'Origen', 'Destino', 'Estado', 'Documento']
    const dataKeys = ['id_accion', 'fecha', 'origen', 'destino', 'estado', 'id_documento_accion_fk.documento']

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
            const response = await obtenerAccionesVersion(localStorage.getItem('token'), versionID)
            setData(response.data)
            setAcciones(formatearFecha(response))
            setCargado(true)
        } catch (error) {

        }
    }

    const addAccion = async (formData) => {
        try {

            var responseDocumento = await agregarDocumentoAccion(formData.id_documento_accion_fk)
            formData.id_documento_accion_fk = responseDocumento.data.id_documento;
            formData.id_version_informe_fk = versionID;
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
            document.body.classList.remove('modal-open');
        } catch (error) {
        }
    }
 
    const editAccion = async (formData) => {
        try {
            formData.id_version_informe_fk = versionID;

            if (typeof formData.id_documento_accion_fk.documento === 'object') {
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
            document.body.classList.remove('modal-open');
        } catch (error) {
            
        }
    }

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
            document.body.classList.remove('modal-open');
        } catch (error) {
            
        }
        setEdit(false)
    }


    const onCancel = () => {
        setAddClick(false)
        setEdit(false)
        document.body.classList.remove('modal-open');
    }

    const addClicked = () => {
        setAddClick(true)
        setEdit(false)
        document.body.classList.add('modal-open');

    }

    const elementClicked = (selectedAccion) => {
        setAccion(selectedAccion);
        setEdit(true);
        setAddClick(false);
        document.body.classList.add('modal-open');

    };

    function getValueByPath(obj, path) {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    }

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
        const pathParts = location.pathname.split('/').filter(part => part !== '');
        const newPathParts = pathParts.slice(0, -2);
        const newPath = `/${newPathParts.join('/')}`;
        navigate(newPath);
    }

    return (
        <main>
            {!error ? (
                <div className="d-flex flex-column justify-content-center pt-5 ms-5 row-gap-3">
                    <div className="d-flex flex-row">
                        <h1>Acciones de la versión {versionID} del informe {informeID} </h1>
                        {(!cargado) && (
                            <div className="spinner-border text-info" style={{ marginTop: '1.2vh', marginLeft: '1.5vw' }} role="status"></div>
                        )}
                    </div>
                    <div className="d-flex justify-content-between mt-4">
                        <Add onClick={addClicked}></Add>
                        <Search colNames={columns} columns={dataKeys} onSearch={search}></Search>
                    </div>
                    <Table columns={columns} data={acciones} dataKeys={dataKeys} onDoubleClick ={elementClicked} />
                    <div>
                        <Back onClick={volverVersionInformes}>Regresar a versiones informe</Back>
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
