'use client'

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PaperAirplaneIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon,
  InformationCircleIcon,
  SunIcon,
  MoonIcon,
  BoltIcon
} from '@heroicons/react/24/outline'
import { useDashboard } from './DashboardContext'
import { useGoddessTheme } from './GoddessThemeContext'
import { getEmotionEffect } from '@/lib/emotionEffects'

export default function ChatWindow() {
  const {
    activeSession,
    currentGoddessId,
    goddessPersonas,
    sendMessage,
    loading,
    currentMenstrualData,
    userProfile
  } = useDashboard()

  const { currentGoddess, triggerEmotionalResponse } = useGoddessTheme()

  const [input, setInput] = useState('')
  const [currentEmotion, setCurrentEmotion] = useState('neutral')
  const [showEmotionalEffect, setShowEmotionalEffect] = useState(false)
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, type: string}>>([])
  const [ambientSparkles, setAmbientSparkles] = useState<Array<{id: number, x: number, y: number}>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Create ambient sparkles that are always present
  useEffect(() => {
    const createAmbientSparkles = () => {
      const sparkleCount = 8
      const newSparkles = Array.from({ length: sparkleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }))
      setAmbientSparkles(newSparkles)
    }

    createAmbientSparkles()
    const interval = setInterval(createAmbientSparkles, 15000) // Refresh sparkles every 15s
    return () => clearInterval(interval)
  }, [])

  // Memoize triggerEmotionalResponse to prevent dependency array changes
  const memoizedTriggerResponse = useMemo(() => triggerEmotionalResponse, [triggerEmotionalResponse])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession?.messages])

  // Enhanced emotion effects with particles and animations
  useEffect(() => {
    if (!activeSession?.messages.length) return
    const latest = activeSession.messages[activeSession.messages.length - 1]
    const emotion =
      latest.role === 'assistant' &&
      latest.detectedEmotion &&
      latest.detectedEmotion !== 'neutral'
        ? latest.detectedEmotion
        : null

    if (emotion && emotion !== currentEmotion) {
      setCurrentEmotion(emotion)
      setShowEmotionalEffect(true)
      createEmotionParticles(emotion)
      memoizedTriggerResponse(emotion, 7, 4000)

      const timeout = setTimeout(() => {
        setShowEmotionalEffect(false)
        setParticles([])
      }, 4000)

      return () => clearTimeout(timeout)
    }
  }, [activeSession?.messages, currentEmotion, memoizedTriggerResponse])

  const createEmotionParticles = (emotion: string) => {
    const count = ['happy', 'excited'].includes(emotion) ? 16 : 10
    const particleTypes = {
      happy: ['sparkle', 'star', 'heart'],
      excited: ['star', 'bolt', 'sparkle'],
      sad: ['heart', 'moon'],
      anxious: ['moon', 'circle'],
      angry: ['bolt', 'circle'],
      neutral: ['sparkle']
    }
    
    const types = particleTypes[emotion as keyof typeof particleTypes] || ['sparkle']
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      type: types[Math.floor(Math.random() * types.length)]
    }))
    setParticles(newParticles)
  }

  const renderParticle = (particle: {type: string}, className: string) => {
    switch (particle.type) {
      case 'sparkle':
        return <SparklesIcon className={className} />
      case 'star':
        return <StarIcon className={className} />
      case 'heart':
        return <HeartIcon className={className} />
      case 'sun':
        return <SunIcon className={className} />
      case 'moon':
        return <MoonIcon className={className} />
      case 'bolt':
        return <BoltIcon className={className} />
      default:
        return <motion.div className={`w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-400`} />
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading || !activeSession) return
    const text = input.trim()
    setInput('')
    await sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const goddess = goddessPersonas.find(g => g.id === currentGoddessId)!
  const emojis: Record<string, string> = {
    athena: '🦉',
    aphrodite: '🌹',
    artemis: '🏹',
    hera: '👑',
    demeter: '🌾',
    persephone: '🌸',
    hestia: '🔥',
    hecate: '🌙'
  }

  const effect = getEmotionEffect(currentEmotion)

  const getPhaseEmoji = (phase: string) => {
    const map = {
      menstrual: '🌙',
      follicular: '🌱',
      ovulatory: '✨',
      luteal: '🍂'
    }
    return map[phase as keyof typeof map] || '🌸'
  }

  if (!activeSession) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-gradient-to-br ${currentGoddess.colors.backgrounds.chat} rounded-lg m-4 shadow-sm relative overflow-hidden`}>
        {/* Ambient sparkles for welcome screen */}
        <AnimatePresence>
          {ambientSparkles.map(sparkle => (
            <motion.div
              key={sparkle.id}
              className="absolute pointer-events-none z-10"
              style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0],
                scale: [0, 1, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: 'loop',
                delay: sparkle.id * 0.5
              }}
            >
              <SparklesIcon className="w-4 h-4 text-purple-300" />
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="text-center relative z-20">
          <div className="text-6xl mb-4">💬</div>
          <h3 className={`text-xl font-semibold text-${currentGoddess.colors.text.primary} mb-2`}>
            Welcome to Pandora's Box
          </h3>
          <p className={`text-${currentGoddess.colors.text.secondary} mb-4`}>
            Select or start a conversation to begin chatting with your goddess guide.
          </p>
          {userProfile.menstrualTrackingEnabled && currentMenstrualData && (
            <div className={`inline-flex items-center space-x-2 px-4 py-2 bg-${currentGoddess.colors.text.primary.replace('text-', '')}-100/50 rounded-full`}>
              <span className="text-lg">{getPhaseEmoji(currentMenstrualData.currentPhase)}</span>
              <span className={`text-sm text-${currentGoddess.colors.text.primary}`}>
                Day {currentMenstrualData.cycleDay} • {currentMenstrualData.currentPhase} phase
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <motion.div className="flex-1 flex flex-col overflow-hidden relative m-4 rounded-lg shadow-sm">
      {/* Ambient background sparkles */}
      <AnimatePresence>
        {ambientSparkles.map(sparkle => (
          <motion.div
            key={`ambient-${sparkle.id}`}
            className="absolute pointer-events-none z-5"
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.2, 0],
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: 'loop',
              delay: sparkle.id * 0.8
            }}
          >
            <SparklesIcon className="w-3 h-3 text-white/30" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Emotion Particles */}
      <AnimatePresence>
        {showEmotionalEffect && particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute pointer-events-none z-20"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0.7, 0],
              scale: [0, 1.2, 0.8, 0],
              y: [-20, -100, -160],
              rotate: [0, 360]
            }}
            transition={{
              duration: 4,
              ease: "easeOut",
              delay: p.id * 0.1
            }}
          >
            {renderParticle(p, getParticleColor(currentEmotion))}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Emotional Background Effect with Glow */}
      <AnimatePresence>
        {showEmotionalEffect && (
          <motion.div
            className={`absolute inset-0 pointer-events-none z-10 rounded-lg`}
            style={{
              background: `radial-gradient(circle at center, ${getGlowColor(currentEmotion)} 0%, transparent 70%)`,
              filter: 'blur(100px)'
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.3, scale: 1.2 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.5 }}
          />
        )}
      </AnimatePresence>

      {/* Header with enhanced glow */}
      <div className={`relative z-30 border-b border-${currentGoddess.colors.borders} p-4 bg-gradient-to-r ${currentGoddess.colors.backgrounds.header} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className={`w-10 h-10 rounded-full bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')} to-${currentGoddess.colors.text.secondary.replace('text-', '')} flex items-center justify-center text-white text-xl shadow-lg relative`}
              whileHover={{ scale: 1.05 }}
              animate={showEmotionalEffect ? { 
                scale: [1, 1.1, 1],
                boxShadow: [
                  '0 0 20px rgba(255,255,255,0.3)',
                  '0 0 40px rgba(255,255,255,0.6)',
                  '0 0 20px rgba(255,255,255,0.3)'
                ]
              } : {}}
              transition={{ repeat: showEmotionalEffect ? Infinity : 0, duration: 2 }}
            >
              {emojis[goddess.id]}
              {showEmotionalEffect && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/20"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.div>
            <div>
              <h2 className={`font-semibold text-${currentGoddess.colors.text.primary}`}>
                {goddess.name}
              </h2>
              <p className={`text-sm text-${currentGoddess.colors.text.secondary}`}>
                {goddess.domain}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {userProfile.menstrualTrackingEnabled && currentMenstrualData && (
              <motion.div 
                className={`flex items-center space-x-1 text-xs bg-${currentGoddess.colors.text.primary.replace('text-', '')}-100/60 px-2 py-1 rounded-full relative`}
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  {getPhaseEmoji(currentMenstrualData.currentPhase)}
                </motion.span>
                <span className={`text-${currentGoddess.colors.text.primary}`}>Day {currentMenstrualData.cycleDay}</span>
                <motion.div
                  className="absolute inset-0 rounded-full bg-white/10"
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </motion.div>
            )}
            
            <AnimatePresence>
              {showEmotionalEffect && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`text-sm text-${currentGoddess.colors.text.secondary} bg-${currentGoddess.colors.text.primary.replace('text-', '')}-100/60 px-3 py-1 rounded-full backdrop-blur-sm flex items-center space-x-1`}
                >
                  <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <SparklesIcon className="w-4 h-4" />
                  </motion.div>
                  <span>{effect.goddessResponse}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div className={`text-sm text-${currentGoddess.colors.text.muted}`}>
              {activeSession.messages.length} messages
            </div>
          </div>
        </div>
      </div>

      {/* Messages with enhanced effects */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br ${currentGoddess.colors.backgrounds.chat} relative z-20`}>
        <AnimatePresence initial={false}>
          {activeSession.messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${msg.role==='user'? 'justify-end':'justify-start'}`}
            >
              <div className={`max-w-2xl ${msg.role==='user'?'order-2':''} relative`}>
                <div className="flex items-end space-x-2">
                  {msg.role==='assistant' && (
                    <motion.div
                      className={`w-8 h-8 rounded-full bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')} to-${currentGoddess.colors.text.secondary.replace('text-', '')} flex items-center justify-center text-white shadow-lg relative flex-shrink-0`}
                      whileHover={{ scale: 1.1 }}
                      animate={msg.detectedEmotion && msg.detectedEmotion !== 'neutral' ? {
                        boxShadow: [
                          '0 0 15px rgba(255,255,255,0.3)',
                          '0 0 25px rgba(255,255,255,0.5)',
                          '0 0 15px rgba(255,255,255,0.3)'
                        ]
                      } : {}}
                      transition={{ repeat: msg.detectedEmotion && msg.detectedEmotion !== 'neutral' ? Infinity : 0, duration: 3 }}
                    >
                      {emojis[goddess.id]}
                      {msg.detectedEmotion && msg.detectedEmotion !== 'neutral' && (
                        <>
                          <motion.div
                            className="absolute -top-1 -right-1"
                            animate={{ y: [-2, -6, -2], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            <SparklesIcon className="w-3 h-3 text-yellow-300" />
                          </motion.div>
                          <motion.div
                            className="absolute -bottom-1 -left-1"
                            animate={{ y: [2, 6, 2], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                          >
                            <StarIcon className="w-2 h-2 text-pink-300" />
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  )}
                  
                  <div className="flex-1">
                    <motion.div
                      className={`px-4 py-3 rounded-2xl shadow-sm backdrop-blur-sm relative ${
                        msg.role==='user'
                          ? `bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border border-purple-400/30`
                          : `bg-white/80 border border-gray-200 text-gray-800 shadow-sm`
                      }`}
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      {/* Message glow effect for emotional messages */}
                      {msg.detectedEmotion && msg.detectedEmotion !== 'neutral' && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background: `linear-gradient(45deg, ${getGlowColor(msg.detectedEmotion)}20, transparent)`,
                            filter: 'blur(1px)'
                          }}
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        />
                      )}
                      
                      <div className="text-sm leading-relaxed whitespace-pre-wrap relative z-10">
                        {msg.content.split('\n').map((line, i) => {
                          if (line.includes('**')) {
                            const parts = line.split('**')
                            return (
                              <p key={i} className={i>0?'mt-2':''}>
                                {parts.map((p,pi)=>pi%2? <strong key={pi}>{p}</strong>: p)}
                              </p>
                            )
                          }
                          if (line.startsWith('• ')) {
                            return <p key={i} className="ml-2 mt-1">{line}</p>
                          }
                          return line.trim()
                            ? <p key={i} className={i>0?'mt-2':''}>{line}</p>
                            : <br key={i}/>
                        })}
                      </div>
                    </motion.div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className={`text-xs text-${currentGoddess.colors.text.muted}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit'})}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {msg.detectedEmotion && msg.detectedEmotion!=='neutral' && (
                          <motion.div 
                            className={`text-xs bg-${currentGoddess.colors.text.primary.replace('text-', '')}-100/60 px-2 py-1 rounded-full text-${currentGoddess.colors.text.secondary} flex items-center space-x-1`}
                            whileHover={{ scale: 1.05 }}
                          >
                            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity }}>
                              {getEmotionIcon(msg.detectedEmotion)}
                            </motion.div>
                            <span>{msg.role==='assistant'?'Understanding your feelings': `Feeling ${msg.detectedEmotion}`}</span>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex justify-start">
            <div className="flex items-end space-x-2">
              <motion.div 
                className={`w-8 h-8 rounded-full bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')} to-${currentGoddess.colors.text.secondary.replace('text-', '')} flex items-center justify-center text-white shadow-lg relative`}
                animate={{ 
                  boxShadow: [
                    '0 0 15px rgba(255,255,255,0.3)',
                    '0 0 30px rgba(255,255,255,0.6)',
                    '0 0 15px rgba(255,255,255,0.3)'
                  ]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {emojis[goddess.id]}
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <SparklesIcon className="w-3 h-3 text-yellow-300" />
                </motion.div>
              </motion.div>
              <div className={`bg-white/70 border border-${currentGoddess.colors.borders} rounded-2xl px-4 py-3 backdrop-blur-sm`}>
                <div className="flex space-x-1">
                  {[0,1,2].map(i=>(
                    <motion.div 
                      key={i} 
                      className={`w-2 h-2 bg-${currentGoddess.colors.text.primary.replace('text-', '')}-400 rounded-full`} 
                      animate={{ scale:[1,1.3,1], opacity: [0.5, 1, 0.5] }} 
                      transition={{ duration:0.8, repeat:Infinity, delay:i*0.2 }} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef}/>
      </div>

      {/* Input with enhanced effects - FIXED BUTTON POSITIONING */}
      <motion.div className={`border-t border-${currentGoddess.colors.borders} p-4 bg-gradient-to-r ${currentGoddess.colors.backgrounds.header} backdrop-blur-sm relative z-30 rounded-b-lg`}>
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <motion.textarea
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                currentMenstrualData?.currentPhase==='menstrual'
                  ? "I'm here to support you during your period. How are you feeling?"
                  : currentMenstrualData
                  ? `Share your thoughts with ${goddess.name}... (${currentMenstrualData.currentPhase} phase)`
                  : `Share your thoughts with ${goddess.name}...`
              }
              className={`w-full px-4 py-3 border border-${currentGoddess.colors.borders} rounded-2xl focus:outline-none focus:ring-2 focus:ring-${currentGoddess.colors.text.primary.replace('text-', '')}-400 resize-none bg-white/70 backdrop-blur-sm text-${currentGoddess.colors.text.primary} placeholder-${currentGoddess.colors.text.muted} transition-all duration-300`}
              rows={1}
              style={{minHeight:'48px',maxHeight:'120px'}}
              disabled={loading}
              whileFocus={{ scale: 1.01 }}
            />
          </div>
          <motion.button
            onClick={handleSend}
            disabled={!input.trim()||loading}
            className={`p-3 rounded-full transition-all duration-200 relative flex items-center justify-center ${
              input.trim() 
                ? `text-white bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')}-500 to-${currentGoddess.colors.text.secondary.replace('text-', '')}-500 hover:from-${currentGoddess.colors.text.primary.replace('text-', '')}-600 hover:to-${currentGoddess.colors.text.secondary.replace('text-', '')}-600 shadow-lg`
                : `text-${currentGoddess.colors.text.muted} bg-gray-100 cursor-not-allowed`
            }`}
            whileHover={input.trim() ? {scale:1.05} : {}} 
            whileTap={input.trim() ? {scale:0.95} : {}}
            animate={input.trim() ? { 
              boxShadow: [
                '0 4px 12px rgba(147, 51, 234, 0.2)',
                '0 6px 16px rgba(147, 51, 234, 0.3)',
                '0 4px 12px rgba(147, 51, 234, 0.2)'
              ]
            } : {}}
            transition={{ repeat: input.trim() ? Infinity : 0, duration: 2 }}
          >
            <PaperAirplaneIcon className="w-5 h-5"/>
            {input.trim() && (
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <SparklesIcon className="w-3 h-3 text-yellow-300" />
              </motion.div>
            )}
          </motion.button>
        </div>
        {userProfile.menstrualTrackingEnabled && currentMenstrualData && (
          <motion.div 
            className={`text-xs text-${currentGoddess.colors.text.muted} mt-2 flex items-center space-x-1`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 10, repeat: Infinity }}>
              <InformationCircleIcon className="w-3 h-3"/>
            </motion.div>
            <span>
              Your responses personalized for {currentMenstrualData.currentPhase} phase
              {currentMenstrualData.currentPhase==='menstrual' && ' – I understand you need extra care.'}
            </span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

// Helper functions for particle colors and effects
function getParticleColor(emotion: string): string {
  const colors = {
    happy: 'w-5 h-5 text-yellow-400',
    excited: 'w-5 h-5 text-pink-400', 
    sad: 'w-4 h-4 text-blue-400',
    anxious: 'w-4 h-4 text-purple-400',
    angry: 'w-5 h-5 text-red-400',
    neutral: 'w-4 h-4 text-gray-400'
  }
  return colors[emotion as keyof typeof colors] || 'w-4 h-4 text-gray-400'
}

function getGlowColor(emotion: string): string {
  const glows = {
    happy: 'rgba(251, 191, 36, 0.4)',
    excited: 'rgba(236, 72, 153, 0.4)',
    sad: 'rgba(59, 130, 246, 0.4)', 
    anxious: 'rgba(147, 51, 234, 0.4)',
    angry: 'rgba(239, 68, 68, 0.4)',
    neutral: 'rgba(156, 163, 175, 0.4)'
  }
  return glows[emotion as keyof typeof glows] || 'rgba(156, 163, 175, 0.4)'
}

function getEmotionIcon(emotion: string): JSX.Element {
  const iconMap = {
    happy: <SparklesIcon className="w-3 h-3" />,
    excited: <StarIcon className="w-3 h-3" />,
    sad: <HeartIcon className="w-3 h-3" />,
    anxious: <MoonIcon className="w-3 h-3" />,
    angry: <BoltIcon className="w-3 h-3" />,
    neutral: <SparklesIcon className="w-3 h-3" />
  }
  return iconMap[emotion as keyof typeof iconMap] || <SparklesIcon className="w-3 h-3" />
}