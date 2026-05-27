import { useState, useMemo, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { useIncidents } from '../../hooks/useIncidents'
import Loader from '../../components/Loader/Loader'
import { TIPOS_INCIDENTE, ESTADOS_LIST } from '../../utils/constants'
import { filterByPeriod, formatDateShort } from '../../utils/helpers'
import './Statistics.css'

const COLORS_ESTADO = { reportado: '#f59e0b', en_proceso: '#3b82f6', resuelto: '#10b981' }
const COLORS_TIPO   = ['#00693e', '#3a8e63', '#70b58e', '#c1272d', '#a01f25', '#f59e0b', '#3b82f6', '#9333ea']

function Statistics() {
  const { user, isAdmin } = useAuth()
  const { incidentes, loading } = useIncidents(
    isAdmin ? { all: true } : { userId: user?.uid }
  )
  const [periodo, setPeriodo] = useState('30dias')
  const printRef = useRef(null)

  const filtrados = useMemo(() => filterByPeriod(incidentes, periodo), [incidentes, periodo])

  const handlePrint = useReactToPrint({ content: () => printRef.current })

  const stats = useMemo(() => {
    const porEstado = ESTADOS_LIST.map(e => ({
      name: e.label,
      value: filtrados.filter(i => i.estado === e.value).length,
      key: e.value,
    }))
    const porTipo = TIPOS_INCIDENTE.map(t => ({
      name: t.label,
      value: filtrados.filter(i => i.tipo === t.value).length,
    })).filter(x => x.value > 0)

    return {
      total: filtrados.length,
      porEstado,
      porTipo,
    }
  }, [filtrados])

  const periodLabel = {
    '7dias':  'Últimos 7 días',
    '30dias': 'Últimos 30 días',
    '90dias': 'Últimos 90 días',
    'todos':  'Todo el tiempo',
  }[periodo]

  if (loading) return <Loader fullScreen />

  return (
    <div className="statistics-container">
      <div className="statistics-header no-print">
        <div>
          <h1>Estadísticas</h1>
          <p className="statistics-subtitle">
            {isAdmin ? 'Resumen general de incidentes' : 'Resumen de tus incidentes'}
          </p>
        </div>
        <button onClick={handlePrint} className="btn-primary">
          <svg className="icon-print" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Imprimir reporte
        </button>
      </div>

      <div className="filter-card no-print">
        <label className="filter-label">Periodo</label>
        <div className="filter-buttons">
          {[
            { v: '7dias',  l: '7 días'  },
            { v: '30dias', l: '30 días' },
            { v: '90dias', l: '90 días' },
            { v: 'todos',  l: 'Todo'    },
          ].map(p => (
            <button
              key={p.v}
              onClick={() => setPeriodo(p.v)}
              className={`filter-btn ${periodo === p.v ? 'active' : ''}`}
            >
              {p.l}
            </button>
          ))}
        </div>
      </div>

      <div ref={printRef} className="print-area">
        <div className="print-header">
          <div className="print-header-content">
            <img src="/logo-udla.png" alt="UDLA" className="print-logo" />
            <div>
              <h2 className="print-title">Universidad de la Amazonia</h2>
              <p className="print-subtitle">Sistema de Reporte de Incidentes</p>
              <p className="print-meta">Reporte de estadísticas — {periodLabel}</p>
              <p className="print-date">Generado: {formatDateShort(new Date())}</p>
            </div>
          </div>
        </div>

        <div className="stats-grid-top">
          <StatBox label="Total incidentes" value={stats.total} />
          {stats.porEstado.map(e => (
            <StatBox key={e.key} label={e.name} value={e.value} color={COLORS_ESTADO[e.key]} />
          ))}
        </div>

        <div className="stats-grid-charts">
          <div className="card">
            <h3 className="card-title">Incidentes por estado</h3>
            {stats.total === 0 ? (
              <p className="empty-state">Sin datos en este periodo</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={stats.porEstado.filter(e => e.value > 0)}
                    cx="50%" cy="50%" outerRadius={90}
                    dataKey="value" label={({ name, value }) => `${name}: ${value}`}
                  >
                    {stats.porEstado.map((e, i) => (
                      <Cell key={i} fill={COLORS_ESTADO[e.key]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="card">
            <h3 className="card-title">Incidentes por tipo</h3>
            {stats.porTipo.length === 0 ? (
              <p className="empty-state">Sin datos en este periodo</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.porTipo}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={70} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" name="Cantidad">
                    {stats.porTipo.map((_, i) => (
                      <Cell key={i} fill={COLORS_TIPO[i % COLORS_TIPO.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Desglose detallado</h3>
          <div className="breakdown-grid">
            <div>
              <p className="breakdown-subtitle">Por estado</p>
              <table className="breakdown-table">
                <tbody>
                  {stats.porEstado.map(e => (
                    <tr key={e.key} className="breakdown-row">
                      <td className="breakdown-cell">{e.name}</td>
                      <td className="breakdown-cell-right">{e.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <p className="breakdown-subtitle">Por tipo</p>
              <table className="breakdown-table">
                <tbody>
                  {stats.porTipo.length === 0
                    ? <tr><td className="breakdown-empty">Sin datos</td></tr>
                    : stats.porTipo.map(t => (
                      <tr key={t.name} className="breakdown-row">
                        <td className="breakdown-cell">{t.name}</td>
                        <td className="breakdown-cell-right">{t.value}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div className="statbox-card">
      {color && <div className="statbox-indicator" style={{ backgroundColor: color }}></div>}
      <p className="statbox-label">{label}</p>
      <p className="statbox-value">{value}</p>
    </div>
  )
}

export default Statistics
