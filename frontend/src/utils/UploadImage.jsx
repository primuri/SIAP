import React, { useState } from 'react';

const UploadImage = ({ mode, handleFileChange, formData, icono2 }) => {
  const [selectedFileName, setSelectedFileName] = useState('');

  const noFileSelected = !formData.foto;

  const updateSelectedFileName = (event) => {
    const fileName = event.target.files[0].name;
    setSelectedFileName(fileName);
    handleFileChange(event); 
  };

  return (
    <div className="row">
      {(mode === 1 || (mode === 2 && noFileSelected)) && (
        <>
          <label className="label-personalizado mt-4" htmlFor="foto">
            {mode === 1 ? (
              <>
                Agregar foto
                <br />
                <input type="file" className="form-control justify-content-center align-items-center" name="foto" id="foto" onChange={updateSelectedFileName} style={{ display: 'none' }} />
                {selectedFileName ? (
                  <span>Nombre del archivo: {selectedFileName}</span>
                ) : (
                  <img src={icono2} alt="Seleccionar archivo" style={{ width: '50px', height: '50px', marginLeft: '100px'}} />
                )}
              </>
            ) : (
              "Cambiar foto"
            )}
          </label>
        </>
      )}
      {mode === 2 && (
        <div>
          <label className="label-personalizado mb-2" htmlFor="foto">
            {noFileSelected ? (
              <>
                <input type="file" className="form-control justify-content-center align-items-center" name="foto" id="foto" onChange={updateSelectedFileName} style={{ display: 'none' }} />
                {selectedFileName ? (
                  <span>Nombre del archivo: {selectedFileName}</span>
                ) : (
                  <img src={icono2} alt="Seleccionar archivo" style={{ width: '50px', height: '50px', marginLeft: '100px'}} />
                )}
              </>
            ) : (
              <>
                Cambiar foto
                <br />
                <img src={formData.foto} alt="" maxWidth={180} maxHeight={100} className="container rounded-circle" />
                <br />
                {!selectedFileName && (
                  <input type="file" className="form-control" name="foto" id="foto" onChange={updateSelectedFileName} style={{ display: 'none' }} />
                )}
                {selectedFileName && (
                  <span>Nombre del nuevo archivo: {selectedFileName}</span>
                )}
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
