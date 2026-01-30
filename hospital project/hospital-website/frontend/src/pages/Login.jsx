import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Phone, Shield, ArrowRight, ArrowLeft, CheckCircle, 
  Loader2, Heart, AlertCircle, Smartphone
} from 'lucide-react'
import { sendOtp, verifyOtp } from '../services/auth'
import { useNavigate } from 'react-router-dom'

// OTP Input component
function OtpInput({ length = 6, value, onChange }) {
  const inputRefs = useRef([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  function handleChange(index, e) {
    const val = e.target.value
    if (!/^\d*$/.test(val)) return

    const newOtp = value.split('')
    newOtp[index] = val.slice(-1)
    const newValue = newOtp.join('')
    onChange(newValue)

    // Move to next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').slice(0, length)
    if (/^\d+$/.test(pasted)) {
      onChange(pasted.padEnd(length, ''))
      inputRefs.current[Math.min(pasted.length, length - 1)]?.focus()
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => inputRefs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-bold border-2 border-surface-200 
                   rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                   outline-none transition-all"
        />
      ))}
    </div>
  )
}

export default function Login() {
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState('phone') // 'phone' | 'otp' | 'success'
  const [devOtp, setDevOtp] = useState(null)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function onSend() {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await sendOtp(phone)
      if (res.dev_otp) setDevOtp(res.dev_otp)
      setStep('otp')
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function onVerify() {
    setLoading(true)
    setError(null)
    try {
      const data = await verifyOtp(phone, otp || devOtp || '123456')
      if (data.token) {
        setStep('success')
        setTimeout(() => navigate('/hospitals'), 1500)
      } else {
        setError('Invalid OTP. Please try again.')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-soft-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <Heart className="w-8 h-8" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold">Welcome to CityHealth</h1>
            <p className="text-white/80 mt-2">Sign in to book appointments with top doctors</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 'phone' && (
                <motion.div
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Phone className="w-6 h-6 text-primary-600" />
                    </div>
                    <h2 className="font-display text-lg font-bold text-slate-800">Enter Phone Number</h2>
                    <p className="text-sm text-slate-500">We'll send you a verification code</p>
                  </div>

                  <div className="relative mb-6">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 
                                  text-slate-500 border-r border-surface-200 pr-3">
                      <span className="text-lg">🇮🇳</span>
                      <span className="font-medium">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Enter 10-digit number"
                      className="w-full pl-24 pr-4 py-4 border-2 border-surface-200 rounded-xl 
                               focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                               outline-none transition-all text-lg"
                    />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-600 text-sm mb-4"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSend}
                    disabled={loading || phone.length < 10}
                    className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 
                              text-white rounded-xl font-semibold shadow-glow 
                              disabled:opacity-50 disabled:cursor-not-allowed
                              flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </motion.div>
              )}

              {step === 'otp' && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button
                    onClick={() => { setStep('phone'); setOtp(''); setError(null); }}
                    className="flex items-center gap-1 text-slate-600 hover:text-primary-600 
                             transition-colors mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Smartphone className="w-6 h-6 text-secondary-600" />
                    </div>
                    <h2 className="font-display text-lg font-bold text-slate-800">Verify OTP</h2>
                    <p className="text-sm text-slate-500">
                      Enter the 6-digit code sent to <span className="font-medium">+91 {phone}</span>
                    </p>
                  </div>

                  {/* Dev OTP hint */}
                  {devOtp && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl text-blue-600 text-sm mb-4"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Dev OTP: <strong>{devOtp}</strong></span>
                    </motion.div>
                  )}

                  <div className="mb-6">
                    <OtpInput 
                      length={6} 
                      value={otp} 
                      onChange={setOtp} 
                    />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-600 text-sm mb-4"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onVerify}
                    disabled={loading || otp.length < 6}
                    className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 
                              text-white rounded-xl font-semibold shadow-glow 
                              disabled:opacity-50 disabled:cursor-not-allowed
                              flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Continue
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>

                  <div className="text-center mt-4">
                    <button 
                      onClick={onSend}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Didn't receive code? Resend OTP
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="w-10 h-10 text-secondary-500" />
                  </motion.div>
                  <h2 className="font-display text-xl font-bold text-slate-800">Login Successful!</h2>
                  <p className="text-slate-500 mt-2">Redirecting you to the dashboard...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
        </p>
      </motion.div>
    </div>
  )
}
