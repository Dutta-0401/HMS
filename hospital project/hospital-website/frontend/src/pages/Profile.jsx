import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, Clock, MapPin, Stethoscope, CreditCard,
  CheckCircle2, XCircle, AlertCircle, Download, ExternalLink,
  User, ArrowLeft, ChevronRight, FileText, Share2
} from 'lucide-react'
import { getUserAppointments } from '../services/booking'

function StatusBadge({ status }) {
  const styles = {
    confirmed: 'badge-emerald',
    completed: 'badge-primary',
    pending: 'badge-amber',
    cancelled: 'badge-red',
    payment_pending: 'badge-amber',
  }
  return (
    <span className={`${styles[status] || 'badge-slate'} capitalize`}>
      {status?.replace('_', ' ')}
    </span>
  )
}

function AppointmentCard({ appointment }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">{appointment.doctorName}</h3>
            <p className="text-sm text-slate-500">{appointment.doctorSpecialty}</p>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4 text-slate-400" />
          {appointment.slotDate}
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4 text-slate-400" />
          {appointment.slotTime}
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400" />
          {appointment.hospitalName}
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <CreditCard className="w-4 h-4 text-slate-400" />
          ₹{appointment.amount}
        </div>
      </div>
    </motion.div>
  )
}

export default function Profile() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    getUserAppointments().then(setAppointments).finally(() => setLoading(false))
  }, [])

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'all', label: 'All' },
  ]

  const filtered = appointments.filter(a => {
    if (activeTab === 'all') return true
    if (activeTab === 'upcoming') return ['confirmed', 'pending', 'payment_pending'].includes(a.status)
    return ['completed', 'cancelled'].includes(a.status)
  })

  return (
    <div className="min-h-[70vh] max-w-3xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden mb-8"
      >
        <div className="h-24 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700" />
        <div className="px-6 pb-6 -mt-10 relative">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 
                        rounded-2xl flex items-center justify-center text-white text-2xl font-bold 
                        shadow-lg border-4 border-white">
            {user.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || <User className="w-8 h-8" />}
          </div>
          <h1 className="font-display text-xl font-bold text-slate-900 mt-3">{user.name || 'Patient'}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
            {user.email && <span>{user.email}</span>}
            {user.phone && <span>{user.phone}</span>}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex bg-white border border-slate-200/60 rounded-xl p-1 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-slate-900 mb-2">No appointments yet</h3>
          <p className="text-slate-500 mb-6">Book your first appointment to get started</p>
          <Link to="/hospitals" className="btn-primary">
            Find a Doctor
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(a => (
            <AppointmentCard key={a.id} appointment={a} />
          ))}
        </div>
      )}
    </div>
  )
}
