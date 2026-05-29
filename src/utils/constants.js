export const TIPOS_INCIDENTE = [
  { value: 'bano',           label: 'Baño',           icon: 'fa-solid fa-shower' },
  { value: 'electricidad',   label: 'Electricidad',   icon: 'fa-solid fa-bolt' },
  { value: 'infraestructura',label: 'Infraestructura',icon: 'fa-solid fa-helmet-safety' },
  { value: 'seguridad',      label: 'Seguridad',      icon: 'fa-solid fa-shield-halved' },
  { value: 'aseo',           label: 'Aseo',           icon: 'fa-solid fa-broom' },
  { value: 'mobiliario',     label: 'Mobiliario',     icon: 'fa-solid fa-chair' },
  { value: 'tecnologia',     label: 'Tecnología',     icon: 'fa-solid fa-laptop' },
  { value: 'otro',           label: 'Otro',           icon: 'fa-solid fa-thumbtack' },
]

export const ESTADOS = {
  REPORTADO:  { value: 'reportado',  label: 'Reportado',  color: 'amber'  },
  EN_PROCESO: { value: 'en_proceso', label: 'En proceso', color: 'blue'   },
  RESUELTO:   { value: 'resuelto',   label: 'Resuelto',   color: 'green'  },
}

export const ESTADOS_LIST = Object.values(ESTADOS)

export const getTipoLabel = (value) => {
  const tipo = TIPOS_INCIDENTE.find(t => t.value === value)
  return tipo ? tipo.label : value
}

export const getTipoIcon = (value) => {
  const tipo = TIPOS_INCIDENTE.find(t => t.value === value)
  return tipo?.icon || 'fa-solid fa-thumbtack'
}

export const getEstado = (value) => {
  return ESTADOS_LIST.find(e => e.value === value) || ESTADOS.REPORTADO
}
