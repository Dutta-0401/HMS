import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight,
  Heart, AlertCircle, Loader2, ChevronLeft
} from 'lucide-react'
import { login, register } from '../services/auth'

export default function Login() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ 
    name: '', email: '', phone: '', password: '' 
  })

  async function handleLogin(e) {
    e.preventDefault()
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await login(loginData.email, loginData.password)
      navigate('/hospitals')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.phone) {
      setError('Please fill in all required fields')
      return
    }
    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await register(registerData)
      navigate('/hospitals')
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Back to home */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 
                    transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl shadow-soft-xl border border-slate-200/60 overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 
                            rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20">
                <Heart className="w-5 h-5 text-white" fill="white" strokeWidth={0} />
              </div>
              <span className="font-display font-bold text-lg text-slate-900">
                City<span className="text-primary-600">Health</span>
              </span>
            </div>

            <h1 className="font-display text-2xl font-bold text-slate-900">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isLogin 
                ? 'Sign in to manage your appointments' 
                : 'Join CityHealth to book appointments'
              }
            </p>
          </div>

          {/* Toggle */}
          <div className="px-8">
            <div className="flex bg-slate-100 rounded-xl p-1">
              {['Sign in', 'Sign up'].map((label, i) => (
                <button
                  key={label}
                  onClick={() => { setIsLogin(i === 0); setError(null) }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    (i === 0 ? isLogin : !isLogin)
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div>
                    <label className="input-label">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="input pl-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                        placeholder="Enter your password"
                        className="input pl-11 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-6">
                    {loading ? (
                      <Loader2 className="w-[18px] h-[18px] animate-spin" />
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  <div>
                    <label className="input-label">Full name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                      <input
                        type="text"
                        value={registerData.name}
                        onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                        placeholder="John Doe"
                        className="input pl-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="input pl-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Phone number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                      <input
                        type="tel"
                        value={registerData.phone}
                        onChange={e => setRegisterData({ ...registerData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        placeholder="9876543210"
                        className="input pl-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                        placeholder="Min 6 characters"
                        className="input pl-11 pr-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-6">
                    {loading ? (
                      <Loader2 className="w-[18px] h-[18px] animate-spin" />
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Demo hint — only visible in development builds */}
            {isLogin && import.meta.env.DEV && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-medium text-slate-600 mb-1.5">Demo credentials</p>
                <p className="text-xs text-slate-500">
                  <code className="bg-white px-1.5 py-0.5 rounded text-slate-700 font-mono">demo@patient.com</code>
                  {' / '}
                  <code className="bg-white px-1.5 py-0.5 rounded text-slate-700 font-mono">demo123</code>
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
