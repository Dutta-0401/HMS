import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'

// Guards routes that require sign-in (e.g. hospital search).
// Unauthenticated visitors are sent to /login with the original
// destination preserved, so they land back after sign in/up.
export default function RequireAuth({ children }) {
  const location = useLocation()
  if (!isAuthenticated()) {
    const from = location.pathname + location.search
    return <Navigate to="/login" state={{ from }} replace />
  }
  return children
}
