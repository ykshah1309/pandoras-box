'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon, SparklesIcon, CheckIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1) // 1: Form, 2: Confirmation
  
  const supabase = createClient()
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
        }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setStep(2)
    }
    setLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Confirmation Step
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-goddess-cream via-white to-goddess-soft-pink/30 flex items-center justify-center px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-white/70 backdrop-blur-sm border border-goddess-soft-pink/30 rounded-3xl p-8 shadow-xl text-center space-y-6"
        >
          {/* Success Aura */}
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-goddess-sage-green/40 via-goddess-mint/30 to-goddess-sage-green/40 rounded-full blur-xl animate-pulse-soft"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-goddess-mint to-goddess-sage-green rounded-full shadow-lg flex items-center justify-center">
              <CheckIcon className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-playfair font-bold text-gray-800">
            Welcome to the Pantheon!
          </h1>
          
          <p className="text-gray-600 leading-relaxed">
            A divine invitation has been sent to <strong className="text-goddess-blush-pink">{formData.email}</strong>. 
            Check your sacred inbox and activate your connection to the goddesses.
          </p>

          <div className="bg-goddess-mint/20 border border-goddess-sage-green/30 rounded-2xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-semibold text-goddess-sage-green">Divine Steps:</span><br />
              1. Check your email (including spam realm)<br />
              2. Click the sacred activation link<br />
              3. Begin your journey with the goddesses
            </p>
          </div>

          <Link 
            href="/login" 
            className="inline-block bg-gradient-to-r from-goddess-sage-green to-goddess-mint text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Return to Sanctuary
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-goddess-cream via-white to-goddess-soft-pink/30 flex items-center justify-center px-4 py-8">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <SparklesIcon className="absolute top-1/4 right-1/4 w-6 h-6 text-goddess-gold/30 animate-float" />
        <HeartIcon className="absolute bottom-1/4 left-1/4 w-5 h-5 text-goddess-blush-pink/30 animate-float animate-delay-200" />
        <StarIcon className="absolute top-1/3 left-1/5 w-4 h-4 text-goddess-lavender/30 animate-float animate-delay-100" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-sm border border-goddess-soft-pink/30 rounded-3xl p-8 shadow-xl"
        >
          {/* Header with Divine Aura */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex flex-col items-center mb-6 group">
              {/* Divine Aura Element */}
              <div className="relative w-16 h-16 mb-3">
                <div className="absolute inset-0 bg-gradient-to-br from-goddess-blush-pink/30 via-goddess-lavender/20 to-goddess-gold/30 rounded-full blur-lg animate-pulse-soft"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-goddess-cream to-white rounded-full shadow-md flex items-center justify-center border border-goddess-soft-pink/30 group-hover:scale-105 transition-transform duration-300">
                  <SparklesIcon className="w-8 h-8 text-goddess-blush-pink" />
                </div>
              </div>
              
              <span className="text-xl font-playfair font-semibold text-gray-800 group-hover:text-goddess-blush-pink transition-colors">
                Pandora's Box
              </span>
            </Link>
            
            <h1 className="text-2xl md:text-3xl font-playfair font-bold text-gray-800 mb-2">
              Join the Divine Sisterhood
            </h1>
            <p className="text-gray-600 text-sm">
              Awaken the goddess within and connect with ancient wisdom
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignUp} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-goddess-lavender/50 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-goddess-blush-pink focus:border-transparent transition-all duration-300"
                    placeholder="Divine"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-goddess-lavender/50 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-goddess-blush-pink focus:border-transparent transition-all duration-300"
                    placeholder="Goddess"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-goddess-lavender/50 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-goddess-blush-pink focus:border-transparent transition-all duration-300"
                  placeholder="goddess@sanctuary.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Sacred Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border border-goddess-lavender/50 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-goddess-blush-pink focus:border-transparent transition-all duration-300"
                    placeholder="Create your divine key"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-goddess-soft-gray hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 6 characters of divine strength
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  required
                  className="mt-1 rounded border-goddess-lavender/50 text-goddess-blush-pink focus:ring-goddess-blush-pink/30" 
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="text-goddess-blush-pink hover:text-goddess-deep-rose transition-colors">
                    Terms of Sacred Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-goddess-blush-pink hover:text-goddess-deep-rose transition-colors">
                    Divine Privacy Policy
                  </Link>
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input 
                  type="checkbox" 
                  className="mt-1 rounded border-goddess-lavender/50 text-goddess-blush-pink focus:ring-goddess-blush-pink/30" 
                />
                <span className="text-sm text-gray-600">
                  Send me wisdom and guidance from the goddesses
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-goddess-blush-pink to-goddess-peachy text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Awakening your divinity...</span>
                </span>
              ) : 'Awaken My Inner Goddess'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-goddess-lavender/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 text-gray-500 font-medium">Or join with divine blessing</span>
            </div>
          </div>

          {/* Social Signup */}
          <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-3 border border-goddess-lavender/30 rounded-xl bg-white/50 hover:bg-white/70 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-gray-700 font-medium group-hover:text-gray-800">Continue with Google</span>
          </button>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Already part of our pantheon?{' '}
              <Link href="/login" className="text-goddess-blush-pink hover:text-goddess-deep-rose font-semibold transition-colors">
                Enter your sanctuary
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}