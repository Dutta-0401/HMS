import { describe, it, expect } from 'vitest'
import {
  distanceKm,
  formatDistance,
  getHospitalCoords,
  NEARBY_RADII_KM,
} from '../utils/geo'

const MUMBAI = { lat: 19.076, lng: 72.8777 }
const PUNE = { lat: 18.5204, lng: 73.8567 }

describe('geo utils (nearby hospital search)', () => {
  it('computes a realistic Mumbai–Pune distance (~120 km)', () => {
    const km = distanceKm(MUMBAI, PUNE)
    expect(km).toBeGreaterThan(100)
    expect(km).toBeLessThan(140)
  })

  it('returns 0 for identical points and null when a point is missing', () => {
    expect(distanceKm(MUMBAI, MUMBAI)).toBeCloseTo(0, 6)
    expect(distanceKm(null, MUMBAI)).toBeNull()
    expect(distanceKm(MUMBAI, undefined)).toBeNull()
  })

  it('formats distances for display', () => {
    expect(formatDistance(0.4)).toBe('400 m')
    expect(formatDistance(2.34)).toBe('2.3 km')
    expect(formatDistance(250)).toBe('250 km')
    expect(formatDistance(null)).toBeNull()
  })

  it('passes through explicit hospital coordinates when present', () => {
    const coords = getHospitalCoords({ latitude: 12.9, longitude: 77.6 })
    expect(coords).toEqual({ lat: 12.9, lng: 77.6 })
  })

  it('maps a known city to its centre with a stable per-hospital offset', () => {
    const a = getHospitalCoords({ id: 'h1', city: 'Mumbai' })
    const b = getHospitalCoords({ id: 'h1', city: 'Mumbai' })
    const c = getHospitalCoords({ id: 'h2', city: 'Mumbai' })
    expect(a).toEqual(b) // deterministic
    expect(a).not.toEqual(c) // distinct hospitals don't collapse
    expect(Math.abs(a.lat - MUMBAI.lat)).toBeLessThan(0.1)
    expect(Math.abs(a.lng - MUMBAI.lng)).toBeLessThan(0.1)
  })

  it('falls back gracefully for unknown cities', () => {
    const coords = getHospitalCoords({ id: 'x', city: 'Atlantis' })
    expect(typeof coords.lat).toBe('number')
    expect(typeof coords.lng).toBe('number')
  })

  it('exposes a sane radius list', () => {
    expect(NEARBY_RADII_KM).toContain(25)
    expect([...NEARBY_RADII_KM].sort((x, y) => x - y)).toEqual(NEARBY_RADII_KM)
  })
})
