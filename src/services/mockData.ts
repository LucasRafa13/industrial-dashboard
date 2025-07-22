import type { MachineStatus } from '../types/MachineStatus'
import type { Alert } from '../types/Alert'

// Dados de múltiplas máquinas industriais
export const mockMachinesData: MachineStatus[] = [
  // Misturador Principal
  {
    id: 'mix-001',
    name: 'Misturador Principal A',
    timestamp: new Date(),
    state: 'RUNNING',
    location: 'Linha de Produção 1',
    metrics: {
      temperature: 78,
      rpm: 1200,
      uptime: 5.38,
      efficiency: 92,
      pressure: 45.2, // PSI
      vibration: 0.8, // mm/s
      power: 125, // kW
    },
    oee: {
      overall: 92,
      availability: 98,
      performance: 95,
      quality: 94,
    },
  },

  // Prensa Hidráulica
  {
    id: 'press-002',
    name: 'Prensa Hidráulica B1',
    timestamp: new Date(),
    state: 'RUNNING',
    location: 'Linha de Produção 1',
    metrics: {
      temperature: 65,
      rpm: 0, // Prensa não tem RPM
      uptime: 7.25,
      efficiency: 88,
      pressure: 180.5, // PSI - maior para prensa
      vibration: 1.2,
      power: 200,
      force: 850, // Toneladas
    },
    oee: {
      overall: 88,
      availability: 95,
      performance: 92,
      quality: 90,
    },
  },

  // Resfriador
  {
    id: 'cool-003',
    name: 'Sistema Resfriamento C',
    timestamp: new Date(),
    state: 'RUNNING',
    location: 'Linha de Produção 1',
    metrics: {
      temperature: 22, // Mais baixa - é resfriador
      rpm: 850, // Ventiladores
      uptime: 12.5,
      efficiency: 95,
      pressure: 12.8,
      vibration: 0.3,
      power: 75,
      flowRate: 450, // L/min
    },
    oee: {
      overall: 95,
      availability: 99,
      performance: 96,
      quality: 98,
    },
  },

  // Extrusora
  {
    id: 'ext-004',
    name: 'Extrusora Dupla Rosca',
    timestamp: new Date(),
    state: 'MAINTENANCE',
    location: 'Linha de Produção 2',
    metrics: {
      temperature: 0, // Parada para manutenção
      rpm: 0,
      uptime: 0,
      efficiency: 0,
      pressure: 0,
      vibration: 0,
      power: 0,
      throughput: 0, // kg/h
    },
    oee: {
      overall: 0,
      availability: 0,
      performance: 0,
      quality: 0,
    },
  },

  // Compressor de Ar
  {
    id: 'comp-005',
    name: 'Compressor Atlas Copco',
    timestamp: new Date(),
    state: 'RUNNING',
    location: 'Utilidades',
    metrics: {
      temperature: 82,
      rpm: 1750,
      uptime: 15.2,
      efficiency: 87,
      pressure: 120.0, // PSI do ar comprimido
      vibration: 0.9,
      power: 300,
      airFlow: 180, // CFM
    },
    oee: {
      overall: 87,
      availability: 96,
      performance: 90,
      quality: 95,
    },
  },

  // Forno Industrial
  {
    id: 'oven-006',
    name: 'Forno Contínuo 2000°C',
    timestamp: new Date(),
    state: 'RUNNING',
    location: 'Linha de Produção 2',
    metrics: {
      temperature: 1850, // Alta temperatura
      rpm: 15, // Rotação lenta da esteira
      uptime: 18.7,
      efficiency: 91,
      pressure: 0.5, // Baixa pressão interna
      vibration: 0.1,
      power: 450,
      gasFlow: 25, // m³/h
    },
    oee: {
      overall: 91,
      availability: 97,
      performance: 94,
      quality: 93,
    },
  },

  // Bomba Centrífuga
  {
    id: 'pump-007',
    name: 'Bomba Centrífuga P1',
    timestamp: new Date(),
    state: 'RUNNING',
    location: 'Sistema Hidráulico',
    metrics: {
      temperature: 55,
      rpm: 3500,
      uptime: 22.1,
      efficiency: 89,
      pressure: 85.2,
      vibration: 1.5,
      power: 90,
      flowRate: 250, // L/min
    },
    oee: {
      overall: 89,
      availability: 98,
      performance: 91,
      quality: 96,
    },
  },

  // Transportador
  {
    id: 'conv-008',
    name: 'Esteira Transportadora ST-1',
    timestamp: new Date(),
    state: 'RUNNING',
    location: 'Linha de Produção 1',
    metrics: {
      temperature: 35,
      rpm: 180, // RPM do motor da esteira
      uptime: 8.9,
      efficiency: 96,
      pressure: 0,
      vibration: 0.4,
      power: 25,
      speed: 1.2, // m/s
    },
    oee: {
      overall: 96,
      availability: 99,
      performance: 97,
      quality: 98,
    },
  },

  // Gerador de Emergência
  {
    id: 'gen-009',
    name: 'Gerador Diesel 500kW',
    timestamp: new Date(),
    state: 'STOPPED',
    location: 'Subestação',
    metrics: {
      temperature: 25, // Temperatura ambiente - parado
      rpm: 0,
      uptime: 0,
      efficiency: 0,
      pressure: 0,
      vibration: 0,
      power: 0,
      fuelLevel: 85, // % do tanque
    },
    oee: {
      overall: 100, // Standby - funciona quando necessário
      availability: 100,
      performance: 100,
      quality: 100,
    },
  },

  // Torre de Resfriamento
  {
    id: 'tower-010',
    name: 'Torre Resfriamento TR-1',
    timestamp: new Date(),
    state: 'RUNNING',
    location: 'Sistema de Refrigeração',
    metrics: {
      temperature: 28,
      rpm: 120, // Ventiladores grandes, baixo RPM
      uptime: 24.0,
      efficiency: 93,
      pressure: 2.1,
      vibration: 0.2,
      power: 150,
      waterFlow: 2500, // L/min
    },
    oee: {
      overall: 93,
      availability: 99,
      performance: 94,
      quality: 97,
    },
  },
]

// Máquina ativa atual (primeira da lista por padrão)
export const mockMachineStatus: MachineStatus = mockMachinesData[0]

// Alertas mais realistas para múltiplas máquinas
export const mockAlerts: Alert[] = [
  {
    id: 'a1',
    level: 'CRITICAL',
    message: 'Temperatura Alta - 78°C (limite: 75°C)',
    component: 'Misturador Principal A',
    machineId: 'mix-001',
    timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min atrás
    acknowledged: false,
    category: 'TEMPERATURE',
  },
  {
    id: 'a2',
    level: 'WARNING',
    message: 'Pressão acima do normal - 180.5 PSI',
    component: 'Prensa Hidráulica B1',
    machineId: 'press-002',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min atrás
    acknowledged: false,
    category: 'PRESSURE',
  },
  {
    id: 'a3',
    level: 'INFO',
    message: 'Manutenção preventiva agendada para amanhã',
    component: 'Sistema Resfriamento C',
    machineId: 'cool-003',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min atrás
    acknowledged: true,
    category: 'MAINTENANCE',
  },
  {
    id: 'a4',
    level: 'CRITICAL',
    message: 'Máquina em manutenção - produção interrompida',
    component: 'Extrusora Dupla Rosca',
    machineId: 'ext-004',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min atrás
    acknowledged: true,
    category: 'MAINTENANCE',
  },
  {
    id: 'a5',
    level: 'WARNING',
    message: 'Vibração elevada detectada - 1.5 mm/s',
    component: 'Bomba Centrífuga P1',
    machineId: 'pump-007',
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 min atrás
    acknowledged: false,
    category: 'VIBRATION',
  },
  {
    id: 'a6',
    level: 'INFO',
    message: 'Nível de combustível baixo - 85%',
    component: 'Gerador Diesel 500kW',
    machineId: 'gen-009',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
    acknowledged: false,
    category: 'FUEL',
  },
  {
    id: 'a7',
    level: 'WARNING',
    message: 'Temperatura do forno próxima ao limite - 1850°C',
    component: 'Forno Contínuo 2000°C',
    machineId: 'oven-006',
    timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 min atrás
    acknowledged: false,
    category: 'TEMPERATURE',
  },
  {
    id: 'a8',
    level: 'INFO',
    message: 'Operação normal - todos os parâmetros OK',
    component: 'Esteira Transportadora ST-1',
    machineId: 'conv-008',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1h atrás
    acknowledged: true,
    category: 'STATUS',
  },
  {
    id: 'a9',
    level: 'WARNING',
    message: 'Eficiência abaixo do esperado - 87%',
    component: 'Compressor Atlas Copco',
    machineId: 'comp-005',
    timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 min atrás
    acknowledged: false,
    category: 'EFFICIENCY',
  },
  {
    id: 'a10',
    level: 'INFO',
    message: 'Sistema operando em modo econômico',
    component: 'Torre Resfriamento TR-1',
    machineId: 'tower-010',
    timestamp: new Date(Date.now() - 90 * 60 * 1000), // 1.5h atrás
    acknowledged: true,
    category: 'STATUS',
  },
]

// Função para obter dados de uma máquina específica
export const getMachineById = (id: string): MachineStatus | undefined => {
  return mockMachinesData.find((machine) => machine.id === id)
}

// Função para obter alertas de uma máquina específica
export const getAlertsByMachineId = (machineId: string): Alert[] => {
  return mockAlerts.filter((alert) => alert.machineId === machineId)
}

// Função para obter máquinas por localização
export const getMachinesByLocation = (location: string): MachineStatus[] => {
  return mockMachinesData.filter((machine) => machine.location === location)
}

// Função para obter estatísticas gerais
export const getOverallStats = () => {
  const runningMachines = mockMachinesData.filter(
    (m) => m.state === 'RUNNING',
  ).length
  const totalMachines = mockMachinesData.length
  const criticalAlerts = mockAlerts.filter(
    (a) => a.level === 'CRITICAL' && !a.acknowledged,
  ).length
  const avgEfficiency =
    mockMachinesData.reduce((sum, m) => sum + m.metrics.efficiency, 0) /
    totalMachines

  return {
    runningMachines,
    totalMachines,
    criticalAlerts,
    avgEfficiency: Math.round(avgEfficiency),
    uptime: Math.round((runningMachines / totalMachines) * 100),
  }
}

// Localizações disponíveis
export const locations = [
  'Linha de Produção 1',
  'Linha de Produção 2',
  'Utilidades',
  'Sistema Hidráulico',
  'Subestação',
  'Sistema de Refrigeração',
]

// Tipos de máquinas
export const machineTypes = [
  'Misturador',
  'Prensa',
  'Resfriador',
  'Extrusora',
  'Compressor',
  'Forno',
  'Bomba',
  'Transportador',
  'Gerador',
  'Torre de Resfriamento',
]
