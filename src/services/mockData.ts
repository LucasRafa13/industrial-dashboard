import type { MachineStatus } from '../types/MachineStatus'
import type { Alert } from '../types/Alert'

export const mockMachineStatus: MachineStatus = {
  id: '1',
  timestamp: new Date(),
  state: 'RUNNING',
  metrics: {
    temperature: 78,
    rpm: 1200,
    uptime: 5.38, // em horas
    efficiency: 92,
  },
  oee: {
    overall: 92,
    availability: 98,
    performance: 95,
    quality: 94,
  },
}

export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    level: 'CRITICAL',
    message: 'Temperatura Alta',
    component: 'Misturador',
    timestamp: new Date(),
    acknowledged: false,
  },
  {
    id: 'a2',
    level: 'WARNING',
    message: 'RPM Baixo',
    component: 'Prensa',
    timestamp: new Date(),
    acknowledged: false,
  },
  {
    id: 'a3',
    level: 'INFO',
    message: 'Manutenção Próxima',
    component: 'Resfriador',
    timestamp: new Date(),
    acknowledged: true,
  },
]
