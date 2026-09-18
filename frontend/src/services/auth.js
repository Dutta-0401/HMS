import api from './api'

export async function register(data) {
  try {
    const response = await api.post('/auth/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role || 'PATIENT',
      hospitalId: data.hospitalId || null,
      captchaToken: data.captchaToken || null,
      website: data.website || ''
    })
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed')
  }
}

export async function login(email, password, extra = {}) {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
      captchaToken: extra.captchaToken || null,
      website: extra.website || ''
    })
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed')
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get('/auth/me')
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user')
  }
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export function getStoredUser() {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

export function getStoredToken() {
  return localStorage.getItem('token')
}

export function isAuthenticated() {
  return !!localStorage.getItem('token')
}

export function decodeToken(token) {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const decoded = JSON.parse(atob(parts[1]))
    return decoded
  } catch (error) {
    return null
  }
}

