import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export const InicioInvestigador = ({ usuario }) => {

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
                 Cada investigador puede <b>visualizar</b> el módulo de Propuestas de Proyectos a través de la barra de navegación ubicada a la izquierda. Adicionalmente, también puede visualizar el módulo de Proyectos de Investigación y todo lo que compone cada uno de ellos: versiones, informes, presupuesto, asistentes, entre otros.</p>
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
                      <div className="accordion-item">
                              <h2 className="accordion-header" id="headingTwo">
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    ¿Por qué al darle click a un registro de la tabla de proyectos no se abre el cuadro con información?
                                </button>
                              </h2>
                              <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                Esta tabla de registros de proyectos no contiene información adicional que sea necesaria para su visualización. Para obtener más detalles, puede dirigirse al botón de versiones, donde podrá explorar cada registro de manera más detallada.
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
