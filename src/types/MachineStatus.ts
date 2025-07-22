export interface MachineStatus {
  id: string
  name?: string // Nome amigável da máquina
  timestamp: Date
  state: 'RUNNING' | 'STOPPED' | 'MAINTENANCE' | 'ERROR'
  location?: string // Localização física
  metrics: {
    temperature: number
    rpm: number
    uptime: number
    efficiency: number
    // Métricas adicionais opcionais
    pressure?: number // PSI
    vibration?: number // mm/s
    power?: number // kW
    force?: number // Toneladas (para prensas)
    flowRate?: number // L/min
    throughput?: number // kg/h
    airFlow?: number // CFM
    gasFlow?: number // m³/h
    speed?: number // m/s (para esteiras)
    fuelLevel?: number // % (para geradores)
    waterFlow?: number // L/min
  }
  oee: {
    overall: number
    availability: number
    performance: number
    quality: number
  }
}
