import type { Meta, StoryObj } from '@storybook/react'
import MetricChart from '../components/MetricChart'

const meta: Meta<typeof MetricChart> = {
  title: 'Components/MetricChart',
  component: MetricChart,
  tags: ['autodocs'],
  args: {
    metric: {
      temperature: 78.5,
      rpm: 1200,
      efficiency: 88.2,
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
}
export default meta

type Story = StoryObj<typeof MetricChart>

export const Default: Story = {}
