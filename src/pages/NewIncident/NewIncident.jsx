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

  // Ubicación categorizada
  const [sede, setSede] = useState('')
  const [bloque, setBloque] = useState('')
  const [piso, setPiso] = useState('')
  const [salon, setSalon] = useState('')
  const [ubicacionDetalle, setUbicacionDetalle] = useState('')

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
        setGpsLoading(false)
      },
      () => {
        setError('No se pudo obtener la ubicación. Verifica los permisos.')
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleSedeChange = (newSede) => {
    setSede(newSede)
    setBloque('')
    setPiso('')
    setSalon('')
    setUbicacionDetalle('')
  }

  const buildUbicacionTexto = () => {
    const parts = []
    if (sede === 'porvenir') {
      parts.push('Sede Porvenir')
      if (bloque) parts.push(`Bloque ${bloque}`)
      if (salon) parts.push(`Salón ${salon}`)
    } else if (sede === 'centro') {
      parts.push('Sede Centro')
      if (piso) parts.push(`Piso ${piso}`)
      if (salon) parts.push(`Salón ${salon}`)
    }
    if (ubicacionDetalle.trim()) parts.push(ubicacionDetalle.trim())
    return parts.join(' - ')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!tipo)              { setError('Selecciona el tipo de incidente.');    return }
    if (!descripcion.trim()){ setError('Describe el incidente.');             return }
    if (!sede)              { setError('Selecciona la sede.');                return }
    if (sede === 'porvenir' && !bloque) { setError('Indica el número de bloque.');  return }
    if (sede === 'centro' && !piso)     { setError('Indica el número de piso.');    return }
    if (!salon)             { setError('Indica el salón o área.');            return }
    if (!file)              { setError('Adjunta una fotografía.');            return }

    const ubicacionTexto = buildUbicacionTexto()

    setLoading(true)
    try {
      await crearIncidente({
        usuarioId: user.uid,
        usuarioNombre: profile?.nombre || user.email,
        tipo, descripcion: descripcion.trim(),
        ubicacionTexto,
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
    <div className="new-incident-page-wrapper">
      <div className="new-incident-container">
      {/* Header */}
      <div className="new-incident-header">
        <div className="header-icon-wrapper">
          <i className="fa-solid fa-triangle-exclamation"></i>
        </div>
        <div>
          <h1>Reportar incidente</h1>
          <p className="new-incident-description">
            Llena el formulario para reportar un incidente en la universidad.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="incident-form">
        {/* Tipo de incidente */}
        <div className="form-section">
          <div className="section-title">
            <i className="fa-solid fa-tag"></i>
            <span>Tipo de incidente</span>
          </div>
          <div className="type-grid">
            {TIPOS_INCIDENTE.map(t => (
              <button
                type="button"
                key={t.value}
                onClick={() => setTipo(t.value)}
                className={`type-button ${tipo === t.value ? 'active' : ''}`}
              >
                <div className="type-icon"><i className={t.icon}></i></div>
                <p className="type-label">{t.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Descripción */}
        <div className="form-section">
          <div className="section-title">
            <i className="fa-solid fa-align-left"></i>
            <span>Descripción detallada</span>
          </div>
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

        {/* Fotografía */}
        <div className="form-section">
          <div className="section-title">
            <i className="fa-solid fa-camera"></i>
            <span>Fotografía</span>
          </div>
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
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="file-upload-placeholder"
            >
              <div className="file-upload-icon">
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <p className="file-upload-title">Toca para tomar o subir foto</p>
              <p className="file-upload-subtitle">JPG, PNG · Máx. 5MB</p>
            </button>
          )}
        </div>

        {/* Ubicación */}
        <div className="form-section">
          <div className="section-title">
            <i className="fa-solid fa-location-dot"></i>
            <span>Ubicación</span>
          </div>

          {/* Selector de sede */}
          <label className="form-label">Sede</label>
          <div className="sede-grid">
            <button
              type="button"
              onClick={() => handleSedeChange('porvenir')}
              className={`sede-button ${sede === 'porvenir' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-building"></i>
              <span>Sede Porvenir</span>
            </button>
            <button
              type="button"
              onClick={() => handleSedeChange('centro')}
              className={`sede-button ${sede === 'centro' ? 'active' : ''}`}
            >
              <i className="fa-solid fa-city"></i>
              <span>Sede Centro</span>
            </button>
          </div>

          {/* Campos condicionales según sede */}
          {sede && (
            <div className="location-details">
              {sede === 'porvenir' && (
                <div className="location-row">
                  <div className="location-field">
                    <label className="form-label">
                      <i className="fa-solid fa-cubes"></i> Bloque
                    </label>
                    <input
                      type="text"
                      value={bloque}
                      onChange={(e) => setBloque(e.target.value)}
                      className="form-input"
                      placeholder="Ej. A, B, 1, 2..."
                    />
                  </div>
                  <div className="location-field">
                    <label className="form-label">
                      <i className="fa-solid fa-door-open"></i> Salón / Área
                    </label>
                    <input
                      type="text"
                      value={salon}
                      onChange={(e) => setSalon(e.target.value)}
                      className="form-input"
                      placeholder="Ej. 203, Baño, Pasillo..."
                    />
                  </div>
                </div>
              )}

              {sede === 'centro' && (
                <div className="location-row">
                  <div className="location-field">
                    <label className="form-label">
                      <i className="fa-solid fa-stairs"></i> Piso
                    </label>
                    <input
                      type="text"
                      value={piso}
                      onChange={(e) => setPiso(e.target.value)}
                      className="form-input"
                      placeholder="Ej. 1, 2, 3..."
                    />
                  </div>
                  <div className="location-field">
                    <label className="form-label">
                      <i className="fa-solid fa-door-open"></i> Salón / Área
                    </label>
                    <input
                      type="text"
                      value={salon}
                      onChange={(e) => setSalon(e.target.value)}
                      className="form-input"
                      placeholder="Ej. 101, Auditorio, Baño..."
                    />
                  </div>
                </div>
              )}

              <div className="location-field" style={{ marginTop: '12px' }}>
                <label className="form-label">
                  <i className="fa-solid fa-map-pin"></i> Descripción del lugar (opcional)
                </label>
                <input
                  type="text"
                  value={ubicacionDetalle}
                  onChange={(e) => setUbicacionDetalle(e.target.value)}
                  className="form-input"
                  placeholder="Ej. Al fondo del pasillo, junto a la ventana..."
                />
              </div>
            </div>
          )}

          {/* GPS */}
          <button
            type="button"
            onClick={obtenerUbicacion}
            disabled={gpsLoading}
            className="btn-gps"
          >
            <i className={gpsLoading ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-crosshairs'}></i>
            <span>{gpsLoading ? 'Obteniendo...' : 'Usar mi ubicación GPS (opcional)'}</span>
          </button>
          {coords.lat && (
            <p className="gps-info">
              <i className="fa-solid fa-check-circle"></i> GPS: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </p>
          )}
        </div>

        {/* Acciones */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
            disabled={loading}
          >
            <i className="fa-solid fa-arrow-left"></i> Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Enviando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane"></i> Enviar reporte
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default NewIncident
