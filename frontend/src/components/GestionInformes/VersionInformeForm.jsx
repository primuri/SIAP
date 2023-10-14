import { useEffect, useState } from "react";
import { FormModal } from "../../utils/FormModal";
import { PropTypes } from 'prop-types';
import { VIFields } from "../../pages/GestionInformes/utils";
import { icono } from '../../../assets/person-i.png'

export const VersionInformeForm = ({ onSubmit, onDelete, onCancel, mode, versionInforme }) => {
    const [showConfirmationEdit, setShowConfirmationEdit]     = useState(false)
    const [showConfirmationDelete, setShowConfirmationDelete] = useState(false)
    const [formData, setFormData]                             = useState(VIFields)

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name.includes('.')) {
            const keys = name.split('.');
            setFormData(prev => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value
                }
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const sendForm = (event) => {
        event.preventDefault();
        const jsonData = JSON.stringify(formData);
        onSubmit(jsonData);
    };

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
        <>
            <FormModal {...{ icono, mode, nombreForm: "version informe", onCancel, handleEditClick, handleDeleteClick, handleDeleteConfirm, handleEditCancel, handleDeleteCancel, showConfirmationDelete, showConfirmationEdit, sendForm }}>
                <div className="modal-body" style={{ padding: '3vh 4vw' }}>
                    <div className="container">

                    </div>
                </div>
            </FormModal>
        </>
    )
}