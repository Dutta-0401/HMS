import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'

// A Link that sends unauthenticated users to sign in/up first,
// preserving the destination so they continue to hospital search
// right after successful authentication.
export default function FindHospitalLink({ to = '/hospitals', className, children, ...rest }) {
  const navigate = useNavigate()

  function handleClick(e) {
    if (isAuthenticated()) return // let the Link navigate normally
    e.preventDefault()
    navigate('/login', { state: { from: to } })
  }

  return (
    <Link to={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  )
}
