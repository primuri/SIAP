import { useEffect, useState } from "react"
import PropTypes from 'prop-types'
import { FormularioDinamico } from "../../utils/FomularioDinamico"
import { toast, Toaster } from 'react-hot-toast'
import icono from '../../assets/person-i.png';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Confirmar } from '../../utils/Confirmar'
import Tooltip from '@mui/material/Tooltip';
import { Modal } from "../../utils/Modal"
import { Table } from "../../utils/Table"
const filter = createFilterOptions();

export const IntegranteOrganoColegiadoForm = ({ onSubmit, mode, integrante, onCancel, onDelete }) => {
    const [showConfirmationEdit, setShowConfirmationEdit] = useState(false);
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false);
    const [oficioData, setOficioData] = useState(null);
    const [addClick, setAddClick] = useState(false) 
    const [edit, setEdit] = useState(false)

    const [formData, setFormData] = useState({
        integrante : {
            puesto: integrante ? integrante.puesto : "",
            normativa_reguladora: integrante ? integrante.normativa_reguladora : "",
            inicio_funciones: integrante ? integrante.inicio_funciones.split('T')[0] : "",
            nombre_integrante: integrante ? integrante.nombre_integrante : "",
        },
        id_organo_colegiado_fk: {
            id_organo_colegiado : integrante ? integrante.id_organo_colegiado_fk.id_organo_colegiado : "",
            nombre : integrante ? integrante.id_organo_colegiado_fk.nombre : "",
            numero_miembros : integrante ? integrante.id_organo_colegiado_fk.numero_miembros : "",
            quorum : integrante ? integrante.id_organo_colegiado_fk.quorum : "",
            acuerdo_firme : integrante ? integrante.id_organo_colegiado_fk.acuerdo_firme : "",
        },
        id_vigencia_fk: {
            id_vigencia : integrante ? integrante.id_vigencia_fk.id_vigencia : "",
            fecha_inicio : integrante ? integrante.id_vigencia_fk.fecha_inicio : "",
            fecha_fin : integrante ? integrante.id_vigencia_fk.fecha_fin : "",
        },
        id_oficio_fk: {
            id_oficio: integrante ? integrante.id_oficio_fk.id_oficio : "",
            ruta_archivo: integrante ? integrante.id_oficio_fk.ruta_archivo : "",
            detalle: integrante ? integrante.id_oficio_fk.detalle : "",
        },
    })

    const handleChange = (event) => {
        const { name, value } = event.target

        // Procesamiento general para otros campos, incluidas las fechas
        const keys = name.split('.');
        let updatedValue = value;
    
        // Si el campo modificado es de fecha, realiza la validación correspondiente
        if (keys.includes('fecha_inicio') || keys.includes('fecha_fin')) {
            const startDateKey = keys.slice(0, -1).join('.') + '.fecha_inicio';
            const endDateKey = keys.slice(0, -1).join('.') + '.fecha_fin';
            const startDate = keys[keys.length - 1] === 'fecha_inicio' ? new Date(value) : new Date(getValueByPath(formData, startDateKey));
            const endDate = keys[keys.length - 1] === 'fecha_fin' ? new Date(value) : new Date(getValueByPath(formData, endDateKey));
    
            if (startDate > endDate) {
                console.log("La fecha de inicio no puede ser posterior a la fecha de fin.");
                return; // Detiene la ejecución si la fecha de inicio es mayor que la de fin
            }
        }
    
        // Navegar por el objeto formData para encontrar y actualizar el valor correcto
        const updateFormData = (path, value, obj) => {
            const keys = path.split('.');
            const lastKey = keys.pop();
            const lastObj = keys.reduce((obj, key) => obj[key] = obj[key] || {}, obj);
            lastObj[lastKey] = value;
        };
    
        updateFormData(name, updatedValue, formData);
        setFormData({ ...formData });
    };

    const handleFileChange = (event) => {
        const oficio = event.target.files[0];
        setOficioData(oficio);
    }
    
    const sendForm = (event) => {
        event.preventDefault()
        const combinedData = new FormData();
        if (oficioData) {
            combinedData.append('ruta_archivo', oficioData);
        }
        combinedData.append('json', JSON.stringify(formData))
        onSubmit(combinedData)
    }

    const handleDeleteClick = () => {
        setShowConfirmationDelete(true);
    };

    const handleEditClick = () => {
        setShowConfirmationEdit(true);
    };

    const handleDeleteConfirm = () => {
        onDelete();
        setShowConfirmationDelete(false);
    };

    const handleDeleteCancel = () => {
        setShowConfirmationDelete(false);
    };

    const handleEditCancel = () => {
        setShowConfirmationEdit(false);
    };

    return (
        <div>
            <div className="modal-header pb-0 position-sticky top-0">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-1 mb-0 text-center">
                            <div className="img-space">
                                <img src={icono} alt="" width={'72px'} />
                            </div>
                        </div>
                        <div className="col-10 mb-0 text-center">
                            <h2 className="headerForm">
                                {mode === 1 ? "Agregar integrante" : "Editar integrante"}
                            </h2>
                        </div>
                        <div className="col-1 mb-0 text-center">
                            <button type="button" onClick={onCancel} className="close" data-dismiss="modal">
                                <span aria-hidden="true" className="close-icon">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={sendForm} className='d-flex flex-column position-relative justify-content-center' encType="multipart/form-data">
                <div className="modal-body justify-content-center" style={{ padding: '3vh 4vw' }}>
                    <div className="container ">

                        <div className="col">
                            <div className="form-group">
                                <label htmlFor="OrganoColegiadoNombre" className="label-personalizado mb-2">Órgano al que pertenece</label>
                                <input type="text" className="form-control disabled-input" name="id_organo_colegiado_fk.nombre" id="OrganoColegiadoNombre" value={formData.id_organo_colegiado_fk.nombre} required disabled />
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="nombreIntegrante" className="label-personalizado mb-2">Nombre integrante</label>
                                    <input type="text" className="form-control" name="nombre_integrante" id="nombreIntegrante" value={formData.nombre_integrante} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="inicioFunciones" className="label-personalizado mb-2">Inicio de funciones</label>
                                        <input type="date" className="form-control" name="inicio_funciones" id="inicioFunciones" value={formData.inicio_funciones} onChange={handleChange} required/>
                                    </div>
                            </div>
                        </div>
          
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="normativaReguladora" className="label-personalizado mb-2">Normativa reguladora</label>
                                    <input type="text" className="form-control" name="normativa_reguladora" id="normativaReguladora"  value={formData.normativa_reguladora} onChange={handleChange} required/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="puesto" className="label-personalizado mb-2">Puesto</label>
                                <input type="text" className="form-control" name="puesto" id="puesto" value={formData.puesto} onChange={handleChange} required />
                            </div>
                        </div>   

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="id_vigencia_fk.fecha_inicio" className="label-personalizado mb-2">Inicio de vigencia <span className="optional"> (Opcional)</span></label>
                                <input type="date" className="form-control" name="id_vigencia_fk.fecha_inicio"
                                    id="id_vigencia_fk.fecha_inicio"
                                    value={formData.id_vigencia_fk.fecha_inicio
                                        ? new Date(formData.id_vigencia_fk.fecha_inicio).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="id_vigencia_fk.fecha_fin" className="label-personalizado mb-2">Finalización de vigencia <span className="optional"> (Opcional)</span></label>
                                <input type="date" className="form-control"
                                    name="id_vigencia_fk.fecha_fin"
                                    id="id_vigencia_fk.fecha_fin"
                                    value={formData.id_vigencia_fk.fecha_fin
                                        ? new Date(formData.id_vigencia_fk.fecha_fin).toISOString().split('T')[0] : ""}
                                    onChange={handleChange} />
                            </div>
                        </div>

                        <div className="row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="id_oficio_fk.detalle" className="label-personalizado mb-2">Número de oficio  </label>
                                <input type="text" className="form-control" name="id_oficio_fk.detalle" id="id_oficio_fk.detalle" value={formData.id_oficio_fk.detalle} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="id_oficio_fk.ruta_archivo" className="label-personalizado mb-2">Oficio de nombramiento  </label>
                                <input type="file" className="form-control" name="id_oficio_fk.ruta_archivo" id="id_oficio_fk.ruta_archivo" onChange={handleFileChange}
                                    required={mode == 1 ? true : ''} />
                                {mode == 2 ? (
                                    <Tooltip title={formData.id_oficio_fk.ruta_archivo.split('/').pop()} placement="right-start">
                                        <a href={'http://localhost:8000' + formData.id_oficio_fk.ruta_archivo} target="blank_"
                                            className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                                            {"Ver Oficio"}
                                        </a>
                                    </Tooltip>

                                )
                                    : ""}
                            </div>
                        </div>             
                    </div>
                </div>
       
                <div className="modal-footer justify-content-center position-sticky bottom-0">
                    <div className="row">
                        <div className="col">
                            {mode === 1 ? (
                                <button id="boton-personalizado" type="submit" className='table-button border-0 p-20 rounded text-white'>Agregar</button>
                            ) : (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleEditClick} className='table-button border-0 p-2 rounded text-white'>Guardar</button>
                                    {showConfirmationEdit && (<Confirmar onConfirm={sendForm} onCancel={handleEditCancel} accion="editar" objeto="integrante" />)}
                                </>
                            )}
                        </div>
                        <div className="col">
                            {mode === 2 && (
                                <>
                                    <button id="boton-personalizado" type="button" onClick={handleDeleteClick} className="delete-button border-0 p-2 rounded text-white"> Eliminar </button>
                                    {showConfirmationDelete && (<Confirmar onConfirm={handleDeleteConfirm} onCancel={handleDeleteCancel} accion="eliminar" objeto="integrante" />)}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            <Toaster></Toaster>
        </div>
    )
}

IntegranteOrganoColegiadoForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onCancel: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    integrante: PropTypes.object,
}