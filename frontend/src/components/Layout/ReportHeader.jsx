import logo from '../../assets/logo.png';


export const ReportHeader = ({ nombreReporte }) => {
  return (
    <div className="bg-light w-100 d-flex align-items-center shadow " style={{ height: "80px" }}>
      <img src={logo} className='logo mx-auto' alt='Logo a página principal' />
      <h5 className='mx-auto'>Reporte {nombreReporte}</h5>
    </div>
  );
};
