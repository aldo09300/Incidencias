import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { errorMessage } from '../../utils/helpers'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import './Register.css'

function Register() {
  const { user, register } = useAuth()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setLoading(true)
    try {
      await register(nombre.trim(), email.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      console.dir(err); // .dir muestra el objeto JavaScript con todas sus propiedades ocultas
      console.log("Texto del error:", err.toString());
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="register-container">
      <Box className="register-content">
        <Box className="register-logo-wrapper">
          <Link to="/">
            <Box
              component="img"
              src="/logo-udla.png"
              alt="UDLA"
              className="register-logo"
            />
          </Link>
        </Box>

        <Paper elevation={6} className="register-paper">
          <Typography variant="h5" fontWeight={700} className="register-title">
            Crear cuenta
          </Typography>
          <Typography variant="body2" className="register-subtitle">
            Regístrate para reportar incidentes
          </Typography>

          {error && (
            <Alert severity="error" className="register-alert">
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} className="register-form">
            <TextField
              label="Nombre completo"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              fullWidth
              placeholder="Juan Pérez"
              size="medium"
            />

            <TextField
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              placeholder="tucorreo@uniamazonia.edu.co"
              size="medium"
            />

            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              placeholder="Mínimo 6 caracteres"
              size="medium"
              inputProps={{ minLength: 6 }}
            />

            <TextField
              label="Confirmar contraseña"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              fullWidth
              placeholder="Repite tu contraseña"
              size="medium"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </Box>

          <Typography variant="body2" className="register-footer-text">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="register-link">
              Inicia sesión
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  )
}

export default Register
