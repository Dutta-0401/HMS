import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Star, IndianRupee, ArrowRight } from 'lucide-react'

export default function DoctorCard({ doctor }) {
  const rating = (4 + (doctor.id?.charCodeAt(0) % 10) / 10).toFixed(1)
  const initials = doctor.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/doctors/${doctor.id}`} className="block card-hover p-5 group h-full">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center
                        text-slate-700 text-lg font-semibold flex-shrink-0">
            {initials}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
              {doctor.name}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5 truncate">{doctor.specialty}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm">
          <span className="flex items-center gap-1 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {doctor.experience || '5+ yrs'}
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {rating}
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-0.5 text-sm font-semibold text-slate-900">
            <IndianRupee className="w-3.5 h-3.5" />
            {doctor.fee || 500}
          </div>
          <span className="text-sm font-medium text-primary-600 inline-flex items-center gap-1">
            Book Now
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
