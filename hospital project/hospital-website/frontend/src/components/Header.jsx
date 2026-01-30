import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, User, LogOut, Calendar, Building2, Home, 
  Heart, Phone, ChevronDown 
} from 'lucide-react'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
    setIsProfileOpen(false)
  }

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/hospitals', label: 'Find Hospitals', icon: Building2 },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-soft' 
            : 'bg-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-secondary-500 
                              rounded-xl flex items-center justify-center shadow-soft">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" fill="white" />
                </div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-lg md:text-xl bg-gradient-to-r from-primary-600 to-secondary-600 
                              bg-clip-text text-transparent">
                  CityHealth
                </div>
                <div className="text-[10px] md:text-xs text-slate-500 -mt-0.5">
                  Healthcare Made Simple
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200
                              flex items-center gap-2 ${
                      isActive(link.path)
                        ? 'text-primary-600'
                        : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                    {isActive(link.path) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Emergency Button */}
              <motion.a
                href="tel:108"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden lg:flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 
                          rounded-xl font-medium text-sm hover:bg-red-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Emergency
              </motion.a>

              {/* Auth Section */}
              {token ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-100 
                              hover:bg-surface-200 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 
                                  rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block font-medium text-sm text-slate-700">
                      {user?.name || 'Profile'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${
                      isProfileOpen ? 'rotate-180' : ''
                    }`} />
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg 
                                  border border-surface-200 py-2 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-surface-200">
                          <p className="font-semibold text-slate-800">{user?.name}</p>
                          <p className="text-xs text-slate-500">{user?.phone}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-surface-100 
                                   transition-colors text-slate-700"
                        >
                          <Calendar className="w-4 h-4 text-primary-500" />
                          <span className="text-sm">My Appointments</span>
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 
                                   transition-colors text-red-600 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 
                              text-white rounded-xl font-medium text-sm shadow-soft hover:shadow-glow 
                              transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </motion.div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-surface-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-slate-700" />
                ) : (
                  <Menu className="w-6 h-6 text-slate-700" />
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
              className="md:hidden bg-white border-t border-surface-200"
            >
              <div className="container-custom py-4 space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive(link.path)
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-slate-600 hover:bg-surface-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  )
                })}
                <a
                  href="tel:108"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-red-600"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-medium">Emergency: 108</span>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />

      {/* Overlay for dropdowns */}
      {(isProfileOpen || isMobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsProfileOpen(false)
            setIsMobileMenuOpen(false)
          }}
        />
      )}
    </>
  )
}
