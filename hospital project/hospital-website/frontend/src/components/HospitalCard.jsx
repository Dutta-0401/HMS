import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MapPin, Star, Clock, ChevronRight, Building2, 
  Users, Phone, ArrowRight
} from 'lucide-react'

export default function HospitalCard({ hospital, viewMode = 'grid' }) {
  // Generate a random but consistent rating for demo
  const rating = (4 + (hospital.id?.charCodeAt(0) % 10) / 10).toFixed(1)
  const distance = ((hospital.id?.charCodeAt(0) % 50) / 10 + 0.5).toFixed(1)

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="group"
      >
        <Link
          to={`/hospitals/${hospital.id}`}
          className="block bg-white rounded-2xl shadow-soft hover:shadow-soft-lg 
                    transition-all duration-300 p-6"
        >
          <div className="flex items-start gap-6">
            {/* Image */}
            <div className="w-32 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 
                          rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-10 h-10 text-primary-500" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-display font-semibold text-lg text-slate-800 
                               group-hover:text-primary-600 transition-colors">
                    {hospital.name}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {hospital.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {distance} km
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500" fill="#EAB308" />
                  <span className="font-semibold text-yellow-700">{rating}</span>
                </div>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mt-3">
                {(hospital.specialties || []).slice(0, 4).map((spec, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-primary-50 text-primary-600 
                              rounded-full text-xs font-medium"
                  >
                    {spec}
                  </span>
                ))}
                {(hospital.specialties?.length || 0) > 4 && (
                  <span className="px-3 py-1 bg-surface-100 text-slate-500 
                                 rounded-full text-xs font-medium">
                    +{hospital.specialties.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center self-center">
              <div className="w-10 h-10 rounded-full bg-surface-100 group-hover:bg-primary-100 
                            flex items-center justify-center transition-colors">
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 
                                      group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  // Grid view (default)
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group h-full"
    >
      <Link
        to={`/hospitals/${hospital.id}`}
        className="block h-full bg-white rounded-2xl shadow-soft hover:shadow-soft-lg 
                  transition-all duration-300 overflow-hidden"
      >
        {/* Image header */}
        <div className="h-32 bg-gradient-to-br from-primary-500 to-secondary-500 
                      relative overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
          
          {/* Hospital icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl 
                        flex items-center justify-center"
            >
              <Building2 className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Rating badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 
                        px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
            <Star className="w-4 h-4 text-yellow-500" fill="#EAB308" />
            <span className="font-semibold text-sm text-slate-800">{rating}</span>
          </div>

          {/* Distance badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 
                        px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-slate-700">{distance} km</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display font-semibold text-lg text-slate-800 
                       group-hover:text-primary-600 transition-colors mb-1">
            {hospital.name}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{hospital.city}</span>
            <span className="text-slate-300">•</span>
            <Clock className="w-4 h-4" />
            <span>Open 24/7</span>
          </div>

          {/* Specialties */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(hospital.specialties || []).slice(0, 3).map((spec, i) => (
              <span 
                key={i}
                className="px-2.5 py-1 bg-primary-50 text-primary-600 
                          rounded-full text-xs font-medium"
              >
                {spec}
              </span>
            ))}
            {(hospital.specialties?.length || 0) > 3 && (
              <span className="px-2.5 py-1 bg-surface-100 text-slate-500 
                             rounded-full text-xs font-medium">
                +{hospital.specialties.length - 3}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-surface-200">
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Users className="w-4 h-4" />
              <span>12+ Doctors</span>
            </div>
            <span className="flex items-center gap-1 text-primary-600 font-medium text-sm 
                           group-hover:gap-2 transition-all">
              View Details
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
