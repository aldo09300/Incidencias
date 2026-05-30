import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useIncidents, cambiarEstado, agruparIncidentes } from '../../hooks/useIncidents'
import StatusBadge from '../../components/StatusBadge/StatusBadge'
import Loader from '../../components/Loader/Loader'
import { ESTADOS_LIST, TIPOS_INCIDENTE, getTipoIcon } from '../../utils/constants'
import { formatDateShort } from '../../utils/helpers'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import './AdminPanel.css'

function AdminPanel() {
  const { incidentes, loading } = useIncidents({ all: true })
  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterTipo, setFilterTipo]     = useState('todos')
  const [selected, setSelected]         = useState(new Set())
  const [actionLoading, setActionLoading] = useState(false)

  const filtered = useMemo(() => {
    return incidentes.filter(i =>
      (filterEstado === 'todos' || i.estado === filterEstado) &&
      (filterTipo   === 'todos' || i.tipo   === filterTipo)
    )
  }, [incidentes, filterEstado, filterTipo])

  const groupedData = useMemo(() => {
    const groups = new Map()
    const result = []

    filtered.forEach(inc => {
      if (inc.grupoId) {
        if (!groups.has(inc.grupoId)) {
          groups.set(inc.grupoId, { ...inc, isGroupLeader: true, groupItems: [inc] })
          result.push(groups.get(inc.grupoId))
        } else {
          groups.get(inc.grupoId).groupItems.push(inc)
        }
      } else {
        result.push(inc)
      }
    })
    return result
  }, [filtered])

  const toggleSelect = (inc) => {
    const s = new Set(selected)
    
    // Si tiene grupo, seleccionamos o deseleccionamos a todos los del grupo
    if (inc.grupoId) {
      const items = incidentes.filter(i => i.grupoId === inc.grupoId)
      // Si el líder ya está seleccionado, quitamos todos. Si no, agregamos todos.
      const isSelected = s.has(inc.id)
      items.forEach(item => {
        if (isSelected) s.delete(item.id)
        else s.add(item.id)
      })
    } else {
      if (s.has(inc.id)) s.delete(inc.id)
      else s.add(inc.id)
    }
    
    setSelected(s)
  }

  const clearSelection = () => setSelected(new Set())

  const handleBulkEstado = async (nuevoEstado) => {
    if (selected.size === 0) return
    if (!window.confirm(`Cambiar el estado de ${selected.size} incidentes a "${nuevoEstado.replace('_',' ')}"?`)) return
    setActionLoading(true)
    try {
      for (const id of selected) {
        await cambiarEstado(id, nuevoEstado, incidentes)
      }
      clearSelection()
    } catch (e) { console.error(e); alert('Error') }
    setActionLoading(false)
  }

  const handleAgrupar = async () => {
    if (selected.size < 2) {
      alert('Selecciona al menos 2 incidentes para agrupar.')
      return
    }
    if (!window.confirm(`¿Agrupar estos ${selected.size} incidentes? Al cambiar el estado de uno, todos cambian.`)) return
    setActionLoading(true)
    try {
      await agruparIncidentes(Array.from(selected))
      clearSelection()
    } catch (e) { console.error(e); alert('Error al agrupar') }
    setActionLoading(false)
  }

  if (loading) return <Loader fullScreen />

  return (
    <Box className="admin-container">
      <Box className="admin-header">
        <Typography variant="h4" fontWeight={700}>Panel de Administración</Typography>
        <Typography variant="body2" className="admin-subtitle">
          Selecciona incidentes para gestionar en lote o agrupar duplicados.
        </Typography>
      </Box>

      <Paper elevation={1} className="admin-paper">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="filter-estado-label">Filtrar por estado</InputLabel>
              <Select
                labelId="filter-estado-label"
                value={filterEstado}
                label="Filtrar por estado"
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                {ESTADOS_LIST.map(e => (
                  <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth size="small">
              <InputLabel id="filter-tipo-label">Filtrar por tipo</InputLabel>
              <Select
                labelId="filter-tipo-label"
                value={filterTipo}
                label="Filtrar por tipo"
                onChange={(e) => setFilterTipo(e.target.value)}
              >
                <MenuItem value="todos">Todos</MenuItem>
                {TIPOS_INCIDENTE.map(t => (
                  <MenuItem key={t.value} value={t.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <i className={t.icon} style={{ marginRight: '6px' }}></i> {t.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {selected.size > 0 && (
        <Paper elevation={2} className="admin-paper admin-action-bar">
          <Typography className="admin-action-text">
            {selected.size} {selected.size === 1 ? 'incidente seleccionado' : 'incidentes seleccionados'}
          </Typography>
          <Box className="admin-action-buttons">
            <Button
              variant="outlined"
              color="secondary"
              size="small"
              onClick={handleAgrupar}
              disabled={actionLoading || selected.size < 2}
            >
              <i className="fa-solid fa-link" style={{ marginRight: '4px' }}></i> Agrupar
            </Button>
            {ESTADOS_LIST.map(e => (
              <Button
                key={e.value}
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleBulkEstado(e.value)}
                disabled={actionLoading}
              >
                <i className="fa-solid fa-arrow-right" style={{ marginRight: '4px' }}></i> {e.label}
              </Button>
            ))}
            <Button size="small" color="inherit" onClick={clearSelection}>
              Cancelar
            </Button>
          </Box>
        </Paper>
      )}

      {groupedData.length === 0 ? (
        <Paper elevation={1} className="admin-empty-state">
          <Typography className="admin-empty-icon"><i className="fa-solid fa-inbox"></i></Typography>
          <Typography variant="h6">No hay incidentes con esos filtros</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={1} className="admin-table-container">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>Descripción</TableCell>
                <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Reportante</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Fecha</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedData.map(inc => {
                const isSelected = selected.has(inc.id);
                return (
                  <TableRow
                    key={inc.id}
                    className={`admin-row-hover ${isSelected ? 'admin-row-selected' : ''}`}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isSelected}
                        onChange={() => toggleSelect(inc)}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ fontSize: '1.25rem', mr: 1 }}><i className={getTipoIcon(inc.tipo)}></i></Typography>
                      </Box>
                    </TableCell>
                    <TableCell className="admin-desc-cell" sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" className="admin-desc-text">{inc.descripcion}</Typography>
                        {inc.isGroupLeader && inc.groupItems.length > 1 && (
                          <span className="admin-badge-grouped">
                            <i className="fa-solid fa-link" style={{ marginRight: '4px' }}></i>
                            {inc.groupItems.length} agrupados
                          </span>
                        )}
                      </Box>
                      <Typography className="admin-desc-location">{inc.ubicacionTexto}</Typography>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                      <Typography variant="body2" color="text.secondary">
                        {inc.isGroupLeader && inc.groupItems.length > 1 ? `${inc.usuarioNombre} y otros` : inc.usuarioNombre}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusBadge estado={inc.estado} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDateShort(inc.fechaCreacion)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography component={Link} to={`/incidentes/${inc.id}`} className="admin-link">
                      Ver <i className="fa-solid fa-arrow-right" style={{ marginLeft: '2px' }}></i>
                      </Typography>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

export default AdminPanel
