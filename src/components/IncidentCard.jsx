import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { getTipoLabel } from '../utils/constants'
import { formatDateShort } from '../utils/helpers'

function IncidentCard({ incidente }) {
  return (
    <Link
      to={`/incidentes/${incidente.id}`}
      className="card card-hover flex gap-4 group"
    >
      <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
        <img
          src={incidente.imagenURL}
          alt={incidente.tipo}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-udla-700">
              {getTipoLabel(incidente.tipo)}
            </p>
            {incidente.grupoId && (
              <span className="badge bg-purple-100 text-purple-700 border border-purple-200">
                Agrupado
              </span>
            )}
          </div>
          <p className="text-gray-800 line-clamp-2 text-sm">
            {incidente.descripcion}
          </p>
          <p className="text-xs text-gray-500 mt-1 truncate">
            📍 {incidente.ubicacionTexto}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
          <StatusBadge estado={incidente.estado} />
          <span className="text-xs text-gray-500">
            {formatDateShort(incidente.fechaCreacion)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default IncidentCard
