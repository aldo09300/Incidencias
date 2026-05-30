export const formatDate = (timestamp) => {
  if (!timestamp) return '—'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export const formatDateShort = (timestamp) => {
  if (!timestamp) return '—'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export const errorMessage = (code) => {
  const map = {
    'auth/email-already-in-use': 'Este correo ya está registrado.',
    'auth/invalid-email':        'Correo electrónico inválido.',
    'auth/weak-password':        'La contraseña debe tener al menos 6 caracteres.',
    'auth/user-not-found':       'No existe una cuenta con ese correo.',
    'auth/wrong-password':       'Contraseña incorrecta.',
    'auth/invalid-credential':   'Credenciales incorrectas.',
    'auth/too-many-requests':    'Demasiados intentos. Espera unos minutos.',
    'auth/network-request-failed':'Error de conexión. Verifica tu internet.',
    'auth/email-not-verified':   'Por favor verifica tu correo electrónico antes de iniciar sesión.',
  }
  return map[code] || 'Ocurrió un error. Intenta de nuevo.'
}

export const filterByPeriod = (incidentes, period) => {
  if (period === 'todos') return incidentes
  const now = new Date()
  const cutoff = new Date()
  if (period === '7dias')   cutoff.setDate(now.getDate() - 7)
  if (period === '30dias')  cutoff.setDate(now.getDate() - 30)
  if (period === '90dias')  cutoff.setDate(now.getDate() - 90)
  return incidentes.filter(inc => {
    if (!inc.fechaCreacion) return false
    const d = inc.fechaCreacion.toDate ? inc.fechaCreacion.toDate() : new Date(inc.fechaCreacion)
    return d >= cutoff
  })
}
