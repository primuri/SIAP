import '../../App.css'

export const Footer = () => {
  const usuario = JSON.parse(localStorage.getItem('user'));
  if(usuario === null){
    return(<></>);
  }else{
    return (
<footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <p> Costa Rica, San José, Montes de Oca, Ciudad de la Investigación, 100m norte del Colegio Monterrey </p>
          <p> (+506) 2511-3419 / 2511-6606 </p>
          <p> cimpa@ucr.ac.cr </p>
        </div>
      </div>
    </footer>
    );
  }
};
