// lib/emotionEffects.ts
export interface EmotionEffect {
  emotion: string
  bgGradient: string
  particleColor: string
  animation: string
  goddessResponse: string
}

export const emotionEffects: Record<string, EmotionEffect> = {
  happy: {
    emotion: 'happy',
    bgGradient: 'from-yellow-400/20 via-orange-300/20 to-pink-400/20',
    particleColor: '#FFD700',
    animation: 'bounce',
    goddessResponse: 'celebrating your joy ✨'
  },
  excited: {
    emotion: 'excited',
    bgGradient: 'from-purple-400/20 via-pink-400/20 to-red-400/20',
    particleColor: '#FF69B4',
    animation: 'pulse',
    goddessResponse: 'sharing your excitement 🎉'
  },
  sad: {
    emotion: 'sad',
    bgGradient: 'from-blue-400/10 via-indigo-300/10 to-purple-400/10',
    particleColor: '#6B73FF',
    animation: 'float',
    goddessResponse: 'offering comfort and understanding 💙'
  },
  anxious: {
    emotion: 'anxious',
    bgGradient: 'from-green-400/15 via-teal-300/15 to-blue-400/15',
    particleColor: '#20B2AA',
    animation: 'calm',
    goddessResponse: 'bringing peace and tranquility 🌿'
  },
  angry: {
    emotion: 'angry',
    bgGradient: 'from-red-400/10 via-orange-300/10 to-yellow-400/10',
    particleColor: '#FF6B6B',
    animation: 'soothe',
    goddessResponse: 'helping you find inner balance ⚖️'
  },
  neutral: {
    emotion: 'neutral',
    bgGradient: 'from-gray-100/5 via-slate-200/5 to-gray-300/5',
    particleColor: '#9CA3AF',
    animation: 'gentle',
    goddessResponse: 'listening with care 🤍'
  }
}

export const getEmotionEffect = (emotion: string): EmotionEffect => {
  return emotionEffects[emotion] || emotionEffects.neutral
}