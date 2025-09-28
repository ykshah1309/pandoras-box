export interface CycleData {
  lastPeriodStart: Date
  averageCycleLength: number
  averagePeriodLength: number
}

export interface CycleInsights {
  currentPhase: string
  cycleDay: number
  daysUntilNextPeriod: number
  daysUntilOvulation: number
  fertileWindow: {
    start: Date
    end: Date
  }
  nextPeriodDate: Date
  isLate: boolean
  daysLate?: number
}

export class MenstrualCalculations {
  
  static calculateCurrentPhase(cycleDay: number, cycleLength: number = 28): string {
    if (cycleDay <= 5) return 'menstrual'
    if (cycleDay <= cycleLength / 2 - 2) return 'follicular'  
    if (cycleDay <= cycleLength / 2 + 2) return 'ovulatory'
    return 'luteal'
  }

  static getCycleInsights(data: CycleData): CycleInsights {
    const today = new Date()
    const lastPeriod = new Date(data.lastPeriodStart)
    const cycleDay = Math.floor((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    const currentPhase = this.calculateCurrentPhase(cycleDay, data.averageCycleLength)
    const nextPeriodDate = new Date(lastPeriod.getTime() + (data.averageCycleLength * 24 * 60 * 60 * 1000))
    const daysUntilNextPeriod = Math.floor((nextPeriodDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    const ovulationDay = Math.floor(data.averageCycleLength / 2)
    const daysUntilOvulation = ovulationDay - cycleDay
    
    const fertileStart = new Date(lastPeriod.getTime() + ((ovulationDay - 5) * 24 * 60 * 60 * 1000))
    const fertileEnd = new Date(lastPeriod.getTime() + ((ovulationDay + 1) * 24 * 60 * 60 * 1000))

    const isLate = daysUntilNextPeriod < -2
    const daysLate = isLate ? Math.abs(daysUntilNextPeriod) : undefined

    return {
      currentPhase,
      cycleDay,
      daysUntilNextPeriod,
      daysUntilOvulation,
      fertileWindow: {
        start: fertileStart,
        end: fertileEnd
      },
      nextPeriodDate,
      isLate,
      daysLate
    }
  }

  static predictNextPeriods(lastPeriodStart: Date, cycleLength: number, count: number = 6): Date[] {
    const periods: Date[] = []
    let nextPeriod = new Date(lastPeriodStart)
    
    for (let i = 0; i < count; i++) {
      nextPeriod = new Date(nextPeriod.getTime() + (cycleLength * 24 * 60 * 60 * 1000))
      periods.push(new Date(nextPeriod))
    }
    
    return periods
  }

  static analyzeCycleIrregularity(cycleLengths: number[]): {
    isIrregular: boolean
    variation: number
    averageLength: number
    recommendation: string
  } {
    if (cycleLengths.length < 3) {
      return {
        isIrregular: false,
        variation: 0,
        averageLength: 28,
        recommendation: "Track for at least 3 cycles for accurate analysis"
      }
    }

    const average = cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length
    const variations = cycleLengths.map(length => Math.abs(length - average))
    const maxVariation = Math.max(...variations)

    const isIrregular = maxVariation > 7 // More than 7 days variation is considered irregular

    let recommendation = "Your cycles appear regular"
    if (isIrregular) {
      if (maxVariation > 15) {
        recommendation = "Consider consulting a healthcare provider about cycle irregularity"
      } else {
        recommendation = "Some variation is normal, but continue tracking patterns"
      }
    }

    return {
      isIrregular,
      variation: maxVariation,
      averageLength: Math.round(average),
      recommendation
    }
  }
}