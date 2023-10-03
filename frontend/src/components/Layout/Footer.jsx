export const Footer = () => {
  const usuario = JSON.parse(localStorage.getItem('user'));
  if(usuario === null){
    return(<></>);
  }else{
    return (
      <footer style={{color: "var(--gris-claro-ucr)", width: "100%"}} className="d-flex justify-content-between align-items-start shadow">
        <div className="d-none d-lg-block ms-5">
            <p>
            <b>Dirección</b>
            <br/> <br/>
            Costa Rica, San José, Montes de Oca, Ciudad de la Investigación, 100m N del <br/> Colegio Monterrey
            <br/> <br/>
            CIMPA
            </p>
        </div>
        <div className="d-none d-lg-block column-gap-20px me-5">
            <p>
            <b>Contacto</b>
            <br/> <br/>
            (506) 2511-3419 / 2511-6606
            <br/>
            cimpa@ucr.ac.cr
            </p>
          </div>
      </footer>
  
    );
  }
};
