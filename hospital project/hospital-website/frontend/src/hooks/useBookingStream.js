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
    const sseUrl = `${API_URL}/sse/bookings/${hospitalId}`

    console.log('Connecting to SSE stream:', sseUrl)

    const eventSource = new EventSource(sseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    eventSource.addEventListener('connected', (event) => {
      console.log('Connected to booking stream:', event.data)
    })

    eventSource.addEventListener('new-booking', (event) => {
      console.log('Received new booking:', event.data)
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
      console.log('Received booking update:', event.data)
      try {
        const booking = JSON.parse(event.data)
        if (onBookingUpdated) {
          onBookingUpdated(booking)
        }
      } catch (error) {
        console.error('Error parsing booking update:', error)
      }
    })

    eventSource.onerror = (error) => {
      console.warn('SSE connection error:', error)
      if (eventSource.readyState === EventSource.CLOSED) {
        console.log('SSE connection closed, will reconnect...')
      }
    }

    // Cleanup on unmount
    return () => {
      console.log('Closing SSE connection')
      eventSource.close()
    }
  }, [hospitalId, onNewBooking, onBookingUpdated])
}
