import { NextRequest, NextResponse } from 'next/server'
import { GoddessAIService } from '@/lib/ai/hf-service'
import { MenstrualIntelligence, type MenstrualData, type MenstrualInsight } from '@/lib/ai/menstrual-intelligence'

const aiService = new GoddessAIService()
const menstrualIntelligence = new MenstrualIntelligence()

export async function POST(request: NextRequest) {
  try {
    const {
      message,
      currentGoddessId,
      sessionId,
      conversationHistory = [],
      menstrualData,
      menstrualInsight
    } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    let selectedGoddessId = currentGoddessId
    let switchedGoddess = false

    // Determine best goddess
    const suggestedGoddess = await aiService.detectBestGoddess(message)

    // If menstruating or symptoms present, switch to Demeter
    if (
      menstrualData &&
      (menstrualData.currentPhase === 'menstrual' ||
       menstrualData.symptoms.some(s =>
         ['cramps','pain','heavy flow','fatigue','mood changes','bloating']
           .includes(s.toLowerCase())
       ))
    ) {
      if (currentGoddessId !== 'demeter') {
        selectedGoddessId = 'demeter'
        switchedGoddess = true
      }
    } else if (suggestedGoddess !== currentGoddessId) {
      selectedGoddessId = suggestedGoddess
      switchedGoddess = true
    }

    // Enhance prompt with menstrual context
    let enhancedMessage = message
    if (menstrualData) {
      const phaseCtx = `User is in ${menstrualData.currentPhase} phase (Day ${menstrualData.cycleDay}/${menstrualData.averageCycleLength})`
      if (menstrualData.currentPhase === 'menstrual') {
        enhancedMessage += ` [${phaseCtx} – please be extra empathetic and provide practical comfort and symptom tips.]`
      } else {
        enhancedMessage += ` [${phaseCtx} – consider energy, mood, and self-care.]`
      }
      if (menstrualData.symptoms.length) {
        enhancedMessage += ` [Symptoms: ${menstrualData.symptoms.join(', ')}]`
      }
    }
    if (menstrualInsight?.phaseSpecificAdvice) {
      enhancedMessage += ` [Advice: ${menstrualInsight.phaseSpecificAdvice}]`
    }

    // Generate AI response
    const aiResponse = await aiService.generateResponse(
      enhancedMessage,
      selectedGoddessId,
      conversationHistory
    )

    let finalContent = aiResponse.content

    // Append menstrual-guidance if on period
    if (menstrualData?.currentPhase === 'menstrual') {
      const guidance = await menstrualIntelligence.getPhaseSpecificGuidance(menstrualData)
      if (guidance.symptomManagement?.length) {
        finalContent += `\n\n🌸 Gentle care tips:\n• ${guidance.symptomManagement.slice(0,2).join('\n• ')}`
      }
      if (guidance.moodSupport?.length) {
        finalContent += `\n\n💖 Remember: ${guidance.moodSupport[0]}`
      }
    }

    return NextResponse.json({
      message: finalContent,
      detectedEmotion: aiResponse.detected_emotion,
      goddessId: selectedGoddessId,
      switchedGoddess,
      empathyLevel: aiResponse.empathy_level,
      menstrualContext: menstrualData
        ? {
            phase: menstrualData.currentPhase,
            cycleDay: menstrualData.cycleDay,
            daysUntilNext: menstrualData.daysUntilNext
          }
        : null
    })
  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 })
  }
}