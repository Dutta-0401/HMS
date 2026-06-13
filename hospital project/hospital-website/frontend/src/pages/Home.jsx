import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Search, Shield, Clock, Star, Heart,
  Stethoscope, Calendar, Zap, Users, CheckCircle2,
  Building2, Activity, ChevronRight, Phone
} from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } }
}

function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-primary-50/30" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary-100/40 via-primary-50/20 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100/30 via-emerald-50/10 to-transparent rounded-full blur-3xl" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="container-custom relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full 
                        border border-primary-100 mb-6"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-700">Trusted by 50,000+ patients</span>
            </motion.div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight">
              Your health,{' '}
              <span className="gradient-text">simplified.</span>
            </h1>

            <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-lg">
              Book appointments with top doctors instantly. No waiting rooms, 
              no phone calls — just seamless healthcare at your fingertips.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/hospitals" className="btn-primary">
                <Search className="w-4 h-4" />
                Find a Doctor
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="btn-outline">
                How it works
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center gap-6">
              {[
                { icon: Shield, label: 'Secure & Private' },
                { icon: Clock, label: 'Instant Booking' },
                { icon: Star, label: '4.9 Rated' },
              ].map((item, i) => (
                <motion.div 
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-slate-500"
                >
                  <item.icon className="w-4 h-4 text-primary-500" />
                  {item.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Decorative Card */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block relative"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-3xl shadow-soft-2xl border border-slate-200/50 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 
                                rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                    <Stethoscope className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Dr. Sarah Chen</h3>
                    <p className="text-sm text-slate-500">Cardiologist</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {['Today, 10:00 AM', 'Tomorrow, 2:30 PM', 'Jun 16, 11:00 AM'].map((time, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${
                      i === 0 
                        ? 'bg-primary-50 border border-primary-200' 
                        : 'bg-slate-50 border border-slate-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Calendar className={`w-4 h-4 ${i === 0 ? 'text-primary-600' : 'text-slate-400'}`} />
                        <span className={`text-sm font-medium ${i === 0 ? 'text-primary-700' : 'text-slate-600'}`}>{time}</span>
                      </div>
                      {i === 0 && (
                        <span className="badge-emerald">Available</span>
                      )}
                    </div>
                  ))}
                </div>

                <button className="w-full btn-primary justify-center">
                  Book Appointment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-soft-lg border border-slate-100 p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">Confirmed</p>
                    <p className="text-[10px] text-slate-400">Just now</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-soft-lg border border-slate-100 p-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900">150+ Doctors</p>
                    <p className="text-[10px] text-slate-400">Online now</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { value: '150+', label: 'Hospitals', icon: Building2 },
    { value: '500+', label: 'Doctors', icon: Stethoscope },
    { value: '50K+', label: 'Patients', icon: Users },
    { value: '98%', label: 'Satisfaction', icon: Heart },
  ]

  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900" />
      <div className="absolute inset-0 bg-mesh-1 opacity-50" />
      
      <div className="container-custom relative z-10">
        <motion.div 
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => (
            <motion.div 
              key={stat.label}
              variants={fadeUp}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-2xl mb-4">
                <stat.icon className="w-6 h-6 text-white/80" />
              </div>
              <div className="text-3xl md:text-4xl font-display font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find doctors by specialty, location, and availability. Our smart filters get you the perfect match.',
      color: 'from-primary-500 to-primary-600',
      bg: 'bg-primary-50',
    },
    {
      icon: Calendar,
      title: 'Instant Booking',
      description: 'Book appointments in seconds. Real-time slot availability with instant confirmation.',
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Zap,
      title: 'Secure Payments',
      description: 'Pay online or at the hospital. PCI-compliant payment processing with multiple options.',
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
    },
    {
      icon: Shield,
      title: 'Your Privacy',
      description: 'HIPAA-compliant data handling. Your medical information stays private and encrypted.',
      color: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
    },
  ]

  return (
    <section className="section bg-white" id="features">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge-primary mb-4 inline-flex">Why CityHealth</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Everything you need,{' '}
            <span className="gradient-text">one platform</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-lg mx-auto">
            From finding the right doctor to managing your health records — we've got it all covered.
          </p>
        </motion.div>

        <motion.div 
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.title}
              variants={fadeUp}
              className="card-interactive p-6 group"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center 
                            mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Search & Choose',
      description: 'Browse hospitals and doctors. Filter by specialty, location, and availability.',
      icon: Search,
    },
    {
      number: '02',
      title: 'Pick a Time',
      description: 'Select your preferred date and time slot from real-time availability.',
      icon: Clock,
    },
    {
      number: '03',
      title: 'Confirm & Pay',
      description: 'Review details, pay securely online or choose to pay at the hospital.',
      icon: CheckCircle2,
    },
  ]

  return (
    <section className="section bg-slate-50" id="how-it-works">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="badge-primary mb-4 inline-flex">How it Works</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Three steps to better health
          </h2>
        </motion.div>

        <motion.div 
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          {/* Connector line */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-px bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200" />

          {steps.map((step, i) => (
            <motion.div 
              key={step.number}
              variants={fadeUp}
              className="relative text-center"
            >
              <div className="relative inline-flex mb-6">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-soft-lg border border-slate-100 
                              flex items-center justify-center relative z-10">
                  <step.icon className="w-7 h-7 text-primary-600" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary-600 text-white text-xs 
                              font-bold rounded-full flex items-center justify-center shadow-md">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link to="/hospitals" className="btn-primary">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="section">
      <div className="container-custom">
        <div className="relative bg-slate-900 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-mesh-1 opacity-30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                Ready to take control of your health?
              </h2>
              <p className="text-white/60 max-w-md mx-auto mb-8">
                Join thousands of patients who book their appointments with CityHealth every day.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/hospitals" className="btn bg-white text-slate-900 hover:bg-white/90 px-6 py-3">
                  Find a Doctor
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="tel:108" className="btn border border-white/20 text-white hover:bg-white/10 px-6 py-3">
                  <Phone className="w-4 h-4" />
                  Emergency: 108
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <StatsSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
    </div>
  )
}
