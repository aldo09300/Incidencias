import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'

function Landing() {
  const { user, loading } = useAuth()

  if (loading) return <Loader fullScreen />
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-udla-500 via-udla-600 to-udla-700">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="bg-udla-50 p-8 md:p-12 flex flex-col items-center justify-center text-center">
                <img
                  src="/logo-udla.png"
                  alt="Universidad de la Amazonia"
                  className="w-40 h-40 md:w-48 md:h-48 object-contain"
                />
                <p className="mt-4 text-udla-700 font-bold text-lg">Universidad de la Amazonia</p>
                <p className="text-udla-600 text-sm">Florencia — Caquetá, Colombia</p>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <span className="inline-block text-xs font-bold tracking-wider text-accent-500 uppercase mb-2">
                  Reporta · Gestiona · Resuelve
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  Sistema de Reporte de Incidentes
                </h1>
                <p className="mt-4 text-gray-600 leading-relaxed">
                  Reporta fugas, daños eléctricos, problemas de infraestructura y más,
                  desde tu celular o computador. Acompaña tu reporte con una fotografía
                  y la ubicación del incidente.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Link to="/login" className="btn-primary flex-1">
                    Iniciar sesión
                  </Link>
                  <Link to="/registro" className="btn-secondary flex-1">
                    Crear cuenta
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl mb-1">📸</div>
                    <p className="text-xs text-gray-600 font-medium">Foto del incidente</p>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">📍</div>
                    <p className="text-xs text-gray-600 font-medium">Ubicación GPS</p>
                  </div>
                  <div>
                    <div className="text-2xl mb-1">🔔</div>
                    <p className="text-xs text-gray-600 font-medium">Notificaciones</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-white/80 text-sm mt-6">
            Programación Web · Ingeniería de Sistemas · 2026-I
          </p>
        </div>
      </div>
    </div>
  )
}

export default Landing
