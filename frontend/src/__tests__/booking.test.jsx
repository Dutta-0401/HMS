import { describe, it, expect, vi } from 'vitest'

// Mock the api module used by booking.js to force the error/fallback path
vi.mock('../services/api', () => ({
  default: {
    get: () => { throw new Error('network') },
    post: () => { throw new Error('network') }
  }
}))

import { getHospitals, getDoctor, getSlots, createAppointment } from '../services/booking'

// The booking service must degrade safely when the backend is unreachable:
// read operations resolve to empty/null (never fake data — this is a medical
// booking app), and write operations surface the failure to the caller.
describe('booking service (safe degradation on API failure)', () => {
  it('getHospitals resolves to an empty array', async () => {
    const list = await getHospitals()
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBe(0)
  })

  it('getDoctor resolves to null', async () => {
    const d = await getDoctor('d1')
    expect(d).toBeNull()
  })

  it('getSlots resolves to an empty array', async () => {
    const slots = await getSlots('d1', '2025-11-10')
    expect(Array.isArray(slots)).toBe(true)
    expect(slots.length).toBe(0)
  })

  it('createAppointment rejects instead of inventing a booking', async () => {
    await expect(
      createAppointment({ doctor: 'd1', slotTime: '10:00', slotDate: '2025-11-10' })
    ).rejects.toThrow()
  })
})
