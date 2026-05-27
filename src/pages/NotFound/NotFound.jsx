import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <p className="notfound-code">404</p>
        <h2 className="notfound-title">Página no encontrada</h2>
        <p className="notfound-text">
          La página que buscas no existe o fue removida.
        </p>
        <Link to="/dashboard" className="btn-primary">Volver al inicio</Link>
      </div>
    </div>
  )
}

export default NotFound
