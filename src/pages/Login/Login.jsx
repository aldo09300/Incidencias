import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { errorMessage } from '../../utils/helpers'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import './Login.css'

function Login() {
  const { user, login } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const navigate = useNavigate()

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(errorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-root">
      {/* ── LEFT PANEL ─────────────────────────────────── */}
      <div className="login-left">
        {/* Badge superior */}
        <div className="login-left-badge">
          <ReportProblemOutlinedIcon className="login-left-badge-icon" />
          <span>Sistema activo</span>
        </div>

        {/* Logo + nombre */}
        <div className="login-left-brand">
          <Link to="/" className="login-left-logo-link">
            <img src="/logo-udla.png" alt="UDLA" className="login-left-logo" />
          </Link>
          <p className="login-left-brand-sub">SISTEMA DE GESTIÓN DE INCIDENTES</p>
        </div>

        {/* Título principal */}
        <div className="login-left-hero">
          <h1 className="login-left-title">
            UDLA — IncidentTrack
          </h1>
          <p className="login-left-desc">
            Reporta, gestiona y resuelve incidentes de infraestructura en la
            Universidad de la Amazonia. Acompañado de foto y ubicación GPS.
            Diseñado para Florencia, Caquetá.
          </p>
        </div>

        {/* Stats */}
        <div className="login-left-stats">
          <div className="login-left-stat">
            <span className="login-left-stat-value">3</span>
            <span className="login-left-stat-label">Tipos de usuario</span>
          </div>
          <div className="login-left-stat">
            <span className="login-left-stat-value">5</span>
            <span className="login-left-stat-label">Estados de incidente</span>
          </div>
          <div className="login-left-stat">
            <span className="login-left-stat-value">∞</span>
            <span className="login-left-stat-label">Reportes en tiempo real</span>
          </div>
        </div>

        {/* Features */}
        <div className="login-left-features">
          <div className="login-left-feature">
            <LocationOnOutlinedIcon className="login-left-feature-icon" />
            <span>Ubicación GPS del incidente</span>
          </div>
          <div className="login-left-feature">
            <NotificationsOutlinedIcon className="login-left-feature-icon" />
            <span>Notificaciones en tiempo real</span>
          </div>
          <div className="login-left-feature">
            <BuildOutlinedIcon className="login-left-feature-icon" />
            <span>Gestión de estados y seguimiento</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────── */}
      <div className="login-right">
        <div className="login-form-card">
          <div className="login-form-header">
            <h2 className="login-form-title">Bienvenido de vuelta</h2>
            <p className="login-form-subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          {error && (
            <Alert severity="error" className="login-alert">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="login-field-group">
              <label className="login-field-label">USUARIO</label>
              <TextField
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                placeholder="tucorreo@uniamazonia.edu.co"
                size="medium"
                className="login-textfield"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailOutlinedIcon className="login-input-icon" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div className="login-field-group">
              <label className="login-field-label">CONTRASEÑA</label>
              <TextField
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                placeholder="••••••••"
                size="medium"
                className="login-textfield"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon className="login-input-icon" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPwd(!showPwd)}
                          edge="end"
                          size="small"
                          className="login-toggle-pwd"
                        >
                          {showPwd ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="large"
              disabled={loading}
              className="login-submit-btn"
              endIcon={!loading && <ArrowForwardIcon />}
            >
              {loading ? 'Ingresando...' : 'Ingresar al sistema'}
            </Button>
          </form>

          <p className="login-register-text">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="login-register-link">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
