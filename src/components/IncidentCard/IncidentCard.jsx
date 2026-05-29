import { Link } from 'react-router-dom'
import Card from '@mui/material/Card'
import StatusBadge from '../StatusBadge/StatusBadge'
import { getTipoLabel, getTipoIcon } from '../../utils/constants'
import { formatDateShort } from '../../utils/helpers'
import './IncidentCard.css'

function IncidentCard({ incidente }) {
  return (
    <Card
      component={Link}
      to={`/incidentes/${incidente.id}`}
      className="incident-card"
    >
      <div className="incident-img-wrapper">
        <img
          className="incident-img"
          src={incidente.imagenURL}
          alt={incidente.tipo}
          loading="lazy"
        />
      </div>

      <div className="incident-content">
        <div>
          <div className="incident-header">
            <p className="incident-type">
              <i className={getTipoIcon(incidente.tipo)} style={{ marginRight: '6px' }}></i>
              {getTipoLabel(incidente.tipo)}
            </p>
            {incidente.grupoId && (
              <span className="incident-chip-grouped">
                Agrupado
              </span>
            )}
          </div>
          <p className="incident-description">
            {incidente.descripcion}
          </p>
          <span className="incident-location">
            <i className="fa-solid fa-location-dot" style={{ marginRight: '4px' }}></i> {incidente.ubicacionTexto}
          </span>
        </div>

        <div className="incident-footer">
          <StatusBadge estado={incidente.estado} />
          <p className="incident-date">
            {formatDateShort(incidente.fechaCreacion)}
          </p>
        </div>
      </div>
    </Card>
  )
}

export default IncidentCard
