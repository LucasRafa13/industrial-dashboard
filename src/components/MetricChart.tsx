import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts'
import { useEffect, useState, useMemo, useCallback, memo } from 'react'
import type { MetricHistory } from '@/types/MetricHistory'

interface MetricChartProps {
  metric: {
    temperature: number
    rpm: number
    efficiency: number
  }
}

// Custom Tooltip Component memoizado para performance
const CustomTooltip = memo(({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-3"
      role="tooltip"
      aria-live="polite"
    >
      <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        {new Date(label).toLocaleTimeString('pt-BR')}
      </p>
      {payload.map((entry: any, index: number) => (
        <p
          key={`tooltip-${index}`}
          className="text-sm"
          style={{ color: entry.color }}
        >
          <span className="font-medium">{entry.name}:</span>{' '}
          {entry.value.toFixed(1)}
          {entry.dataKey === 'temperature'
            ? '°C'
            : entry.dataKey === 'efficiency'
            ? '%'
            : ''}
        </p>
      ))}
    </div>
  )
})

CustomTooltip.displayName = 'CustomTooltip'

// Formatters memoizados
const formatXAxisTick = (tick: any) =>
  new Date(tick).toLocaleTimeString('pt-BR', {
    minute: '2-digit',
    second: '2-digit',
  })

const MetricChart = memo(({ metric }: MetricChartProps) => {
  const [history, setHistory] = useState<MetricHistory[]>([])

  const updateHistory = useCallback((newMetric: typeof metric) => {
    const newEntry: MetricHistory = {
      timestamp: new Date(),
      temperature: newMetric.temperature,
      rpm: newMetric.rpm,
      efficiency: newMetric.efficiency,
    }

    setHistory((prev) => {
      const updated = [...prev, newEntry]
      return updated.slice(-30)
    })
  }, [])

  useEffect(() => {
    updateHistory(metric)
  }, [metric, updateHistory])

  const chartConfig = useMemo(
    () => ({
      temperature: {
        stroke: '#f97316',
        name: 'Temperatura (°C)',
        'aria-label':
          'Linha do gráfico mostrando temperatura ao longo do tempo',
      },
      rpm: {
        stroke: '#3b82f6',
        name: 'RPM',
        'aria-label': 'Linha do gráfico mostrando RPM ao longo do tempo',
      },
      efficiency: {
        stroke: '#10b981',
        name: 'Eficiência (%)',
        'aria-label': 'Linha do gráfico mostrando eficiência ao longo do tempo',
      },
    }),
    [],
  )

  const currentMetrics = useMemo(
    () => ({
      temperature: metric.temperature.toFixed(1),
      rpm: Math.round(metric.rpm).toString(),
      efficiency: Math.round(metric.efficiency).toString(),
    }),
    [metric.temperature, metric.rpm, metric.efficiency],
  )

  return (
    <section
      className="mt-8 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow"
      aria-labelledby="metrics-chart-title"
    >
      <h3
        id="metrics-chart-title"
        className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
      >
        Gráfico de Métricas
      </h3>

      <div
        className="flex gap-6 mb-4 text-sm text-gray-700 dark:text-gray-300"
        role="region"
        aria-label="Métricas atuais"
      >
        <div
          data-testid="metric-temperature"
          aria-label={`Temperatura atual: ${currentMetrics.temperature} graus Celsius`}
        >
          <span className="font-medium">Temperatura:</span>{' '}
          <span className="font-bold text-orange-600 dark:text-orange-400">
            {currentMetrics.temperature}°C
          </span>
        </div>

        <div
          data-testid="metric-rpm"
          aria-label={`RPM atual: ${currentMetrics.rpm}`}
        >
          <span className="font-medium">RPM:</span>{' '}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {currentMetrics.rpm}
          </span>
        </div>

        <div
          data-testid="metric-efficiency"
          aria-label={`Eficiência atual: ${currentMetrics.efficiency} por cento`}
        >
          <span className="font-medium">Eficiência:</span>{' '}
          <span className="font-bold text-green-600 dark:text-green-400">
            {currentMetrics.efficiency}%
          </span>
        </div>
      </div>

      <div
        role="img"
        aria-label="Gráfico de linhas mostrando histórico de temperatura, RPM e eficiência ao longo do tempo"
        tabIndex={0}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            // Poderia abrir modal com dados detalhados
            console.log('Gráfico ativado via teclado')
          }
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={history}
            accessibilityLayer
            role="graphics-document"
            aria-label="Gráfico de métricas industriais"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="gray" opacity={0.3} />

            <XAxis
              dataKey="timestamp"
              tickFormatter={formatXAxisTick}
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#6b7280' }}
            />

            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#6b7280' }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeDasharray: '3 3' }}
            />

            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
              }}
            />

            <Line
              type="monotone"
              dataKey="temperature"
              stroke={chartConfig.temperature.stroke}
              name={chartConfig.temperature.name}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              aria-label={chartConfig.temperature['aria-label']}
            />

            <Line
              type="monotone"
              dataKey="rpm"
              stroke={chartConfig.rpm.stroke}
              name={chartConfig.rpm.name}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              aria-label={chartConfig.rpm['aria-label']}
            />

            <Line
              type="monotone"
              dataKey="efficiency"
              stroke={chartConfig.efficiency.stroke}
              name={chartConfig.efficiency.name}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              aria-label={chartConfig.efficiency['aria-label']}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Texto alternativo para screen readers */}
      <div className="sr-only">
        {history.length > 0 && (
          <p>
            Gráfico mostra {history.length} pontos de dados. Temperatura varia
            entre {Math.min(...history.map((h) => h.temperature)).toFixed(1)}°C
            e {Math.max(...history.map((h) => h.temperature)).toFixed(1)}°C. RPM
            varia entre {Math.min(...history.map((h) => h.rpm))} e{' '}
            {Math.max(...history.map((h) => h.rpm))}. Eficiência varia entre{' '}
            {Math.min(...history.map((h) => h.efficiency))}% e{' '}
            {Math.max(...history.map((h) => h.efficiency))}%.
          </p>
        )}
      </div>
    </section>
  )
})

MetricChart.displayName = 'MetricChart'

export default MetricChart
