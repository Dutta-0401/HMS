// Geographic helpers for "hospitals near me".
// The backend does not store lat/lng yet, so hospitals are mapped to an
// approximate coordinate: their own lat/lng when present, otherwise the
// centre of their city plus a small deterministic offset (so hospitals in
// the same city don't collapse to identical distances).

export const CITY_COORDS = {
  mumbai: { lat: 19.076, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  delhi: { lat: 28.6139, lng: 77.209 },
  'new delhi': { lat: 28.6139, lng: 77.209 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  nashik: { lat: 19.9975, lng: 73.7898 },
  thane: { lat: 19.2183, lng: 72.9781 },
  surat: { lat: 21.1702, lng: 72.8311 },
  indore: { lat: 22.7196, lng: 75.8577 },
  bhopal: { lat: 23.2599, lng: 77.4126 },
  patna: { lat: 25.5941, lng: 85.1376 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  vadodara: { lat: 22.3072, lng: 73.1812 },
}

const DEFAULT_COORDS = { lat: 19.076, lng: 72.8777 } // Mumbai fallback

// Small deterministic jitter (in degrees) derived from the hospital id so
// hospitals sharing a city get distinct but stable coordinates.
function jitterFor(id = '') {
  let hash = 0
  for (let i = 0; i < String(id).length; i++) {
    hash = (hash * 31 + String(id).charCodeAt(i)) >>> 0
  }
  const latJitter = ((hash % 100) / 100 - 0.5) * 0.12 // ±0.06° ≈ ±6.5km
  const lngJitter = (((hash >> 7) % 100) / 100 - 0.5) * 0.12
  return { latJitter, lngJitter }
}

export function getHospitalCoords(hospital = {}) {
  if (
    (hospital.latitude != null || hospital.lat != null) &&
    (hospital.longitude != null || hospital.lng != null)
  ) {
    return {
      lat: Number(hospital.latitude ?? hospital.lat),
      lng: Number(hospital.longitude ?? hospital.lng),
    }
  }
  const key = String(hospital.city || '').trim().toLowerCase()
  const base = CITY_COORDS[key] || DEFAULT_COORDS
  const { latJitter, lngJitter } = jitterFor(hospital.id || hospital.name)
  return { lat: base.lat + latJitter, lng: base.lng + lngJitter }
}

// Haversine distance in kilometres.
export function distanceKm(a, b) {
  if (!a || !b) return null
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return 2 * R * Math.asin(Math.sqrt(h))
}

export function formatDistance(km) {
  if (km == null || Number.isNaN(km)) return null
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 100) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

export const NEARBY_RADII_KM = [5, 10, 25, 50, 100]
