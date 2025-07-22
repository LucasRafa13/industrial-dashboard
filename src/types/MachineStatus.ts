export interface MachineStatus {
  id: string
  timestamp: Date
  state: 'RUNNING' | 'STOPPED' | 'MAINTENANCE' | 'ERROR'
  metrics: {
    temperature: number
    rpm: number
    uptime: number
    efficiency: number
  }
  oee: {
    overall: number
    availability: number
    performance: number
    quality: number
  }
}
