import React, { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, MapPin, Star, Phone, Stethoscope, 
  Search, Building2, Users, Filter
} from 'lucide-react'
import { getHospital, getDoctorsInHospital } from '../services/booking'
import DoctorCard from '../components/DoctorCard'

export default function HospitalDetail() {
  const { id } = useParams()
  const [hospital, setHospital] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [doctorSearch, setDoctorSearch] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('')

  useEffect(() => {
    Promise.all([getHospital(id), getDoctorsInHospital(id)])
      .then(([h, d]) => { setHospital(h); setDoctors(d) })
      .finally(() => setLoading(false))
  }, [id])

  const specialties = useMemo(() => {
    const set = new Set(doctors.map(d => d.specialty).filter(Boolean))
    return Array.from(set).sort()
  }, [doctors])

  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => {
      const matchSearch = !doctorSearch || 
        d.name?.toLowerCase().includes(doctorSearch.toLowerCase())
      const matchSpec = !selectedSpecialty || d.specialty === selectedSpecialty
      return matchSearch && matchSpec
    })
  }, [doctors, doctorSearch, selectedSpecialty])

  const rating = hospital ? (4 + (hospital.id?.charCodeAt(0) % 10) / 10).toFixed(1) : '4.5'

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-48 rounded-2xl" />
        <div className="skeleton h-12 w-1/2 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-64 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="text-center py-20">
        <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">Hospital Not Found</h2>
        <Link to="/hospitals" className="btn-primary mt-4">
          <ArrowLeft className="w-4 h-4" /> Back to Hospitals
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh]">
      {/* Back */}
      <Link to="/hospitals" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        All Hospitals
      </Link>

      {/* Hospital Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200/60 shadow-card overflow-hidden mb-8"
      >
        <div className="relative h-40 bg-primary-600">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <span className="badge bg-white/20 text-white border border-white/20 backdrop-blur-sm">
              <Star className="w-3 h-3 fill-current" /> {rating}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 -mt-10 relative">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-soft-lg border border-slate-100 
                        flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-primary-600" />
          </div>

          <h1 className="font-display text-2xl font-bold text-slate-900">{hospital.name}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {hospital.city || 'City'}
            </span>
            {hospital.phone && (
              <a href={`tel:${hospital.phone}`} className="flex items-center gap-1.5 hover:text-primary-600">
                <Phone className="w-4 h-4 text-slate-400" />
                {hospital.phone}
              </a>
            )}
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              {doctors.length} Doctors
            </span>
          </div>

          {hospital.specialties?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {hospital.specialties.map((s, i) => (
                <span key={i} className="badge-primary">{s}</span>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Doctors Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="font-display text-xl font-bold text-slate-900">
            Our Doctors
          </h2>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={doctorSearch}
                onChange={e => setDoctorSearch(e.target.value)}
                placeholder="Search doctors..."
                className="input pl-10 py-2 text-sm"
              />
            </div>
            <select
              value={selectedSpecialty}
              onChange={e => setSelectedSpecialty(e.target.value)}
              className="input w-auto py-2 text-sm min-w-[130px]"
            >
              <option value="">All Specialties</option>
              {specialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16">
            <Stethoscope className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No doctors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map(d => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
