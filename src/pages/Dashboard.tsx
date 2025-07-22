import { useRealtimeData } from '../hooks/useRealtimeData'
import AlertsAndOEE from '../components/AlertsAndOEE'
import { mockAlerts } from '../services/mockData'
import MetricChart from '../components/MetricChart'

export default function Dashboard() {
  const data = useRealtimeData()
  const { state, metrics } = data

  const formatUptime = (uptime: number) => {
    const h = Math.floor(uptime)
    const m = Math.floor((uptime % 1) * 60)
    return `${h}h ${m}m`
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Estado da Máquina
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Status: {state === 'RUNNING' ? 'Ligada' : state}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Temperatura
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {metrics.temperature.toFixed(1)}°C{' '}
            {metrics.temperature >= 78 ? '▲' : '▼'}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            RPM
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {metrics.rpm.toFixed(0)} {metrics.rpm >= 1200 ? '▲' : '▼'}
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tempo de Operação
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {formatUptime(metrics.uptime)}
          </p>
        </div>
      </div>
      <MetricChart metric={data.metrics} />
      <AlertsAndOEE alerts={mockAlerts} oee={data.oee} />
    </>
  )
}
