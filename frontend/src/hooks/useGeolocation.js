import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'cityhealth:user-location'
const PROMPTED_KEY = 'cityhealth:location-prompted'

function readStoredLocation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (typeof parsed?.lat === 'number' && typeof parsed?.lng === 'number') return parsed
    return null
  } catch {
    return null
  }
}

/**
 * Wraps the browser Geolocation API.
 * - `status`: 'idle' | 'prompting' | 'granted' | 'denied' | 'unavailable' | 'error'
 * - Persists the last known coords in localStorage so "nearby" still works
 *   across visits without re-prompting.
 */
export default function useGeolocation({ autoRequest = false } = {}) {
  const [coords, setCoords] = useState(() => readStoredLocation())
  const [status, setStatus] = useState(() => (readStoredLocation() ? 'granted' : 'idle'))
  const [error, setError] = useState(null)

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setStatus('unavailable')
      setError('Geolocation is not supported by this browser.')
      return
    }
    setStatus('prompting')
    setError(null)
    try {
      localStorage.setItem(PROMPTED_KEY, '1')
    } catch { /* ignore */ }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCoords(next)
        setStatus('granted')
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch { /* ignore */ }
      },
      (err) => {
        if (err?.code === err?.PERMISSION_DENIED || err?.code === 1) {
          setStatus('denied')
          setError('Location permission was denied. You can still search by name or city.')
        } else {
          setStatus('error')
          setError('Could not determine your location. You can still search by name or city.')
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 }
    )
  }, [])

  const clear = useCallback(() => {
    setCoords(null)
    setStatus('idle')
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    if (autoRequest && !readStoredLocation()) request()
  }, [autoRequest, request])

  return { coords, status, error, request, clear, hasLocation: !!coords }
}

export function wasLocationPrompted() {
  try {
    return localStorage.getItem(PROMPTED_KEY) === '1'
  } catch {
    return false
  }
}
