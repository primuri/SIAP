export const columnsVI = ['Versión', 'Fecha', 'Detalle evaluación','Documento oficio', 'Documento informe']
export const dataKeyVI = ['numero_version', 'fecha_presentacion', 'id_evaluacion_cc.detalle', 'id_oficio_fk.documento', 'id_documento_fk.documento']
export const VIFields = (versionInforme) => {
    return {
        numero_version: versionInforme ? versionInforme.numero_version : "",
        fecha_presentacion: versionInforme ? versionInforme.fecha_presentacion: "",
        id_evaluacion_fk: versionInforme ? versionInforme.id_evaluacion_fk : null,
        id_oficio_fk: versionInforme ? versionInforme.id_oficio_fk : {documento: "", detalle: ""},
        id_documento_informe_fk: versionInforme ? versionInforme.id_documento_informe_fk : {tipo: "", detalle: "", documento: ""}
    }
}

// Notas desarrollo: La evaluación solo se puede visualizar 