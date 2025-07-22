import { Outlet } from 'react-router-dom'
import ThemeToggle from '@/components/ThemeToggle'
import Logo from '@/assets/logo.png'
import { Settings } from 'lucide-react'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="w-16 h-auto object-contain" />
            <h1 className="text-xl font-bold transition-colors duration-300">
              Dashboard de Monitoramento
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Status: <span className="text-green-500">✅ Conectado</span>
            </span>
            <Settings className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </header>

      <main className="p-6 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  )
}
