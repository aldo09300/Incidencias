import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import { useIncidents, cambiarEstado, eliminarIncidente, desagruparIncidente } from '../../hooks/useIncidents'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import Loader from '../../components/Loader/Loader'
import { ESTADOS_LIST, getTipoLabel } from '../../utils/constants'
import { formatDate } from '../../utils/helpers'
import './IncidentDetail.css'

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
      <div className="detail-container" style={{ textAlign: 'center', paddingTop: '48px' }}>
        <h2>Incidente no encontrado</h2>
        <Link to="/incidentes" className="btn-primary" style={{ marginTop: '16px' }}>Volver</Link>
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
    <div className="detail-container">
      <button onClick={() => navigate(-1)} className="btn-ghost">
        ← Volver
      </button>

      <div className="detail-card">
        <div className="detail-header">
          <div>
            <p className="detail-header-type">
              {getTipoLabel(incidente.tipo)}
            </p>
            <h2 className="detail-header-title">Reporte #{incidente.id.slice(0,8)}</h2>
          </div>
          <StatusBadge estado={incidente.estado} />
        </div>

        <div className="detail-image-container">
          <img src={incidente.imagenURL} alt={incidente.tipo} className="detail-image" />
        </div>

        <div className="info-grid">
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
                  className="info-item-link"
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
                <span className="badge-purple">
                  {grupoSize} incidentes agrupados
                </span>
              }
            />
          )}
        </div>

        <div className="detail-section">
          <p className="detail-label">Descripción</p>
          <p className="detail-description">{incidente.descripcion}</p>
        </div>

        {puedeGestionar && (
          <div className="admin-section">
            <p className="admin-label">Cambiar estado</p>
            <div className="state-buttons">
              {ESTADOS_LIST.map(e => (
                <button
                  key={e.value}
                  onClick={() => handleChangeEstado(e.value)}
                  disabled={actionLoading || incidente.estado === e.value}
                  className={`state-btn ${incidente.estado === e.value ? 'active' : ''}`}
                >
                  {e.label}
                </button>
              ))}
            </div>
            {incidente.grupoId && (
              <p className="admin-warning">
                ⚠ El cambio de estado se aplicará a los {grupoSize} incidentes del grupo.
              </p>
            )}
          </div>
        )}

        <div className="actions-footer">
          {incidente.grupoId && puedeGestionar && (
            <button onClick={handleDesagrupar} disabled={actionLoading} className="btn-secondary">
              Quitar del grupo
            </button>
          )}
          {puedeEliminar && (
            <button onClick={handleEliminar} disabled={actionLoading} className="btn-accent">
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
      <p className="info-item-label">{label}</p>
      <p className="info-item-value">{value || '—'}</p>
    </div>
  )
}

export default IncidentDetail
