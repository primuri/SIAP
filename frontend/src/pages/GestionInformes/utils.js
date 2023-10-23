export const columnsVI = ['Versión', 'Fecha', 'Detalle evaluación','Documento oficio', 'Documento informe']
export const dataKeyVI = ['numero_version', 'fecha_presentacion', 'id_evaluacion_cc_fk.detalle', 'id_oficio_fk.ruta_archivo', 'id_documento_informe_fk.documento']
export const VIFields = (versionInforme) => {
    return {
        numero_version: versionInforme ? versionInforme.numero_version : "",
        fecha_presentacion: versionInforme ? versionInforme.fecha_presentacion: "",
        id_evaluacion_cc_fk: versionInforme ? versionInforme.id_evaluacion_cc_fk : null,
        id_oficio_fk: versionInforme ? {...versionInforme.id_oficio_fk} : {ruta_archivo: "", detalle: ""},
        id_documento_informe_fk: versionInforme ? {...versionInforme.id_documento_informe_fk} : {tipo: "Informe", detalle: "", documento: ""}
    }
}

// Notas desarrollo: La evaluación solo se puede visualizar 
