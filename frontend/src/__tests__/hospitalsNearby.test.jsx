import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/booking', () => ({
  getHospitals: vi.fn(),
}))

import { getHospitals } from '../services/booking'
import Hospitals from '../pages/Hospitals'

// User is "in Mumbai"; one hospital is next door, one is in Delhi (~1150 km).
const MOCK_HOSPITALS = [
  {
    id: 'near-1',
    name: 'Nearby Care Hospital',
    city: 'Mumbai',
    latitude: 19.076,
    longitude: 72.8777,
    specialties: ['Cardiology'],
  },
  {
    id: 'far-1',
    name: 'Far Away Hospital',
    city: 'Delhi',
    latitude: 28.6139,
    longitude: 77.209,
    specialties: ['Neurology'],
  },
]

beforeEach(() => {
  localStorage.clear()
  vi.mocked(getHospitals).mockResolvedValue(MOCK_HOSPITALS)
  // Pretend the user already granted location (stored by the hook).
  localStorage.setItem('cityhealth:user-location', JSON.stringify({ lat: 19.076, lng: 72.8777 }))
})

describe('Hospitals page (nearby search wiring)', () => {
  it('shows real distances once location is known', async () => {
    render(
      <MemoryRouter>
        <Hospitals />
      </MemoryRouter>
    )
    expect(await screen.findByText('Nearby Care Hospital')).toBeInTheDocument()
    expect(screen.getByText('Far Away Hospital')).toBeInTheDocument()
    // Nearby hospital is ~0 m away; Delhi is ~1100+ km away.
    // (Distance shares its element with the rating, so match substrings.)
    expect(screen.getByText(/0 m/)).toBeInTheDocument()
    expect(screen.getByText(/\d{3,} km/)).toBeInTheDocument()
    expect(screen.getByText(/sorted by distance/)).toBeInTheDocument()
  })

  it('filters to hospitals within the radius when "Near me" is on', async () => {
    render(
      <MemoryRouter>
        <Hospitals />
      </MemoryRouter>
    )
    expect(await screen.findByText('Far Away Hospital')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /near me/i }))

    await waitFor(() => {
      expect(screen.queryByText('Far Away Hospital')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Nearby Care Hospital')).toBeInTheDocument()
    expect(screen.getByText(/1 hospital found/)).toBeInTheDocument()
  })

  it('asks for location access when none is saved yet', async () => {
    localStorage.removeItem('cityhealth:user-location')
    render(
      <MemoryRouter>
        <Hospitals />
      </MemoryRouter>
    )
    expect(await screen.findByText('Nearby Care Hospital')).toBeInTheDocument()
    // The prompt appears shortly after mount.
    expect(await screen.findByText('Find hospitals near you')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /share location/i })).toBeInTheDocument()
  })
})
