import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  User, Calendar, Clock, MapPin, Stethoscope, 
  X, AlertCircle, CheckCircle, XCircle, LogOut,
  Phone, Mail, ChevronRight, Settings, History,
  Camera, Edit3, Save, Loader2, Home, Users
} from 'lucide-react'
import { getUserAppointments, cancelAppointment } from '../services/booking'

// Appointment status badge
function StatusBadge({ status }) {
  const config = {
    confirmed: { icon: CheckCircle, color: 'text-secondary-600 bg-secondary-50', label: 'Confirmed' },
    pending: { icon: Clock, color: 'text-yellow-600 bg-yellow-50', label: 'Pending' },
    completed: { icon: CheckCircle, color: 'text-blue-600 bg-blue-50', label: 'Completed' },
    cancelled: { icon: XCircle, color: 'text-red-600 bg-red-50', label: 'Cancelled' },
  }
  
  const { icon: Icon, color, label } = config[status] || config.pending
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

// Profile Edit Modal
function ProfileEditModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || '',
    location: user?.location || '',
    address: user?.address || '',
    profilePhoto: user?.profilePhoto || null,
  })
  const [saving, setSaving] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(user?.profilePhoto || null)
  const fileInputRef = useRef(null)

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (file) {
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      
      // Convert to base64 for storage
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    onSave(formData)
    setSaving(false)
  }

  return (
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
        className="bg-white rounded-2xl shadow-soft-xl w-full max-w-lg max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 
                      flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-display text-xl font-bold flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Edit Profile
          </h3>
          <p className="text-white/80 text-sm mt-1">Update your personal information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Profile Photo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-secondary-500 
                            flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-soft">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  formData.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full 
                          flex items-center justify-center text-white shadow-soft
                          hover:bg-primary-600 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border-2 border-surface-200 rounded-xl 
                           focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                           outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border-2 border-surface-200 rounded-xl 
                           focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                           outline-none transition-all"
                />
              </div>
            </div>

            {/* Phone (read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border-2 border-surface-200 rounded-xl 
                           bg-surface-50 text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Phone number cannot be changed</p>
            </div>

            {/* Age and Gender Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border-2 border-surface-200 rounded-xl 
                           focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                           outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-surface-200 rounded-xl 
                           focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                           outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City / Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter your city"
                  className="w-full pl-10 pr-4 py-3 border-2 border-surface-200 rounded-xl 
                           focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                           outline-none transition-all"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
              <div className="relative">
                <Home className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your complete address"
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border-2 border-surface-200 rounded-xl 
                           focus:border-primary-500 focus:ring-2 focus:ring-primary-200 
                           outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border-2 border-surface-200 
                        text-slate-600 font-semibold hover:bg-surface-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={saving}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 
                        text-white font-semibold shadow-glow disabled:opacity-50 
                        disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// Appointment card
function AppointmentCard({ appointment, onCancel }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-xl shadow-soft p-5 border border-surface-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-500 
                        flex items-center justify-center text-white font-bold">
            {appointment.doctor_name?.charAt(0) || 'D'}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{appointment.doctor_name || 'Doctor'}</h3>
            <p className="text-sm text-slate-500 flex items-center gap-1">
              <Stethoscope className="w-3 h-3" />
              {appointment.specialty || 'General'}
            </p>
          </div>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-primary-500" />
          {appointment.date || 'Scheduled'}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-primary-500" />
          {appointment.time || '10:00 AM'}
        </div>
        {appointment.hospital_name && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-secondary-500" />
            {appointment.hospital_name}
          </div>
        )}
      </div>

      {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
        <>
          <AnimatePresence>
            {showCancelConfirm ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-surface-200"
              >
                <p className="text-sm text-slate-600 mb-3">
                  Are you sure you want to cancel this appointment?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 py-2 px-4 rounded-lg border border-surface-200 
                             text-slate-600 font-medium hover:bg-surface-50 transition-colors"
                  >
                    Keep It
                  </button>
                  <button
                    onClick={() => onCancel(appointment.id)}
                    className="flex-1 py-2 px-4 rounded-lg bg-red-500 text-white 
                             font-medium hover:bg-red-600 transition-colors"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4 border-t border-surface-200 flex justify-between items-center"
              >
                <span className="text-sm text-slate-500">
                  Fee: <span className="font-semibold text-slate-800">₹{appointment.fee || 500}</span>
                </span>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium 
                           flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Cancel Booking
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upcoming')
  const [showEditModal, setShowEditModal] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      getUserAppointments(user.id)
        .then(setAppointments)
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user?.id])

  async function onCancel(id) {
    await cancelAppointment(id)
    setAppointments(a => a.map(x => x.id === id ? { ...x, status: 'cancelled' } : x))
  }

  function handleLogout() {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    navigate('/login')
  }

  function handleSaveProfile(formData) {
    const updatedUser = { ...user, ...formData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setShowEditModal(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">Not Logged In</h2>
        <p className="text-slate-500 mb-6">Please login to view your profile and appointments</p>
        <Link to="/login" className="btn-primary inline-flex items-center gap-2">
          Login to Continue
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  const filteredAppointments = appointments.filter(ap => {
    if (activeTab === 'upcoming') return ['confirmed', 'pending'].includes(ap.status)
    if (activeTab === 'past') return ['completed', 'cancelled'].includes(ap.status)
    return true
  })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-secondary-500 text-white 
                      px-6 py-3 rounded-xl shadow-soft-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Profile updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-soft overflow-hidden mb-8"
      >
        <div className="h-24 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500" />
        
        <div className="px-6 pb-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-400 to-secondary-500 
                            flex items-center justify-center text-white text-3xl font-bold 
                            shadow-soft-lg border-4 border-white">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <button
                onClick={() => setShowEditModal(true)}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 rounded-full 
                          flex items-center justify-center text-white shadow-soft
                          hover:bg-primary-600 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-slate-800">{user.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-1 text-slate-500 text-sm">
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {user.phone}
                  </span>
                )}
                {user.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                )}
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowEditModal(true)}
                className="p-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
                title="Edit Profile"
              >
                <Settings className="w-5 h-5 text-slate-600" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>

          {/* Profile Details Grid */}
          {(user.age || user.gender || user.address) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 pt-6 border-t border-surface-200"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {user.age && (
                  <div className="bg-surface-50 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-1">Age</div>
                    <div className="font-semibold text-slate-800">{user.age} years</div>
                  </div>
                )}
                {user.gender && (
                  <div className="bg-surface-50 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-1">Gender</div>
                    <div className="font-semibold text-slate-800 capitalize">
                      {user.gender === 'prefer_not_to_say' ? 'Not specified' : user.gender}
                    </div>
                  </div>
                )}
                {user.location && (
                  <div className="bg-surface-50 rounded-xl p-3">
                    <div className="text-xs text-slate-500 mb-1">Location</div>
                    <div className="font-semibold text-slate-800">{user.location}</div>
                  </div>
                )}
                {user.address && (
                  <div className="bg-surface-50 rounded-xl p-3 md:col-span-1">
                    <div className="text-xs text-slate-500 mb-1">Address</div>
                    <div className="font-semibold text-slate-800 text-sm truncate" title={user.address}>
                      {user.address}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Complete Profile Prompt */}
          {(!user.age || !user.gender || !user.email || !user.address) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">Complete Your Profile</h4>
                  <p className="text-sm text-slate-600 mt-1">
                    Add more details to help doctors provide better care.
                  </p>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="mt-2 text-sm text-primary-600 font-medium hover:underline 
                             flex items-center gap-1"
                  >
                    <Edit3 className="w-4 h-4" />
                    Complete Profile
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <ProfileEditModal
            user={user}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveProfile}
          />
        )}
      </AnimatePresence>

      {/* Appointments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-primary-500" />
            My Appointments
          </h2>
          
          {/* Tabs */}
          <div className="flex bg-surface-100 p-1 rounded-lg">
            {[
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'past', label: 'Past' },
              { id: 'all', label: 'All' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-600 hover:text-primary-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-surface-200 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-surface-200 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-surface-200 rounded w-1/4" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-4 bg-surface-200 rounded w-24" />
                  <div className="h-4 bg-surface-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-soft p-12 text-center"
          >
            <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-800 mb-2">
              No {activeTab === 'all' ? '' : activeTab} appointments
            </h3>
            <p className="text-slate-500 mb-6">
              {activeTab === 'upcoming' 
                ? "You don't have any upcoming appointments scheduled" 
                : activeTab === 'past'
                  ? "You don't have any past appointments"
                  : "You haven't booked any appointments yet"}
            </p>
            <Link to="/hospitals" className="btn-primary inline-flex items-center gap-2">
              Book an Appointment
              <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredAppointments.map(appointment => (
                <AppointmentCard 
                  key={appointment.id} 
                  appointment={appointment} 
                  onCancel={onCancel}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}
