import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, CreditCard, Building2, Wallet, Check, 
  AlertCircle, Loader2, Calendar, Clock, Stethoscope, Shield
} from 'lucide-react'
import { createAppointment } from '../services/booking'
import { initiatePayUCheckout } from '../services/paymentPayU'
import dayjs from 'dayjs'

// Payment method card component
function PaymentMethodCard({ id, label, icon: Icon, description, selected, onSelect }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(id)}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
        selected
          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
          : 'border-surface-200 hover:border-primary-300 bg-white'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          selected ? 'bg-primary-500 text-white' : 'bg-surface-100 text-slate-500'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-slate-800">{label}</div>
          <div className="text-xs text-slate-500">{description}</div>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-primary-500 bg-primary-500' : 'border-surface-300'
        }`}>
          {selected && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
    </motion.button>
  )
}

// BookingModal handles confirm flow and calls backend to create appointment.
export default function BookingModal({ doctor, slot, selectedDate, onClose, onBooked }) {
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('payu')
  const [error, setError] = useState(null)

  const paymentMethods = [
    { id: 'payu', label: 'Pay with PayU', icon: Wallet, description: 'Multiple payment options' },
    { id: 'pay_at_hospital', label: 'Pay at Hospital', icon: Building2, description: 'Cash or card at reception' },
  ]

  async function loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const s = document.createElement('script')
      s.src = 'https://checkout.razorpay.com/v1/checkout.js'
      s.onload = () => resolve(true)
      s.onerror = () => resolve(false)
      document.body.appendChild(s)
    })
  }

  async function openRazorpayCheckout(order, amount) {
    const key = import.meta.env.VITE_REACT_APP_RAZORPAY_KEY_ID || import.meta.env.REACT_APP_RAZORPAY_KEY_ID || process.env.REACT_APP_RAZORPAY_KEY_ID
    if (!key) throw new Error('Razorpay key not configured')

    const options = {
      key,
      amount: amount * 100,
      currency: 'INR',
      name: 'CityHealth',
      description: 'Appointment payment',
      order_id: order,
      handler: function (response) {
        onBooked({ appointment_id: order, status: 'confirmed' })
      },
      modal: { ondismiss: function(){ setError('Payment dismissed') } }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  async function confirm() {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        doctorId: doctor.id,
        slotId: slot.id,
        paymentMethod: paymentMethod,
      }
      const res = await createAppointment(payload)

      if (paymentMethod === 'payu') {
        try {
          const user = JSON.parse(localStorage.getItem('user') || '{}')
          const paymentDetails = {
            txnId: `${res.appointment_id}-${Date.now()}`,
            amount: res.amount || 500,
            productInfo: `Doctor Consultation - ${doctor.name}`,
            firstName: user.name || 'Patient',
            email: user.email || 'patient@cityhealth.com',
            phone: user.phone || '9999999999',
            address: 'Clinic Address',
            city: doctor.hospital_city || 'City',
            state: 'State',
            zipcode: '000000',
          }
          initiatePayUCheckout(paymentDetails)
          setTimeout(() => {
            onBooked(res)
            onClose()
          }, 2000)
        } catch (payuErr) {
          console.error('PayU error:', payuErr)
          const simulate = window.confirm('PayU checkout failed. Click OK to simulate payment and confirm booking.')
          if (simulate) {
            onBooked({ ...res, status: 'confirmed' })
          } else {
            setError('Payment not completed')
          }
        }
      } else if (paymentMethod === 'online' && res.razorpay_order_id) {
        const loaded = await loadRazorpayScript()
        if (loaded && window.Razorpay) {
          await openRazorpayCheckout(res.razorpay_order_id, res.amount || 500)
        } else {
          const simulate = window.confirm('Razorpay checkout failed to load. Click OK to simulate payment and confirm booking.')
          if (simulate) {
            onBooked({ appointment_id: res.appointment_id, status: 'confirmed' })
          } else {
            setError('Payment not completed')
          }
        }
      } else {
        onBooked(res)
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Booking failed')
    } finally {
      setLoading(false)
      if (paymentMethod !== 'payu') onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-soft-xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 
                        flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-display text-xl font-bold">Confirm Booking</h3>
            <p className="text-white/80 text-sm mt-1">Review your appointment details</p>
          </div>

          <div className="p-6">
            {/* Appointment summary */}
            <div className="bg-surface-50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-500 
                              flex items-center justify-center text-white font-bold text-lg">
                  {doctor.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-800">{doctor.name}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" />
                    {doctor.specialty}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-primary-500" />
                      {dayjs(selectedDate).format('DD MMM, YYYY')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary-500" />
                      {slot.time}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-200">
                <span className="text-slate-600">Consultation Fee</span>
                <span className="text-xl font-bold text-primary-600">₹{doctor.fee}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="mb-6">
              <h4 className="font-semibold text-slate-800 mb-3">Select Payment Method</h4>
              <div className="space-y-2">
                {paymentMethods.map(method => (
                  <PaymentMethodCard
                    key={method.id}
                    {...method}
                    selected={paymentMethod === method.id}
                    onSelect={setPaymentMethod}
                  />
                ))}
              </div>
            </div>

            {/* Security badge */}
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
              <Shield className="w-4 h-4 text-secondary-500" />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-600 text-sm mb-4"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-surface-200 
                          text-slate-600 font-semibold hover:bg-surface-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirm}
                disabled={loading}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 
                          text-white font-semibold shadow-glow disabled:opacity-50 
                          disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm & Pay
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
