import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useIncidents } from '../hooks/useIncidents'
import IncidentCard from '../components/IncidentCard'
import Loader from '../components/Loader'
import { ESTADOS } from '../utils/constants'

function Dashboard() {
  const { user, profile, isAdmin } = useAuth()
  const { incidentes, loading } = useIncidents(
    isAdmin ? { all: true } : { userId: user?.uid }
  )

  const stats = {
    total:      incidentes.length,
    reportado:  incidentes.filter(i => i.estado === 'reportado').length,
    enProceso:  incidentes.filter(i => i.estado === 'en_proceso').length,
    resuelto:   incidentes.filter(i => i.estado === 'resuelto').length,
  }

  const recientes = incidentes.slice(0, 6)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="bg-gradient-to-r from-udla-500 to-udla-600 rounded-2xl p-6 md:p-8 text-white mb-6">
        <p className="text-white/80 text-sm font-medium">
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 className="text-white text-2xl md:text-3xl mt-1">
          ¡Hola, {profile?.nombre?.split(' ')[0] || 'Usuario'}!
        </h1>
        <p className="text-white/90 mt-2">
          {isAdmin
            ? 'Panel general de incidentes de la institución.'
            : 'Consulta tus reportes o crea uno nuevo.'}
        </p>
        <div className="mt-5 flex gap-3 flex-wrap">
          <Link to="/nuevo" className="bg-white text-udla-700 hover:bg-udla-50 font-semibold px-5 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            Reportar incidente
          </Link>
          <Link to="/incidentes" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-5 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors">
            Ver todos
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard label="Total" value={stats.total} color="udla" icon="📊" />
        <StatCard label="Reportados" value={stats.reportado} color="amber" icon="🔔" />
        <StatCard label="En proceso" value={stats.enProceso} color="blue" icon="🔧" />
        <StatCard label="Resueltos" value={stats.resuelto} color="green" icon="✅" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2>{isAdmin ? 'Incidentes recientes' : 'Mis reportes recientes'}</h2>
        <Link to="/incidentes" className="text-sm text-udla-600 hover:text-udla-700 font-semibold">
          Ver todos →
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : recientes.length === 0 ? (
        <EmptyState isAdmin={isAdmin} />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {recientes.map(inc => <IncidentCard key={inc.id} incidente={inc} />)}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  const colors = {
    udla:  'border-udla-200 bg-udla-50',
    amber: 'border-amber-200 bg-amber-50',
    blue:  'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
  }
  return (
    <div className={`rounded-xl border ${colors[color]} p-4`}>
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xs text-gray-600 font-medium">{label}</p>
      <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )
}

function EmptyState({ isAdmin }) {
  return (
    <div className="card text-center py-12">
      <div className="text-5xl mb-3">📭</div>
      <h3 className="mb-2">
        {isAdmin ? 'No hay incidentes reportados aún' : 'Aún no has reportado incidentes'}
      </h3>
      <p className="text-gray-500 mb-5 text-sm">
        {isAdmin
          ? 'Cuando los usuarios reporten, aparecerán aquí.'
          : 'Reporta el primer incidente que encuentres en las instalaciones.'}
      </p>
      {!isAdmin && (
        <Link to="/nuevo" className="btn-primary">Reportar incidente</Link>
      )}
    </div>
  )
}

export default Dashboard
