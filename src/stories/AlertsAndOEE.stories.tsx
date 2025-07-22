import type { Meta, StoryObj } from '@storybook/react'
import AlertsAndOEE from '../components/AlertsAndOEE'
import type { Alert } from '../types/Alert'

const meta: Meta<typeof AlertsAndOEE> = {
  title: 'Components/AlertsAndOEE',
  component: AlertsAndOEE,
  tags: ['autodocs'],
  args: {
    alerts: [
      {
        id: '1',
        level: 'CRITICAL',
        message: 'Falha no motor da linha 3',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min atrás
      },
      {
        id: '2',
        level: 'WARNING',
        message: 'Temperatura acima do ideal',
        timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 min atrás
      },
      {
        id: '3',
        level: 'INFO',
        message: 'Manutenção agendada para amanhã',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
      },
    ] as Alert[],
    oee: {
      overall: 85.3,
      availability: 92.0,
      performance: 80.5,
      quality: 95.0,
    },
  },
}
export default meta

type Story = StoryObj<typeof AlertsAndOEE>

export const Default: Story = {}
