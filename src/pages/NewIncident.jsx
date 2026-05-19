import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { crearIncidente } from '../hooks/useIncidents'
import { TIPOS_INCIDENTE } from '../utils/constants'

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
    <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1>Reportar incidente</h1>
        <p className="text-gray-600 mt-1 text-sm">
          Llena el formulario para reportar un incidente en la universidad.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label-field">Tipo de incidente *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TIPOS_INCIDENTE.map(t => (
              <button
                type="button"
                key={t.value}
                onClick={() => setTipo(t.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  tipo === t.value
                    ? 'border-udla-500 bg-udla-50 text-udla-700'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-2xl mb-1">{t.icon}</div>
                <p className="text-xs font-semibold">{t.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label-field">Descripción detallada *</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            maxLength={500}
            className="input-field resize-none"
            placeholder="Describe el problema con el mayor detalle posible..."
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{descripcion.length}/500</p>
        </div>

        <div>
          <label className="label-field">Fotografía *</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />
          {preview ? (
            <div className="relative">
              <img src={preview} alt="Vista previa" className="w-full max-h-72 object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => { setFile(null); setPreview(null); fileInputRef.current.value = '' }}
                className="absolute top-2 right-2 bg-accent-500 text-white w-9 h-9 rounded-full font-bold shadow-lg"
              >
                ×
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full py-10 border-2 border-dashed border-gray-300 rounded-lg hover:border-udla-500 hover:bg-udla-50 transition-colors"
            >
              <div className="text-5xl mb-2">📷</div>
              <p className="font-semibold text-gray-700">Toca para tomar o subir foto</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG · Máx. 5MB</p>
            </button>
          )}
        </div>

        <div>
          <label className="label-field">Ubicación *</label>
          <input
            type="text"
            value={ubicacionTexto}
            onChange={(e) => setUbicacionTexto(e.target.value)}
            className="input-field mb-2"
            placeholder="Ej. Bloque A, segundo piso, salón 203"
          />
          <button
            type="button"
            onClick={obtenerUbicacion}
            disabled={gpsLoading}
            className="btn-secondary text-sm w-full sm:w-auto"
          >
            {gpsLoading ? 'Obteniendo...' : '📍 Usar mi ubicación GPS (opcional)'}
          </button>
          {coords.lat && (
            <p className="text-xs text-udla-600 mt-2 font-medium">
              ✓ GPS: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary sm:flex-1"
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="btn-primary sm:flex-1">
            {loading ? 'Enviando...' : 'Enviar reporte'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewIncident
