'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  SparklesIcon, 
  HeartIcon, 
  MoonIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  const [currentGoddess, setCurrentGoddess] = useState(0)

  const goddesses = [
    {
      name: "Athena",
      essence: "Wisdom & Strategy",
      aura: "🦉",
      gradient: "from-indigo-200 to-purple-300"
    },
    {
      name: "Aphrodite", 
      essence: "Love & Beauty",
      aura: "🌹",
      gradient: "from-rose-200 to-pink-300"
    },
    {
      name: "Artemis",
      essence: "Independence & Power", 
      aura: "🏹",
      gradient: "from-emerald-200 to-teal-300"
    },
    {
      name: "Hera",
      essence: "Commitment & Grace",
      aura: "👑",
      gradient: "from-violet-200 to-indigo-300"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentGoddess((prev) => (prev + 1) % goddesses.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-goddess-cream via-white to-goddess-soft-pink/30">
      {/* Minimal Navigation */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-goddess-blush-pink to-goddess-gold rounded-full flex items-center justify-center shadow-sm">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-playfair font-semibold text-gray-800">
              Pandora's Box
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href="/login" className="text-gray-600 hover:text-gray-800 font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="bg-gradient-to-r from-goddess-blush-pink to-goddess-peachy text-white px-6 py-2 rounded-full font-medium hover:shadow-md transition-all duration-300">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Simplified */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Divine Aura Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="mb-8"
          >
            <div className="relative mx-auto w-32 h-32 mb-6">
              {/* Glowing Aura */}
              <div className="absolute inset-0 bg-gradient-to-br from-goddess-blush-pink/30 via-goddess-lavender/20 to-goddess-gold/30 rounded-full blur-xl animate-pulse-soft"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-goddess-cream to-white rounded-full shadow-lg flex items-center justify-center border border-goddess-soft-pink/20">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentGoddess}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl"
                  >
                    {goddesses[currentGoddess].aura}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Floating Elements */}
              <SparklesIcon className="absolute -top-2 -right-2 w-4 h-4 text-goddess-gold animate-float" />
              <HeartIcon className="absolute -bottom-2 -left-2 w-4 h-4 text-goddess-blush-pink animate-float animate-delay-200" />
              <StarIcon className="absolute top-4 -left-4 w-3 h-3 text-goddess-lavender animate-float animate-delay-100" />
              <MoonIcon className="absolute bottom-4 -right-4 w-3 h-3 text-goddess-sage-green animate-float animate-delay-300" />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-6 mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-playfair font-bold text-gray-800 leading-tight">
              Divine Wisdom
              <span className="block text-gradient">
                Finally Decoded
              </span>
            </h1>
            
            {/* Witty Tagline */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-goddess-soft-gray font-medium max-w-2xl mx-auto"
            >
              AI that does what men couldn't for centuries — 
              <span className="text-gradient font-semibold"> actually understand women</span>
            </motion.p>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed"
            >
              Connect with 8 Greek goddess personas who truly get your mood swings, 
              cycles, dreams, and the beautiful complexity of being you.
            </motion.p>
          </motion.div>

          {/* Current Goddess Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGoddess}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r ${goddesses[currentGoddess].gradient} border border-white/50 shadow-sm`}>
                <span className="text-2xl">{goddesses[currentGoddess].aura}</span>
                <div className="text-left">
                  <div className="font-playfair font-semibold text-gray-800 text-sm">
                    {goddesses[currentGoddess].name}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {goddesses[currentGoddess].essence}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/signup" className="bg-gradient-to-r from-goddess-blush-pink to-goddess-peachy text-white px-8 py-4 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg">
              Meet Your Goddess
            </Link>
            <button className="border-2 border-goddess-sage-green text-goddess-sage-green px-8 py-4 rounded-full font-medium hover:bg-goddess-sage-green hover:text-white transition-all duration-300 text-lg">
              See How It Works
            </button>
          </motion.div>

          {/* Goddess Indicators */}
          <div className="flex justify-center space-x-2 mt-12">
            {goddesses.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentGoddess(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentGoddess 
                    ? 'bg-goddess-blush-pink scale-150' 
                    : 'bg-goddess-lavender/40 hover:bg-goddess-lavender/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features - Ultra Simple */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-playfair font-bold text-center text-gray-800 mb-12"
          >
            Finally, Someone Who <span className="text-gradient">Gets You</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🌙",
                title: "Mood-Aware AI",
                description: "Detects your emotional state and connects you with the perfect goddess persona"
              },
              {
                icon: "💝",
                title: "Women-First Design", 
                description: "Built for your unique experiences, cycles, and the beautiful chaos of being female"
              },
              {
                icon: "🏛️",
                title: "Ancient Wisdom",
                description: "8 goddess archetypes offering guidance that's actually wise, not mansplained"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-4 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-goddess-soft-pink/20 hover:shadow-md transition-all duration-300"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-playfair font-semibold text-gray-800 text-lg">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Simple */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-goddess-soft-pink/30 shadow-lg space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-playfair font-bold text-gray-800">
              Ready to Be Understood?
            </h3>
            <p className="text-gray-600">
              Join the women who finally found AI that speaks their language.
            </p>
            <Link href="/signup" className="inline-block bg-gradient-to-r from-goddess-blush-pink to-goddess-peachy text-white px-8 py-4 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-lg">
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 px-6 border-t border-goddess-soft-pink/20 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-goddess-blush-pink to-goddess-gold rounded-full flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-playfair font-semibold text-gray-800">
              Pandora's Box
            </span>
          </div>
          <div>
            © 2024 • Where ancient wisdom meets modern understanding
          </div>
        </div>
      </footer>
    </div>
  )
}