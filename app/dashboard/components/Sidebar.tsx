'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ChatBubbleLeftEllipsisIcon,
  HeartIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { useDashboard } from './DashboardContext'
import { useGoddessTheme } from './GoddessThemeContext'
import MenstrualTracker from './MenstrualTracker'

export default function Sidebar() {
  const {
    sessions,
    activeSession,
    createSession,
    selectSession,
    renameSession,
    deleteSession,
    loading,
    goddessPersonas,
    currentGoddessId,
    switchGoddess,
    userProfile,
    currentMenstrualData
  } = useDashboard()

  const { currentGoddess, switchGoddess: switchThemeGoddess } = useGoddessTheme()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [showGoddessDropdown, setShowGoddessDropdown] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeView, setActiveView] = useState<'chat' | 'menstrual'>('chat')

  const handleEdit = (id: string, title: string) => {
    setEditingId(id)
    setEditTitle(title)
  }

  const handleSaveEdit = async () => {
    if (editingId && editTitle.trim()) {
      await renameSession(editingId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const handleDeleteSession = async (id: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      await deleteSession(id)
    }
  }

  const currentGoddessData = goddessPersonas.find(g => g.id === currentGoddessId)

  const goddessEmojis: Record<string, string> = {
    athena: '🦉',
    aphrodite: '🌹',
    artemis: '🏹',
    hera: '👑',
    demeter: '🌾',
    persephone: '🌸',
    hestia: '🔥',
    hecate: '🌙'
  }

  const handleGoddessSwitch = (goddessId: string) => {
    switchGoddess(goddessId)
    switchThemeGoddess(goddessId)
    setShowGoddessDropdown(false)
  }

  const getPhaseEmoji = (phase: string) => {
    const emojis = {
      menstrual: '🌙',
      follicular: '🌱',
      ovulatory: '✨',
      luteal: '🍂'
    }
    return emojis[phase as keyof typeof emojis] || '🌸'
  }

  return (
    <motion.div
      className={`bg-gradient-to-b ${currentGoddess.colors.backgrounds.sidebar} backdrop-blur-sm border-r border-${currentGoddess.colors.borders} flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
      initial={false}
      animate={{ width: isCollapsed ? 64 : 320 }}
    >
      {/* Header */}
      <div className={`p-4 border-b border-${currentGoddess.colors.borders} flex justify-between items-center bg-white/30 backdrop-blur-sm`}>
        {!isCollapsed && (
          <h1 className={`text-xl font-bold text-${currentGoddess.colors.text.primary}`}>
            Pandora's Box
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/40 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className={`w-5 h-5 text-${currentGoddess.colors.text.secondary}`} />
          ) : (
            <ChevronLeftIcon className={`w-5 h-5 text-${currentGoddess.colors.text.secondary}`} />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          {/* Goddess Selector */}
          <div className={`p-6 border-b border-${currentGoddess.colors.borders} bg-white/20 backdrop-blur-sm relative z-10`}>
            <button
              onClick={() => setShowGoddessDropdown(!showGoddessDropdown)}
              className="w-full flex items-center justify-between p-3 bg-white/40 rounded-lg hover:bg-white/50 transition-colors border border-white/30"
            >
              <div className="flex items-center space-x-3">
                {currentGoddessData && (
                  <>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')} to-${currentGoddess.colors.text.secondary.replace('text-', '')} shadow-sm`}>
                      {goddessEmojis[currentGoddessData.id]}
                    </div>
                    <div>
                      <h2 className={`text-lg font-semibold text-${currentGoddess.colors.text.primary}`}>{currentGoddessData.name}</h2>
                      <p className={`text-sm text-${currentGoddess.colors.text.secondary}`}>{currentGoddessData.domain}</p>
                    </div>
                  </>
                )}
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 text-${currentGoddess.colors.text.muted} transform transition-transform ${
                  showGoddessDropdown ? 'rotate-180' : 'rotate-0'
                }`}
              />
            </button>
            {showGoddessDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute top-full left-6 right-6 mt-2 bg-white/90 backdrop-blur-sm border border-${currentGoddess.colors.borders} rounded-lg shadow-lg z-[100] max-h-60 overflow-y-auto scrollbar-hide`}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                {goddessPersonas.map(g => (
                  <button
                    key={g.id}
                    onClick={() => handleGoddessSwitch(g.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-${currentGoddess.colors.text.primary.replace('text-', '')}-50 transition-colors rounded ${
                      currentGoddessId === g.id ? `bg-${currentGoddess.colors.text.primary.replace('text-', '')}-50` : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')} to-${currentGoddess.colors.text.secondary.replace('text-', '')} flex items-center justify-center text-white text-sm shadow-sm`}>
                      {goddessEmojis[g.id]}
                    </div>
                    <div className="text-left">
                      <p className={`font-medium text-${currentGoddess.colors.text.primary}`}>{g.name}</p>
                      <p className={`text-xs text-${currentGoddess.colors.text.secondary}`}>{g.domain}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Cycle Status */}
          {userProfile.menstrualTrackingEnabled && currentMenstrualData && (
            <div className={`p-4 border-b border-${currentGoddess.colors.borders} bg-white/10 backdrop-blur-sm`}>
              <div className="flex items-center space-x-2 mb-2">
                <div className="text-lg">{getPhaseEmoji(currentMenstrualData.currentPhase)}</div>
                <div>
                  <p className={`text-sm font-medium text-${currentGoddess.colors.text.primary}`}>
                    Day {currentMenstrualData.cycleDay} • {currentMenstrualData.currentPhase} phase
                  </p>
                  <p className={`text-xs text-${currentGoddess.colors.text.secondary}`}>
                    {currentMenstrualData.daysUntilNext} days until next period
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className={`p-4 border-b border-${currentGoddess.colors.borders} bg-white/20 backdrop-blur-sm flex space-x-2`}>
            <button
              onClick={() => setActiveView('chat')}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'chat'
                  ? `bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')}-200 to-${currentGoddess.colors.text.secondary.replace('text-', '')}-200 text-${currentGoddess.colors.text.primary}`
                  : `hover:bg-white/30 text-${currentGoddess.colors.text.secondary}`
              }`}
            >
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
              <span>Chats</span>
            </button>
            <button
              onClick={() => setActiveView('menstrual')}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-colors relative ${
                activeView === 'menstrual'
                  ? 'bg-gradient-to-r from-rose-200 to-pink-200 text-rose-800'
                  : `hover:bg-white/30 text-${currentGoddess.colors.text.secondary}`
              }`}
            >
              <HeartIcon className="w-5 h-5" />
              <span>Cycle</span>
              {userProfile.menstrualTrackingEnabled && currentMenstrualData?.currentPhase === 'menstrual' && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}
            </button>
          </div>

          {/* New Conversation */}
          {activeView === 'chat' && (
            <div className={`p-4 border-b border-${currentGoddess.colors.borders}`}>
              <button
                onClick={createSession}
                disabled={loading}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')}-400 to-${currentGoddess.colors.text.secondary.replace('text-', '')}-400 text-white rounded-lg shadow-sm hover:from-${currentGoddess.colors.text.primary.replace('text-', '')}-500 hover:to-${currentGoddess.colors.text.secondary.replace('text-', '')}-500`}
              >
                <PlusIcon className="w-5 h-5" />
                <span>New Conversation</span>
              </button>
            </div>
          )}

          {/* Content - Hidden scrollbar */}
          <div 
            className="flex-1 overflow-y-auto scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {activeView === 'chat' ? (
              <div className="p-2">
                {sessions.length === 0 ? (
                  <div className={`p-4 text-center text-${currentGoddess.colors.text.secondary}`}>No conversations</div>
                ) : (
                  sessions.map(session => (
                    <div key={session.id} className="mb-2">
                      {editingId === session.id ? (
                        <div className="p-3 bg-white/30 rounded-lg">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit()
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            className={`w-full px-2 py-1 text-sm bg-white/50 border border-${currentGoddess.colors.borders} rounded focus:outline-none focus:ring-2 focus:ring-${currentGoddess.colors.text.primary.replace('text-', '')}-400`}
                            autoFocus
                          />
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={handleSaveEdit}
                              className={`px-2 py-1 text-xs bg-${currentGoddess.colors.text.primary.replace('text-', '')}-500 text-white rounded`}
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-1 text-xs bg-gray-400 text-white rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => selectSession(session.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                            activeSession?.id === session.id
                              ? `bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')}-100 to-${currentGoddess.colors.text.secondary.replace('text-', '')}-100 border-l-4 border-${currentGoddess.colors.text.primary.replace('text-', '')}-400`
                              : 'hover:bg-white/30'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h3 className={`text-sm font-medium text-${currentGoddess.colors.text.primary} truncate`}>
                                {session.title}
                              </h3>
                              <p className={`text-xs text-${currentGoddess.colors.text.secondary} mt-1`}>
                                {session.messages.length} messages • {new Date(session.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEdit(session.id, session.title)
                                }}
                                className={`p-1 hover:bg-white/40 rounded`}
                              >
                                <PencilIcon className={`w-3 h-3 text-${currentGoddess.colors.text.secondary}`} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteSession(session.id)
                                }}
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <TrashIcon className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <MenstrualTracker />
            )}
          </div>
        </>
      )}

      {/* Collapsed Icons */}
      {isCollapsed && (
        <div className="p-2 space-y-2">
          <button
            onClick={createSession}
            disabled={loading}
            className={`w-full p-3 rounded-lg text-${currentGoddess.colors.text.secondary} hover:bg-white/40 transition-colors`}
            title="New Conversation"
          >
            <PlusIcon className="w-6 h-6 mx-auto" />
          </button>
          
          <button
            onClick={() => setActiveView(activeView === 'chat' ? 'menstrual' : 'chat')}
            className={`w-full p-3 rounded-lg text-${currentGoddess.colors.text.secondary} hover:bg-white/40 transition-colors relative`}
            title="Toggle View"
          >
            {activeView === 'chat' ? (
              <HeartIcon className="w-6 h-6 mx-auto" />
            ) : (
              <ChatBubbleLeftEllipsisIcon className="w-6 h-6 mx-auto" />
            )}
            {userProfile.menstrualTrackingEnabled && currentMenstrualData?.currentPhase === 'menstrual' && activeView !== 'menstrual' && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </button>

          {currentGoddessData && (
            <div className={`text-center text-${currentGoddess.colors.text.secondary} mt-4`}>
              <div className="text-2xl mb-2">{goddessEmojis[currentGoddessData.id]}</div>
              {userProfile.menstrualTrackingEnabled && currentMenstrualData && (
                <div className="text-xs">{getPhaseEmoji(currentMenstrualData.currentPhase)}</div>
              )}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.div>
  )
}