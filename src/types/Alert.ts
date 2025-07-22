export interface Alert {
  id: string
  level: 'INFO' | 'WARNING' | 'CRITICAL'
  message: string
  component: string
  timestamp: Date
  acknowledged: boolean
}
