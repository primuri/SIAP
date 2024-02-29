import React, { useState } from 'react';

const UploadDoc = ({ mode, handleFileChange, formData, icono2 }) => {
  const [selectedFileName, setSelectedFileName] = useState('');

  const updateSelectedFileName = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFileName(file.name);
    }

    handleFileChange(event); // Invoca la función original después de actualizar el nombre del archivo
  };

  return (
    <div className="justify-content-center align-items-center">
      {(mode === 1 || (mode === 2 && !formData.documento)) && (
        <>
          <label htmlFor="documento_asociado.documento" className="label-personalizado mb-2">
            {mode === 1 ? (
              <>
                Documento
                <br />
                <label htmlFor="documento" style={{ cursor: 'pointer' }}>
                  <input type="file" className="form-control" name="documento" id="documento" onChange={updateSelectedFileName} style={{ display: 'none' }} />
                  {selectedFileName ? (
                    <span>Nombre del archivo: {selectedFileName}</span>
                  ) : (
                    <img src={icono2} alt="Seleccionar archivo" style={{ width: '50px', height: '50px', marginRight: '5px' }} />
                  )}
                </label>
              </>
            ) : ""}
          </label>
        </>
      )}
      {mode === 2 && (
        <>
          <label htmlFor="documento_asociado.documento" className="label-personalizado mb-2">
            Documento adjunto
            <br />
          </label>
          {formData.documento && (
            <>
              <a href={formData.documento} target="_blank" rel="noopener noreferrer" className="link-info link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover mt-2">
                {formData.documento.split('/').pop()}
              </a>
              {!selectedFileName && (
                <>
                  <br />
                  <input type="file" className="form-control" name="documento" id="documento" onChange={updateSelectedFileName} style={{ display: 'none' }} />
                </>
              )}
              {selectedFileName && (
                <span>Nombre del archivo: {selectedFileName}</span>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UploadDoc;
