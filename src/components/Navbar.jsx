import { useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

function Navbar() {
  const { user, profile, isAdmin, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white/20 text-white'
        : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`

  return (
    <nav className="bg-udla-500 shadow-lg sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-2.5 text-white font-bold">
            <img src="/logo-udla.png" alt="UDLA" className="h-10 w-10 rounded-full bg-white p-0.5" />
            <span className="hidden sm:block text-base leading-tight">
              <span className="block">Sistema de</span>
              <span className="block text-xs font-medium text-white/80">Incidentes UDLA</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={linkClass}>Inicio</NavLink>
            <NavLink to="/incidentes" className={linkClass}>Incidentes</NavLink>
            <NavLink to="/nuevo" className={linkClass}>Reportar</NavLink>
            <NavLink to="/estadisticas" className={linkClass}>Estadísticas</NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={linkClass}>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v6c0 3.5 3 6.5 7 7 4-0.5 7-3.5 7-7V7l-7-5z"/>
                  </svg>
                  Admin
                </span>
              </NavLink>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user && <NotificationBell />}
            <div className="hidden md:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-white truncate max-w-[140px]">
                  {profile?.nombre || user?.email}
                </p>
                <p className="text-xs text-white/70">
                  {isAdmin ? 'Administrador' : 'Usuario'}
                </p>
              </div>
              <button onClick={handleLogout} className="btn-ghost text-white hover:bg-white/10" title="Cerrar sesión">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
              </button>
            </div>

            <button
              className="md:hidden p-2 text-white"
              onClick={() => setOpen(!open)}
              aria-label="Menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                }
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden py-3 border-t border-white/10 space-y-1">
            <NavLink to="/dashboard"    className={linkClass} onClick={() => setOpen(false)}>Inicio</NavLink>
            <NavLink to="/incidentes"   className={linkClass} onClick={() => setOpen(false)}>Incidentes</NavLink>
            <NavLink to="/nuevo"        className={linkClass} onClick={() => setOpen(false)}>Reportar</NavLink>
            <NavLink to="/estadisticas" className={linkClass} onClick={() => setOpen(false)}>Estadísticas</NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>Panel Admin</NavLink>
            )}
            <div className="pt-3 mt-3 border-t border-white/10">
              <p className="px-3 text-sm text-white font-semibold">{profile?.nombre || user?.email}</p>
              <p className="px-3 text-xs text-white/70 mb-2">{isAdmin ? 'Administrador' : 'Usuario'}</p>
              <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:bg-white/10">
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
