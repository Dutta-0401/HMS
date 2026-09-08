import { useEffect } from 'react'
import { getStoredToken } from '../services/auth'

export function useBookingStream(hospitalId, onNewBooking, onBookingUpdated) {
  useEffect(() => {
    if (!hospitalId) return

    const token = getStoredToken()
    if (!token) {
      console.warn('No token available for SSE connection')
      return
    }

    const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8080/api'
    // Browser EventSource does not support custom headers — the Authorization
    // option below would be silently ignored. Pass the token as a query param
    // so the backend can authenticate the SSE connection.
    const sseUrl = `${API_URL}/sse/bookings/${hospitalId}?token=${encodeURIComponent(token)}`

    const eventSource = new EventSource(sseUrl)

    eventSource.addEventListener('connected', () => {})

    eventSource.addEventListener('new-booking', (event) => {
      try {
        const booking = JSON.parse(event.data)
        if (onNewBooking) {
          onNewBooking(booking)
        }
      } catch (error) {
        console.error('Error parsing booking data:', error)
      }
    })

    eventSource.addEventListener('booking-updated', (event) => {
      try {
        const booking = JSON.parse(event.data)
        if (onBookingUpdated) {
          onBookingUpdated(booking)
        }
      } catch (error) {
        console.error('Error parsing booking update:', error)
      }
    })

    eventSource.onerror = () => {}

    return () => {
      eventSource.close()
    }
  }, [hospitalId, onNewBooking, onBookingUpdated])
}
