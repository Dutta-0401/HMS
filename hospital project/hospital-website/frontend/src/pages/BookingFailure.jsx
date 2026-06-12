import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  XCircle, ArrowRight, Home, Phone, Mail, 
  AlertTriangle, RefreshCw
} from 'lucide-react'

export default function BookingFailure() {
  const [searchParams] = useSearchParams()
  const txnId = searchParams.get('txnid')
  const amount = searchParams.get('amount')

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
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto"
            >
              <XCircle className="w-9 h-9 text-red-600" />
            </motion.div>
            <h1 className="font-display text-2xl font-bold text-slate-900 mt-4">
              Payment Failed
            </h1>
            <p className="text-slate-500 mt-1">Something went wrong with your payment</p>
          </div>

          <div className="px-8 pb-8">
            {/* Transaction Details */}
            {(txnId || amount) && (
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-sm space-y-2">
                {txnId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Transaction ID</span>
                    <span className="font-mono font-medium text-slate-900">{txnId}</span>
                  </div>
                )}
                {amount && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount</span>
                    <span className="font-medium text-slate-900">₹{amount}</span>
                  </div>
                )}
              </div>
            )}

            {/* Tips */}
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 text-left mb-6">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Troubleshooting tips</p>
                <ul className="mt-1 space-y-1 text-amber-700">
                  <li>Check your account balance</li>
                  <li>Try a different payment method</li>
                  <li>Ensure your card details are correct</li>
                  <li>Contact your bank if issue persists</li>
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link to="/hospitals" className="btn-primary w-full justify-center">
                <RefreshCw className="w-4 h-4" />
                Try Booking Again
              </Link>
              <Link to="/" className="btn-outline w-full justify-center">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>

            {/* Support */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-3">Need help?</p>
              <div className="flex justify-center gap-4">
                <a href="tel:18001234567" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                  <Phone className="w-4 h-4" />
                  1800-123-4567
                </a>
                <a href="mailto:support@cityhealth.com" className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700">
                  <Mail className="w-4 h-4" />
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
