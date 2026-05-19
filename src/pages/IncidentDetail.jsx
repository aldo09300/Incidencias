import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'
import { useIncidents, cambiarEstado, eliminarIncidente, desagruparIncidente } from '../hooks/useIncidents'
import StatusBadge from '../components/StatusBadge'
import Loader from '../components/Loader'
import { ESTADOS_LIST, getTipoLabel } from '../utils/constants'
import { formatDate } from '../utils/helpers'

function IncidentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin } = useAuth()
  const { incidentes } = useIncidents({ all: true })

  const [incidente, setIncidente] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'incidentes', id))
        if (snap.exists()) setIncidente({ id: snap.id, ...snap.data() })
        else setIncidente(null)
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    load()
  }, [id])

  // mantener actualizado con la lista (que viene de onSnapshot)
  useEffect(() => {
    const found = incidentes.find(i => i.id === id)
    if (found) setIncidente(found)
  }, [incidentes, id])

  if (loading) return <Loader fullScreen />
  if (!incidente) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h2>Incidente no encontrado</h2>
        <Link to="/incidentes" className="btn-primary mt-4 inline-flex">Volver</Link>
      </div>
    )
  }

  const isOwner = incidente.usuarioId === user?.uid
  const puedeGestionar = isAdmin
  const puedeEliminar  = isAdmin || isOwner

  const grupoSize = incidente.grupoId
    ? incidentes.filter(i => i.grupoId === incidente.grupoId).length
    : 0

  const handleChangeEstado = async (nuevo) => {
    if (nuevo === incidente.estado) return
    setActionLoading(true)
    try {
      await cambiarEstado(incidente.id, nuevo, incidentes)
    } catch (e) { console.error(e); alert('Error al actualizar el estado') }
    setActionLoading(false)
  }

  const handleEliminar = async () => {
    if (!confirm('¿Eliminar este incidente? Esta acción no se puede deshacer.')) return
    setActionLoading(true)
    try {
      await eliminarIncidente(incidente)
      navigate('/incidentes')
    } catch (e) { console.error(e); alert('Error al eliminar'); setActionLoading(false) }
  }

  const handleDesagrupar = async () => {
    setActionLoading(true)
    try { await desagruparIncidente(incidente.id) }
    catch (e) { console.error(e); alert('Error') }
    setActionLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4">
        ← Volver
      </button>

      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-sm font-semibold text-udla-600">
              {getTipoLabel(incidente.tipo)}
            </p>
            <h2 className="mt-1">Reporte #{incidente.id.slice(0,8)}</h2>
          </div>
          <StatusBadge estado={incidente.estado} />
        </div>

        <div className="rounded-xl overflow-hidden bg-gray-100 mb-5">
          <img src={incidente.imagenURL} alt={incidente.tipo} className="w-full max-h-96 object-contain" />
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <InfoItem label="Reportado por" value={incidente.usuarioNombre} />
          <InfoItem label="Fecha de reporte" value={formatDate(incidente.fechaCreacion)} />
          <InfoItem label="Última actualización" value={formatDate(incidente.fechaActualizacion)} />
          <InfoItem label="Ubicación" value={incidente.ubicacionTexto} />
          {incidente.latitud && (
            <InfoItem
              label="Coordenadas GPS"
              value={
                <a
                  href={`https://www.google.com/maps?q=${incidente.latitud},${incidente.longitud}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-udla-600 hover:underline"
                >
                  {incidente.latitud.toFixed(5)}, {incidente.longitud.toFixed(5)} ↗
                </a>
              }
            />
          )}
          {incidente.grupoId && (
            <InfoItem
              label="Grupo"
              value={
                <span className="inline-flex items-center gap-2">
                  <span className="badge bg-purple-100 text-purple-700 border border-purple-200">
                    {grupoSize} incidentes agrupados
                  </span>
                </span>
              }
            />
          )}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="label-field">Descripción</p>
          <p className="text-gray-800 whitespace-pre-wrap">{incidente.descripcion}</p>
        </div>

        {puedeGestionar && (
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="label-field mb-3">Cambiar estado</p>
            <div className="flex flex-wrap gap-2">
              {ESTADOS_LIST.map(e => (
                <button
                  key={e.value}
                  onClick={() => handleChangeEstado(e.value)}
                  disabled={actionLoading || incidente.estado === e.value}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-colors disabled:opacity-50 ${
                    incidente.estado === e.value
                      ? 'bg-udla-500 border-udla-500 text-white cursor-default'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-udla-500'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
            {incidente.grupoId && (
              <p className="text-xs text-gray-500 mt-2">
                ⚠ El cambio de estado se aplicará a los {grupoSize} incidentes del grupo.
              </p>
            )}
          </div>
        )}

        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap gap-2 justify-end">
          {incidente.grupoId && puedeGestionar && (
            <button onClick={handleDesagrupar} disabled={actionLoading} className="btn-secondary text-sm">
              Quitar del grupo
            </button>
          )}
          {puedeEliminar && (
            <button onClick={handleEliminar} disabled={actionLoading} className="btn-accent text-sm">
              Eliminar incidente
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-gray-800 mt-0.5">{value || '—'}</p>
    </div>
  )
}

export default IncidentDetail
