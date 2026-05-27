import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useIncidents } from '../../hooks/useIncidents'
import IncidentCard from '../../components/IncidentCard/IncidentCard'
import Loader from '../../components/Loader/Loader'
import { ESTADOS_LIST, TIPOS_INCIDENTE } from '../../utils/constants'
import './Incidents.css'

function Incidents() {
  const { user, isAdmin } = useAuth()
  const { incidentes, loading } = useIncidents(
    isAdmin ? { all: true } : { userId: user?.uid }
  )

  const [filterEstado, setFilterEstado] = useState('todos')
  const [filterTipo, setFilterTipo]     = useState('todos')
  const [search, setSearch]             = useState('')

  const filtered = useMemo(() => {
    return incidentes.filter(inc => {
      if (filterEstado !== 'todos' && inc.estado !== filterEstado) return false
      if (filterTipo   !== 'todos' && inc.tipo   !== filterTipo)   return false
      if (search) {
        const s = search.toLowerCase()
        const matches = (inc.descripcion || '').toLowerCase().includes(s) ||
                        (inc.ubicacionTexto || '').toLowerCase().includes(s) ||
                        (inc.usuarioNombre || '').toLowerCase().includes(s)
        if (!matches) return false
      }
      return true
    })
  }, [incidentes, filterEstado, filterTipo, search])

  return (
    <div className="incidents-container">
      <div className="incidents-header">
        <div>
          <h1>{isAdmin ? 'Todos los incidentes' : 'Mis incidentes'}</h1>
          <p className="incidents-subtitle">
            {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          </p>
        </div>
        <Link to="/nuevo" className="incidents-btn-new">
          + Nuevo
        </Link>
      </div>

      <div className="filter-card">
        <div className="filter-group">
          <label className="filter-label">Buscar</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Busca por descripción, ubicación o reportante..."
            className="filter-input"
          />
        </div>

        <div className="filter-grid">
          <div>
            <label className="filter-label">Estado</label>
            <div className="chips-container">
              <FilterChip active={filterEstado === 'todos'} onClick={() => setFilterEstado('todos')}>
                Todos
              </FilterChip>
              {ESTADOS_LIST.map(e => (
                <FilterChip
                  key={e.value}
                  active={filterEstado === e.value}
                  onClick={() => setFilterEstado(e.value)}
                  color={e.color}
                >
                  {e.label}
                </FilterChip>
              ))}
            </div>
          </div>

          <div>
            <label className="filter-label">Tipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="filter-input"
            >
              <option value="todos">Todos los tipos</option>
              {TIPOS_INCIDENTE.map(t => (
                <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="no-results-card">
          <div className="no-results-icon">🔍</div>
          <h3 className="no-results-title">No se encontraron incidentes</h3>
          <p className="no-results-text">Prueba con otros filtros.</p>
        </div>
      ) : (
        <div className="incidents-grid">
          {filtered.map(inc => <IncidentCard key={inc.id} incidente={inc} />)}
        </div>
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children, color }) {
  let chipClass = 'filter-chip'
  if (active) {
    chipClass += ' active'
    if (color) {
      chipClass += ` ${color}`
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={chipClass}
    >
      {children}
    </button>
  )
}

export default Incidents
