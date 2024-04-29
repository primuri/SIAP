import React, { useEffect, useState } from 'react';
import inicio from '../../assets/inicio.jpg';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export const InicioAdministrador = ({ usuario }) => {

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
                 Cada administrador puede gestionar varios <b>módulos</b> a través de una barra de navegación ubicada a la izquierda. Estos módulos incluyen la <b>gestión</b> de usuarios, propuestas, proyectos, investigadores, evaluadores y proveedores. Cada módulo presenta tablas de datos específicas que permiten <b>visualizar, agregar, editar y eliminar</b> registros relacionados con ese módulo en particular.
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
                                    ¿Cómo se agrega un nuevo registro?
                                </button>
                              </h2>
                              <div id="collapseOne" className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                Haga click en el botón "Agregar" ubicado en la esquina superior izquierda. Esto abrirá un formulario para ingresar la información necesaria. Complete el formulario proporcionando la información solicitada. Una vez que haya ingresado todos los detalles, haga clic en el botón "Agregar" dentro del formulario para guardar el nuevo registro. En caso de ya no querer agregarlo, dele click a la "x" en la esquina superior derecha.
                                </div>
                              </div>
                      </div>

                      <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                  ¿Cómo se edita un registro?
                              </button>
                            </h2>
                            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                               Haga clic en el registro que desea, esto abrirá un formulario con los datos del registros. Haga las modificaciones necesarias y de click en el botón "Guardar" ubicado en la parte inferior del formulario. En caso de ya no querer guardarlo, dele click a la "x" en la esquina superior derecha.
                              </div>
                            </div>
                      </div>

                      <div className="accordion-item">
                            <h2 className="accordion-header" id="headingThree">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                  ¿Cómo se elimina un registro?
                              </button>
                            </h2>
                            <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                               Haga clic en el registro que desea, esto abrirá un formulario. De click en el botón "Eliminar" ubicado en la parte inferior del formulario. En caso de ya no querer eliminarlo, dele click a la "x" en la esquina superior derecha.
                              </div>
                            </div>
                    </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingFour">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                  ¿Cómo se agrega un proyecto?
                              </button>
                            </h2>
                            <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour" data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                              Para que un proyecto adquiera existencia formal, es necesario que previamente exista una propuesta correspondiente. La transición de una propuesta a proyecto se materializa únicamente mediante la aprobación de dicha propuesta. Por lo tanto, para agregar un nuevo proyecto, el proceso implica dirigirse a la sección de "Propuestas de Proyectos", donde la aprobación de la propuesta es el paso clave. Una vez aprobada, la propuesta se transformará en un proyecto, visible y gestionable en la sección designada para "Proyectos". Este flujo asegura un proceso estructurado y controlado en la evolución de las ideas propuestas hacia la ejecución efectiva de proyectos.
                              </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingFive">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                                  ¿Por qué no se puede editar o borrar un proyecto?
                              </button>
                            </h2>
                            <div id="collapseFive" className="accordion-collapse collapse" aria-labelledby="headingFive" data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                              Cada proyecto tiene una o varias versiones. Es por esto que si se desea editar, debe de ser directamente en una de las versiones y no en un proyecto en general como tal. Por otro lado, por seguridad, estos datos no pueden ser eliminados ya que es informacion sensible. 
                              </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingSix">
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                                  ¿Por qué no se puede agregar más de un presupuesto?
                              </button>
                            </h2>
                            <div id="collapseSix" className="accordion-collapse collapse" aria-labelledby="headingSix" data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                              Un proyecto tiene únicamente un presupuesto, no se deben ingresar varios. En caso de desear modificarlo, se puede hacer.
                              </div>
                            </div>
                        </div>

                        <div className="accordion-item">
                            <h2 className="accordion-header" id="headingSeven">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
                                ¿Cómo saber cuando un dato es opcional?
                            </button>
                            </h2>
                            <div id="collapseSeven" className="accordion-collapse collapse" aria-labelledby="headingSeven" data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                              En cada formulario, ya sea para agregar o editar un registro, si hay algún dato que no es requerido se detalla explícitamente que es opcional al lado de su nombre. 
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
