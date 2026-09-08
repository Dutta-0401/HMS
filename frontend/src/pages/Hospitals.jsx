import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Grid3X3, List, Building2, X, Filter } from 'lucide-react'
import { getHospitals } from '../services/booking'
import HospitalCard from '../components/HospitalCard'

function HospitalSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="skeleton h-32" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
        <div className="flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [viewMode, setViewMode] = useState('grid')

  useEffect(() => {
    getHospitals().then(setHospitals).finally(() => setLoading(false))
  }, [])

  const cities = useMemo(() => {
    const set = new Set(hospitals.map(h => h.city).filter(Boolean))
    return Array.from(set).sort()
  }, [hospitals])

  const filtered = useMemo(() => {
    return hospitals.filter(h => {
      const matchesSearch = !searchQuery || 
        h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCity = !selectedCity || h.city === selectedCity
      return matchesSearch && matchesCity
    })
  }, [hospitals, searchQuery, selectedCity])

  const hasFilters = searchQuery || selectedCity

  return (
    <div className="min-h-[70vh]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="py-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl font-bold text-slate-900 tracking-tight">
              Find Hospitals
            </h1>
            <p className="text-slate-500 mt-1">
              Browse {hospitals.length} hospitals and book your appointment
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, city, or specialty..."
            className="input pl-11 pr-10"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="input w-auto min-w-[140px] appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2394a3b8%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat"
          >
            <option value="">All Cities</option>
            {cities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {loading ? (
        <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {[1, 2, 3, 4, 5, 6].map(i => <HospitalSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold text-slate-900 mb-2">No hospitals found</h3>
          <p className="text-slate-500 mb-6">Try adjusting your search or filters</p>
          {hasFilters && (
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCity('') }}
              className="btn-outline"
            >
              Clear filters
            </button>
          )}
        </motion.div>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">
            {filtered.length} hospital{filtered.length !== 1 ? 's' : ''} found
          </p>
          <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            <AnimatePresence mode="popLayout">
              {filtered.map(h => (
                <HospitalCard key={h.id} hospital={h} viewMode={viewMode} />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  )
}
