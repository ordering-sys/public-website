'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { Lang } from '@/lib/i18n'

/* ─── Types ─── */
export type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  lang: Lang
  toggleTheme: () => void
  setLang: (l: Lang) => void
}

/* ─── Context ─── */
const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  lang: 'km',
  toggleTheme: () => {},
  setLang: () => {},
})

/* ─── Provider ─── */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [lang,  setLangState] = useState<Lang>('km')
  const [mounted, setMounted] = useState(false)

  /* Read persisted prefs on first mount */
  useEffect(() => {
    const savedTheme = localStorage.getItem('cafe-theme') as Theme | null
    const savedLang  = localStorage.getItem('cafe-lang')  as Lang  | null

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolvedTheme: Theme = savedTheme ?? (prefersDark ? 'dark' : 'light')
    const resolvedLang:  Lang  = savedLang  ?? 'km'

    setTheme(resolvedTheme)
    setLangState(resolvedLang)
    setMounted(true)
  }, [])

  /* Apply theme attr to <html> whenever it changes */
  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('lang', lang === 'km' ? 'km' : 'en')
    localStorage.setItem('cafe-theme', theme)
  }, [theme, mounted, lang])

  /* Apply lang attr */
  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('lang', lang === 'km' ? 'km' : 'en')
    localStorage.setItem('cafe-lang', lang)
  }, [lang, mounted])

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cafe-lang', l)
        document.documentElement.setAttribute('lang', l === 'km' ? 'km' : 'en')
      } catch (err) {
        console.error('Failed to save language preference:', err)
      }
    }
  }, [])

  /* Prevent flash: render nothing until localStorage is read */
  if (!mounted) return null

  return (
    <ThemeContext.Provider value={{ theme, lang, toggleTheme, setLang }}>
      {children}
    </ThemeContext.Provider>
  )
}

/* ─── Hook ─── */
export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
