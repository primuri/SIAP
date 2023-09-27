import { useEffect, useState } from 'react';
import {login} from '../../../api/gestionUsuarios'
export const InicioSesion = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
    });
  };
  
  // Restablecer el formulario cuando el componente se monta o cuando el usuario vuelve a la página de inicio de sesión
  useEffect(() => {
    resetForm();
  }, []);

  const validatePassword = (password) => {
    // Realiza la validación de la contraseña aquí
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&.*])[A-Za-z\d!@#$%^&.*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar la contraseña antes de enviarla
    if (!validatePassword(formData.password)) {
      setError('La contraseña debe contener al menos una mayúscula, un número y un caracter especial, y tener al menos 8 caracteres.');
      return;
    }
    setError('');
    try {
        const response = await login(formData)
  
        // Si el inicio de sesión es exitoso, guardar el token en localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        // Redirigir a la página principal o realizar otras acciones necesarias
        window.location.href = '/'
      } catch (error) {
        setError('Usuario o contraseña incorrectos');
      }
  };

  return (
    <div className="bg-light p-5 rounded position-absolute w-25" style={{ left: '37%', top: '30%' }}>
      <h1 className="fs-3">Iniciar Sesión</h1>
      <hr></hr>
      <form className="d-flex flex-column row-gap-3 mt-1" onSubmit={handleSubmit}>
        <>
          <label className="fw-bold">Correo Electrónico</label>
          <input
            type="email"
            className="border-0 rounded p-1"
            name="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </>
        <>
          <label className="fw-bold">Contraseña</label>
          <input
            type="password"
            className="border-0 rounded p-1"
            name="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </>
        <input type="submit" value="Iniciar Sesión" className="border-0 rounded mt-4 p-3 text-light shadow" />
      </form>
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
};
