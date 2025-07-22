import type { Alert } from '@/types/Alert'
import { useMemo, memo, useCallback } from 'react'

interface AlertsAndOEEProps {
  alerts: Alert[]
  oee: {
    overall: number
    availability: number
    performance: number
    quality: number
  }
}

const alertConfig = {
  CRITICAL: {
    bgColor: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-300',
    borderColor: 'border-red-200 dark:border-red-800',
    icon: '🔴',
    priority: 3,
    ariaLabel: 'Alerta crítico',
  },
  WARNING: {
    bgColor: 'bg-yellow-400',
    textColor: 'text-yellow-700 dark:text-yellow-300',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
    icon: '🟡',
    priority: 2,
    ariaLabel: 'Alerta de aviso',
  },
  INFO: {
    bgColor: 'bg-blue-400',
    textColor: 'text-blue-700 dark:text-blue-300',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: '🔵',
    priority: 1,
    ariaLabel: 'Alerta informativo',
  },
} as const

const AlertItem = memo(({ alert }: { alert: Alert; index: number }) => {
  const config = alertConfig[alert.level]

  const formatTime = useCallback((timestamp: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - timestamp.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return 'agora'
    if (diffMins < 60) return `${diffMins}min`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h`

    return timestamp.toLocaleDateString('pt-BR')
  }, [])

  return (
    <li
      key={alert.id}
      className={`flex items-start gap-3 p-3 rounded-lg border ${config.borderColor} ${config.textColor} bg-opacity-5 transition-colors hover:bg-opacity-10 focus-within:ring-2 focus-within:ring-blue-500`}
      role="listitem"
      aria-label={`${config.ariaLabel}: ${alert.message}`}
      tabIndex={0}
    >
      <span
        className={`w-3 h-3 mt-1 rounded-full ${config.bgColor} flex-shrink-0`}
        role="img"
        aria-label={config.ariaLabel}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <span className="text-xs font-medium uppercase tracking-wide opacity-75">
              {alert.level}
            </span>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
              {alert.message}
            </p>
            {alert.component && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Componente: {alert.component}
              </p>
            )}
          </div>

          <time
            className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0"
            dateTime={alert.timestamp.toISOString()}
            aria-label={`Ocorreu ${formatTime(alert.timestamp)}`}
          >
            {formatTime(alert.timestamp)}
          </time>
        </div>
      </div>
    </li>
  )
})

AlertItem.displayName = 'AlertItem'

const OEEMetric = memo(
  ({
    label,
    value,
    description,
  }: {
    label: string
    value: number
    description: string
  }) => {
    const getColorClass = useCallback((val: number) => {
      if (val >= 90) return 'text-green-600 dark:text-green-400'
      if (val >= 75) return 'text-yellow-600 dark:text-yellow-400'
      return 'text-red-600 dark:text-red-400'
    }, [])

    const getPerformanceDescription = useCallback((val: number) => {
      if (val >= 90) return 'Excelente'
      if (val >= 75) return 'Bom'
      if (val >= 60) return 'Regular'
      return 'Crítico'
    }, [])

    return (
      <li className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {label}:
        </span>
        <div className="text-right">
          <span
            className={`text-sm font-bold ${getColorClass(value)}`}
            aria-label={`${label}: ${value.toFixed(
              0,
            )} por cento, performance ${getPerformanceDescription(value)}`}
          >
            {value.toFixed(0)}%
          </span>
          <span className="sr-only">{description}</span>
        </div>
      </li>
    )
  },
)

OEEMetric.displayName = 'OEEMetric'

const AlertsAndOEE = memo(({ alerts, oee }: AlertsAndOEEProps) => {
  const sortedAlerts = useMemo(() => {
    return [...alerts]
      .sort((a, b) => {
        const priorityDiff =
          alertConfig[b.level].priority - alertConfig[a.level].priority
        if (priorityDiff !== 0) return priorityDiff

        return b.timestamp.getTime() - a.timestamp.getTime()
      })
      .slice(0, 10)
  }, [alerts])

  const oeeMetrics = useMemo(
    () => [
      {
        label: 'OEE',
        value: oee.overall,
        description:
          'Overall Equipment Effectiveness - eficiência geral do equipamento',
      },
      {
        label: 'Disponibilidade',
        value: oee.availability,
        description: 'Tempo de operação versus tempo planejado',
      },
      {
        label: 'Performance',
        value: oee.performance,
        description: 'Velocidade real versus velocidade ideal',
      },
      {
        label: 'Qualidade',
        value: oee.quality,
        description: 'Produtos conformes versus total produzido',
      },
    ],
    [oee],
  )

  const alertCounts = useMemo(() => {
    const counts = { CRITICAL: 0, WARNING: 0, INFO: 0 }
    alerts.forEach((alert) => counts[alert.level]++)
    return counts
  }, [alerts])

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <section
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4"
        aria-labelledby="alerts-title"
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            id="alerts-title"
            className="text-lg font-semibold text-gray-900 dark:text-white"
          >
            Alertas Recentes
          </h3>

          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
            aria-label={`Total de ${alerts.length} alertas`}
          >
            {alerts.length}
          </span>
        </div>

        <div className="sr-only">
          Resumo dos alertas: {alertCounts.CRITICAL} críticos,{' '}
          {alertCounts.WARNING} avisos, {alertCounts.INFO} informativos.
        </div>

        {sortedAlerts.length > 0 ? (
          <ul
            className="space-y-3"
            role="list"
            aria-label="Lista de alertas ordenados por prioridade e data"
          >
            {sortedAlerts.map((alert, index) => (
              <AlertItem key={alert.id} alert={alert} index={index} />
            ))}
          </ul>
        ) : (
          <p
            className="text-sm text-gray-500 dark:text-gray-400 text-center py-8"
            role="status"
          >
            Nenhum alerta no momento
          </p>
        )}

        {alerts.length > 10 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            Mostrando 10 de {alerts.length} alertas
          </p>
        )}
      </section>

      <section
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-4"
        aria-labelledby="oee-title"
      >
        <h3
          id="oee-title"
          className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
        >
          Métricas de Eficiência
        </h3>

        <ul
          className="space-y-1"
          role="list"
          aria-label="Métricas de eficiência do equipamento"
        >
          {oeeMetrics.map((metric) => (
            <OEEMetric
              key={metric.label}
              label={metric.label}
              value={metric.value}
              description={metric.description}
            />
          ))}
        </ul>

        <div
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          role="region"
          aria-label="Indicador de performance geral"
        >
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span>Performance Geral</span>
            <span>
              {oee.overall >= 90
                ? 'Excelente'
                : oee.overall >= 75
                ? 'Bom'
                : 'Crítico'}
            </span>
          </div>

          <div
            className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
            role="progressbar"
            aria-valuenow={oee.overall}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Performance geral: ${oee.overall.toFixed(0)}%`}
          >
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                oee.overall >= 90
                  ? 'bg-green-500'
                  : oee.overall >= 75
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, oee.overall))}%` }}
            />
          </div>
        </div>
      </section>
    </div>
  )
})

AlertsAndOEE.displayName = 'AlertsAndOEE'

export default AlertsAndOEE
