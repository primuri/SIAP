export const Footer = () => {
  return (
    <footer style={{color: "var(--gris-claro-ucr)"}} className="bg-dark vw-100 d-flex justify-content-between align-items-center bottom-0 shadow">
      <div className="d-none d-lg-block ms-5">
          <b>Dirección</b>
          <p>Costa Rica, San José, Montes de Oca, Ciudad de la Investigación, 100m N del Colegio Monterrey</p>
          <p>CIMPA</p>
      </div>
      <div className="d-none d-lg-block column-gap-20px me-5">
          <b>Contacto</b>
          <p>(506) 2511-3419 / 2511-6606</p>
          <p>cimpa@ucr.ac.cr</p>
        </div>
    </footer>

  );
};
