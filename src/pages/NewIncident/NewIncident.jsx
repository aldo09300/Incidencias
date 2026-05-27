import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { crearIncidente } from '../../hooks/useIncidents'
import { TIPOS_INCIDENTE } from '../../utils/constants'
import './NewIncident.css'

function NewIncident() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [tipo, setTipo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [ubicacionTexto, setUbicacionTexto] = useState('')
  const [coords, setCoords] = useState({ lat: null, lng: null })
  const [gpsLoading, setGpsLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('El archivo debe ser una imagen.')
      return
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB.')
      return
    }
    setError('')
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const obtenerUbicacion = () => {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización.')
      return
    }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        if (!ubicacionTexto) {
          setUbicacionTexto(`Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`)
        }
        setGpsLoading(false)
      },
      () => {
        setError('No se pudo obtener la ubicación. Verifica los permisos.')
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!tipo)           { setError('Selecciona el tipo de incidente.');    return }
    if (!descripcion.trim()) { setError('Describe el incidente.');          return }
    if (!ubicacionTexto.trim()) { setError('Indica la ubicación.');         return }
    if (!file)           { setError('Adjunta una fotografía.');             return }

    setLoading(true)
    try {
      await crearIncidente({
        usuarioId: user.uid,
        usuarioNombre: profile?.nombre || user.email,
        tipo, descripcion: descripcion.trim(),
        ubicacionTexto: ubicacionTexto.trim(),
        latitud: coords.lat, longitud: coords.lng,
        file,
      })
      navigate('/incidentes')
    } catch (err) {
      console.error(err)
      setError('Error al crear el incidente. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="new-incident-container">
      <div className="new-incident-header">
        <h1>Reportar incidente</h1>
        <p className="new-incident-description">
          Llena el formulario para reportar un incidente en la universidad.
        </p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="incident-form">
        <div className="form-group">
          <label className="form-label">Tipo de incidente *</label>
          <div className="type-grid">
            {TIPOS_INCIDENTE.map(t => (
              <button
                type="button"
                key={t.value}
                onClick={() => setTipo(t.value)}
                className={`type-button ${tipo === t.value ? 'active' : ''}`}
              >
                <div className="type-icon">{t.icon}</div>
                <p className="type-label">{t.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Descripción detallada *</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            maxLength={500}
            className="form-textarea"
            placeholder="Describe el problema con el mayor detalle posible..."
          />
          <p className="char-counter">{descripcion.length}/500</p>
        </div>

        <div className="form-group">
          <label className="form-label">Fotografía *</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
          {preview ? (
            <div className="file-preview-container">
              <img src={preview} alt="Vista previa" className="file-preview-img" />
              <button
                type="button"
                onClick={() => { setFile(null); setPreview(null); fileInputRef.current.value = '' }}
                className="file-remove-btn"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="file-upload-placeholder"
            >
              <div className="file-upload-icon">📷</div>
              <p className="file-upload-title">Toca para tomar o subir foto</p>
              <p className="file-upload-subtitle">JPG, PNG · Máx. 5MB</p>
            </button>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Ubicación *</label>
          <input
            type="text"
            value={ubicacionTexto}
            onChange={(e) => setUbicacionTexto(e.target.value)}
            className="form-input"
            style={{ marginBottom: '8px' }}
            placeholder="Ej. Bloque A, segundo piso, salón 203"
          />
          <button
            type="button"
            onClick={obtenerUbicacion}
            disabled={gpsLoading}
            className="btn-secondary"
            style={{ width: '100%', maxWidth: 'max-content' }}
          >
            {gpsLoading ? 'Obteniendo...' : '📍 Usar mi ubicación GPS (opcional)'}
          </button>
          {coords.lat && (
            <p className="gps-info">
              ✓ GPS: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </p>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Enviando...' : 'Enviar reporte'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewIncident
