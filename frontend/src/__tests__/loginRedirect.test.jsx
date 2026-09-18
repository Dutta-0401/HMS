import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../services/auth', () => ({
  login: vi.fn(),
  register: vi.fn(),
}))

import { login } from '../services/auth'
import Login from '../pages/Login'

function ShowPath() {
  const location = useLocation()
  return <div data-testid="path">{location.pathname}</div>
}

beforeEach(() => {
  localStorage.clear()
  vi.mocked(login).mockImplementation(async (email) => {
    localStorage.setItem('token', 'test-token')
    localStorage.setItem('user', JSON.stringify({ name: 'Test', email }))
    return { token: 'test-token' }
  })
})

describe('Login (redirect back to hospital search)', () => {
  function renderLogin(from = '/hospitals') {
    return render(
      <MemoryRouter initialEntries={[{ pathname: '/login', state: { from } }]}>
        <Routes>
          <Route path="/login" element={<div><ShowPath /><Login /></div>} />
          <Route path="/hospitals" element={<div><ShowPath /><div>Hospitals page</div></div>} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('shows the nearby-search hint when gated from hospital search', () => {
    renderLogin()
    expect(screen.getByText(/find hospitals near you/i)).toBeInTheDocument()
  })

  it('returns to the saved destination after successful sign in', async () => {
    renderLogin('/hospitals')
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('Enter your password'), {
      target: { value: 'password123' },
    })
    // The "Sign in" tab and the submit button share a name — target the form's submit.
    const submit = document.querySelector('form button[type="submit"]')
    fireEvent.click(submit)

    await waitFor(() => {
      expect(screen.getByText('Hospitals page')).toBeInTheDocument()
    })
    expect(screen.getByTestId('path').textContent).toBe('/hospitals')
    expect(localStorage.getItem('token')).toBe('test-token')
  })
})
