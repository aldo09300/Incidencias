import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl md:text-9xl font-bold text-udla-500">404</p>
        <h2 className="mt-4">Página no encontrada</h2>
        <p className="text-gray-600 mt-2 mb-6">
          La página que buscas no existe o fue removida.
        </p>
        <Link to="/dashboard" className="btn-primary">Volver al inicio</Link>
      </div>
    </div>
  )
}

export default NotFound
