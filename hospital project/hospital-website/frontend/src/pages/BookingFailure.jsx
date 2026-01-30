import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  XCircle, CreditCard, User, Mail, AlertTriangle, 
  RefreshCw, Home, Phone, MessageCircle, Lightbulb
} from 'lucide-react'

export default function BookingFailure() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState(null)

  useEffect(() => {
    const status = searchParams.get('status')
    const txnId = searchParams.get('txnid')
    const amount = searchParams.get('amount')
    const firstName = searchParams.get('firstname')
    const email = searchParams.get('email')
    const error = searchParams.get('error')

    const data = {
      status,
      txnid: txnId,
      amount,
      firstname: firstName,
      email,
      error: error || 'Payment was declined or cancelled.',
    }

    setPaymentData(data)
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 
                       rounded-full animate-spin mb-4" />
        <div className="text-lg text-slate-600">Processing result...</div>
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
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft"
          >
            <XCircle className="w-12 h-12 text-red-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-display text-2xl font-bold"
          >
            Payment Failed
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 mt-2"
          >
            {paymentData?.error}
          </motion.p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-50 rounded-xl p-5 mb-6"
          >
            <div className="flex items-center gap-2 text-sm text-red-600 mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>Transaction Details</span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-red-100">
                <span className="text-slate-500">Transaction ID</span>
                <span className="font-mono text-slate-800">{paymentData?.txnid || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-red-100">
                <span className="text-slate-500">Amount</span>
                <span className="font-medium text-slate-800">₹{paymentData?.amount || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-red-100">
                <span className="text-slate-500">Patient</span>
                <span className="text-slate-800">{paymentData?.firstname || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500">Email</span>
                <span className="text-slate-800">{paymentData?.email || 'N/A'}</span>
              </div>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-800 mb-1">Helpful Tips</div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Check if your card has sufficient balance</li>
                  <li>• Try a different payment method</li>
                  <li>• Ensure OTP/PIN was entered correctly</li>
                  <li>• Contact your bank if issues persist</li>
                </ul>
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
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/hospitals')}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 
                        text-white rounded-xl font-semibold shadow-glow 
                        flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Booking Again
            </motion.button>

            <Link 
              to="/"
              className="w-full py-3 border-2 border-surface-200 rounded-xl font-semibold 
                        text-slate-700 hover:bg-surface-50 transition-colors
                        flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 pt-6 border-t border-surface-200 text-center"
          >
            <p className="text-sm text-slate-500 mb-3">Need help? Contact our support team</p>
            <div className="flex justify-center gap-4">
              <a 
                href="tel:1800-123-4567" 
                className="flex items-center gap-2 text-primary-600 hover:underline text-sm"
              >
                <Phone className="w-4 h-4" />
                1800-123-4567
              </a>
              <a 
                href="mailto:support@cityhealth.com" 
                className="flex items-center gap-2 text-primary-600 hover:underline text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Chat Support
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
