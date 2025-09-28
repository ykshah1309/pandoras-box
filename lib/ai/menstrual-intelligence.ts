export interface MenstrualData {
  currentPhase: string
  daysUntilNext: number
  symptoms: string[]
  cycleDay: number
  averageCycleLength: number
  lastPeriodStart?: string
  periodLength?: number
  irregularityFlags?: string[]
}

export interface MenstrualInsight {
  shouldOfferTracking: boolean
  phaseSpecificAdvice?: string
  symptomManagement?: string[]
  nutritionalTips?: string[]
  exerciseRecommendations?: string[]
  moodSupport?: string[]
}

export class MenstrualIntelligence {
  
  async analyzeMenstrualRelevance(
    userMessage: string, 
    menstrualData?: MenstrualData,
    userProfile?: any
  ): Promise<MenstrualInsight> {
    
    const menstrualKeywords = [
      'period', 'periods', 'menstrual', 'menstruation', 'cycle', 'cramps', 'pms', 
      'bloating', 'heavy flow', 'light flow', 'irregular', 'late period', 'early period',
      'ovulation', 'hormones', 'mood swings', 'breast tenderness', 'acne', 'breakout',
      'fatigue', 'tired', 'emotional', 'cramping', 'pain', 'uncomfortable', 'flow',
      'spotting', 'breakthrough bleeding', 'missed period', 'delayed'
    ]

    const messageContainsMenstrualContent = menstrualKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    )

    // If user mentions menstrual issues but isn't tracking
    if (messageContainsMenstrualContent && !userProfile?.menstrualTrackingEnabled) {
      return {
        shouldOfferTracking: true,
        phaseSpecificAdvice: "I notice you're dealing with menstrual concerns. Would you like me to help you start tracking your cycle? It could provide valuable insights into your patterns and symptoms."
      }
    }

    // If user is tracking, provide phase-specific guidance
    if (menstrualData) {
      return await this.getPhaseSpecificGuidance(menstrualData)
    }

    return { shouldOfferTracking: false }
  }

  async getPhaseSpecificGuidance(data: MenstrualData): Promise<MenstrualInsight> {
    const { currentPhase, symptoms, cycleDay } = data

    switch (currentPhase) {
      case 'menstrual':
        return {
          shouldOfferTracking: false,
          phaseSpecificAdvice: "You're in your menstrual phase - a time for rest and gentle care. Your body is shedding the uterine lining, which can cause cramping and fatigue.",
          symptomManagement: [
            "Use a heating pad for cramps",
            "Try gentle yoga or stretching",
            "Take warm baths with Epsom salts",
            "Practice deep breathing for pain relief",
            "Stay hydrated with warm herbal teas"
          ],
          nutritionalTips: [
            "Iron-rich foods like spinach, lentils, and lean meats",
            "Magnesium from dark chocolate, nuts, and seeds",
            "Anti-inflammatory foods like ginger and turmeric",
            "Avoid excessive caffeine and sugar",
            "Stay hydrated with water and herbal teas"
          ],
          exerciseRecommendations: [
            "Gentle walks or light stretching",
            "Restorative yoga poses",
            "Avoid high-intensity workouts",
            "Listen to your body's need for rest"
          ],
          moodSupport: [
            "Practice self-compassion",
            "Allow yourself extra rest",
            "Journal your feelings",
            "Connect with supportive friends",
            "Engage in comforting activities"
          ]
        }

      case 'follicular':
        return {
          shouldOfferTracking: false,
          phaseSpecificAdvice: "You're in your follicular phase - a time of renewal and increasing energy. Your body is preparing for ovulation.",
          symptomManagement: [
            "Support increasing energy with good nutrition",
            "Stay hydrated as energy builds",
            "Monitor any PMS symptoms fading"
          ],
          nutritionalTips: [
            "Protein-rich foods for energy",
            "Complex carbohydrates for sustained energy",
            "Fresh fruits and vegetables",
            "Adequate healthy fats"
          ],
          exerciseRecommendations: [
            "Gradually increase activity levels",
            "Try new workout routines",
            "Strength training can be beneficial",
            "Cardiovascular exercises"
          ],
          moodSupport: [
            "Set new goals and intentions",
            "Embrace creative projects",
            "Social activities may feel more appealing",
            "Plan challenging tasks for later in this phase"
          ]
        }

      case 'ovulatory':
        return {
          shouldOfferTracking: false,
          phaseSpecificAdvice: "You're in your ovulatory phase - peak energy and fertility time. You may feel most confident and social now.",
          symptomManagement: [
            "Track ovulation signs if trying to conceive",
            "Stay extra hydrated",
            "Monitor any ovulation pain (mittelschmerz)"
          ],
          nutritionalTips: [
            "Antioxidant-rich foods",
            "Healthy fats for hormone production",
            "Folate-rich foods if considering pregnancy",
            "Plenty of water"
          ],
          exerciseRecommendations: [
            "High-intensity workouts are well-tolerated",
            "Team sports or group fitness",
            "Dancing or fun activities",
            "Peak performance time for athletics"
          ],
          moodSupport: [
            "Embrace social opportunities",
            "Confidence is naturally higher",
            "Great time for important conversations",
            "Creative and productive energy peaks"
          ]
        }

      case 'luteal':
        return {
          shouldOfferTracking: false,
          phaseSpecificAdvice: "You're in your luteal phase - energy may be declining and PMS symptoms might appear. This is a time to slow down and prepare for menstruation.",
          symptomManagement: [
            "Manage PMS symptoms proactively",
            "Use stress-reduction techniques",
            "Monitor mood changes with compassion",
            "Prepare for potential breast tenderness or bloating"
          ],
          nutritionalTips: [
            "Complex carbohydrates for mood stability",
            "Calcium and magnesium for PMS relief",
            "Limit salt to reduce bloating",
            "B-vitamins for mood support",
            "Avoid alcohol which can worsen PMS"
          ],
          exerciseRecommendations: [
            "Moderate exercise like walking or swimming",
            "Yoga for stress relief",
            "Avoid overexertion",
            "Stretching for tension relief"
          ],
          moodSupport: [
            "Practice patience with yourself",
            "Prepare for emotional sensitivity",
            "Maintain regular sleep schedule",
            "Use relaxation techniques",
            "Plan lighter social schedules"
          ]
        }

      default:
        return {
          shouldOfferTracking: true,
          phaseSpecificAdvice: "I'd love to help you understand your cycle better. Tracking can provide insights into your body's patterns."
        }
    }
  }

  async getPhaseSpecificAdvice(phase: string, symptoms: string[]): Promise<string[]> {
    const advice: Record<string, string[]> = {
      menstrual: [
        "Rest when your body needs it",
        "Use heat therapy for cramps", 
        "Stay hydrated with warm drinks",
        "Gentle movement can help with circulation"
      ],
      follicular: [
        "Take advantage of increasing energy",
        "Plan challenging projects",
        "Focus on protein and complex carbs",
        "Great time to start new exercise routines"
      ],
      ovulatory: [
        "Peak time for social and physical activities",
        "High-intensity exercise is well tolerated",
        "Confidence and communication skills peak",
        "Ideal time for important meetings or dates"
      ],
      luteal: [
        "Prepare for potential PMS symptoms",
        "Focus on stress management",
        "Limit salt and sugar intake",
        "Plan for more downtime and self-care"
      ]
    }

    return advice[phase] || ["Listen to your body's signals and honor its needs"]
  }
}