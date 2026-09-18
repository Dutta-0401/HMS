import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import RequireAuth from '../components/RequireAuth'
import FindHospitalLink from '../components/FindHospitalLink'

function ShowPath() {
  const location = useLocation()
  return <div data-testid="path">{location.pathname}</div>
}

function ShowState() {
  const location = useLocation()
  return <div data-testid="from">{location.state?.from || 'none'}</div>
}

beforeEach(() => {
  localStorage.clear()
})

describe('RequireAuth (hospital search gate)', () => {
  function renderGate() {
    return render(
      <MemoryRouter initialEntries={['/hospitals']}>
        <Routes>
          <Route path="/hospitals" element={<RequireAuth><div>Hospital search</div></RequireAuth>} />
          <Route path="/login" element={<div>Sign in page</div>} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('redirects unauthenticated visitors to /login', () => {
    renderGate()
    expect(screen.getByText('Sign in page')).toBeInTheDocument()
    expect(screen.queryByText('Hospital search')).not.toBeInTheDocument()
  })

  it('renders the protected page when authenticated', () => {
    localStorage.setItem('token', 'test-token')
    renderGate()
    expect(screen.getByText('Hospital search')).toBeInTheDocument()
  })
})

describe('FindHospitalLink (gated entry button)', () => {
  function renderLink() {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<FindHospitalLink to="/hospitals">Find a hospital</FindHospitalLink>} />
          <Route path="/hospitals" element={<div><ShowPath /><div>Hospitals page</div></div>} />
          <Route path="/login" element={<div><ShowPath /><ShowState /><div>Sign in page</div></div>} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('sends unauthenticated users to /login with the destination preserved', () => {
    renderLink()
    fireEvent.click(screen.getByText('Find a hospital'))
    expect(screen.getByText('Sign in page')).toBeInTheDocument()
    expect(screen.getByTestId('path').textContent).toBe('/login')
    expect(screen.getByTestId('from').textContent).toBe('/hospitals')
  })

  it('navigates straight through when authenticated', () => {
    localStorage.setItem('token', 'test-token')
    renderLink()
    fireEvent.click(screen.getByText('Find a hospital'))
    expect(screen.getByText('Hospitals page')).toBeInTheDocument()
    expect(screen.getByTestId('path').textContent).toBe('/hospitals')
  })
})
