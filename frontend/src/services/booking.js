import api from './api'

// ─── Hospitals ────────────────────────────────────────────

export async function getHospitals(params = {}) {
  try {
    const response = await api.get('/hospitals', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching hospitals:', error)
    return []
  }
}

export async function getHospital(id) {
  try {
    const response = await api.get(`/hospitals/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching hospital:', error)
    return null
  }
}

export async function getDoctorsInHospital(hospitalId) {
  try {
    const response = await api.get(`/hospitals/${hospitalId}/doctors`)
    return response.data
  } catch (error) {
    console.error('Error fetching doctors in hospital:', error)
    return []
  }
}

// ─── Doctors ──────────────────────────────────────────────

export async function getDoctor(doctorId) {
  try {
    const response = await api.get(`/doctors/${doctorId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching doctor:', error)
    return null
  }
}

export async function getSlots(doctorId, date) {
  try {
    const response = await api.get(`/doctors/${doctorId}/slots`, {
      params: { date }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching slots:', error)
    return []
  }
}

// ─── Appointments ─────────────────────────────────────────

export async function createAppointment(appointmentData) {
  try {
    const response = await api.post('/appointments', {
      doctorId: appointmentData.doctorId,
      slotId: appointmentData.slotId,
      paymentMethod: appointmentData.paymentMethod,
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.details ? Object.values(error.response.data.details).join(', ') : error.response?.data?.message || 'Failed to create appointment')
  }
}

export async function getUserAppointments() {
  try {
    const response = await api.get('/appointments/my-appointments')
    return response.data
  } catch (error) {
    console.error('Error fetching user appointments:', error)
    return []
  }
}

export async function getBooking(bookingId) {
  try {
    const response = await api.get(`/bookings/${bookingId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching booking:', error)
    return null
  }
}

export async function cancelAppointment(appointmentId) {
  try {
    const response = await api.patch(`/appointments/${appointmentId}/cancel`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel appointment')
  }
}

export async function getHospitalBookings(hospitalId) {
  try {
    const response = await api.get(`/bookings/hospital/${hospitalId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching hospital bookings:', error)
    return []
  }
}

export async function updateBookingStatus(bookingId, status) {
  try {
    const response = await api.patch(`/bookings/${bookingId}/status`, null, {
      params: { status }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update booking status')
  }
}