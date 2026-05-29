import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useIncidents } from '../../hooks/useIncidents'
import IncidentCard from '../../components/IncidentCard/IncidentCard'
import Loader from '../../components/Loader/Loader'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import './Dashboard.css'

function Dashboard() {
  const { user, profile, isAdmin } = useAuth()
  const { incidentes, loading } = useIncidents(
    isAdmin ? { all: true } : { userId: user?.uid }
  )

  const stats = {
    total:      incidentes.length,
    reportado:  incidentes.filter(i => i.estado === 'reportado').length,
    enProceso:  incidentes.filter(i => i.estado === 'en_proceso').length,
    resuelto:   incidentes.filter(i => i.estado === 'resuelto').length,
  }

  const recientes = incidentes.slice(0, 6)

  return (
    <Box className="dashboard-container">
      <Box className="dashboard-hero">
        <Typography variant="body2" className="dashboard-date">
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </Typography>
        <Typography variant="h4" className="dashboard-greeting">
          ¡Hola, {profile?.nombre?.split(' ')[0] || 'Usuario'}!
        </Typography>
        <Typography variant="body1" className="dashboard-hero-subtitle">
          {isAdmin
            ? 'Panel general de incidentes de la institución.'
            : 'Consulta tus reportes o crea uno nuevo.'}
        </Typography>
        <Box className="dashboard-actions">
          <Button
            component={Link}
            to="/nuevo"
            variant="contained"
            className="dashboard-btn-report"
            startIcon={
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
            }
          >
            Reportar incidente
          </Button>
          <Button
            component={Link}
            to="/incidentes"
            variant="outlined"
            className="dashboard-btn-all"
          >
            Ver todos
          </Button>
        </Box>
      </Box>

      <Grid container spacing={2} className="dashboard-stats-grid">
        <Grid xs={6} lg={3}>
          <StatCard label="Total" value={stats.total} color="udla" icon="fa-solid fa-chart-bar" />
        </Grid>
        <Grid xs={6} lg={3}>
          <StatCard label="Reportados" value={stats.reportado} color="amber" icon="fa-solid fa-bell" />
        </Grid>
        <Grid xs={6} lg={3}>
          <StatCard label="En proceso" value={stats.enProceso} color="blue" icon="fa-solid fa-wrench" />
        </Grid>
        <Grid xs={6} lg={3}>
          <StatCard label="Resueltos" value={stats.resuelto} color="green" icon="fa-solid fa-circle-check" />
        </Grid>
      </Grid>

      <Box className="dashboard-section-header">
        <Typography variant="h6" className="dashboard-section-title">
          {isAdmin ? 'Incidentes recientes' : 'Mis reportes recientes'}
        </Typography>
        <Typography component={Link} to="/incidentes" className="dashboard-link-all">
          Ver todos <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px' }}></i>
        </Typography>
      </Box>

      {loading ? (
        <Loader />
      ) : recientes.length === 0 ? (
        <EmptyState isAdmin={isAdmin} />
      ) : (
        <Box className="dashboard-incidents-grid">
          {recientes.map(inc => <IncidentCard key={inc.id} incidente={inc} />)}
        </Box>
      )}
    </Box>
  )
}

function StatCard({ label, value, color, icon }) {
  const colorClass = `dashboard-stat-card-${color}`
  return (
    <Paper elevation={0} className={`dashboard-stat-card ${colorClass}`}>
      <Typography className="dashboard-stat-icon"><i className={icon}></i></Typography>
      <Typography className="dashboard-stat-label">{label}</Typography>
      <Typography className="dashboard-stat-value">{value}</Typography>
    </Paper>
  )
}

function EmptyState({ isAdmin }) {
  return (
    <Paper elevation={1} className="dashboard-empty-state">
      <Typography className="dashboard-empty-icon"><i className="fa-solid fa-inbox"></i></Typography>
      <Typography variant="h5" className="dashboard-empty-title">
        {isAdmin ? 'No hay incidentes reportados aún' : 'Aún no has reportado incidentes'}
      </Typography>
      <Typography className="dashboard-empty-desc">
        {isAdmin
          ? 'Cuando los usuarios reporten, aparecerán aquí.'
          : 'Reporta el primer incidente que encuentres en las instalaciones.'}
      </Typography>
      {!isAdmin && (
        <Button component={Link} to="/nuevo" variant="contained" color="primary">
          Reportar incidente
        </Button>
      )}
    </Paper>
  )
}

export default Dashboard
