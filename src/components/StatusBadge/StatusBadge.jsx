import Chip from '@mui/material/Chip'
import { getEstado } from '../../utils/constants'
import './StatusBadge.css'

function StatusBadge({ estado }) {
  const info = getEstado(estado)
  const colorName = info.color || 'amber' 

  return (
    <Chip
      size="small"
      label={info.label}
      icon={
        <span className={`status-dot ${colorName}`} />
      }
      className={`status-badge ${colorName}`}
    />
  )
}

export default StatusBadge
