'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CalendarDaysIcon, 
  HeartIcon, 
  SparklesIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  PlusIcon,
  ChevronRightIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { useDashboard } from './DashboardContext'
import { useGoddessTheme } from './GoddessThemeContext'

interface TrackingSetupProps {
  onComplete: () => void
}

interface CycleInsights {
  cycleDay: number
  currentPhase: string
  daysUntilNext: number
  isLate: boolean
  fertileWindow: {
    start: string
    end: string
  }
}

function TrackingSetup({ onComplete }: TrackingSetupProps) {
  const [step, setStep] = useState(1)
  const [lastPeriodDate, setLastPeriodDate] = useState('')
  const [averageCycleLength, setAverageCycleLength] = useState(28)
  const [averagePeriodLength, setAveragePeriodLength] = useState(5)
  const { enableMenstrualTracking, logPeriodStart } = useDashboard()
  const { currentGoddess } = useGoddessTheme()

  const handleComplete = async () => {
    if (lastPeriodDate) {
      await enableMenstrualTracking()
      await logPeriodStart(lastPeriodDate, [], 'Initial tracking setup')
      onComplete()
    }
  }

  return (
    <div className={`max-w-md mx-auto p-6 bg-gradient-to-br ${currentGoddess.colors.backgrounds.chat} rounded-xl shadow-sm border border-${currentGoddess.colors.borders}`}>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <HeartIcon className={`w-12 h-12 text-${currentGoddess.colors.text.primary}`} />
        </div>
        <h2 className={`text-xl font-semibold text-${currentGoddess.colors.text.primary} mb-2`}>
          Set Up Cycle Tracking
        </h2>
        <p className={`text-sm text-${currentGoddess.colors.text.secondary}`}>
          I'll provide personalized insights and support based on your cycle
        </p>
      </div>

      <div className="space-y-6">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className={`block text-sm font-medium text-${currentGoddess.colors.text.primary} mb-2`}>
                When did your last period start?
              </label>
              <input
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className={`w-full px-3 py-2 border border-${currentGoddess.colors.borders} rounded-lg focus:outline-none focus:ring-2 focus:ring-${currentGoddess.colors.text.primary.replace('text-', '')}-400`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium text-${currentGoddess.colors.text.primary} mb-2`}>
                Average cycle length
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={averageCycleLength}
                  onChange={(e) => setAverageCycleLength(parseInt(e.target.value))}
                  min="21"
                  max="40"
                  className={`flex-1 px-3 py-2 border border-${currentGoddess.colors.borders} rounded-lg focus:outline-none focus:ring-2 focus:ring-${currentGoddess.colors.text.primary.replace('text-', '')}-400`}
                />
                <span className={`text-sm text-${currentGoddess.colors.text.secondary}`}>days</span>
              </div>
              <p className={`text-xs text-${currentGoddess.colors.text.muted} mt-1`}>
                Average is 28 days, but 21-35 days is normal
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium text-${currentGoddess.colors.text.primary} mb-2`}>
                Average period length
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={averagePeriodLength}
                  onChange={(e) => setAveragePeriodLength(parseInt(e.target.value))}
                  min="2"
                  max="10"
                  className={`flex-1 px-3 py-2 border border-${currentGoddess.colors.borders} rounded-lg focus:outline-none focus:ring-2 focus:ring-${currentGoddess.colors.text.primary.replace('text-', '')}-400`}
                />
                <span className={`text-sm text-${currentGoddess.colors.text.secondary}`}>days</span>
              </div>
            </div>

            <button
              onClick={handleComplete}
              disabled={!lastPeriodDate}
              className={`w-full px-4 py-3 bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')}-400 to-${currentGoddess.colors.text.secondary.replace('text-', '')}-400 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-${currentGoddess.colors.text.primary.replace('text-', '')}-500 hover:to-${currentGoddess.colors.text.secondary.replace('text-', '')}-500 transition-colors`}
            >
              Start Tracking
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function MenstrualTracker() {
  const { 
    userProfile, 
    currentMenstrualData, 
    enableMenstrualTracking, 
    logPeriodStart,
    getCurrentCycleInsights 
  } = useDashboard()
  const { currentGoddess } = useGoddessTheme()
  
  const [showSetup, setShowSetup] = useState(false)
  const [showLogEntry, setShowLogEntry] = useState(false)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  const symptomOptions = [
    'Cramps', 'Heavy flow', 'Light flow', 'Bloating', 'Mood changes',
    'Fatigue', 'Headache', 'Breast tenderness', 'Acne', 'Back pain',
    'Food cravings', 'Irritability', 'Nausea'
  ]

  const getPhaseDescription = (phase: string) => {
    const descriptions = {
      menstrual: 'Time for rest and gentle self-care 🌙',
      follicular: 'Energy building, new beginnings 🌱',  
      ovulatory: 'Peak energy and confidence ✨',
      luteal: 'Winding down, preparing for rest 🍂'
    }
    return descriptions[phase as keyof typeof descriptions] || 'Your body knows best'
  }

  const getPhaseColor = (phase: string) => {
    const colors = {
      menstrual: 'from-red-100 to-pink-100',
      follicular: 'from-green-100 to-emerald-100',
      ovulatory: 'from-yellow-100 to-orange-100', 
      luteal: 'from-purple-100 to-indigo-100'
    }
    return colors[phase as keyof typeof colors] || 'from-gray-100 to-gray-200'
  }

  const handleLogPeriod = async () => {
    await logPeriodStart(new Date().toISOString().split('T')[0], selectedSymptoms, notes)
    setShowLogEntry(false)
    setSelectedSymptoms([])
    setNotes('')
  }

  if (!userProfile.menstrualTrackingEnabled) {
    return (
      <div className="p-6">
        {!showSetup ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <HeartIcon className={`w-16 h-16 text-${currentGoddess.colors.text.primary}`} />
            </div>
            <h2 className={`text-2xl font-bold text-${currentGoddess.colors.text.primary} mb-4`}>
              Menstrual Cycle Tracking
            </h2>
            <p className={`text-${currentGoddess.colors.text.secondary} mb-6 max-w-md mx-auto`}>
              Get personalized insights, predictions, and support tailored to your unique cycle. 
              Your goddess guide will understand you better and provide more relevant advice.
            </p>
            
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto`}>
              <div className={`p-4 bg-gradient-to-br ${currentGoddess.colors.backgrounds.chat} rounded-lg border border-${currentGoddess.colors.borders}`}>
                <SparklesIcon className={`w-8 h-8 text-${currentGoddess.colors.text.primary} mx-auto mb-2`} />
                <h3 className={`font-semibold text-${currentGoddess.colors.text.primary} mb-1`}>Smart Insights</h3>
                <p className={`text-sm text-${currentGoddess.colors.text.secondary}`}>Personalized guidance based on your cycle phase</p>
              </div>
              
              <div className={`p-4 bg-gradient-to-br ${currentGoddess.colors.backgrounds.chat} rounded-lg border border-${currentGoddess.colors.borders}`}>
                <CalendarDaysIcon className={`w-8 h-8 text-${currentGoddess.colors.text.primary} mx-auto mb-2`} />
                <h3 className={`font-semibold text-${currentGoddess.colors.text.primary} mb-1`}>Predictions</h3>
                <p className={`text-sm text-${currentGoddess.colors.text.secondary}`}>Accurate period and fertility predictions</p>
              </div>
              
              <div className={`p-4 bg-gradient-to-br ${currentGoddess.colors.backgrounds.chat} rounded-lg border border-${currentGoddess.colors.borders}`}>
                <HeartIcon className={`w-8 h-8 text-${currentGoddess.colors.text.primary} mx-auto mb-2`} />
                <h3 className={`font-semibold text-${currentGoddess.colors.text.primary} mb-1`}>Support</h3>
                <p className={`text-sm text-${currentGoddess.colors.text.secondary}`}>Compassionate AI responses tuned to your needs</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowSetup(true)}
              className={`px-8 py-3 bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')}-400 to-${currentGoddess.colors.text.secondary.replace('text-', '')}-400 text-white rounded-lg font-semibold hover:from-${currentGoddess.colors.text.primary.replace('text-', '')}-500 hover:to-${currentGoddess.colors.text.secondary.replace('text-', '')}-500 transition-colors shadow-sm`}
            >
              Start Tracking
            </button>
          </div>
        ) : (
          <TrackingSetup onComplete={() => setShowSetup(false)} />
        )}
      </div>
    )
  }

  const currentCycleInsights = getCurrentCycleInsights()

  return (
    <div className="p-6 space-y-6">
      {/* Current Cycle Overview */}
      {currentCycleInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 bg-gradient-to-br ${getPhaseColor(currentCycleInsights.currentPhase)} rounded-xl border border-${currentGoddess.colors.borders} shadow-sm`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-semibold text-${currentGoddess.colors.text.primary}`}>
              Current Cycle
            </h2>
            <div className={`px-3 py-1 bg-white/50 rounded-full text-sm font-medium text-${currentGoddess.colors.text.primary}`}>
              {currentCycleInsights.currentPhase.charAt(0).toUpperCase() + currentCycleInsights.currentPhase.slice(1)} Phase
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className={`text-2xl font-bold text-${currentGoddess.colors.text.primary}`}>
                Day {currentCycleInsights.cycleDay}
              </div>
              <div className={`text-sm text-${currentGoddess.colors.text.secondary}`}>of cycle</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold text-${currentGoddess.colors.text.primary}`}>
                {currentCycleInsights.daysUntilNext}
              </div>
              <div className={`text-sm text-${currentGoddess.colors.text.secondary}`}>days until next</div>
            </div>
          </div>
          
          <p className={`text-center text-${currentGoddess.colors.text.secondary} italic`}>
            {getPhaseDescription(currentCycleInsights.currentPhase)}
          </p>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.button
          onClick={() => setShowLogEntry(true)}
          className={`p-4 bg-gradient-to-br ${currentGoddess.colors.backgrounds.chat} border border-${currentGoddess.colors.borders} rounded-lg hover:shadow-md transition-shadow flex items-center justify-between`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <PlusIcon className={`w-6 h-6 text-${currentGoddess.colors.text.primary}`} />
            <div className="text-left">
              <h3 className={`font-semibold text-${currentGoddess.colors.text.primary}`}>Log Period</h3>
              <p className={`text-sm text-${currentGoddess.colors.text.secondary}`}>Track today's symptoms</p>
            </div>
          </div>
          <ChevronRightIcon className={`w-5 h-5 text-${currentGoddess.colors.text.muted}`} />
        </motion.button>

        <motion.div
          className={`p-4 bg-gradient-to-br ${currentGoddess.colors.backgrounds.chat} border border-${currentGoddess.colors.borders} rounded-lg`}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3">
            <InformationCircleIcon className={`w-6 h-6 text-${currentGoddess.colors.text.primary}`} />
            <div>
              <h3 className={`font-semibold text-${currentGoddess.colors.text.primary}`}>Cycle History</h3>
              <p className={`text-sm text-${currentGoddess.colors.text.secondary}`}>{userProfile.menstrualCycles.length} cycles tracked</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Cycles */}
      {userProfile.menstrualCycles.length > 0 && (
        <div>
          <h3 className={`text-lg font-semibold text-${currentGoddess.colors.text.primary} mb-4`}>Recent Cycles</h3>
          <div className="space-y-3">
            {userProfile.menstrualCycles.slice(-3).reverse().map((cycle) => (
              <div
                key={cycle.id}
                className={`p-4 bg-gradient-to-br ${currentGoddess.colors.backgrounds.chat} border border-${currentGoddess.colors.borders} rounded-lg`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium text-${currentGoddess.colors.text.primary}`}>
                    {new Date(cycle.cycle_start_date).toLocaleDateString()}
                  </span>
                  <span className={`text-sm text-${currentGoddess.colors.text.secondary}`}>
                    {cycle.cycle_length} day cycle, {cycle.period_length} day period
                  </span>
                </div>
                {cycle.symptoms.length > 0 && (
                  <p className={`text-sm text-${currentGoddess.colors.text.muted}`}>
                    {cycle.symptoms.slice(0, 2).join(', ')}
                    {cycle.symptoms.length > 2 && ` +${cycle.symptoms.length - 2} more`}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Entry Modal */}
      <AnimatePresence>
        {showLogEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto`}
            >
              <h2 className={`text-xl font-semibold text-${currentGoddess.colors.text.primary} mb-4`}>
                Log Period Start
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium text-${currentGoddess.colors.text.primary} mb-2`}>
                    Symptoms (select all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {symptomOptions.map((symptom) => (
                      <label
                        key={symptom}
                        className={`flex items-center space-x-2 p-2 rounded-lg border border-${currentGoddess.colors.borders} hover:bg-${currentGoddess.colors.text.primary.replace('text-', '')}-50 cursor-pointer`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSymptoms.includes(symptom)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSymptoms([...selectedSymptoms, symptom])
                            } else {
                              setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom))
                            }
                          }}
                          className={`text-${currentGoddess.colors.text.primary.replace('text-', '')}-500`}
                        />
                        <span className={`text-sm text-${currentGoddess.colors.text.primary}`}>{symptom}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium text-${currentGoddess.colors.text.primary} mb-2`}>
                    Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="How are you feeling today?"
                    className={`w-full px-3 py-2 border border-${currentGoddess.colors.borders} rounded-lg focus:outline-none focus:ring-2 focus:ring-${currentGoddess.colors.text.primary.replace('text-', '')}-400 resize-none`}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowLogEntry(false)}
                  className={`flex-1 px-4 py-2 border border-${currentGoddess.colors.borders} rounded-lg text-${currentGoddess.colors.text.secondary} hover:bg-gray-50 transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogPeriod}
                  className={`flex-1 px-4 py-2 bg-gradient-to-r from-${currentGoddess.colors.text.primary.replace('text-', '')}-400 to-${currentGoddess.colors.text.secondary.replace('text-', '')}-400 text-white rounded-lg font-medium hover:from-${currentGoddess.colors.text.primary.replace('text-', '')}-500 hover:to-${currentGoddess.colors.text.secondary.replace('text-', '')}-500 transition-colors`}
                >
                  Log Period
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}