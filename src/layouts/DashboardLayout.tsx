import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import ThemeToggle from '@/components/ThemeToggle'
import MachineSelector from '@/components/MachineSelector'
import Logo from '@/assets/logo.png'
import { Settings, X } from 'lucide-react'
import type { MachineStatus } from '@/types/MachineStatus'

// Opção padrão "Todas as Máquinas"
const allMachinesOption: MachineStatus = {
  id: 'all',
  name: 'Todas as Máquinas',
  timestamp: new Date(),
  state: 'RUNNING',
  location: 'Visão Geral',
  metrics: {
    temperature: 0,
    rpm: 0,
    uptime: 0,
    efficiency: 0,
  },
  oee: {
    overall: 0,
    availability: 0,
    performance: 0,
    quality: 0,
  },
}

export default function DashboardLayout() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  // Inicia com "Todas as Máquinas" selecionado
  const [selectedMachine, setSelectedMachine] =
    useState<MachineStatus>(allMachinesOption)

  const handleMachineChange = (machine: MachineStatus) => {
    setSelectedMachine(machine)
    // Aqui você poderia disparar um evento global ou usar context para comunicar a mudança
    // Por enquanto, vamos apenas fechar o modal
    setIsSettingsOpen(false)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-300">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <img src={Logo} alt="Logo" className="w-16 h-auto object-contain" />
            <div>
              <h1 className="text-xl font-bold transition-colors duration-300">
                Dashboard de Monitoramento
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedMachine.name || selectedMachine.id} •{' '}
                {selectedMachine.location}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
              Status: <span className="text-green-500">✅ Conectado</span>
            </span>

            {/* Botão Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
              aria-label="Abrir configurações"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="p-6 transition-all duration-300">
        <Outlet context={{ selectedMachine, setSelectedMachine }} />
      </main>

      {/* Modal de Settings */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Configurações do Dashboard
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Selecione uma máquina para monitorar
                </p>
              </div>

              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Fechar configurações"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-6">
              <MachineSelector
                selectedMachine={selectedMachine}
                onMachineChange={handleMachineChange}
              />
            </div>

            {/* Footer do Modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
