import { useOutletContext } from 'react-router-dom'
import { useRealtimeData } from '../hooks/useRealtimeData'
import AlertsAndOEE from '../components/AlertsAndOEE'
import { mockAlerts, getAlertsByMachineId } from '../services/mockData'
import MetricChart from '../components/MetricChart'
import type { MachineStatus } from '../types/MachineStatus'
import { useMemo } from 'react'

interface DashboardContext {
  selectedMachine: MachineStatus
  setSelectedMachine: (machine: MachineStatus) => void
}

export default function Dashboard() {
  const { selectedMachine } = useOutletContext<DashboardContext>()

  const data = useRealtimeData({
    machineId: selectedMachine?.id,
    updateInterval: 3000,
  })

  const { state, metrics } = data

  // Filtrar alertas: se máquina específica selecionada, mostrar só dela; senão, mostrar todos
  const displayAlerts = useMemo(() => {
    if (!selectedMachine || selectedMachine.id === 'all') {
      return mockAlerts
    }

    const machineAlerts = getAlertsByMachineId(selectedMachine.id)

    return machineAlerts.length > 0 ? machineAlerts : mockAlerts
  }, [selectedMachine])

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
          {selectedMachine?.metrics.pressure && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Pressão: {selectedMachine.metrics.pressure} PSI
            </p>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Temperatura
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {metrics.temperature.toFixed(1)}°C{' '}
            {metrics.temperature >= 78 ? '▲' : '▼'}
          </p>
          {selectedMachine?.metrics.vibration && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Vibração: {selectedMachine.metrics.vibration} mm/s
            </p>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            RPM
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {metrics.rpm.toFixed(0)} {metrics.rpm >= 1200 ? '▲' : '▼'}
          </p>
          {selectedMachine?.metrics.power && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Potência: {selectedMachine.metrics.power} kW
            </p>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tempo de Operação
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {formatUptime(metrics.uptime)}
          </p>
          {selectedMachine?.name && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {selectedMachine.name}
            </p>
          )}
        </div>
      </div>

      <MetricChart metric={data.metrics} />

      <AlertsAndOEE alerts={displayAlerts} oee={data.oee} />
    </>
  )
}
