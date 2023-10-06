import { useEffect, useState } from 'react';
import { login } from '../../../api/gestionUsuarios';
import { Toaster, toast } from 'react-hot-toast';

export const InicioSesion = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);                 // Estado para mostrar/ocultar la contraseña

  const resetForm = () => {
    setFormData({
      correo: '',
      password: '',
    });
  };

  // Restablecer el formulario cuando el componente se monta o cuando el usuario vuelve a la página de inicio de sesión
  useEffect(() => {
    resetForm();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(formData);

      // Si el inicio de sesión es exitoso, guarda el token en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirigir a la página principal o realizar otras acciones necesarias
      window.location.href = '/';
    } catch (error) {
      toast.error('Usuario o contraseña incorrectos', {
        duration: 4000,                                         // Duración en milisegundos (4 segundos en este caso)
        position: 'bottom-right',                               // Posición en la pantalla
        style: {
          background: '#670000',
          color: '#fff',
        },
      });
    }
  };

  return (
    <div className="bg-white shadow p-5 rounded position-absolute w-5" style={{ left: '37%', top: '30%', width: '450px' }}>
      <h1 className="fs-3">Iniciar Sesión</h1>
      <hr></hr>
      <form className="d-flex flex-column row-gap-3 mt-1" onSubmit={handleSubmit}>
        <>
          <label className="fw-bold">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            name="correo"
            value={formData.correo}
            onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
          />
        </>
        <>
          <label className="fw-bold">Contraseña</label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}           // Mostrar contraseña si showPassword es true
              className="form-control" name="password" value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button type="button" className="btn btn-link"
              onClick={() => setShowPassword(!showPassword)} // Cambiar el estado de showPassword al hacer clic
            >
              
              <img
                src={showPassword ? 'path-to-eye-closed.png' : 'path-to-eye-open.png'}
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
                />
            </button>
            <i class="bi bi-eye"></i>
          </div>
        </>
        <input id="boton-inicioSesion" type="submit" value="Iniciar Sesión" className="rounded mt-3 mb-t text-light shadow" />
      </form>
      <Toaster></Toaster>
    </div>
  );
};
