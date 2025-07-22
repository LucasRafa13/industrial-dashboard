export interface Alert {
  id: string
  level: 'INFO' | 'WARNING' | 'CRITICAL'
  message: string
  component: string
  machineId?: string // ID da máquina relacionada
  timestamp: Date
  acknowledged: boolean
  category?:
    | 'TEMPERATURE'
    | 'PRESSURE'
    | 'VIBRATION'
    | 'MAINTENANCE'
    | 'FUEL'
    | 'EFFICIENCY'
    | 'STATUS'
}
