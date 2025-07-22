import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark' // O tema que está realmente aplicado
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  // Função para aplicar o tema seguindo a documentação
  const applyTheme = () => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
      setActualTheme('dark')
    } else if (theme === 'light') {
      root.classList.remove('dark')
      setActualTheme('light')
    } else {
      // System theme
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches

      if (systemPrefersDark) {
        root.classList.add('dark')
        setActualTheme('dark')
      } else {
        root.classList.remove('dark')
        setActualTheme('light')
      }
    }
  }

  // Aplicar tema na inicialização
  useEffect(() => {
    // Carregar tema do localStorage
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  // Aplicar tema sempre que mudar
  useEffect(() => {
    applyTheme()

    // Escutar mudanças no sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)

    // Salvar no localStorage seguindo a documentação
    if (newTheme === 'light') {
      localStorage.theme = 'light'
    } else if (newTheme === 'dark') {
      localStorage.theme = 'dark'
    } else {
      // System - remover do localStorage
      localStorage.removeItem('theme')
    }
  }

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme: handleSetTheme, actualTheme }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
