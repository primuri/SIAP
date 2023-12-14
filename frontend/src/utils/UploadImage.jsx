import React from 'react';

const UploadImage = ({ mode, handleFileChange, formData, icono2 }) => {
  const noFileSelected = !formData.foto;

  return (
    <div className="row">
      {(mode === 1 || (mode === 2 && noFileSelected)) && (
        <>
          <label className="label-personalizado mb-2" htmlFor="foto">
            {mode === 1 ? (
              <>
                Subir foto
                <br />
                <img src={icono2} alt="Seleccionar archivo" style={{ width: '50px', height: '50px', marginRight: '5px' }} />
              </>
            ) : (
              "Cambiar foto"
            )}
          </label>
          <input type="file" className="form-control justify-content-center align-items-center" name="foto" id="foto" onChange={handleFileChange} style={{ display: 'none' }} />
        </>
      )}
      {mode === 2 && (
        <div>
          <label className="label-personalizado mb-2" htmlFor="foto">
            {noFileSelected ? (
              <>
                <img src={icono2} alt="Seleccionar archivo" style={{ width: '50px', height: '50px', marginRight: '5px' }} />
              </>
            ) : (
              <>
                Cambiar foto
                <br />
                <img src={formData.foto} alt="" maxWidth={180} maxHeight={100} className="container rounded-circle" />
              </>
            )}
          </label>
          <br />
          <input type="file" className="form-control" name="foto" id="foto" onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
      )}
    </div>
  );
};

export default UploadImage;