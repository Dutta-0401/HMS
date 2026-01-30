import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle, Calendar, User, ArrowRight, 
  Download, Share2, Clock, Home
} from 'lucide-react'
import { getUserAppointments } from '../services/booking'

export default function BookingResult() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 
                       rounded-full animate-spin mb-4" />
        <div className="text-lg text-slate-600">Loading appointment details...</div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-soft-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-500 to-primary-500 p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft"
          >
            <CheckCircle className="w-12 h-12 text-secondary-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-2xl font-bold"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 mt-2"
          >
            Your appointment has been successfully scheduled
          </motion.p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Appointment ID */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface-50 rounded-xl p-5 mb-6 text-center"
          >
            <div className="text-sm text-slate-500 mb-1">Appointment ID</div>
            <div className="font-mono text-lg font-bold text-slate-800">{id}</div>
          </motion.div>

          {/* Quick info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary-600 mt-0.5" />
              <div>
                <div className="font-medium text-slate-800">What's Next?</div>
                <p className="text-sm text-slate-600 mt-1">
                  You'll receive a confirmation SMS and email shortly. 
                  Please arrive 15 minutes before your scheduled time.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-3"
          >
            <Link
              to="/profile"
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 
                        text-white rounded-xl font-semibold shadow-glow 
                        flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              View My Appointments
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex gap-3">
              <button 
                onClick={() => alert('Download feature coming soon!')}
                className="flex-1 py-3 border-2 border-surface-200 rounded-xl font-semibold 
                          text-slate-700 hover:bg-surface-50 transition-colors
                          flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Appointment Confirmation',
                      text: `Appointment ID: ${id}`,
                      url: window.location.href
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copied to clipboard!')
                  }
                }}
                className="flex-1 py-3 border-2 border-surface-200 rounded-xl font-semibold 
                          text-slate-700 hover:bg-surface-50 transition-colors
                          flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            <Link
              to="/"
              className="w-full py-3 text-slate-500 hover:text-primary-600 
                        transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
