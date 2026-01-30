import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, MapPin, Filter, Grid3X3, List, Building2, 
  Star, Clock, ChevronRight, Loader2, Map, X
} from 'lucide-react'
import { getHospitals } from '../services/booking'
import HospitalCard from '../components/HospitalCard'

// Loading skeleton component
function HospitalSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 bg-surface-200 rounded-xl" />
        <div className="flex-1">
          <div className="h-5 bg-surface-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-surface-200 rounded w-1/2 mb-3" />
          <div className="flex gap-2">
            <div className="h-6 bg-surface-200 rounded-full w-16" />
            <div className="h-6 bg-surface-200 rounded-full w-20" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [selectedCity, setSelectedCity] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setLoading(true)
    getHospitals()
      .then((r) => {
        setHospitals(r)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Get unique cities for filter
  const cities = ['all', ...new Set(hospitals.map(h => h.city).filter(Boolean))]

  // Filter hospitals
  const filteredHospitals = hospitals.filter(h => {
    const matchesSearch = h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         h.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         h.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCity = selectedCity === 'all' || h.city === selectedCity
    return matchesSearch && matchesCity
  })

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 py-16 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
              Find Hospitals Near You
            </h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Browse through our network of trusted hospitals and healthcare centers
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search hospitals, specialties, or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-soft-lg 
                          text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-white/30
                          transition-all duration-200 text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-100 rounded-full"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-custom py-8">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          {/* Left side - Results count */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary-500" />
              <span className="font-medium text-slate-800">
                {filteredHospitals.length} {filteredHospitals.length === 1 ? 'Hospital' : 'Hospitals'}
              </span>
            </div>

            {/* City filter dropdown */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 rounded-xl border-2 border-surface-300 bg-white 
                        text-slate-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-100
                        transition-all cursor-pointer"
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city === 'all' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>

          {/* Right side - View toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-surface-100 text-slate-500 hover:bg-surface-200'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-surface-100 text-slate-500 hover:bg-surface-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : ''}`}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <HospitalSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredHospitals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="font-display text-xl font-semibold text-slate-800 mb-2">
              No hospitals found
            </h3>
            <p className="text-slate-500 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCity('all') }}
              className="px-6 py-3 bg-primary-500 text-white rounded-xl font-medium 
                        hover:bg-primary-600 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Hospital Grid/List */}
        {!loading && filteredHospitals.length > 0 && (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1 max-w-3xl'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredHospitals.map((hospital, index) => (
                <motion.div
                  key={hospital.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <HospitalCard hospital={hospital} viewMode={viewMode} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
