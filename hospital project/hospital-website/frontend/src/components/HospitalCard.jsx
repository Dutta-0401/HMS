import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, Users, ArrowRight, Building2 } from 'lucide-react'

const specialtyColors = [
  'from-blue-500 to-blue-600',
  'from-emerald-500 to-emerald-600',
  'from-violet-500 to-violet-600',
  'from-amber-500 to-orange-500',
  'from-rose-500 to-pink-500',
]

export default function HospitalCard({ hospital, viewMode = 'grid' }) {
  const rating = (4 + (hospital.id?.charCodeAt(0) % 10) / 10).toFixed(1)
  const distance = (1 + (hospital.id?.charCodeAt(0) % 15)).toFixed(1)
  const specialties = hospital.specialties || []
  const doctorCount = hospital.doctorCount || specialties.length * 3

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
      >
        <Link 
          to={`/hospitals/${hospital.id}`}
          className="flex items-center gap-5 p-4 bg-white rounded-2xl border border-slate-200/60 
                    shadow-card hover:shadow-card-hover transition-all duration-300 group"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 
                        rounded-2xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
              {hospital.name}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {hospital.city || 'City'}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {rating}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              {specialties.slice(0, 3).map((s, i) => (
                <span key={i} className="badge-slate">{s}</span>
              ))}
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 
                               group-hover:translate-x-1 transition-all" />
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link 
        to={`/hospitals/${hospital.id}`}
        className="block bg-white rounded-2xl border border-slate-200/60 shadow-card 
                  hover:shadow-card-hover overflow-hidden transition-all duration-300 group h-full"
      >
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="badge bg-white/20 text-white border border-white/20 backdrop-blur-sm">
              <Star className="w-3 h-3 fill-current" />
              {rating}
            </span>
            <span className="badge bg-white/20 text-white border border-white/20 backdrop-blur-sm">
              {distance} km
            </span>
          </div>
          <div className="absolute bottom-4 left-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors mb-1 truncate">
            {hospital.name}
          </h3>
          <p className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            {hospital.city || 'City'}
          </p>

          {/* Specialties */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {specialties.slice(0, 3).map((s, i) => (
              <span key={i} className="badge-slate">{s}</span>
            ))}
            {specialties.length > 3 && (
              <span className="badge-slate">+{specialties.length - 3}</span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              <Users className="w-3.5 h-3.5" />
              {doctorCount} Doctors
            </div>
            <span className="text-sm font-medium text-primary-600 group-hover:translate-x-1 
                          transition-transform inline-flex items-center gap-1">
              View
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
