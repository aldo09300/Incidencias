import { useState, useMemo, useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, Legend, CartesianGrid,
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useIncidents } from '../hooks/useIncidents'
import Loader from '../components/Loader'
import { TIPOS_INCIDENTE, ESTADOS_LIST } from '../utils/constants'
import { filterByPeriod, formatDateShort } from '../utils/helpers'

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
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3 no-print">
        <div>
          <h1>Estadísticas</h1>
          <p className="text-sm text-gray-600 mt-1">
            {isAdmin ? 'Resumen general de incidentes' : 'Resumen de tus incidentes'}
          </p>
        </div>
        <button onClick={handlePrint} className="btn-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
          </svg>
          Imprimir reporte
        </button>
      </div>

      <div className="card mb-6 no-print">
        <p className="label-field mb-2">Periodo</p>
        <div className="flex flex-wrap gap-2">
          {[
            { v: '7dias',  l: '7 días'  },
            { v: '30dias', l: '30 días' },
            { v: '90dias', l: '90 días' },
            { v: 'todos',  l: 'Todo'    },
          ].map(p => (
            <button
              key={p.v}
              onClick={() => setPeriodo(p.v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                periodo === p.v
                  ? 'bg-udla-500 border-udla-500 text-white'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {p.l}
            </button>
          ))}
        </div>
      </div>

      <div ref={printRef} className="print-area">
        <div className="hidden print:block mb-6 pb-4 border-b-2 border-udla-500">
          <div className="flex items-center gap-4">
            <img src="/logo-udla.png" alt="UDLA" className="w-16 h-16" />
            <div>
              <h2 className="text-udla-700">Universidad de la Amazonia</h2>
              <p className="text-sm text-gray-600">Sistema de Reporte de Incidentes</p>
              <p className="text-sm font-semibold mt-1">Reporte de estadísticas — {periodLabel}</p>
              <p className="text-xs text-gray-500">Generado: {formatDateShort(new Date())}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <StatBox label="Total incidentes" value={stats.total} />
          {stats.porEstado.map(e => (
            <StatBox key={e.key} label={e.name} value={e.value} color={COLORS_ESTADO[e.key]} />
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4 mb-6">
          <div className="card">
            <h3 className="mb-4">Incidentes por estado</h3>
            {stats.total === 0 ? (
              <p className="text-gray-500 text-center py-12">Sin datos en este periodo</p>
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
            <h3 className="mb-4">Incidentes por tipo</h3>
            {stats.porTipo.length === 0 ? (
              <p className="text-gray-500 text-center py-12">Sin datos en este periodo</p>
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
          <h3 className="mb-4">Desglose detallado</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Por estado</p>
              <table className="w-full text-sm">
                <tbody>
                  {stats.porEstado.map(e => (
                    <tr key={e.key} className="border-b border-gray-100">
                      <td className="py-2">{e.name}</td>
                      <td className="py-2 text-right font-semibold">{e.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Por tipo</p>
              <table className="w-full text-sm">
                <tbody>
                  {stats.porTipo.length === 0
                    ? <tr><td className="py-2 text-gray-500">Sin datos</td></tr>
                    : stats.porTipo.map(t => (
                      <tr key={t.name} className="border-b border-gray-100">
                        <td className="py-2">{t.name}</td>
                        <td className="py-2 text-right font-semibold">{t.value}</td>
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
    <div className="card">
      {color && <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: color }}></div>}
      <p className="text-xs text-gray-600 font-medium">{label}</p>
      <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  )
}

export default Statistics
