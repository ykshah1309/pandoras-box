'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EyeIcon, EyeSlashIcon, SparklesIcon, HeartIcon, MoonIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const supabase = createClient()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-goddess-cream via-white to-goddess-soft-pink/30 flex items-center justify-center px-4 py-8">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <SparklesIcon className="absolute top-1/4 left-1/4 w-6 h-6 text-goddess-gold/30 animate-float" />
        <HeartIcon className="absolute top-1/3 right-1/4 w-5 h-5 text-goddess-blush-pink/30 animate-float animate-delay-200" />
        <MoonIcon className="absolute bottom-1/3 left-1/3 w-7 h-7 text-goddess-lavender/30 animate-float animate-delay-100" />
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
              Welcome Back, Goddess
            </h1>
            <p className="text-gray-600 text-sm">
              Your divine companions await your return
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
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
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-goddess-lavender/50 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-goddess-blush-pink focus:border-transparent transition-all duration-300"
                  placeholder="goddess@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-goddess-lavender/50 rounded-xl bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-goddess-blush-pink focus:border-transparent transition-all duration-300"
                    placeholder="Your secret sanctuary"
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
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  className="rounded border-goddess-lavender/50 text-goddess-blush-pink focus:ring-goddess-blush-pink/30" 
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-goddess-blush-pink hover:text-goddess-deep-rose transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-goddess-blush-pink to-goddess-peachy text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Entering the sanctuary...</span>
                </span>
              ) : 'Enter Your Sanctuary'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-goddess-lavender/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 text-gray-500 font-medium">Or continue with divine grace</span>
            </div>
          </div>

          {/* Social Login */}
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

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              New to our pantheon?{' '}
              <Link href="/signup" className="text-goddess-blush-pink hover:text-goddess-deep-rose font-semibold transition-colors">
                Join the sisterhood
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}