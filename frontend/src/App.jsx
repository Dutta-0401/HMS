import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import Login from './pages/Login'
import Hospitals from './pages/Hospitals'
import HospitalDetail from './pages/HospitalDetail'
import DoctorDetail from './pages/DoctorDetail'
import Profile from './pages/Profile'
import BookingResult from './pages/BookingResult'
import BookingSuccess from './pages/BookingSuccess'
import BookingFailure from './pages/BookingFailure'
import Header from './components/Header'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import RequireAuth from './components/RequireAuth'

function requireAuth() {
  return localStorage.getItem('token')
}

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  const showFooter = ['/', '/hospitals', '/profile'].includes(location.pathname) || 
                     location.pathname.startsWith('/hospitals/')

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <PageTransition><Home /></PageTransition>
            } />
            <Route path="/login" element={
              <PageTransition>
                <div className="container-custom py-8">
                  <Login />
                </div>
              </PageTransition>
            } />
            <Route path="/hospitals" element={
              <PageTransition>
                <div className="container-custom py-8">
                  <RequireAuth><Hospitals /></RequireAuth>
                </div>
              </PageTransition>
            } />
            <Route path="/hospitals/:id" element={
              <PageTransition>
                <div className="container-custom py-8">
                  <RequireAuth><HospitalDetail /></RequireAuth>
                </div>
              </PageTransition>
            } />
            <Route path="/doctors/:id" element={
              <PageTransition>
                <div className="container-custom py-8">
                  <DoctorDetail />
                </div>
              </PageTransition>
            } />
            <Route
              path="/profile"
              element={requireAuth() ? (
                <PageTransition>
                  <div className="container-custom py-8">
                    <Profile />
                  </div>
                </PageTransition>
              ) : <Navigate to="/login" />}
            />
            <Route path="/book/:id" element={
              <PageTransition>
                <div className="container-custom py-8">
                  <BookingResult />
                </div>
              </PageTransition>
            } />
            <Route path="/book-success" element={
              <PageTransition>
                <div className="container-custom py-8">
                  <BookingSuccess />
                </div>
              </PageTransition>
            } />
            <Route path="/book-failed" element={
              <PageTransition>
                <div className="container-custom py-8">
                  <BookingFailure />
                </div>
              </PageTransition>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
      <Chatbot />
    </div>
  )
}
