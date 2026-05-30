import { useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from '../NotificationBell/NotificationBell'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Collapse from '@mui/material/Collapse'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
import ShieldIcon from '@mui/icons-material/Shield'
import './Navbar.css'

function Navbar() {
  const { user, profile, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) => {
    return isActive ? 'navbar-link active' : 'navbar-link'
  }

  return (
    <AppBar
      position="sticky"
      className="navbar-appbar no-print"
    >
      <div className="navbar-container">
        <Toolbar disableGutters className="navbar-toolbar">
          
          <Link to="/dashboard" className="navbar-logo-link">
            <img
              src="/logo-udla.png"
              alt="UDLA"
              className="navbar-logo-img"
            />
            <div className="navbar-logo-text">
              <p className="navbar-logo-title">
                Sistema de
              </p>
              <p className="navbar-logo-subtitle">
                Incidentes UDLA
              </p>
            </div>
          </Link>

          
          <div className="navbar-desktop-nav">
            <NavLink to="/dashboard" className={linkClass}>Inicio</NavLink>
            <NavLink to="/incidentes" className={linkClass}>Incidentes</NavLink>
            <NavLink to="/nuevo" className={linkClass}>Reportar</NavLink>
            <NavLink to="/estadisticas" className={linkClass}>Estadísticas</NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={linkClass}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldIcon sx={{ fontSize: 16 }} />
                  Admin
                </div>
              </NavLink>
            )}
          </div>

          
          <div className="navbar-right-section">
            {user && <NotificationBell />}

            
            <div className="navbar-desktop-user">
              <div className="navbar-user-info">
                <p className="navbar-user-name">
                  {profile?.nombre || user?.email}
                </p>
                <p className="navbar-user-role">
                  {isAdmin ? 'Administrador' : 'Usuario'}
                </p>
              </div>
              <IconButton
                onClick={handleLogout}
                title="Cerrar sesión"
                className="navbar-icon-btn"
              >
                <LogoutIcon />
              </IconButton>
            </div>

            
            <IconButton
              onClick={() => setOpen(!open)}
              aria-label="Menú"
              className="navbar-mobile-toggle navbar-icon-btn"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </div>
        </Toolbar>

        
        <Collapse in={open} className="navbar-mobile-menu">
          <div className="navbar-mobile-nav">
            <div className="navbar-mobile-links">
              <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>Inicio</NavLink>
              <NavLink to="/incidentes" className={linkClass} onClick={() => setOpen(false)}>Incidentes</NavLink>
              <NavLink to="/nuevo" className={linkClass} onClick={() => setOpen(false)}>Reportar</NavLink>
              <NavLink to="/estadisticas" className={linkClass} onClick={() => setOpen(false)}>Estadísticas</NavLink>
              {isAdmin && (
                <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>Panel Admin</NavLink>
              )}
            </div>
            <div className="navbar-mobile-user">
              <p className="navbar-mobile-user-name">
                {profile?.nombre || user?.email}
              </p>
              <span className="navbar-mobile-user-role">
                {isAdmin ? 'Administrador' : 'Usuario'}
              </span>
              <button
                onClick={handleLogout}
                className="navbar-mobile-logout"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </Collapse>
      </div>
    </AppBar>
  )
}

export default Navbar
