import type { Meta, StoryObj } from '@storybook/react'
import ThemeToggle from '../components/ThemeToggle'
import { ThemeProvider } from '../context/ThemeContext'

const meta: Meta<typeof ThemeToggle> = {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof ThemeToggle>

export const Default: Story = {}
