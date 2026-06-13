import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Star, Award, Clock, MapPin, Stethoscope,
  Calendar, CreditCard, CheckCircle, Users, Heart,
  IndianRupee
} from 'lucide-react'
import { getDoctor, getSlots } from '../services/booking'
import SlotGrid from '../components/SlotGrid'
import BookingModal from '../components/BookingModal'
import dayjs from 'dayjs'

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
        const active = currentStep >= step.number
        const current = currentStep === step.number

        return (
          <React.Fragment key={step.number}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              current 
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                : active 
                  ? 'bg-primary-50 text-primary-700' 
                  : 'bg-slate-100 text-slate-400'
            }`}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.number}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${active ? 'bg-primary-300' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

function DateSelector({ selectedDate, onSelect, days }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {days.map((d) => {
        const val = d.format('YYYY-MM-DD')
        const isSelected = selectedDate === val
        const isToday = d.isSame(dayjs(), 'day')

        return (
          <motion.button
            key={val}
            onClick={() => onSelect(val)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`relative flex-shrink-0 p-3 rounded-xl transition-all duration-200 min-w-[70px] ${
              isSelected
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-primary-300'
            }`}
          >
            {isToday && !isSelected && (
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            )}
            <div className={`text-xs font-medium ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
              {isToday ? 'Today' : d.format('ddd')}
            </div>
            <div className="text-lg font-bold mt-0.5">{d.format('DD')}</div>
            <div className={`text-xs ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
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
    getDoctor(id).then(setDoctor).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (selectedDate) {
      setSlotsLoading(true)
      getSlots(id, selectedDate).then(setSlots).finally(() => setSlotsLoading(false))
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
    navigate(`/book/${res.appointmentId}`)
  }

  const rating = doctor ? (4 + (doctor.id?.charCodeAt(0) % 10) / 10).toFixed(1) : '4.5'
  const experience = doctor?.experience || `${5 + (doctor?.id?.charCodeAt(0) % 15)} years`

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-12 rounded-xl" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="text-center py-20">
        <Stethoscope className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Doctor Not Found</h2>
        <Link to="/hospitals" className="btn-primary mt-4">
          <ArrowLeft className="w-4 h-4" /> Find Doctors
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] max-w-4xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Doctor Profile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden mb-8"
      >
        <div className="h-24 bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700" />
        
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 
                        rounded-2xl flex items-center justify-center text-white text-2xl font-bold 
                        shadow-lg border-4 border-white"
            >
              {doctor.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
            </motion.div>
            
            <div className="flex-1">
              <h1 className="font-display text-2xl font-bold text-slate-900">{doctor.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-primary-500" />
                  {doctor.specialty}
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  {experience}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-900">{rating}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Users, label: 'Patients', value: '1000+' },
              { icon: Award, label: 'Experience', value: experience },
              { icon: Heart, label: 'Success Rate', value: '98%' },
              { icon: IndianRupee, label: 'Fee', value: `₹${doctor.fee}` },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                <item.icon className="w-4 h-4 text-primary-500 mx-auto mb-1.5" />
                <div className="font-semibold text-sm text-slate-900">{item.value}</div>
                <div className="text-xs text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Booking Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl border border-slate-200/60 shadow-card p-6 md:p-8"
      >
        <h2 className="font-display text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-500" />
          Book Appointment
        </h2>
        <p className="text-sm text-slate-500 mb-6">Select your preferred date and time</p>

        <BookingStepper currentStep={currentStep} />

        {/* Date */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary-500" />
            Select Date
          </h3>
          <DateSelector selectedDate={selectedDate} onSelect={handleDateSelect} days={days} />
        </div>

        {/* Slots */}
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary-500" />
            Available Slots — {dayjs(selectedDate).format('DD MMM, YYYY')}
          </h3>
          
          {slotsLoading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton h-12 rounded-xl" />
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

        {/* Selected Slot Summary */}
        <AnimatePresence>
          {selectedSlot && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-primary-600 font-medium">Selected Appointment</p>
                  <p className="font-semibold text-slate-900 mt-0.5">
                    {dayjs(selectedDate).format('dddd, DD MMMM YYYY')} at {selectedSlot.time}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Fee</p>
                  <p className="text-lg font-bold text-primary-700">₹{doctor.fee}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile CTA */}
      {selectedSlot && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 
                    shadow-soft-xl md:hidden z-40"
        >
          <button
            onClick={() => setSelectedSlot(selectedSlot)}
            className="w-full btn-primary justify-center py-4"
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
