import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../hooks/useNotifications'
import { formatDate } from '../../utils/helpers'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CloseIcon from '@mui/icons-material/Close'
import './NotificationBell.css'

function NotificationBell() {
  const { user } = useAuth()
  const { notificaciones, noLeidas, marcarLeida, marcarTodasLeidas, eliminar } = useNotifications(user?.uid)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()

  const handleOpen = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)
  const open = Boolean(anchorEl)

  const handleClick = async (n) => {
    if (!n.leida) await marcarLeida(n.id)
    handleClose()
    if (n.incidenteId) navigate(`/incidentes/${n.incidenteId}`)
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        aria-label="Notificaciones"
        className="notification-icon-btn"
      >
        <Badge
          badgeContent={noLeidas > 9 ? '9+' : noLeidas}
          color="secondary"
          invisible={noLeidas === 0}
          className="notification-badge"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            className: 'notification-popover-paper'
          },
        }}
      >
        
        <div className="notification-header">
          <p className="notification-header-title">
            Notificaciones
          </p>
          {noLeidas > 0 && (
            <Button
              size="small"
              onClick={marcarTodasLeidas}
              className="notification-mark-all"
            >
              Marcar todas como leídas
            </Button>
          )}
        </div>

        
        <div className="notification-list">
          {notificaciones.length === 0 ? (
            <p className="notification-empty">
              No tienes notificaciones
            </p>
          ) : (
            notificaciones.map(n => (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
                className={`notification-item ${!n.leida ? 'unread' : 'read'}`}
              >
                <div className="notification-item-content">
                  <div className="notification-item-text">
                    <p className="notification-item-title">
                      {n.titulo}
                    </p>
                    <p className="notification-item-message">
                      {n.mensaje}
                    </p>
                    <span className="notification-item-date">
                      {formatDate(n.fecha)}
                    </span>
                  </div>
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); eliminar(n.id) }}
                    aria-label="Eliminar"
                    className="notification-item-delete"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))
          )}
        </div>
      </Popover>
    </>
  )
}

export default NotificationBell
