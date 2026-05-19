import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useIncidents, cambiarEstado, agruparIncidentes } from '../hooks/useIncidents'
import StatusBadge from '../components/StatusBadge'
import Loader from '../components/Loader'
import { ESTADOS_LIST, TIPOS_INCIDENTE, getTipoIcon, getTipoLabel } from '../utils/constants'
import { formatDateShort } from '../utils/helpers'

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

  const toggleSelect = (id) => {
    const s = new Set(selected)
    if (s.has(id)) s.delete(id); else s.add(id)
    setSelected(s)
  }

  const clearSelection = () => setSelected(new Set())

  const handleBulkEstado = async (nuevoEstado) => {
    if (selected.size === 0) return
    if (!confirm(`Cambiar el estado de ${selected.size} incidentes a "${nuevoEstado.replace('_',' ')}"?`)) return
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
    if (!confirm(`¿Agrupar estos ${selected.size} incidentes? Al cambiar el estado de uno, todos cambian.`)) return
    setActionLoading(true)
    try {
      await agruparIncidentes(Array.from(selected))
      clearSelection()
    } catch (e) { console.error(e); alert('Error al agrupar') }
    setActionLoading(false)
  }

  if (loading) return <Loader fullScreen />

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="mb-6">
        <h1>Panel de Administración</h1>
        <p className="text-sm text-gray-600 mt-1">
          Selecciona incidentes para gestionar en lote o agrupar duplicados.
        </p>
      </div>

      <div className="card mb-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field">Filtrar por estado</label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos</option>
              {ESTADOS_LIST.map(e => (
                <option key={e.value} value={e.value}>{e.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Filtrar por tipo</label>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos</option>
              {TIPOS_INCIDENTE.map(t => (
                <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="card mb-4 bg-udla-50 border-udla-200 sticky top-16 z-30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-semibold text-udla-700">
              {selected.size} {selected.size === 1 ? 'incidente seleccionado' : 'incidentes seleccionados'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button onClick={handleAgrupar} disabled={actionLoading || selected.size < 2}
                className="btn-secondary text-sm disabled:opacity-50">
                🔗 Agrupar
              </button>
              {ESTADOS_LIST.map(e => (
                <button key={e.value} onClick={() => handleBulkEstado(e.value)} disabled={actionLoading}
                  className="btn-primary text-sm">
                  → {e.label}
                </button>
              ))}
              <button onClick={clearSelection} className="btn-ghost text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-3">📭</div>
          <h3>No hay incidentes con esos filtros</h3>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-2 w-10"></th>
                <th className="text-left py-3 px-2">Tipo</th>
                <th className="text-left py-3 px-2 hidden md:table-cell">Descripción</th>
                <th className="text-left py-3 px-2 hidden lg:table-cell">Reportante</th>
                <th className="text-left py-3 px-2">Estado</th>
                <th className="text-left py-3 px-2 hidden sm:table-cell">Fecha</th>
                <th className="text-right py-3 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inc => (
                <tr key={inc.id} className={`border-b border-gray-100 hover:bg-gray-50 ${selected.has(inc.id) ? 'bg-udla-50' : ''}`}>
                  <td className="py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selected.has(inc.id)}
                      onChange={() => toggleSelect(inc.id)}
                      className="w-4 h-4 accent-udla-500"
                    />
                  </td>
                  <td className="py-3 px-2 whitespace-nowrap">
                    <span className="text-xl mr-1">{getTipoIcon(inc.tipo)}</span>
                    {inc.grupoId && <span className="ml-1 text-purple-500" title="Agrupado">🔗</span>}
                  </td>
                  <td className="py-3 px-2 max-w-xs hidden md:table-cell">
                    <p className="truncate">{inc.descripcion}</p>
                    <p className="text-xs text-gray-500 truncate">{inc.ubicacionTexto}</p>
                  </td>
                  <td className="py-3 px-2 hidden lg:table-cell text-gray-600">{inc.usuarioNombre}</td>
                  <td className="py-3 px-2"><StatusBadge estado={inc.estado} /></td>
                  <td className="py-3 px-2 text-gray-500 text-xs hidden sm:table-cell whitespace-nowrap">
                    {formatDateShort(inc.fechaCreacion)}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Link to={`/incidentes/${inc.id}`} className="text-udla-600 hover:text-udla-700 font-medium text-sm">
                      Ver →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
