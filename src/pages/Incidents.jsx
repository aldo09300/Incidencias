import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useIncidents } from '../hooks/useIncidents'
import IncidentCard from '../components/IncidentCard'
import Loader from '../components/Loader'
import { ESTADOS_LIST, TIPOS_INCIDENTE } from '../utils/constants'

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
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1>{isAdmin ? 'Todos los incidentes' : 'Mis incidentes'}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
          </p>
        </div>
        <Link to="/nuevo" className="btn-primary">
          + Nuevo
        </Link>
      </div>

      <div className="card mb-6 space-y-4">
        <div>
          <label className="label-field">Buscar</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Busca por descripción, ubicación o reportante..."
            className="input-field"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Estado</label>
            <div className="flex flex-wrap gap-2">
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
            <label className="label-field">Tipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="input-field"
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
        <div className="card text-center py-12">
          <div className="text-5xl mb-3">🔍</div>
          <h3 className="mb-2">No se encontraron incidentes</h3>
          <p className="text-gray-500 text-sm">Prueba con otros filtros.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(inc => <IncidentCard key={inc.id} incidente={inc} />)}
        </div>
      )}
    </div>
  )
}

function FilterChip({ active, onClick, children, color }) {
  const colorStyles = {
    amber: 'bg-amber-500 border-amber-500 text-white',
    blue:  'bg-blue-500  border-blue-500  text-white',
    green: 'bg-green-500 border-green-500 text-white',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
        active
          ? (color ? colorStyles[color] : 'bg-udla-500 border-udla-500 text-white')
          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
      }`}
    >
      {children}
    </button>
  )
}

export default Incidents
