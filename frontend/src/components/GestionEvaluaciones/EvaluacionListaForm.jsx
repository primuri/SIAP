

export const EvaluacionListaForm = ({ onCancel, preguntas }) => {
    console.log(preguntas)
    return (
        <div>
            <div className="pb-0 position-sticky ml-2 mt-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="d-flex justify-content-end mb-0">
                            <button type="button" onClick={onCancel} className="close" data-dismiss="modal">
                                <span aria-hidden="true" className="close-icon">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {(preguntas.length === 6) ? (
                    <>
                        <h2 className="headerForm text-center mt-2 mb-2"> Evaluación del proyecto {preguntas[0].id_evaluacion_fk.id_version_proyecto_fk.id_codigo_vi_fk.id_codigo_cimpa_fk.nombre}</h2>
                        <form className='d-flex flex-column position-relative justify-content-center m-5 mt-4' encType="multipart/form-data">
                            <div className="form-group m-2">
                                <label>1. {preguntas[0].pregunta}</label>
                                <textarea className="form-control mt-2" rows="10" value={preguntas[0].respuesta} disabled={true}></textarea>
                            </div>
                            <div className="form-group m-2 mt-4">
                                <label>2. {preguntas[1].pregunta} </label>
                                <textarea className="form-control mt-2" rows="10" value={preguntas[1].respuesta} disabled={true}></textarea>
                            </div>
                            <div className="form-group m-2 mt-4">
                                <label >3. {preguntas[2].pregunta} </label>
                                <textarea className="form-control mt-2" rows="10" value={preguntas[2].respuesta} disabled={true}></textarea>
                            </div>
                            <div className="form-group m-2 mt-4">
                                <label>4. {preguntas[3].pregunta} </label>
                                <textarea className="form-control mt-2" rows="10" value={preguntas[3].respuesta} disabled={true}></textarea>
                            </div>
                            <div className="form-group m-2 mt-4">
                                <label>5. {preguntas[4].pregunta} </label>
                                <textarea className="form-control mt-2" rows="10" value={preguntas[4].respuesta} disabled={true}></textarea>
                            </div>
                            <div className="form-group m-2 mt-4">
                                <label>6. {preguntas[5].pregunta} </label>
                                <textarea className="form-control mt-2" rows="10" value={preguntas[5].respuesta} disabled={true}></textarea>
                            </div>
                        </form>

                    </>

                ) : (<div className="spinner-border text-info" style={{ marginBottom: '30vh', marginTop: '30vh', marginLeft: '50%', marginRight:'50%', width:'8vh', height:'8vh' }} role="status"></div>)}
            </div>


            <div className="modal-footer justify-content-center position-sticky bottom-0">

            </div>

        </div>
    )
}
