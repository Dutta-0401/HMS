import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Wallet, Building2, Check, AlertCircle, 
  Loader2, Calendar, Clock, Stethoscope, Shield,
  CreditCard
} from 'lucide-react'
import { createAppointment } from '../services/booking'
import { initiatePayUCheckout } from '../services/paymentPayU'
import dayjs from 'dayjs'

function PaymentOption({ id, label, icon: Icon, description, selected, onSelect }) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onSelect(id)}
      className={`w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${
        selected
          ? 'bg-primary-50 border-2 border-primary-500 ring-4 ring-primary-500/10'
          : 'bg-white border-2 border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        selected ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-slate-900">{label}</div>
        <div className="text-xs text-slate-400 mt-0.5">{description}</div>
      </div>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
        selected ? 'border-primary-500 bg-primary-500' : 'border-slate-300'
      }`}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
    </motion.button>
  )
}

export default function BookingModal({ doctor, slot, selectedDate, onClose, onBooked }) {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('pay_at_hospital')
  const [error, setError] = useState(null)

  const paymentOptions = [
    { id: 'payu', label: 'Pay Online', icon: CreditCard, description: 'UPI, Cards, Net Banking via PayU' },
    { id: 'pay_at_hospital', label: 'Pay at Hospital', icon: Building2, description: 'Cash or card at reception' },
  ]

  async function confirm() {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        doctorId: doctor.id,
        slotId: slot.id,
        paymentMethod: paymentMethod === 'payu' ? 'online' : paymentMethod,
      }
      const res = await createAppointment(payload)

      if (paymentMethod === 'payu') {
        try {
          const user = JSON.parse(localStorage.getItem('user') || '{}')
          // Pass only identity fields — amount is read from the DB on the server.
          // txnId is also generated server-side so the client cannot tamper with it.
          await initiatePayUCheckout({
            appointmentId: res.appointmentId,
            firstName: user.name || 'Patient',
            email: user.email || 'patient@cityhealth.com',
            phone: (user.phone || '9999999999').replace(/\D/g, ''),
          })
          setTimeout(() => {
            onBooked(res)
            onClose()
          }, 2000)
        } catch (payuErr) {
          console.error('PayU error:', payuErr)
          setError('Payment gateway unavailable. Please try "Pay at Hospital".')
        }
      } else {
        onBooked(res)
        onClose()
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-soft-xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-slate-900">Confirm Booking</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 
                          flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Doctor summary */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-11 h-11 bg-primary-600 
                            rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {doctor.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-slate-900 truncate">{doctor.name}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  {doctor.specialty}
                </p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary-500" />
                {dayjs(selectedDate).format('DD MMM, YYYY')}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary-500" />
                {slot.time}
              </span>
            </div>

            {/* Fee */}
            <div className="flex items-center justify-between mt-4 p-3 bg-primary-50 rounded-xl">
              <span className="text-sm text-primary-700">Consultation Fee</span>
              <span className="text-lg font-bold text-primary-700">₹{doctor.fee}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="px-6 pb-6">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Payment Method</h4>
            <div className="space-y-2">
              {paymentOptions.map(opt => (
                <PaymentOption
                  key={opt.id}
                  {...opt}
                  selected={paymentMethod === opt.id}
                  onSelect={setPaymentMethod}
                />
              ))}
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5" />
              <span>256-bit SSL encrypted payment</span>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="btn-outline flex-1">
                Cancel
              </button>
              <button
                onClick={confirm}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Confirm
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
