import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, Grid3X3, List, Building2, X,
  Navigation, LocateFixed, Loader2, AlertCircle,
} from 'lucide-react'
import { getHospitals } from '../services/booking'
import HospitalCard from '../components/HospitalCard'
import useGeolocation from '../hooks/useGeolocation'
import { getHospitalCoords, distanceKm, NEARBY_RADII_KM } from '../utils/geo'

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
  const [nearbyOnly, setNearbyOnly] = useState(false)
  const [radiusKm, setRadiusKm] = useState(25)
  const [sortBy, setSortBy] = useState('recommended')
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)

  const { coords, status, error, request, clear, hasLocation } = useGeolocation()

  useEffect(() => {
    getHospitals().then(setHospitals).finally(() => setLoading(false))
  }, [])

  // Ask for location access shortly after arriving (e.g. right after
  // sign in/up redirect) when we have no saved location yet.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cityhealth:user-location')
      const prompted = localStorage.getItem('cityhealth:location-prompted')
      if (!saved && !prompted) {
        const t = setTimeout(() => setShowLocationPrompt(true), 600)
        return () => clearTimeout(t)
      }
    } catch { /* storage unavailable — still show prompt */ 
      const t = setTimeout(() => setShowLocationPrompt(true), 600)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (hasLocation) setShowLocationPrompt(false)
  }, [hasLocation])

  const cities = useMemo(() => {
    const set = new Set(hospitals.map(h => h.city).filter(Boolean))
    return Array.from(set).sort()
  }, [hospitals])

  const withDistance = useMemo(() => {
    return hospitals.map(h => ({
      ...h,
      distanceKm: coords ? distanceKm(coords, getHospitalCoords(h)) : null,
    }))
  }, [hospitals, coords])

  const filtered = useMemo(() => {
    let list = withDistance.filter(h => {
      const matchesSearch = !searchQuery ||
        h.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.specialties?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCity = !selectedCity || h.city === selectedCity
      const matchesRadius = !nearbyOnly || !hasLocation || (h.distanceKm != null && h.distanceKm <= radiusKm)
      return matchesSearch && matchesCity && matchesRadius
    })
    if (sortBy === 'distance' && hasLocation) {
      list = [...list].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    } else if (sortBy === 'recommended' && hasLocation) {
      list = [...list].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => String(a.name).localeCompare(String(b.name)))
    }
    return list
  }, [withDistance, searchQuery, selectedCity, nearbyOnly, radiusKm, hasLocation, sortBy])

  const hasFilters = searchQuery || selectedCity || nearbyOnly
  const locating = status === 'prompting'

  function handleEnableLocation() {
    request()
  }

  function handleNearbyToggle() {
    if (!hasLocation) {
      request()
      setNearbyOnly(true)
      return
    }
    setNearbyOnly(v => !v)
  }

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
              {hasLocation && nearbyOnly && ` within ${radiusKm} km of you`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Location access prompt — shown after sign in/up when no location yet */}
      <AnimatePresence>
        {showLocationPrompt && !hasLocation && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 bg-primary-50 border border-primary-100 rounded-2xl"
          >
            <div className="w-11 h-11 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">Find hospitals near you</h3>
              <p className="text-sm text-slate-600 mt-0.5">
                Share your location and we'll sort hospitals by distance so you can see what's closest.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowLocationPrompt(false)}
                className="btn-outline-sm"
              >
                Not now
              </button>
              <button
                onClick={handleEnableLocation}
                disabled={locating}
                className="btn-primary-sm"
              >
                {locating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                {locating ? 'Locating…' : 'Share location'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location error / denied hint */}
      <AnimatePresence>
        {(status === 'denied' || status === 'error' || status === 'unavailable') && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error || 'Location unavailable.'} Enable location in your browser settings and try again, or keep searching by name or city.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3 mb-8"
      >
        <div className="flex flex-col sm:flex-row gap-3">
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

          <div className="flex gap-2 flex-wrap">
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

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              title="Sort hospitals"
              className="input w-auto min-w-[150px] appearance-none cursor-pointer pr-10 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2394a3b8%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat"
            >
              <option value="recommended">Recommended</option>
              <option value="distance" disabled={!hasLocation}>Nearest first</option>
              <option value="name">Name (A–Z)</option>
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
        </div>

        {/* Nearby controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleNearbyToggle}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              nearbyOnly && hasLocation
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            {locating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LocateFixed className="w-4 h-4" />
            )}
            {nearbyOnly && hasLocation ? 'Near me: on' : 'Near me'}
          </button>

          {hasLocation && nearbyOnly && (
            <>
              <select
                value={radiusKm}
                onChange={e => setRadiusKm(Number(e.target.value))}
                title="Search radius"
                className="input w-auto appearance-none cursor-pointer pr-10 py-2 text-sm bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%2394a3b8%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_8px_center] bg-no-repeat"
              >
                {NEARBY_RADII_KM.map(r => (
                  <option key={r} value={r}>Within {r} km</option>
                ))}
              </select>
              <button
                onClick={request}
                title="Refresh my location"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                Refresh
              </button>
              <button
                onClick={() => { clear(); setNearbyOnly(false) }}
                title="Turn off location"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            </>
          )}

          {!hasLocation && !locating && (
            <button
              onClick={request}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-primary-700 hover:text-primary-800 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Use my location instead
            </button>
          )}
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
          <p className="text-slate-500 mb-6">
            {nearbyOnly && hasLocation
              ? `No hospitals within ${radiusKm} km — try a larger radius or clear filters`
              : 'Try adjusting your search or filters'}
          </p>
          {hasFilters && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedCity(''); setNearbyOnly(false) }}
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
            {hasLocation && ' · sorted by distance'}
          </p>
          <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            <AnimatePresence mode="popLayout">
              {filtered.map(h => (
                <HospitalCard key={h.id} hospital={h} viewMode={viewMode} distanceKm={h.distanceKm} />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  )
}
