import { useState, useMemo } from 'react'
import type { MachineStatus } from '@/types/MachineStatus'
import {
  mockMachinesData,
  locations,
  getOverallStats,
  mockAlerts,
} from '@/services/mockData'

const allMachinesOption: MachineStatus = {
  id: 'all',
  name: 'Todas as Máquinas',
  timestamp: new Date(),
  state: 'RUNNING',
  location: 'Visão Geral',
  metrics: {
    temperature: 0,
    rpm: 0,
    uptime: 0,
    efficiency: 0,
  },
  oee: {
    overall: 0,
    availability: 0,
    performance: 0,
    quality: 0,
  },
}

interface MachineSelectorProps {
  selectedMachine: MachineStatus
  onMachineChange: (machine: MachineStatus) => void
}

export default function MachineSelector({
  selectedMachine,
  onMachineChange,
}: MachineSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>('all')

  const stats = useMemo(() => getOverallStats(), [])

  const filteredMachines = useMemo(() => {
    const machines =
      selectedLocation === 'all'
        ? mockMachinesData
        : mockMachinesData.filter(
            (machine) => machine.location === selectedLocation,
          )

    return [allMachinesOption, ...machines]
  }, [selectedLocation])

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'RUNNING':
        return 'bg-green-500'
      case 'STOPPED':
        return 'bg-red-500'
      case 'MAINTENANCE':
        return 'bg-yellow-500'
      case 'ERROR':
        return 'bg-red-700'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (state: string) => {
    switch (state) {
      case 'RUNNING':
        return 'Em Operação'
      case 'STOPPED':
        return 'Parada'
      case 'MAINTENANCE':
        return 'Manutenção'
      case 'ERROR':
        return 'Erro'
      default:
        return 'Desconhecido'
    }
  }

  return (
    <div className="relative">
      <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Máquinas Ativas
          </div>
          <div className="text-xl font-bold text-green-600">
            {stats.runningMachines}/{stats.totalMachines}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Uptime Geral
          </div>
          <div className="text-xl font-bold text-blue-600">{stats.uptime}%</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Eficiência Média
          </div>
          <div className="text-xl font-bold text-green-600">
            {stats.avgEfficiency}%
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Alertas Críticos
          </div>
          <div className="text-xl font-bold text-red-600">
            {stats.criticalAlerts}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Máquinas Industriais
          </h3>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">Todas as Localizações</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div
          className="p-4 border-2 border-blue-500 rounded-lg mb-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedMachine.id === 'all' ? (
                <div className="w-3 h-3 rounded-full bg-blue-500" />
              ) : (
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    selectedMachine.state,
                  )}`}
                />
              )}
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {selectedMachine.name || selectedMachine.id}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedMachine.id === 'all'
                    ? `${mockAlerts.length} alertas de ${mockMachinesData.length} máquinas`
                    : `${selectedMachine.location} • ${getStatusText(
                        selectedMachine.state,
                      )}`}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              {selectedMachine.id === 'all' ? (
                <>
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      Máquinas
                    </div>
                    <div className="font-medium">
                      {stats.runningMachines}/{stats.totalMachines}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      Eficiência
                    </div>
                    <div className="font-medium">{stats.avgEfficiency}%</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">Temp</div>
                    <div className="font-medium">
                      {selectedMachine.metrics.temperature}°C
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      Eficiência
                    </div>
                    <div className="font-medium">
                      {selectedMachine.metrics.efficiency}%
                    </div>
                  </div>
                </>
              )}
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredMachines.map((machine) => (
              <div
                key={machine.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  machine.id === selectedMachine.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600'
                }`}
                onClick={() => {
                  onMachineChange(machine)
                  setIsOpen(false)
                }}
              >
                {machine.id === 'all' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {machine.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Visão geral de todas as máquinas
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <div className="text-center">
                        <div className="text-gray-500">Ativas</div>
                        <div className="font-medium text-green-600">
                          {stats.runningMachines}/{stats.totalMachines}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Alertas</div>
                        <div className="font-medium text-red-600">
                          {
                            mockAlerts.filter(
                              (a) => a.level === 'CRITICAL' && !a.acknowledged,
                            ).length
                          }
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Efic. Média</div>
                        <div className="font-medium text-green-600">
                          {stats.avgEfficiency}%
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusColor(
                            machine.state,
                          )}`}
                        />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {machine.name || machine.id}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {machine.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <div className="text-center">
                          <div className="text-gray-500">Temp</div>
                          <div
                            className={`font-medium ${
                              machine.metrics.temperature > 100
                                ? 'text-red-600'
                                : machine.metrics.temperature > 80
                                ? 'text-yellow-600'
                                : 'text-green-600'
                            }`}
                          >
                            {machine.metrics.temperature}°C
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-gray-500">RPM</div>
                          <div className="font-medium">
                            {machine.metrics.rpm}
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-gray-500">Efic.</div>
                          <div
                            className={`font-medium ${
                              machine.metrics.efficiency >= 90
                                ? 'text-green-600'
                                : machine.metrics.efficiency >= 75
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }`}
                          >
                            {machine.metrics.efficiency}%
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-gray-500">Status</div>
                          <div
                            className={`font-medium text-xs px-2 py-1 rounded ${
                              machine.state === 'RUNNING'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : machine.state === 'MAINTENANCE'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                          >
                            {getStatusText(machine.state)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Métricas Adicionais */}
                    {(machine.metrics.pressure ||
                      machine.metrics.vibration ||
                      machine.metrics.power) && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex gap-4 text-xs text-gray-600 dark:text-gray-400">
                          {machine.metrics.pressure && (
                            <span>Pressão: {machine.metrics.pressure} PSI</span>
                          )}
                          {machine.metrics.vibration && (
                            <span>
                              Vibração: {machine.metrics.vibration} mm/s
                            </span>
                          )}
                          {machine.metrics.power && (
                            <span>Potência: {machine.metrics.power} kW</span>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
