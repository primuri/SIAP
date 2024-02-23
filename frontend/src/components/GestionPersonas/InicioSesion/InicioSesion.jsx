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
      
      var user = JSON.parse(localStorage.getItem("user"));
      var tipoUsuario = user.groups[0]
      console.log(tipoUsuario)
      if(tipoUsuario === 'administrador') {
        window.location.href = '/inicio-administrador';
      }
      if(tipoUsuario === 'evaluador') {
        window.location.href = '/inicio-evaluador';
      }
      
      
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
            <button type="button" className="btn ojo"
              onClick={() => setShowPassword(!showPassword)} // Cambiar el estado de showPassword al hacer clic
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4AACE1" class="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg>
            </button>
          </div>
        </>
        <input id="boton-inicioSesion" type="submit" value="Iniciar Sesión" className="rounded mt-3 mb-t text-light shadow" />
      </form>
      <Toaster></Toaster>
    </div>
  );
};
