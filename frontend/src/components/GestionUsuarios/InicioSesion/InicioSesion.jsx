import { useEffect, useState } from 'react';
import {login} from '../../../api/gestionUsuarios'
import {Toaster, toast} from 'react-hot-toast'
export const InicioSesion = () => {
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });
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

    // Validar la contraseña antes de enviarla
    //if (!validatePassword(formData.password)) {
    //  setError('La contraseña debe contener al menos una mayúscula, un número y un caracter especial, y tener al menos 8 caracteres.');
    //  return;
    //}
    try {
        const response = await login(formData)
  
        // Si el inicio de sesión es exitoso, guardar el token en localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        // Redirigir a la página principal o realizar otras acciones necesarias
        window.location.href = '/'
      } catch (error) {
        toast.error('Usuario o contraseña incorrectos', {
          duration: 4000, // Duración en milisegundos (4 segundos en este caso)
          position: 'bottom-right', // Posición en la pantalla
          style: {
            background: '#670000',
            color: '#fff',
          },
        });

      }
  };

  return (
    <div id="inicio-sesion" className="bg-white shadow p-5 rounded position-absolute w-5" style={{left: '37%', top: '30%'}}>
      <h1 className="fs-3">Iniciar Sesión</h1>
      <hr></hr>
      <form className="d-flex flex-column row-gap-3 mt-1" onSubmit={handleSubmit}>
        <>
          <label id="texto-iniciarSesion" className="fw-bold">Correo Electrónico</label>
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
          <input
            type="password"
            className="form-control"
            name="password"
          />
        </>
        <input id="boton-inicioSesion" type="submit" value="Iniciar Sesión" className="rounded mt-3 mb-t text-light shadow" />
      </form>
      <Toaster></Toaster>
    </div>
  );
};
