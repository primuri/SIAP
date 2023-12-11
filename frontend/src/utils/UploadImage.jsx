import React from 'react';

const UploadImage = ({ mode, handleFileChange, formData, icono2 }) => {
  return (
    <div className="justify-content-center align-items-center">
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
      <input type="file" className="form-control" name="foto" id="foto" onChange={handleFileChange} style={{ display: 'none' }} />
      {mode === 2 && (
        <div className="justify-content-center align-items-center" style={{ margin: 'auto' }}>
          <label htmlFor="foto" style={{ cursor: 'pointer' }}>
            <img src={formData.foto} alt="" maxWidth={180} maxHeight={100} className="container rounded-circle" />
          </label>
        </div>
      )}
    </div>
  );
};

export default UploadImage;