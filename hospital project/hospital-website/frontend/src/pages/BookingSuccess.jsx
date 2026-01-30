import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle, Calendar, Clock, User, Mail, 
  CreditCard, Download, Home, ArrowRight, Sparkles
} from 'lucide-react'
import { verifyPayUResponse } from '../services/paymentPayU'
import jsPDF from 'jspdf'

// Confetti component
function Confetti() {
  const colors = ['#1E88E5', '#00BFA5', '#FFC107', '#E91E63', '#9C27B0']
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            y: window.innerHeight + 20,
            rotate: Math.random() * 720 - 360,
            x: `calc(${Math.random() * 100}vw + ${(Math.random() - 0.5) * 200}px)`,
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 0.5,
            ease: 'linear',
          }}
          style={{
            position: 'absolute',
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}

export default function BookingSuccess() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [paymentData, setPaymentData] = useState(null)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const status = searchParams.get('status')
    const txnId = searchParams.get('txnid')
    const amount = searchParams.get('amount')
    const firstName = searchParams.get('firstname')
    const email = searchParams.get('email')

    const data = {
      status,
      txnid: txnId,
      amount,
      firstname: firstName,
      email,
    }

    setPaymentData(data)
    setLoading(false)

    if (data.txnid) {
      const booking = {
        id: data.txnid,
        amount: data.amount,
        patientName: data.firstname,
        email: data.email,
        paymentStatus: 'completed',
        paymentMethod: 'payu',
        timestamp: new Date().toISOString(),
      }
      
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      bookings.push(booking)
      localStorage.setItem('bookings', JSON.stringify(bookings))
    }

    // Hide confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3000)
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 
                       rounded-full animate-spin mb-4" />
        <div className="text-lg text-slate-600">Processing your booking...</div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      {showConfetti && <Confetti />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-soft-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 p-8 text-white text-center">
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
            Booking Confirmed! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 mt-2"
          >
            Your appointment has been successfully booked
          </motion.p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Appointment details card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface-50 rounded-xl p-5 mb-6"
          >
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Sparkles className="w-4 h-4 text-secondary-500" />
              <span>Appointment Details</span>
            </div>
            
            <div className="space-y-4">
              {paymentData?.txnid && (
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500">Transaction ID</div>
                    <div className="font-mono text-sm text-slate-800">{paymentData.txnid}</div>
                  </div>
                </div>
              )}
              
              {paymentData?.amount && (
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-secondary-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500">Amount Paid</div>
                    <div className="text-xl font-bold text-secondary-600">₹{paymentData.amount}</div>
                  </div>
                </div>
              )}
              
              {paymentData?.firstname && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500">Patient Name</div>
                    <div className="font-medium text-slate-800">{paymentData.firstname}</div>
                  </div>
                </div>
              )}
              
              {paymentData?.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-500">Email</div>
                    <div className="text-slate-800">{paymentData.email}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Email confirmation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-3 p-4 bg-primary-50 rounded-xl mb-6"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <div className="font-medium text-slate-800">Confirmation Email Sent</div>
              <div className="text-sm text-slate-500">Check your inbox at {paymentData?.email}</div>
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
              onClick={() => navigate('/profile')}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 
                        text-white rounded-xl font-semibold shadow-glow 
                        flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              View My Appointments
            </motion.button>

            <button
              onClick={() => {
                // Get user profile data from localStorage
                const user = JSON.parse(localStorage.getItem('user') || '{}')
                
                // Create PDF
                const doc = new jsPDF()
                
                // Set font sizes and colors
                doc.setFontSize(20)
                doc.setTextColor(30, 136, 229) // Primary color
                
                // Header
                doc.text('APPOINTMENT RECEIPT', 105, 20, { align: 'center' })
                
                // Line separator
                doc.setLineWidth(0.5)
                doc.setDrawColor(30, 136, 229)
                doc.line(20, 25, 190, 25)
                
                // Booking details
                doc.setFontSize(11)
                doc.setTextColor(100, 100, 100)
                doc.text('Booking ID:', 20, 35)
                doc.setTextColor(0, 0, 0)
                doc.text(paymentData?.txnid || 'N/A', 60, 35)
                
                doc.setTextColor(100, 100, 100)
                doc.text('Date:', 20, 45)
                doc.setTextColor(0, 0, 0)
                doc.text(new Date().toLocaleDateString(), 60, 45)
                
                doc.setTextColor(100, 100, 100)
                doc.text('Time:', 20, 55)
                doc.setTextColor(0, 0, 0)
                doc.text(new Date().toLocaleTimeString(), 60, 55)
                
                // Patient Details Section
                doc.setFontSize(14)
                doc.setTextColor(30, 136, 229)
                doc.text('PATIENT DETAILS', 20, 70)
                
                doc.setLineWidth(0.3)
                doc.line(20, 73, 190, 73)
                
                doc.setFontSize(11)
                doc.setTextColor(100, 100, 100)
                doc.text('Name:', 20, 83)
                doc.setTextColor(0, 0, 0)
                doc.text(user.name || paymentData?.firstname || 'N/A', 60, 83)
                
                doc.setTextColor(100, 100, 100)
                doc.text('Age:', 20, 93)
                doc.setTextColor(0, 0, 0)
                doc.text(String(user.age || 'N/A'), 60, 93)
                
                doc.setTextColor(100, 100, 100)
                doc.text('Address:', 20, 103)
                doc.setTextColor(0, 0, 0)
                const address = user.address || 'N/A'
                const addressLines = doc.splitTextToSize(address, 130)
                doc.text(addressLines, 60, 103)
                
                // Payment Details Section
                const yOffset = 103 + (addressLines.length * 7)
                doc.setFontSize(14)
                doc.setTextColor(30, 136, 229)
                doc.text('PAYMENT DETAILS', 20, yOffset + 10)
                
                doc.setLineWidth(0.3)
                doc.line(20, yOffset + 13, 190, yOffset + 13)
                
                doc.setFontSize(11)
                doc.setTextColor(100, 100, 100)
                doc.text('Amount Paid:', 20, yOffset + 23)
                doc.setFontSize(16)
                doc.setTextColor(0, 191, 165) // Secondary color
                doc.text(`₹${paymentData?.amount || '0'}`, 60, yOffset + 23)
                
                doc.setFontSize(11)
                doc.setTextColor(100, 100, 100)
                doc.text('Payment Method:', 20, yOffset + 33)
                doc.setTextColor(0, 0, 0)
                doc.text('PayU', 60, yOffset + 33)
                
                doc.setTextColor(100, 100, 100)
                doc.text('Status:', 20, yOffset + 43)
                doc.setTextColor(0, 191, 165)
                doc.text(paymentData?.status === 'success' ? 'Confirmed' : 'Pending', 60, yOffset + 43)
                
                // Footer
                doc.setLineWidth(0.5)
                doc.setDrawColor(30, 136, 229)
                doc.line(20, yOffset + 60, 190, yOffset + 60)
                
                doc.setFontSize(10)
                doc.setTextColor(100, 100, 100)
                doc.text('Thank you for choosing CityHealth!', 105, yOffset + 68, { align: 'center' })
                doc.text('Visit us at: www.cityhealth.com', 105, yOffset + 75, { align: 'center' })
                doc.text('Support: support@cityhealth.com', 105, yOffset + 82, { align: 'center' })
                
                // Save PDF
                doc.save(`receipt-${paymentData?.txnid || Date.now()}.pdf`)
              }}
              className="w-full py-3 border-2 border-surface-200 rounded-xl font-semibold 
                        text-slate-700 hover:bg-surface-50 transition-colors
                        flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>

            <Link 
              to="/"
              className="w-full py-3 text-slate-500 hover:text-primary-600 
                        transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
