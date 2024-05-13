import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export const InicioInvitado = ({ usuario }) => {

  const usuarioObjeto = JSON.parse(usuario);
  const correo = usuarioObjeto.correo;

  function obtenerNombreDeUsuario(correo) {
    const partes = correo.split('@');

    if (partes.length >= 2) {
      const nombreDeUsuario = partes[0];
      const nombreFormateado = nombreDeUsuario
        .split('.')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return nombreFormateado;
    } else {
      return correo; 
    }
  }

  useEffect(() => {
    var acc = document.getElementsByClassName("accordion1");
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function () {
        this.classList.toggle("active");

        var panel = this.nextElementSibling;
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
            panel.style.display = "block";
        }
      });
    }
  }, []);

  return (
    <main>
      <div className="d-flex p-5 mt-5">
        <div className="col mt-4">
            <div className="row" id="descripcion-inicio">
              <div className="col-l" style={{ textAlign: 'justify' }}>
                <h1 className="mt-5 text-center">¡Bienvenido(a), {obtenerNombreDeUsuario(correo)}!</h1>
                <br/>
                <p className="fs-5 m-5 mt-0 mb-4">
                  El sistema <b>SIAP</b> es una solución para la Administración de Proyectos en el Centro de Investigación en Matemática Pura y Aplicada de la UCR.  Está diseñado para proporcionar una plataforma centralizada, organizada y segura para el manejo de cada proyecto.
                </p>
                <p className="fs-5 m-5 mt-0 mb-4">
                 Cada invitado puede <b>visualizar</b> el módulo de Órganos Colegiados a través de la barra de navegación ubicada a la izquierda. Además, también puede acceder a la información de cada órgano colegiado así como de los integrantes, las sesiones y los acuerdos de cada sesión.
                </p>
              </div>
            </div>

            <div className="row" id="accordion">
                <div className="col-6 m-5">   
                    <h4 className="pb-3">Preguntas frecuentes</h4>
                    <div className="accordion"> 

                      <div className="accordion-item">
                              <h2 className="accordion-header" id="headingOne">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                    ¿Cómo puede visualizar toda la información detallada de cada registro?
                                </button>
                              </h2>
                              <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    Haga doble click en la fila de la tabla que desea visualizar y esto le abrirá un cuadro con toda la información detallada.
                                </div>
                              </div>
                      </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </main>
  );
};
