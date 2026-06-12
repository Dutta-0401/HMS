import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  CheckCircle2, Download, Calendar, ArrowRight, 
  Home, CreditCard, User, Mail, FileText
} from 'lucide-react'
import jsPDF from 'jspdf'

function Confetti() {
  const particles = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
    color: ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5],
    size: 6 + Math.random() * 6,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ 
            y: '100vh', 
            opacity: [1, 1, 0],
            rotate: Math.random() > 0.5 ? 360 : -360 
          }}
          transition={{ 
            duration: p.duration, 
            delay: p.delay, 
            ease: 'easeIn' 
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            background: p.color,
          }}
        />
      ))}
    </div>
  )
}

export default function BookingSuccess() {
  const [searchParams] = useSearchParams()
  const [showConfetti, setShowConfetti] = useState(true)
  
  const status = searchParams.get('status')
  const txnId = searchParams.get('txnid')
  const amount = searchParams.get('amount')
  const patientName = searchParams.get('firstname')
  const email = searchParams.get('email')

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3500)
    return () => clearTimeout(timer)
  }, [])

  function downloadReceipt() {
    const doc = new jsPDF()
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.text('CityHealth', 20, 25)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text('Booking Receipt', 20, 33)

    doc.setDrawColor(200)
    doc.line(20, 38, 190, 38)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Appointment Confirmed', 20, 50)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const details = [
      ['Booking ID', txnId || 'N/A'],
      ['Date', new Date().toLocaleDateString()],
      ['Patient', patientName || 'N/A'],
      ['Email', email || 'N/A'],
      ['Amount Paid', `Rs. ${amount || '0'}`],
    ]
    details.forEach(([label, value], i) => {
      doc.text(label + ':', 20, 65 + i * 10)
      doc.text(String(value), 70, 65 + i * 10)
    })

    doc.line(20, 125, 190, 125)
    doc.setFontSize(9)
    doc.text('Thank you for choosing CityHealth.', 20, 135)
    doc.text('For support, call 1800-123-4567', 20, 142)

    doc.save(`CityHealth-Receipt-${txnId || 'booking'}.pdf`)
  }

  return (
    <>
      {showConfetti && <Confetti />}
      
      <div className="min-h-[70vh] flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md mx-auto px-4"
        >
          <div className="bg-white rounded-3xl shadow-soft-xl border border-slate-200/60 overflow-hidden text-center">
            {/* Success Icon */}
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
                Payment Successful!
              </h1>
              <p className="text-slate-500 mt-1">Your appointment has been confirmed</p>
            </div>

            {/* Details */}
            <div className="px-8 pb-8">
              <div className="bg-slate-50 rounded-xl p-4 space-y-3 mb-6">
                {[
                  { icon: FileText, label: 'Transaction ID', value: txnId || 'N/A' },
                  { icon: CreditCard, label: 'Amount Paid', value: `₹${amount || '0'}` },
                  { icon: User, label: 'Patient', value: patientName || 'N/A' },
                  { icon: Mail, label: 'Email', value: email || 'N/A' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-500">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    <span className="font-medium text-slate-900 truncate ml-4 max-w-[180px]">{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Notification */}
              <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl text-sm text-primary-700 mb-6">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Confirmation email sent to {email || 'your email'}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button onClick={downloadReceipt} className="btn-primary w-full justify-center">
                  <Download className="w-4 h-4" />
                  Download Receipt
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
    </>
  )
}
