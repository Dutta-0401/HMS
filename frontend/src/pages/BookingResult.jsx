import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, Calendar, ArrowRight, Home, Info, 
  Share2, Copy, Download
} from 'lucide-react'

export default function BookingResult() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Appointment Booked',
          text: `My appointment has been confirmed! Booking ID: ${id}`,
        })
      } catch {}
    } else {
      navigator.clipboard?.writeText(id)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-4"
      >
        <div className="bg-white rounded-3xl shadow-soft-xl border border-slate-200/60 overflow-hidden text-center">
          <div className="pt-10 pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-slate-900 mt-4">
              Appointment Confirmed!
            </h1>
            <p className="text-slate-500 mt-1">Your booking has been successfully created</p>
          </div>

          <div className="px-8 pb-8">
            {/* Booking ID */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-slate-400 mb-1">Booking ID</p>
              <p className="font-mono font-semibold text-slate-900">{id}</p>
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl text-sm text-primary-700 text-left mb-6">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">What's next?</p>
                <ul className="mt-1 space-y-1 text-primary-600">
                  <li>Arrive 15 minutes before your appointment</li>
                  <li>Bring a valid ID and insurance card</li>
                  <li>You'll receive an SMS/email confirmation shortly</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button onClick={handleShare} className="btn-primary w-full justify-center">
                <Share2 className="w-4 h-4" />
                Share Booking Details
              </button>
              <Link to="/profile" className="btn-outline w-full justify-center">
                <Calendar className="w-4 h-4" />
                View My Appointments
              </Link>
              <Link to="/" className="btn-ghost w-full justify-center">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
