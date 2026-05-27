import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/Loader/Loader'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined'
import WaterDamageOutlinedIcon from '@mui/icons-material/WaterDamageOutlined'
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import './Landing.css'

const FEATURES = [
  {
    icon: <CameraAltOutlinedIcon />,
    title: 'Foto del incidente',
    desc: 'Adjunta evidencia fotográfica directamente desde tu dispositivo.',
  },
  {
    icon: <LocationOnOutlinedIcon />,
    title: 'Ubicación GPS',
    desc: 'Geolocalización precisa del lugar donde ocurrió el incidente.',
  },
  {
    icon: <NotificationsOutlinedIcon />,
    title: 'Notificaciones',
    desc: 'Recibe actualizaciones en tiempo real sobre el estado de tu reporte.',
  },
]

const INCIDENT_TYPES = [
  { icon: <ElectricBoltOutlinedIcon />,    label: 'Daños eléctricos' },
  { icon: <WaterDamageOutlinedIcon />,     label: 'Fugas de agua' },
  { icon: <ConstructionOutlinedIcon />,    label: 'Infraestructura' },
]

const STATS = [
  { value: '3',  label: 'Tipos de usuario' },
  { value: '5',  label: 'Estados de seguimiento' },
  { value: '24/7', label: 'Disponibilidad' },
]

function Landing() {
  const { user, loading } = useAuth()

  if (loading) return <Loader fullScreen />
  if (user)    return <Navigate to="/dashboard" replace />

  return (
    <div className="lnd-root">

      {/* ══ LEFT PANEL ══════════════════════════════════════ */}
      <div className="lnd-left">

        {/* Decorative circles */}
        <div className="lnd-circle lnd-circle-1" />
        <div className="lnd-circle lnd-circle-2" />

        {/* Top bar: logo + badge */}
        <div className="lnd-top">
          <div className="lnd-brand">
            <img src="/logo-udla.png" alt="UDLA" className="lnd-logo" />
            <div className="lnd-brand-text">
              <span className="lnd-brand-name">Universidad de la Amazonia</span>
              <span className="lnd-brand-place">Florencia — Caquetá, Colombia</span>
            </div>
          </div>
          <div className="lnd-badge">
            <VerifiedOutlinedIcon className="lnd-badge-icon" />
            <span>Sistema institucional</span>
          </div>
        </div>

        {/* Hero */}
        <div className="lnd-hero">
          <p className="lnd-tagline">Reporta · Gestiona · Resuelve</p>
          <h1 className="lnd-title">Sistema de Reporte<br />de Incidentes</h1>
          <p className="lnd-subtitle">
            Reporta fugas, daños eléctricos, problemas de infraestructura
            y más, desde tu celular o computador. Acompaña tu reporte con
            fotografía y ubicación GPS en tiempo real.
          </p>
        </div>

        {/* Incident type chips */}
        <div className="lnd-chips">
          {INCIDENT_TYPES.map(({ icon, label }) => (
            <div key={label} className="lnd-chip">
              <span className="lnd-chip-icon">{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="lnd-stats">
          {STATS.map(({ value, label }) => (
            <div key={label} className="lnd-stat">
              <span className="lnd-stat-value">{value}</span>
              <span className="lnd-stat-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Footer text */}
        <p className="lnd-footer">
          Programación Web · Ingeniería de Sistemas · 2026-I
        </p>
      </div>

      {/* ══ RIGHT PANEL ═════════════════════════════════════ */}
      <div className="lnd-right">
        <div className="lnd-card">

          {/* Header */}
          <div className="lnd-card-header">
            <h2 className="lnd-card-title">Bienvenido</h2>
            <p className="lnd-card-subtitle">
              Accede al sistema para reportar y gestionar incidentes en el campus.
            </p>
          </div>

          {/* Features list */}
          <div className="lnd-features">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="lnd-feature">
                <div className="lnd-feature-icon">{icon}</div>
                <div className="lnd-feature-text">
                  <span className="lnd-feature-title">{title}</span>
                  <span className="lnd-feature-desc">{desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="lnd-divider">
            <span className="lnd-divider-line" />
            <span className="lnd-divider-text">Acceder</span>
            <span className="lnd-divider-line" />
          </div>

          {/* CTA buttons */}
          <div className="lnd-actions">
            <Button
              component={Link}
              to="/login"
              fullWidth
              size="large"
              className="lnd-btn-primary"
              startIcon={<LoginOutlinedIcon />}
              endIcon={<ArrowForwardIcon />}
            >
              Iniciar sesión
            </Button>
            <Button
              component={Link}
              to="/registro"
              fullWidth
              size="large"
              className="lnd-btn-secondary"
              startIcon={<PersonAddOutlinedIcon />}
            >
              Crear cuenta
            </Button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Landing
