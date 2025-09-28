'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react'

interface EmotionalState {
  mood: string
  intensity: number // 1-10
  duration: number
}

export interface GoddessTheme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    gradient: {
      from: string
      via: string
      to: string
    }
    backgrounds: {
      sidebar: string
      chat: string
      header: string
    }
    borders: string
    text: {
      primary: string
      secondary: string
      muted: string
    }
    mood?: string
  }
  mood: string
  emotionalState?: EmotionalState
}

interface GoddessContextType {
  currentGoddess: GoddessTheme
  switchGoddess: (goddessId: string) => void
  triggerEmotionalResponse: (mood: string, intensity: number, duration?: number) => void
  isTransitioning: boolean
}

const goddessThemes: Record<string, GoddessTheme> = {
  athena: {
    id: 'athena',
    name: 'Athena',
    colors: {
      primary: '#4338CA',
      secondary: '#8B5CF6',
      accent: '#F59E0B',
      gradient: { from: 'indigo-200', via: 'purple-200', to: 'pink-200' },
      backgrounds: { sidebar: 'from-indigo-200 via-purple-200 to-pink-200', chat: 'from-white/80 to-indigo-100/30', header: 'from-indigo-100 to-purple-100' },
      borders: 'indigo-300/50',
      text: { primary: 'indigo-800', secondary: 'indigo-600', muted: 'indigo-400' }
    },
    mood: 'wise'
  },
  aphrodite: {
    id: 'aphrodite',
    name: 'Aphrodite',
    colors: {
      primary: '#EC4899',
      secondary: '#F97316',
      accent: '#10B981',
      gradient: { from: 'rose-200', via: 'pink-200', to: 'orange-200' },
      backgrounds: { sidebar: 'from-rose-200 via-pink-200 to-orange-200', chat: 'from-white/80 to-pink-100/30', header: 'from-rose-100 to-pink-100' },
      borders: 'rose-300/50',
      text: { primary: 'rose-800', secondary: 'rose-600', muted: 'rose-400' }
    },
    mood: 'passionate'
  },
  artemis: {
    id: 'artemis',
    name: 'Artemis',
    colors: {
      primary: '#059669',
      secondary: '#0D9488',
      accent: '#F59E0B',
      gradient: { from: 'emerald-200', via: 'teal-200', to: 'green-200' },
      backgrounds: { sidebar: 'from-emerald-200 via-teal-200 to-green-200', chat: 'from-white/80 to-emerald-100/30', header: 'from-emerald-100 to-teal-100' },
      borders: 'emerald-300/50',
      text: { primary: 'emerald-800', secondary: 'emerald-600', muted: 'emerald-400' }
    },
    mood: 'fierce'
  },
  hera: {
    id: 'hera',
    name: 'Hera',
    colors: {
      primary: '#7C3AED',
      secondary: '#2563EB',
      accent: '#DC2626',
      gradient: { from: 'violet-200', via: 'purple-200', to: 'blue-200' },
      backgrounds: { sidebar: 'from-violet-200 via-purple-200 to-blue-200', chat: 'from-white/80 to-violet-100/30', header: 'from-violet-100 to-purple-100' },
      borders: 'violet-300/50',
      text: { primary: 'violet-800', secondary: 'violet-600', muted: 'violet-400' }
    },
    mood: 'regal'
  },
  demeter: {
    id: 'demeter',
    name: 'Demeter',
    colors: {
      primary: '#65A30D',
      secondary: '#CA8A04',
      accent: '#DC2626',
      gradient: { from: 'lime-200', via: 'yellow-200', to: 'amber-200' },
      backgrounds: { sidebar: 'from-lime-200 via-yellow-200 to-amber-200', chat: 'from-white/80 to-lime-100/30', header: 'from-lime-100 to-yellow-100' },
      borders: 'lime-300/50',
      text: { primary: 'lime-800', secondary: 'lime-600', muted: 'lime-400' }
    },
    mood: 'nurturing'
  },
  persephone: {
    id: 'persephone',
    name: 'Persephone',
    colors: {
      primary: '#BE185D',
      secondary: '#7C2D12',
      accent: '#059669',
      gradient: { from: 'pink-200', via: 'rose-200', to: 'red-200' },
      backgrounds: { sidebar: 'from-pink-200 via-rose-200 to-red-200', chat: 'from-white/80 to-pink-100/30', header: 'from-pink-100 to-rose-100' },
      borders: 'pink-300/50',
      text: { primary: 'pink-800', secondary: 'pink-600', muted: 'pink-400' }
    },
    mood: 'transformative'
  },
  hestia: {
    id: 'hestia',
    name: 'Hestia',
    colors: {
      primary: '#92400E',
      secondary: '#B45309',
      accent: '#059669',
      gradient: { from: 'amber-200', via: 'orange-200', to: 'yellow-200' },
      backgrounds: { sidebar: 'from-amber-200 via-orange-200 to-yellow-200', chat: 'from-white/80 to-amber-100/30', header: 'from-amber-100 to-orange-100' },
      borders: 'amber-300/50',
      text: { primary: 'amber-800', secondary: 'amber-600', muted: 'amber-400' }
    },
    mood: 'peaceful'
  },
  hecate: {
    id: 'hecate',
    name: 'Hecate',
    colors: {
      primary: '#581C87',
      secondary: '#1F2937',
      accent: '#F59E0B',
      gradient: { from: 'purple-200', via: 'gray-200', to: 'slate-200' },
      backgrounds: { sidebar: 'from-purple-200 via-gray-200 to-slate-200', chat: 'from-white/80 to-purple-100/30', header: 'from-purple-100 to-gray-100' },
      borders: 'purple-300/50',
      text: { primary: 'purple-800', secondary: 'purple-600', muted: 'purple-400' }
    },
    mood: 'mystical'
  }
}

const GoddessThemeContext = createContext<GoddessContextType | undefined>(undefined)

export function GoddessThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentGoddess, setCurrentGoddess] = useState<GoddessTheme>(goddessThemes.athena)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const triggerEmotionalResponse = (mood: string, intensity: number, duration = 5000) => {
    setIsTransitioning(true)
    setCurrentGoddess(prev => ({
      ...prev,
      mood,
      emotionalState: { mood, intensity, duration }
    }))
    
    setTimeout(() => {
      setIsTransitioning(false)
      setCurrentGoddess(prev => ({
        ...prev,
        mood: goddessThemes[prev.id].mood,
        emotionalState: undefined
      }))
    }, duration)
  }

  const switchGoddess = (goddessId: string) => {
    if (goddessThemes[goddessId] && goddessId !== currentGoddess.id) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentGoddess(goddessThemes[goddessId])
        setTimeout(() => setIsTransitioning(false), 500)
      }, 300)
    }
  }

  return (
    <GoddessThemeContext.Provider value={{
      currentGoddess,
      switchGoddess,
      triggerEmotionalResponse,
      isTransitioning
    }}>
      {children}
    </GoddessThemeContext.Provider>
  )
}

export const useGoddessTheme = () => {
  const context = useContext(GoddessThemeContext)
  if (!context) {
    throw new Error('useGoddessTheme must be used within GoddessThemeProvider')
  }
  return context
}