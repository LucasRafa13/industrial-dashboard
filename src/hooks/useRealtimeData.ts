import { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import type { MachineStatus } from '../types/MachineStatus'
import { mockMachineStatus } from '../services/mockData'
import type { MetricHistory } from '../types/MetricHistory'

interface UseRealtimeDataOptions {
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

// Hook customizado para gerenciar persistência de dados
function usePersistentState<T>(
  key: string,
  defaultValue: T,
  enabled: boolean = true,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (!enabled) return defaultValue

    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const setPersistentState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const newValue =
          typeof value === 'function' ? (value as Function)(prev) : value

        if (enabled) {
          try {
            localStorage.setItem(key, JSON.stringify(newValue))
          } catch (error) {
            console.warn('Failed to persist state:', error)
          }
        }

        return newValue
      })
    },
    [key, enabled],
  )

  return [state, setPersistentState]
}

export const useRealtimeData = (
  options: UseRealtimeDataOptions = {},
): UseRealtimeDataReturn => {
  const {
    updateInterval = 3000,
    maxHistorySize = 30,
    enablePersistence = true,
  } = options

  // Estados principais
  const [status, setStatus] = useState<MachineStatus>(mockMachineStatus)
  const [isConnected, setIsConnected] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [connectionAttempts, setConnectionAttempts] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastUpdateRef = useRef<Date>(new Date())
  const simulationStateRef = useRef({
    temperatureTrend: 0,
    rpmTrend: 0,
    stabilityCounter: 0,
  })

  // Estado persistente para histórico
  const [history, setHistory] = usePersistentState<MetricHistory[]>(
    'metricHistory',
    [],
    enablePersistence,
  )

  // Debounced status para reduzir re-renders
  const debouncedStatus = useDebounce(status, 100)

  const generateNewMetrics = useCallback((currentStatus: MachineStatus) => {
    const { temperatureTrend, rpmTrend, stabilityCounter } =
      simulationStateRef.current
    const now = new Date()
    const timeDelta = (now.getTime() - lastUpdateRef.current.getTime()) / 1000

    // Simulação mais realística com tendências
    let tempChange = (Math.random() - 0.5) * 2
    let rpmChange = (Math.random() - 0.5) * 20

    // Aplicar tendências para criar padrões mais realísticos
    if (stabilityCounter > 5) {
      // Período de estabilidade
      tempChange *= 0.3
      rpmChange *= 0.3
      simulationStateRef.current.stabilityCounter = 0
    } else {
      simulationStateRef.current.stabilityCounter++
    }

    tempChange += temperatureTrend * 0.1
    rpmChange += rpmTrend * 0.1

    if (Math.random() < 0.1) {
      simulationStateRef.current.temperatureTrend = (Math.random() - 0.5) * 4
      simulationStateRef.current.rpmTrend = (Math.random() - 0.5) * 40
    }

    const newTemp = Math.min(
      90,
      Math.max(60, currentStatus.metrics.temperature + tempChange),
    )
    const newRpm = Math.max(
      800,
      Math.min(1500, currentStatus.metrics.rpm + rpmChange),
    )

    const tempEfficiency = newTemp < 85 ? 1 : 0.9
    const rpmEfficiency = newRpm >= 1100 && newRpm <= 1400 ? 1 : 0.85
    const newEfficiency = Math.min(
      100,
      Math.max(
        70,
        tempEfficiency * rpmEfficiency * 95 + (Math.random() * 10 - 5),
      ),
    )

    return {
      temperature: newTemp,
      rpm: newRpm,
      efficiency: newEfficiency,
      uptime: currentStatus.metrics.uptime + timeDelta / 3600,
    }
  }, [])

  const simulateConnection = useCallback(() => {
    const shouldDisconnect = Math.random() < 0.02 

    if (shouldDisconnect && isConnected) {
      setIsConnected(false)
      setConnectionAttempts(0)
      return false
    }

    if (!isConnected) {
      setConnectionAttempts((prev) => prev + 1)
      // Reconecta após algumas tentativas
      if (connectionAttempts > 3) {
        setIsConnected(true)
        setConnectionAttempts(0)
        return true
      }
      return false
    }

    return true
  }, [isConnected, connectionAttempts])

  const updateStatus = useCallback(() => {
    const connected = simulateConnection()
    const now = new Date()

    if (!connected) {
      return
    }

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
            Math.max(75, (newMetrics.rpm / 1400) * 100),
          ),
          quality: Math.min(100, Math.max(80, newMetrics.efficiency)),
          overall: 0, 
        },
      }

      updatedStatus.oee.overall =
        (updatedStatus.oee.availability *
          updatedStatus.oee.performance *
          updatedStatus.oee.quality) /
        10000

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
  }, [generateNewMetrics, simulateConnection, maxHistorySize, setHistory])

  const connectionQuality = useMemo(() => {
    if (!isConnected) return 'disconnected'
    if (!lastUpdate) return 'excellent'

    const timeSinceUpdate = Date.now() - lastUpdate.getTime()

    if (timeSinceUpdate < updateInterval * 1.5) return 'excellent'
    if (timeSinceUpdate < updateInterval * 3) return 'good'
    if (timeSinceUpdate < updateInterval * 6) return 'poor'
    return 'disconnected'
  }, [isConnected, lastUpdate, updateInterval])

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

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      } else {
        if (!intervalRef.current) {
          updateStatus() // Update imediato
          intervalRef.current = setInterval(updateStatus, updateInterval)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [updateStatus, updateInterval])

  useEffect(() => {
    const handleOnline = () => setIsConnected(true)
    const handleOffline = () => setIsConnected(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return {
    ...debouncedStatus,
    isConnected,
    lastUpdate,
    historySize: history.length,
    connectionQuality,
  }
}
