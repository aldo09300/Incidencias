import './Footer.css'

function Footer() {
  return (
    <footer className="footer-container no-print">
      <div className="footer-inner">
        <div className="footer-brand">
          <img
            src="/logo-udla.png"
            alt="UDLA"
            className="footer-logo"
          />
          <div>
            <p className="footer-title">
              Universidad de la Amazonia
            </p>
            <p className="footer-subtitle">
              Sistema de Reporte de Incidentes
            </p>
          </div>
        </div>
        <p className="footer-credits">
          © {new Date().getFullYear()} — Programación Web<br />
          Ingeniería de Sistemas
        </p>
      </div>
    </footer>
  )
}

export default Footer
