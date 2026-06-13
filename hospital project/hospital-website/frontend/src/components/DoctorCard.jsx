import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Award, Star, IndianRupee, ArrowRight } from 'lucide-react'

const specialtyGradients = {
  Cardiology: 'from-rose-500 to-pink-600',
  Neurology: 'from-violet-500 to-purple-600',
  Pediatrics: 'from-emerald-500 to-teal-600',
  Orthopedics: 'from-blue-500 to-indigo-600',
  Dermatology: 'from-amber-500 to-orange-600',
  default: 'from-primary-500 to-primary-600',
}

export default function DoctorCard({ doctor }) {
  const rating = (4 + (doctor.id?.charCodeAt(0) % 10) / 10).toFixed(1)
  const gradient = specialtyGradients[doctor.specialty] || specialtyGradients.default

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/doctors/${doctor.id}`}
        className="block bg-white rounded-2xl border border-slate-200/60 shadow-card 
                  hover:shadow-card-hover overflow-hidden transition-all duration-300 group h-full"
      >
        {/* Header */}
        <div className={`relative h-24 bg-gradient-to-br ${gradient} overflow-hidden`}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />
        </div>

        {/* Avatar */}
        <div className="relative px-5 -mt-10">
          <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center 
                        text-white text-2xl font-bold shadow-lg border-4 border-white relative`}>
            {doctor.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full 
                          border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 pb-5 pt-3">
          <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
            {doctor.name}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">{doctor.specialty}</p>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {doctor.experience || '5+ yrs'}
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              {rating}
            </span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-0.5 text-sm font-semibold text-slate-900">
              <IndianRupee className="w-3.5 h-3.5" />
              {doctor.fee || 500}
            </div>
            <span className="btn-primary-sm text-xs py-1.5 px-3">
              Book Now
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
