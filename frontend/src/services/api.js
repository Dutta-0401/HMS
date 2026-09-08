import axios from 'axios'

// Prefer Vite env vars (import.meta.env). Avoid accessing `process` directly in the browser
// because `process` is not defined in the Vite dev/runtime environment and causes
// a runtime ReferenceError when the file is loaded in the browser.
const API_URL = (
  import.meta.env.VITE_REACT_APP_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  (typeof process !== 'undefined' && process.env ? process.env.REACT_APP_API_URL : undefined) ||
  'http://localhost:8080/api'
)

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Request interceptor: Attach JWT token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
