import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Star, Clock, Award, Calendar, ChevronRight,
  Stethoscope, CheckCircle
} from 'lucide-react'

export default function DoctorCard({ doctor }) {
  // Generate consistent demo data
  const rating = (4 + (doctor.id?.charCodeAt(0) % 10) / 10).toFixed(1)
  const experience = doctor.experience || `${5 + (doctor.id?.charCodeAt(0) % 15)} years`
  const isAvailable = true // In a real app, this would come from the backend

  // Get initials for avatar
  const initials = doctor.name
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'DR'

  // Generate a gradient based on specialty
  const getGradient = (specialty) => {
    const gradients = {
      'Cardiology': 'from-red-400 to-pink-500',
      'Neurology': 'from-purple-400 to-indigo-500',
      'Pediatrics': 'from-green-400 to-teal-500',
      'Orthopedics': 'from-blue-400 to-cyan-500',
      'Dermatology': 'from-orange-400 to-yellow-500',
      'General Medicine': 'from-primary-400 to-primary-600',
    }
    return gradients[specialty] || 'from-primary-400 to-secondary-500'
  }

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <div className="bg-white rounded-2xl shadow-soft hover:shadow-soft-lg 
                    transition-all duration-300 overflow-hidden h-full">
        {/* Header with gradient */}
        <div className={`h-3 bg-gradient-to-r ${getGradient(doctor.specialty)}`} />
        
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getGradient(doctor.specialty)} 
                            flex items-center justify-center text-white font-bold text-lg shadow-soft`}>
                {initials}
              </div>
              {isAvailable && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 
                              rounded-full border-2 border-white flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-slate-800 
                           group-hover:text-primary-600 transition-colors truncate">
                {doctor.name}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                <Stethoscope className="w-4 h-4 text-primary-500" />
                <span className="truncate">{doctor.specialty}</span>
              </div>
              
              {/* Experience & Rating */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Award className="w-3.5 h-3.5 text-secondary-500" />
                  <span>{experience}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500" fill="#EAB308" />
                  <span className="text-xs font-medium text-slate-700">{rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Availability indicator */}
          <div className="flex items-center gap-2 mt-4 py-2 px-3 bg-green-50 rounded-xl">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">Available Today</span>
            <span className="text-xs text-green-600 ml-auto">Next: 10:30 AM</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-200">
            <div>
              <span className="text-xs text-slate-500">Consultation Fee</span>
              <div className="text-lg font-bold text-primary-600">₹{doctor.fee}</div>
            </div>
            
            <Link
              to={`/doctors/${doctor.id}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r 
                        from-primary-500 to-primary-600 text-white rounded-xl 
                        font-medium text-sm shadow-soft hover:shadow-glow 
                        transition-all duration-300 group-hover:gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Now
              <ChevronRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 
                                      group-hover:ml-0 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
