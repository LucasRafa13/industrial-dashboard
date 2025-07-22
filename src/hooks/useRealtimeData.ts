import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import type { MachineStatus } from '../types/MachineStatus'
import { mockMachinesData, getMachineById } from '../services/mockData'
import type { MetricHistory } from '../types/MetricHistory'

interface UseRealtimeDataOptions {
  machineId?: string
  updateInterval?: number
  maxHistorySize?: number
  enablePersistence?: boolean
}

interface UseRealtimeDataReturn extends MachineStatus {
  isConnected: boolean
  lastUpdate: Date | null
  historySize: number
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected'
}

// Debounce utility
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export const useRealtimeData = (
  options: UseRealtimeDataOptions = {},
): UseRealtimeDataReturn => {
  const {
    machineId,
    updateInterval = 3000,
    maxHistorySize = 30,
  } = options

  // Buscar máquina inicial
  const initialMachine = useMemo(() => {
    if (machineId) {
      return getMachineById(machineId) || mockMachinesData[0]
    }
    return mockMachinesData[0]
  }, [machineId])

  // Estados principais
  const [status, setStatus] = useState<MachineStatus>(initialMachine)
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [connectionAttempts, setConnectionAttempts] = useState(0)

  // Referências para cleanup e controle
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastUpdateRef = useRef<Date>(new Date())
  const simulationStateRef = useRef(
    new Map<
      string,
      {
        temperatureTrend: number
        rpmTrend: number
        stabilityCounter: number
      }
    >(),
  )

  // Estado persistente para histórico por máquina
  const [history, setHistory] = useState<MetricHistory[]>([])

  // Inicializar estado da simulação para a máquina
  const getSimulationState = useCallback((machineId: string) => {
    if (!simulationStateRef.current.has(machineId)) {
      simulationStateRef.current.set(machineId, {
        temperatureTrend: 0,
        rpmTrend: 0,
        stabilityCounter: 0,
      })
    }
    return simulationStateRef.current.get(machineId)!
  }, [])

  // Função otimizada para gerar novos dados por tipo de máquina
  const generateNewMetrics = useCallback(
    (currentStatus: MachineStatus) => {
      const now = new Date()
      const timeDelta = (now.getTime() - lastUpdateRef.current.getTime()) / 1000

      // Máquina em manutenção ou parada não gera dados
      if (
        currentStatus.state === 'MAINTENANCE' ||
        currentStatus.state === 'STOPPED'
      ) {
        return currentStatus.metrics
      }

      let tempChange = (Math.random() - 0.5) * 2
      let rpmChange = (Math.random() - 0.5) * 20

      // Comportamento específico por tipo de máquina
      const machineType = currentStatus.name?.toLowerCase() || ''

      if (machineType.includes('forno')) {
        // Fornos têm temperatura muito alta e mais estável
        tempChange *= 0.1
        const baseTemp = 1850
        const newTemp = Math.min(2000, Math.max(1800, baseTemp + tempChange))
        return {
          ...currentStatus.metrics,
          temperature: newTemp,
          rpm: Math.max(
            10,
            Math.min(20, currentStatus.metrics.rpm + (Math.random() - 0.5) * 2),
          ),
          uptime: currentStatus.metrics.uptime + timeDelta / 3600,
          efficiency: Math.min(
            100,
            Math.max(
              85,
              currentStatus.metrics.efficiency + (Math.random() - 0.5) * 2,
            ),
          ),
        }
      }

      if (machineType.includes('resfri')) {
        // Sistemas de resfriamento têm temperatura baixa
        const newTemp = Math.min(30, Math.max(15, 22 + tempChange * 0.5))
        return {
          ...currentStatus.metrics,
          temperature: newTemp,
          rpm: Math.max(
            800,
            Math.min(900, currentStatus.metrics.rpm + rpmChange * 0.3),
          ),
          uptime: currentStatus.metrics.uptime + timeDelta / 3600,
          efficiency: Math.min(
            100,
            Math.max(
              90,
              currentStatus.metrics.efficiency + (Math.random() - 0.5) * 1,
            ),
          ),
        }
      }

      if (machineType.includes('compressor')) {
        // Compressores têm RPM mais alto e temperatura moderada
        const newTemp = Math.min(
          90,
          Math.max(70, currentStatus.metrics.temperature + tempChange),
        )
        const newRpm = Math.max(
          1600,
          Math.min(1800, currentStatus.metrics.rpm + rpmChange),
        )
        return {
          ...currentStatus.metrics,
          temperature: newTemp,
          rpm: newRpm,
          uptime: currentStatus.metrics.uptime + timeDelta / 3600,
          efficiency: Math.min(
            100,
            Math.max(
              80,
              currentStatus.metrics.efficiency + (Math.random() - 0.5) * 3,
            ),
          ),
        }
      }

      // Comportamento padrão para outras máquinas
      const newTemp = Math.min(
        90,
        Math.max(60, currentStatus.metrics.temperature + tempChange),
      )
      const newRpm = Math.max(
        800,
        Math.min(1500, currentStatus.metrics.rpm + rpmChange),
      )
      const newEfficiency = Math.min(
        100,
        Math.max(
          70,
          currentStatus.metrics.efficiency + (Math.random() - 0.5) * 2,
        ),
      )

      return {
        ...currentStatus.metrics,
        temperature: newTemp,
        rpm: newRpm,
        uptime: currentStatus.metrics.uptime + timeDelta / 3600,
        efficiency: newEfficiency,
      }
    },
    [getSimulationState],
  )

  // Função para simular perda de conexão ocasional
  const simulateConnection = useCallback(() => {
    const shouldDisconnect = Math.random() < 0.01 // 1% chance

    if (shouldDisconnect && isConnected) {
      setIsConnected(false)
      setConnectionAttempts(0)
      return false
    }

    if (!isConnected) {
      setConnectionAttempts((prev) => prev + 1)
      if (connectionAttempts > 2) {
        setIsConnected(true)
        setConnectionAttempts(0)
        return true
      }
      return false
    }

    return true
  }, [isConnected, connectionAttempts])

  // Função principal de atualização
  const updateStatus = useCallback(() => {
    const connected = simulateConnection()
    const now = new Date()

    if (!connected) return

    setStatus((prevStatus) => {
      const newMetrics = generateNewMetrics(prevStatus)

      const updatedStatus: MachineStatus = {
        ...prevStatus,
        timestamp: now,
        metrics: newMetrics,
        oee: {
          availability: Math.min(
            100,
            Math.max(85, (newMetrics.uptime / (newMetrics.uptime + 0.1)) * 100),
          ),
          performance: Math.min(
            100,
            Math.max(
              75,
              newMetrics.rpm > 0
                ? (newMetrics.rpm /
                    (prevStatus.name?.includes('compressor') ? 1700 : 1400)) *
                    100
                : 100,
            ),
          ),
          quality: Math.min(100, Math.max(80, newMetrics.efficiency)),
          overall: 0,
        },
      }

      // Calcular OEE geral
      updatedStatus.oee.overall =
        (updatedStatus.oee.availability *
          updatedStatus.oee.performance *
          updatedStatus.oee.quality) /
        10000

      // Atualizar histórico
      const newHistoryEntry: MetricHistory = {
        timestamp: now,
        temperature: newMetrics.temperature,
        rpm: newMetrics.rpm,
        efficiency: newMetrics.efficiency,
      }

      setHistory((prevHistory) => {
        const updated = [...prevHistory, newHistoryEntry]
        return updated.slice(-maxHistorySize)
      })

      lastUpdateRef.current = now
      setLastUpdate(now)

      return updatedStatus
    })
  }, [generateNewMetrics, simulateConnection, maxHistorySize])

  // Atualizar máquina quando machineId muda
  useEffect(() => {
    if (machineId) {
      const machine = getMachineById(machineId)
      if (machine) {
        setStatus(machine)
        setHistory([]) // Limpar histórico ao trocar máquina
      }
    }
  }, [machineId])

  // Qualidade da conexão
  const connectionQuality = useMemo(() => {
    if (!isConnected) return 'disconnected'
    if (!lastUpdate) return 'excellent'

    const timeSinceUpdate = Date.now() - lastUpdate.getTime()

    if (timeSinceUpdate < updateInterval * 1.5) return 'excellent'
    if (timeSinceUpdate < updateInterval * 3) return 'good'
    if (timeSinceUpdate < updateInterval * 6) return 'poor'
    return 'disconnected'
  }, [isConnected, lastUpdate, updateInterval])

  // Configurar interval
  useEffect(() => {
    updateStatus()
    intervalRef.current = setInterval(updateStatus, updateInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [updateStatus, updateInterval])

  // Pausa/retoma baseado na visibilidade da aba
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      } else {
        if (!intervalRef.current) {
          updateStatus()
          intervalRef.current = setInterval(updateStatus, updateInterval)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [updateStatus, updateInterval])

  // Debounced status para performance
  const debouncedStatus = useDebounce(status, 100)

  return {
    ...debouncedStatus,
    isConnected,
    lastUpdate,
    historySize: history.length,
    connectionQuality,
  }
}
