import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, User, LogOut, Calendar, Building2, Home,
  Phone, ChevronDown
} from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsProfileOpen(false)
  }, [location])

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
    setIsProfileOpen(false)
  }

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/hospitals', label: 'Hospitals', icon: Building2 },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isScrolled
            ? 'bg-paper/90 backdrop-blur border-b border-slate-200'
            : 'bg-paper border-b border-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Wordmark */}
            <Link to="/" className="flex items-center group">
              <span className="font-display text-2xl md:text-[1.6rem] font-medium tracking-tight text-ink leading-none">
                cityhealth<span className="text-primary-600 text-base align-top ml-px">+</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                const active = isActive(link.path)
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors
                              flex items-center gap-2 ${
                      active
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Emergency */}
              <motion.a
                href="tel:108"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden lg:flex items-center gap-2 px-3.5 py-2 text-red-600 bg-red-50 
                          rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Emergency
              </motion.a>

              {/* Auth */}
              {token ? (
                <div className="relative" ref={dropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl
                              bg-white border border-slate-200 hover:border-slate-300
                              transition-colors duration-200"
                  >
                    <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate">
                      {user?.name || 'Profile'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`} />
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-soft-xl 
                                  border border-slate-200/60 py-2 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="font-semibold text-sm text-slate-900 truncate">{user?.name}</p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email || user?.phone}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 
                                   transition-colors text-slate-600"
                        >
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm">My Appointments</span>
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 
                                   transition-colors text-red-600 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Sign out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className="btn-primary-sm">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign in</span>
                </Link>
              )}

              {/* Mobile Toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-slate-700" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden bg-paper/95 backdrop-blur-xl border-t border-slate-200 overflow-hidden"
            >
              <div className="container-custom py-3 space-y-1">
                {navLinks.map((link, i) => {
                  const Icon = link.icon
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive(link.path)
                            ? 'bg-primary-50 text-primary-700 font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  )
                })}
                <div className="divider my-2" />
                <motion.a
                  href="tel:108"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Emergency: 108</span>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer */}
      <div className="h-16 md:h-20" />

      {/* Overlay */}
      {(isProfileOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => { setIsProfileOpen(false); setIsMobileMenuOpen(false) }}
        />
      )}
    </>
  )
}
