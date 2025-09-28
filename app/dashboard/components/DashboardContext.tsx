'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { GoddessAIService } from '@/lib/ai/hf-service'
import { MenstrualIntelligence, type MenstrualData, type MenstrualInsight } from '@/lib/ai/menstrual-intelligence'

const aiService = new GoddessAIService()
const menstrualIntelligence = new MenstrualIntelligence()

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  goddessId?: string
  goddessName?: string
  timestamp: string
  detectedEmotion?: string
  menstrualInsight?: MenstrualInsight
}

export interface Session {
  id: string
  title: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface GoddessPersona {
  id: string
  name: string
  domain: string
  personality: string
  approach: string
  specialties: string[]
  communication_style: string
  empathy_level: number
}

export interface MenstrualCycle {
  id: string
  cycle_start_date: string
  cycle_length: number
  period_length: number
  symptoms: string[]
  notes?: string
}

export interface UserProfile {
  menstrualTrackingEnabled: boolean
  averageCycleLength: number
  averagePeriodLength: number
  lastPeriodStart?: string
  menstrualCycles: MenstrualCycle[]
}

interface DashboardContextType {
  sessions: Session[]
  activeSession: Session | null
  currentGoddessId: string
  goddessPersonas: GoddessPersona[]
  loading: boolean
  userProfile: UserProfile
  currentMenstrualData: MenstrualData | null
  
  // Chat functions
  createSession: () => Promise<void>
  selectSession: (id: string) => void
  sendMessage: (content: string) => Promise<void>
  switchGoddess: (goddessId: string) => void
  renameSession: (id: string, title: string) => Promise<void>
  deleteSession: (id: string) => Promise<void>
  
  // Menstrual tracking functions
  enableMenstrualTracking: () => Promise<void>
  logPeriodStart: (date: string, symptoms: string[], notes?: string) => Promise<void>
  updateCycle: (cycleId: string, updates: Partial<MenstrualCycle>) => Promise<void>
  getCurrentCycleInsights: () => MenstrualData | null
}

const DashboardContext = createContext<DashboardContextType | null>(null)

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSession, setActiveSession] = useState<Session | null>(null)
  const [currentGoddessId, setCurrentGoddessId] = useState('athena')
  const [goddessPersonas] = useState<GoddessPersona[]>(aiService.getAllGoddesses())
  const [loading, setLoading] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    menstrualTrackingEnabled: false,
    averageCycleLength: 28,
    averagePeriodLength: 5,
    menstrualCycles: []
  })
  const [currentMenstrualData, setCurrentMenstrualData] = useState<MenstrualData | null>(null)

  // Calculate current menstrual data when profile changes
  useEffect(() => {
    if (userProfile.menstrualTrackingEnabled && userProfile.menstrualCycles.length > 0) {
      const data = getCurrentCycleInsights()
      setCurrentMenstrualData(data)
    }
  }, [userProfile])

  const getCurrentCycleInsights = (): MenstrualData | null => {
    if (!userProfile.menstrualTrackingEnabled || userProfile.menstrualCycles.length === 0) {
      return null
    }

    const lastCycle = userProfile.menstrualCycles[userProfile.menstrualCycles.length - 1]
    const lastPeriodStart = new Date(lastCycle.cycle_start_date)
    const today = new Date()
    const daysDiff = Math.floor((today.getTime() - lastPeriodStart.getTime()) / (1000 * 60 * 60 * 24))
    
    // Calculate current phase
    let currentPhase = 'follicular'
    if (daysDiff <= userProfile.averagePeriodLength) {
      currentPhase = 'menstrual'
    } else if (daysDiff >= 12 && daysDiff <= 16) {
      currentPhase = 'ovulatory'  
    } else if (daysDiff > 16) {
      currentPhase = 'luteal'
    }

    const cycleDay = daysDiff + 1
    const daysUntilNext = Math.max(0, userProfile.averageCycleLength - cycleDay + 1)

    return {
      currentPhase,
      daysUntilNext,
      symptoms: lastCycle.symptoms,
      cycleDay,
      averageCycleLength: userProfile.averageCycleLength,
      lastPeriodStart: lastCycle.cycle_start_date,
      periodLength: userProfile.averagePeriodLength,
      irregularityFlags: []
    }
  }

  const createSession = async () => {
    const newSession: Session = {
      id: `session_${Date.now()}`,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setSessions(prev => [newSession, ...prev])
    setActiveSession(newSession)
  }

  const selectSession = (id: string) => {
    const session = sessions.find(s => s.id === id) || null
    setActiveSession(session)
  }

  const sendMessage = async (content: string) => {
    if (!activeSession) return
    setLoading(true)

    try {
      const userMsg: Message = {
        id: `msg_${Date.now()}`,
        content,
        role: 'user',
        timestamp: new Date().toISOString()
      }

      const updated = {
        ...activeSession,
        messages: [...activeSession.messages, userMsg],
        updatedAt: new Date().toISOString()
      }

      setActiveSession(updated)
      setSessions(prev => prev.map(s => s.id === updated.id ? updated : s))

      // Analyze for menstrual relevance
      const menstrualInsight = await menstrualIntelligence.analyzeMenstrualRelevance(
        content,
        currentMenstrualData,
        userProfile
      )

      // Enhanced prompt for period-specific responses
      let enhancedContent = content
      if (currentMenstrualData?.currentPhase === 'menstrual') {
        enhancedContent += ` [CONTEXT: User is currently menstruating - Day ${currentMenstrualData.cycleDay} of cycle. Please be extra empathetic and consider period-related factors in your response.]`
      } else if (currentMenstrualData) {
        enhancedContent += ` [CONTEXT: User is in ${currentMenstrualData.currentPhase} phase - Day ${currentMenstrualData.cycleDay} of ${currentMenstrualData.averageCycleLength} day cycle.]`
      }

      const res = await fetch(`${window.location.origin}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: enhancedContent,
          currentGoddessId,
          sessionId: updated.id,
          conversationHistory: updated.messages,
          menstrualData: currentMenstrualData,
          menstrualInsight
        })
      })

      const data = await res.json()

      if (data.switchedGoddess) {
        setCurrentGoddessId(data.goddessId)
      }

      const goddess = goddessPersonas.find(g => g.id === data.goddessId)
      let aiResponseContent = data.message

      // Add menstrual-specific guidance if relevant
      if (menstrualInsight.phaseSpecificAdvice) {
        aiResponseContent += `\n\n💫 **Cycle Insight**: ${menstrualInsight.phaseSpecificAdvice}`
      }

      if (menstrualInsight.shouldOfferTracking) {
        aiResponseContent += `\n\n🌸 Would you like me to help you start tracking your menstrual cycle? It can provide valuable insights and personalized support.`
      }

      const aiMsg: Message = {
        id: `msg_${Date.now()}_ai`,
        content: aiResponseContent,
        role: 'assistant',
        goddessId: data.goddessId,
        goddessName: goddess?.name || 'AI Assistant',
        timestamp: new Date().toISOString(),
        detectedEmotion: data.detectedEmotion,
        menstrualInsight
      }

      const final = {
        ...updated,
        messages: [...updated.messages, aiMsg],
        updatedAt: new Date().toISOString()
      }

      setActiveSession(final)
      setSessions(prev => prev.map(s => s.id === final.id ? final : s))
    } finally {
      setLoading(false)
    }
  }

  const switchGoddess = (goddessId: string) => {
    setCurrentGoddessId(goddessId)
  }

  const renameSession = async (id: string, title: string) => {
    setSessions(prev => prev.map(s =>
      s.id === id ? { ...s, title, updatedAt: new Date().toISOString() } : s
    ))
    if (activeSession?.id === id) {
      setActiveSession(prev => prev ? { ...prev, title } : null)
    }
  }

  const deleteSession = async (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id))
    if (activeSession?.id === id) setActiveSession(null)
  }

  // Menstrual tracking functions
  const enableMenstrualTracking = async () => {
    setUserProfile(prev => ({
      ...prev,
      menstrualTrackingEnabled: true
    }))
  }

  const logPeriodStart = async (date: string, symptoms: string[], notes?: string) => {
    const newCycle: MenstrualCycle = {
      id: `cycle_${Date.now()}`,
      cycle_start_date: date,
      cycle_length: userProfile.averageCycleLength,
      period_length: userProfile.averagePeriodLength,
      symptoms,
      notes
    }

    setUserProfile(prev => ({
      ...prev,
      lastPeriodStart: date,
      menstrualCycles: [...prev.menstrualCycles, newCycle]
    }))
  }

  const updateCycle = async (cycleId: string, updates: Partial<MenstrualCycle>) => {
    setUserProfile(prev => ({
      ...prev,
      menstrualCycles: prev.menstrualCycles.map(cycle =>
        cycle.id === cycleId ? { ...cycle, ...updates } : cycle
      )
    }))
  }

  return (
    <DashboardContext.Provider value={{
      sessions,
      activeSession,
      currentGoddessId,
      goddessPersonas,
      loading,
      userProfile,
      currentMenstrualData,
      createSession,
      selectSession,
      sendMessage,
      switchGoddess,
      renameSession,
      deleteSession,
      enableMenstrualTracking,
      logPeriodStart,
      updateCycle,
      getCurrentCycleInsights
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used inside DashboardProvider')
  return ctx
}