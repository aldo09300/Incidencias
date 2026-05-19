export const TIPOS_INCIDENTE = [
  { value: 'bano',           label: 'Baño',           icon: '🚿' },
  { value: 'electricidad',   label: 'Electricidad',   icon: '⚡' },
  { value: 'infraestructura',label: 'Infraestructura',icon: '🏗️' },
  { value: 'seguridad',      label: 'Seguridad',      icon: '🛡️' },
  { value: 'aseo',           label: 'Aseo',           icon: '🧹' },
  { value: 'mobiliario',     label: 'Mobiliario',     icon: '🪑' },
  { value: 'tecnologia',     label: 'Tecnología',     icon: '💻' },
  { value: 'otro',           label: 'Otro',           icon: '📌' },
]

export const ESTADOS = {
  REPORTADO:  { value: 'reportado',  label: 'Reportado',  color: 'amber'  },
  EN_PROCESO: { value: 'en_proceso', label: 'En proceso', color: 'blue'   },
  RESUELTO:   { value: 'resuelto',   label: 'Resuelto',   color: 'green'  },
}

export const ESTADOS_LIST = Object.values(ESTADOS)

export const getTipoLabel = (value) => {
  const tipo = TIPOS_INCIDENTE.find(t => t.value === value)
  return tipo ? `${tipo.icon} ${tipo.label}` : value
}

export const getTipoIcon = (value) => {
  const tipo = TIPOS_INCIDENTE.find(t => t.value === value)
  return tipo?.icon || '📌'
}

export const getEstado = (value) => {
  return ESTADOS_LIST.find(e => e.value === value) || ESTADOS.REPORTADO
}
