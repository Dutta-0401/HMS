import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Star, Award, Clock, MapPin, Stethoscope,
  Calendar, CreditCard, CheckCircle, ChevronLeft, ChevronRight,
  Phone, Mail, Building2, Shield, Users, Heart
} from 'lucide-react'
import { getDoctor, getSlots } from '../services/booking'
import SlotGrid from '../components/SlotGrid'
import BookingModal from '../components/BookingModal'
import dayjs from 'dayjs'

// Stepper component
function BookingStepper({ currentStep }) {
  const steps = [
    { number: 1, label: 'Select Date', icon: Calendar },
    { number: 2, label: 'Choose Time', icon: Clock },
    { number: 3, label: 'Confirm', icon: CheckCircle },
  ]

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isActive = currentStep >= step.number
        const isCurrent = currentStep === step.number

        return (
          <React.Fragment key={step.number}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isCurrent 
                  ? 'bg-primary-500 text-white shadow-glow' 
                  : isActive 
                    ? 'bg-primary-100 text-primary-600' 
                    : 'bg-surface-100 text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
              <span className="text-sm font-medium sm:hidden">{step.number}</span>
            </motion.div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${isActive ? 'bg-primary-300' : 'bg-surface-200'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Date selector component
function DateSelector({ selectedDate, onSelect, days }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {days.map((d, i) => {
        const val = d.format('YYYY-MM-DD')
        const isSelected = selectedDate === val
        const isToday = d.isSame(dayjs(), 'day')

        return (
          <motion.button
            key={val}
            onClick={() => onSelect(val)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex-shrink-0 p-3 rounded-xl transition-all duration-200 
                       min-w-[70px] ${
              isSelected
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-glow'
                : 'bg-white border-2 border-surface-200 text-slate-600 hover:border-primary-300'
            }`}
          >
            {isToday && !isSelected && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary-500 rounded-full" />
            )}
            <div className={`text-xs font-medium ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
              {isToday ? 'Today' : d.format('ddd')}
            </div>
            <div className="text-lg font-bold">{d.format('DD')}</div>
            <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
              {d.format('MMM')}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}

export default function DoctorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [slots, setSlots] = useState([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    setLoading(true)
    getDoctor(id)
      .then(setDoctor)
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (selectedDate) {
      setSlotsLoading(true)
      getSlots(id, selectedDate)
        .then(setSlots)
        .finally(() => setSlotsLoading(false))
    }
  }, [id, selectedDate])

  const days = Array.from({ length: 7 }).map((_, i) => dayjs().add(i, 'day'))

  function handleDateSelect(date) {
    setSelectedDate(date)
    setSelectedSlot(null)
    setCurrentStep(2)
  }

  function handleSlotSelect(slot) {
    setSelectedSlot(slot)
    setCurrentStep(3)
  }

  function onBooked(res) {
    navigate(`/book/${res.appointment_id}`)
  }

  // Generate consistent demo data
  const rating = doctor ? (4 + (doctor.id?.charCodeAt(0) % 10) / 10).toFixed(1) : '4.5'
  const experience = doctor?.experience || `${5 + (doctor?.id?.charCodeAt(0) % 15)} years`
  const initials = doctor?.name
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'DR'

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-soft p-8 animate-pulse">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-surface-200 rounded-2xl" />
            <div className="flex-1">
              <div className="h-6 bg-surface-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-surface-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="text-center py-16">
        <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">Doctor Not Found</h2>
        <p className="text-slate-500 mb-6">The doctor you're looking for doesn't exist.</p>
        <Link to="/hospitals" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Find Doctors
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 
                   transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </motion.div>

      {/* Doctor Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-soft overflow-hidden mb-8"
      >
        {/* Header gradient */}
        <div className="h-24 bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500" />
        
        <div className="px-6 md:px-8 pb-6 -mt-12">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-500 
                        flex items-center justify-center text-white text-2xl font-bold 
                        shadow-soft-lg border-4 border-white"
            >
              {initials}
            </motion.div>
            
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-slate-800">{doctor.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-primary-500" />
                  {doctor.specialty}
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-secondary-500" />
                  {experience}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-xl">
              <Star className="w-5 h-5 text-yellow-500" fill="#EAB308" />
              <span className="font-bold text-slate-800">{rating}</span>
              <span className="text-sm text-slate-500">(86 reviews)</span>
            </div>
          </div>

          {/* Quick info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Patients', value: '1000+' },
              { icon: Award, label: 'Experience', value: experience },
              { icon: Heart, label: 'Success Rate', value: '98%' },
              { icon: CreditCard, label: 'Consultation', value: `₹${doctor.fee}` },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-surface-50 rounded-xl p-4 text-center"
              >
                <item.icon className="w-5 h-5 text-primary-500 mx-auto mb-2" />
                <div className="font-bold text-slate-800">{item.value}</div>
                <div className="text-xs text-slate-500">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Booking Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-soft p-6 md:p-8"
      >
        <h2 className="font-display text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          Book Appointment
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Select your preferred date and time slot
        </p>

        {/* Stepper */}
        <BookingStepper currentStep={currentStep} />

        {/* Date Selection */}
        <div className="mb-8">
          <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-500" />
            Select Date
          </h3>
          <DateSelector 
            selectedDate={selectedDate} 
            onSelect={handleDateSelect} 
            days={days} 
          />
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-500" />
            Available Slots for {dayjs(selectedDate).format('DD MMM, YYYY')}
          </h3>
          
          {slotsLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-12 bg-surface-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <SlotGrid 
              slots={slots} 
              selectedSlot={selectedSlot}
              onSelect={handleSlotSelect} 
            />
          )}
        </div>

        {/* Selected slot summary */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 
                        rounded-xl border border-primary-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Selected Appointment</p>
                  <p className="font-semibold text-slate-800">
                    {dayjs(selectedDate).format('dddd, DD MMMM YYYY')} at {selectedSlot.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Fee</p>
                  <p className="text-xl font-bold text-primary-600">₹{doctor.fee}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Sticky booking button for mobile */}
      {selectedSlot && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-surface-200 
                    shadow-soft-xl md:hidden z-40"
        >
          <button
            onClick={() => setSelectedSlot(selectedSlot)}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 
                      text-white rounded-xl font-semibold shadow-glow"
          >
            Confirm Booking • ₹{doctor.fee}
          </button>
        </motion.div>
      )}

      {/* Booking Modal */}
      {selectedSlot && (
        <BookingModal 
          doctor={doctor} 
          slot={selectedSlot} 
          selectedDate={selectedDate}
          onClose={() => setSelectedSlot(null)} 
          onBooked={onBooked} 
        />
      )}
    </div>
  )
}
