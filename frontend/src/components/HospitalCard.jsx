import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, Users, ArrowRight, Building2 } from 'lucide-react'

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
        transition={{ duration: 0.3 }}
      >
        <Link
          to={`/hospitals/${hospital.id}`}
          className="flex items-center gap-5 p-4 card-hover group"
        >
          <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-primary-600" />
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
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors" />
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/hospitals/${hospital.id}`} className="block card-hover p-5 group h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-600" />
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {rating}
            <span className="text-slate-300">·</span>
            {distance} km
          </div>
        </div>

        <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors mb-1 truncate">
          {hospital.name}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          {hospital.city || 'City'}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {specialties.slice(0, 3).map((s, i) => (
            <span key={i} className="badge-slate">{s}</span>
          ))}
          {specialties.length > 3 && (
            <span className="badge-slate">+{specialties.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Users className="w-3.5 h-3.5" />
            {doctorCount} Doctors
          </div>
          <span className="text-sm font-medium text-primary-600 inline-flex items-center gap-1">
            View
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
