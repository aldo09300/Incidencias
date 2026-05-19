import { getEstado } from '../utils/constants'

function StatusBadge({ estado }) {
  const info = getEstado(estado)
  const colors = {
    amber: 'bg-amber-100 text-amber-800 border border-amber-200',
    blue:  'bg-blue-100  text-blue-800  border border-blue-200',
    green: 'bg-green-100 text-green-800 border border-green-200',
  }
  const dotColors = {
    amber: 'bg-amber-500',
    blue:  'bg-blue-500',
    green: 'bg-green-500',
  }

  return (
    <span className={`badge ${colors[info.color]}`}>
      <span className={`w-2 h-2 rounded-full ${dotColors[info.color]}`}></span>
      {info.label}
    </span>
  )
}

export default StatusBadge
