import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  MapPin, Search, Calendar, CreditCard, CheckCircle, Shield, Clock, 
  Star, ArrowRight, Heart, Building2, Users, Stethoscope, Activity,
  ChevronRight, Play, Sparkles
} from 'lucide-react'

// Animated counter component
function AnimatedCounter({ end, duration = 2, suffix = '' }) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [end, duration])
  
  return <span>{count.toLocaleString()}{suffix}</span>
}

// Floating elements for hero background
function FloatingElements() {
  const elements = [
    { icon: Heart, x: '10%', y: '20%', delay: 0, size: 'w-8 h-8' },
    { icon: Stethoscope, x: '85%', y: '15%', delay: 0.5, size: 'w-10 h-10' },
    { icon: Activity, x: '75%', y: '70%', delay: 1, size: 'w-6 h-6' },
    { icon: Building2, x: '15%', y: '75%', delay: 1.5, size: 'w-8 h-8' },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((el, i) => {
        const Icon = el.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ delay: el.delay, duration: 0.5 }}
            style={{ left: el.x, top: el.y }}
            className="absolute"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className={`${el.size} text-primary-600`} />
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

// Feature card component
function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300"
    >
      <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-secondary-100 
                    rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-primary-600" />
      </div>
      <h3 className="font-display font-semibold text-lg text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

// Step card for how it works
function StepCard({ number, title, description, icon: Icon, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: number * 0.15, duration: 0.5 }}
      className="relative flex gap-4"
    >
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-6 top-14 w-0.5 h-[calc(100%-2rem)] bg-gradient-to-b from-primary-300 to-secondary-300" />
      )}
      
      {/* Step number */}
      <div className="relative z-10">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 
                    rounded-xl flex items-center justify-center text-white font-bold shadow-soft"
        >
          {number}
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="w-5 h-5 text-primary-500" />
          <h3 className="font-display font-semibold text-lg text-slate-800">{title}</h3>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

// Stats section
function StatsSection() {
  const stats = [
    { value: 150, suffix: '+', label: 'Partner Hospitals', icon: Building2 },
    { value: 500, suffix: '+', label: 'Expert Doctors', icon: Users },
    { value: 50000, suffix: '+', label: 'Happy Patients', icon: Heart },
    { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: Star },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center text-white"
              >
                <Icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  const features = [
    {
      icon: MapPin,
      title: 'Find Nearby Hospitals',
      description: 'Discover hospitals and clinics near your location with real-time availability updates.'
    },
    {
      icon: Stethoscope,
      title: 'Expert Doctors',
      description: 'Browse through our network of verified specialists across all medical departments.'
    },
    {
      icon: Calendar,
      title: 'Easy Scheduling',
      description: 'Book appointments instantly with our smart scheduling system. No phone calls needed.'
    },
    {
      icon: CreditCard,
      title: 'Secure Payments',
      description: 'Pay online securely or choose to pay at the hospital. Multiple payment options available.'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'No more waiting in queues. Get instant confirmations and digital receipts.'
    },
    {
      icon: Shield,
      title: 'Trusted & Secure',
      description: 'Your health data is protected with enterprise-grade security and encryption.'
    }
  ]

  const steps = [
    {
      title: 'Share Your Location',
      description: 'Allow location access to discover the best hospitals and clinics nearby.',
      icon: MapPin
    },
    {
      title: 'Choose Hospital & Doctor',
      description: 'Browse through hospitals, check ratings, and select your preferred specialist.',
      icon: Building2
    },
    {
      title: 'Select Date & Time',
      description: 'Pick a convenient slot from the real-time availability calendar.',
      icon: Calendar
    },
    {
      title: 'Confirm & Pay',
      description: 'Complete your booking with secure online payment or pay at the hospital.',
      icon: CheckCircle
    }
  ]

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        
        {/* Floating elements */}
        <FloatingElements />
        
        {/* Decorative circles */}
        <div className="absolute -right-40 -top-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -left-40 -bottom-40 w-96 h-96 bg-secondary-100 rounded-full blur-3xl opacity-50" />

        <div className="container-custom relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full 
                          shadow-soft mb-6 border border-primary-100"
              >
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-primary-600">
                  Trusted by 50,000+ patients
                </span>
              </motion.div>

              {/* Headline */}
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Book Hospital
                <br />
                <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                  Appointments
                </span>
                <br />
                Near You — <span className="text-primary-600">Instantly</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                Skip the waiting room. Find trusted hospitals, choose expert doctors, 
                and book your appointment in minutes with secure online payments.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.button
                  onClick={() => navigate('/hospitals')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 
                            text-white rounded-2xl font-semibold shadow-soft hover:shadow-glow 
                            transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Find Hospitals Near Me
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  {/* Animated ring */}
                  <motion.span
                    className="absolute inset-0 rounded-2xl border-2 border-primary-400"
                    animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-8 py-4 border-2 border-primary-200 text-primary-600 
                            rounded-2xl font-semibold hover:bg-primary-50 transition-all 
                            duration-300 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Watch How It Works
                </motion.button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Verified Doctors</span>
                </div>
              </div>
            </motion.div>

            {/* Right content - Illustration/Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              {/* Main card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="bg-white rounded-3xl shadow-soft-xl p-8 relative z-10">
                  {/* Mock hospital card */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 
                                  rounded-2xl flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">City General Hospital</h3>
                      <p className="text-sm text-slate-500">2.5 km away • Open 24/7</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} className="w-4 h-4 text-yellow-400" fill="#FACC15" />
                        ))}
                        <span className="text-sm text-slate-600 ml-1">(4.8)</span>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {['Cardiology', 'Neurology', 'Pediatrics'].map(s => (
                      <span key={s} className="px-3 py-1 bg-primary-50 text-primary-600 
                                              rounded-full text-sm font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Mock doctor */}
                  <div className="flex items-center justify-between p-4 bg-surface-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-secondary-400 to-secondary-500 
                                    rounded-xl flex items-center justify-center text-white font-bold">
                        DR
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">Dr. Priya Sharma</p>
                        <p className="text-sm text-slate-500">Cardiologist • 15 yrs exp</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary-600">₹500</p>
                      <p className="text-xs text-green-600">Available Today</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <button className="w-full mt-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 
                                    text-white rounded-xl font-semibold shadow-soft">
                    Book Appointment
                  </button>
                </div>
              </motion.div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute -left-8 top-1/4 bg-white rounded-2xl shadow-soft-lg p-4 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Booking Confirmed!</p>
                    <p className="text-xs text-slate-500">Dr. Sharma • 10:30 AM</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating rating */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                className="absolute -right-4 bottom-1/4 bg-white rounded-2xl shadow-soft-lg p-4 z-20"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400" fill="#FACC15" />
                  <span className="font-bold text-slate-800">4.9</span>
                  <span className="text-sm text-slate-500">Excellent</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-primary-50 text-primary-600 
                          rounded-full text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Healthcare Made <span className="gradient-text">Simple & Accessible</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We're reimagining how you access healthcare. From finding the right doctor 
              to booking and payment — everything in one seamless experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-surface-100">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-secondary-50 text-secondary-600 
                            rounded-full text-sm font-medium mb-4">
                How It Works
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Book Your Appointment in
                <br />
                <span className="gradient-text">4 Simple Steps</span>
              </h2>
              <p className="text-slate-600 mb-8">
                Our streamlined process ensures you get the care you need without the hassle. 
                Everything is designed to save your time.
              </p>

              <div className="space-y-2">
                {steps.map((step, i) => (
                  <StepCard 
                    key={i} 
                    number={i + 1} 
                    {...step} 
                    isLast={i === steps.length - 1}
                  />
                ))}
              </div>
            </motion.div>

            {/* Right illustration */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Phone mockup */}
                <div className="bg-slate-800 rounded-[3rem] p-4 shadow-soft-xl max-w-sm mx-auto">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden">
                    {/* Status bar */}
                    <div className="bg-slate-100 px-6 py-3 flex items-center justify-between">
                      <span className="text-xs font-medium">9:41</span>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-2 bg-slate-400 rounded-sm" />
                      </div>
                    </div>
                    
                    {/* App content */}
                    <div className="p-6">
                      <h3 className="font-semibold text-slate-800 mb-4">Select Time Slot</h3>
                      
                      {/* Date selector */}
                      <div className="flex gap-2 mb-4">
                        {['Mon', 'Tue', 'Wed', 'Thu'].map((day, i) => (
                          <div key={day} className={`flex-1 py-2 rounded-lg text-center text-sm 
                            ${i === 1 ? 'bg-primary-500 text-white' : 'bg-surface-100 text-slate-600'}`}>
                            <div className="font-medium">{day}</div>
                            <div className="text-xs">{15 + i}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Time slots */}
                      <div className="grid grid-cols-3 gap-2">
                        {['9:00', '10:30', '11:00', '2:00', '3:30', '4:00'].map((time, i) => (
                          <div key={time} className={`py-2 rounded-lg text-center text-sm 
                            ${i === 1 ? 'bg-secondary-500 text-white' : 'bg-surface-100 text-slate-600'}`}>
                            {time}
                          </div>
                        ))}
                      </div>

                      {/* Confirm button */}
                      <button className="w-full mt-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 
                                        text-white rounded-xl font-medium text-sm">
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -z-10 -right-10 -top-10 w-40 h-40 border-2 border-dashed 
                            border-primary-200 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Book Your Appointment?
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Join thousands of patients who trust CityHealth for their healthcare needs. 
              Start your journey to better health today.
            </p>
            
            <motion.button
              onClick={() => navigate('/hospitals')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-primary-600 rounded-2xl font-semibold 
                        shadow-soft-xl hover:shadow-2xl transition-all duration-300
                        flex items-center gap-2 mx-auto"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 
                              rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <div>
                  <div className="font-display font-bold text-xl">CityHealth</div>
                  <div className="text-sm text-slate-400">Healthcare Made Simple</div>
                </div>
              </div>
              <p className="text-slate-400 max-w-md">
                Your trusted partner for finding and booking hospital appointments. 
                We connect patients with the best healthcare providers in their area.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to="/hospitals" className="hover:text-white transition-colors">Find Hospitals</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Emergency</h4>
              <div className="text-2xl font-bold text-red-400 mb-2">108</div>
              <p className="text-slate-400 text-sm">24/7 Emergency Helpline</p>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2026 CityHealth. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
