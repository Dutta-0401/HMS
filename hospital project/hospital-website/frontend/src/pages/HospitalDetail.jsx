import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, Star, Clock, Phone, Mail, Building2, Users, 
  Stethoscope, ArrowLeft, Filter, Search, ChevronDown,
  CheckCircle, Calendar, Award
} from 'lucide-react'
import { getHospital, getDoctorsInHospital } from '../services/booking'
import DoctorCard from '../components/DoctorCard'

// Loading skeleton
function DoctorSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-soft animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-surface-200 rounded-2xl" />
        <div className="flex-1">
          <div className="h-5 bg-surface-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-surface-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

export default function HospitalDetail() {
  const { id } = useParams()
  const [hospital, setHospital] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getHospital(id),
      getDoctorsInHospital(id)
    ]).then(([h, d]) => {
      setHospital(h)
      setDoctors(d)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  // Get unique specialties
  const specialties = ['all', ...new Set(doctors.map(d => d.specialty).filter(Boolean))]

  // Filter doctors
  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = d.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty = selectedSpecialty === 'all' || d.specialty === selectedSpecialty
    return matchesSearch && matchesSpecialty
  })

  // Demo rating
  const rating = hospital ? (4 + (hospital.id?.charCodeAt(0) % 10) / 10).toFixed(1) : '4.5'

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        {/* Skeleton header */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden animate-pulse mb-8">
          <div className="h-48 bg-surface-200" />
          <div className="p-6">
            <div className="h-8 bg-surface-200 rounded w-1/2 mb-3" />
            <div className="h-4 bg-surface-200 rounded w-1/3" />
          </div>
        </div>
        
        {/* Skeleton doctors */}
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <DoctorSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="text-center py-16">
        <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-slate-800 mb-2">Hospital Not Found</h2>
        <p className="text-slate-500 mb-6">The hospital you're looking for doesn't exist.</p>
        <Link to="/hospitals" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Hospitals
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link 
          to="/hospitals" 
          className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 
                   transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Hospitals
        </Link>
      </motion.div>

      {/* Hospital Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-soft overflow-hidden mb-8"
      >
        {/* Banner */}
        <div className="h-48 md:h-56 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 
                      relative overflow-hidden">
          {/* Pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '30px 30px'
          }} />
          
          {/* Hospital icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl 
                        flex items-center justify-center"
            >
              <Building2 className="w-12 h-12 text-white" />
            </motion.div>
          </div>

          {/* Rating badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 
                        px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm">
            <Star className="w-5 h-5 text-yellow-500" fill="#EAB308" />
            <span className="font-bold text-slate-800">{rating}</span>
            <span className="text-slate-500 text-sm">(128 reviews)</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                {hospital.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-600">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  {hospital.city}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-green-500" />
                  Open 24/7
                </span>
                {hospital.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {hospital.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{doctors.length}</div>
                <div className="text-xs text-slate-500">Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary-600">
                  {(hospital.specialties || []).length}
                </div>
                <div className="text-xs text-slate-500">Departments</div>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="mt-6">
            <h3 className="font-semibold text-slate-700 mb-3">Specialties & Departments</h3>
            <div className="flex flex-wrap gap-2">
              {(hospital.specialties || []).map((spec, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-2 bg-primary-50 text-primary-600 
                           rounded-xl text-sm font-medium flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {spec}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Doctors Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-500" />
              Our Doctors
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor' : 'doctors'} available
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border-2 border-surface-300 bg-white 
                          text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100
                          transition-all w-48"
              />
            </div>

            {/* Specialty filter */}
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 border-surface-300 bg-white 
                        text-sm text-slate-700 focus:border-primary-500 focus:ring-2 
                        focus:ring-primary-100 transition-all cursor-pointer"
            >
              {specialties.map(spec => (
                <option key={spec} value={spec}>
                  {spec === 'all' ? 'All Specialties' : spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-soft">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700 mb-1">No doctors found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredDoctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <DoctorCard doctor={doctor} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}
