import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Calendar, Phone } from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
}

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } }
}

function Hero() {
  return (
    <section className="border-b border-slate-200">
      <div className="container-custom pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-end">
          {/* Left — the statement */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <p className="eyebrow mb-6">
              <span className="w-6 h-px bg-slate-400" />
              Same-week care · 150+ hospitals
            </p>

            <h1 className="font-display text-[2.6rem] sm:text-6xl lg:text-7xl font-medium text-ink leading-[0.98] tracking-tightest">
              See a doctor this week.
              <span className="block text-slate-400">Not next month.</span>
            </h1>

            <p className="mt-7 text-lg text-slate-600 leading-relaxed max-w-md">
              Browse real availability, pick a slot, and confirm in under a minute.
              No phone trees, no waiting rooms — just the appointment you needed.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link to="/hospitals" className="btn-primary">
                Find a doctor
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#how-it-works" className="group inline-flex items-center gap-1.5 text-sm font-medium text-ink">
                How it works
                <ArrowUpRight className="w-4 h-4 text-primary-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>

          {/* Right — a quiet, real appointment card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-soft">
              <div className="flex items-baseline justify-between mb-5">
                <span className="eyebrow">Next available</span>
                <span className="badge-emerald">Open</span>
              </div>

              <div className="flex items-center gap-4 pb-5 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center
                              font-display text-lg text-ink">SC</div>
                <div>
                  <h3 className="font-display text-lg text-ink leading-tight">Dr. Sarah Chen</h3>
                  <p className="text-sm text-slate-500">Cardiology · City General</p>
                </div>
              </div>

              <div className="divide-y divide-slate-200">
                {[
                  { day: 'Today', time: '10:00 AM', open: true },
                  { day: 'Tomorrow', time: '2:30 PM', open: true },
                  { day: 'Jun 16', time: '11:00 AM', open: false },
                ].map((s) => (
                  <div key={s.day} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                      <span className="text-sm text-ink">{s.day}</span>
                      <span className="text-sm text-slate-400">{s.time}</span>
                    </div>
                    <span className={`text-xs ${s.open ? 'text-primary-700' : 'text-slate-400'}`}>
                      {s.open ? 'Book' : 'Full'}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/hospitals" className="btn-primary-sm w-full justify-center mt-5">
                Book appointment
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function StatsStrip() {
  const stats = [
    { value: '150+', label: 'Partner hospitals' },
    { value: '500+', label: 'Verified doctors' },
    { value: '50k', label: 'Appointments booked' },
    { value: '4.9', label: 'Average rating' },
  ]
  return (
    <section className="border-b border-slate-200">
      <motion.div
        variants={stagger}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-40px' }}
        className="container-custom grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200"
      >
        {stats.map((s) => (
          <motion.div key={s.label} variants={fadeUp} className="py-8 px-5 first:pl-0">
            <div className="font-display text-3xl md:text-4xl text-ink tracking-tight">{s.value}</div>
            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

function Features() {
  const features = [
    { title: 'Real-time availability', body: 'Slots update live from each hospital. What you see is genuinely open — no callbacks to confirm.' },
    { title: 'Book in under a minute', body: 'Pick a doctor, choose a time, done. Pay online or at the desk, whichever you prefer.' },
    { title: 'Every specialty', body: 'Cardiology to dermatology across 150+ hospitals, filtered by location and the soonest opening.' },
    { title: 'Private by default', body: 'Your records are encrypted and handled to HIPAA standards. Shared only with your doctor.' },
  ]
  return (
    <section className="section" id="features">
      <div className="container-custom">
        <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="max-w-2xl mb-14">
          <p className="eyebrow mb-4">Why CityHealth</p>
          <h2 className="font-display text-3xl md:text-[2.6rem] font-medium text-ink leading-[1.05] tracking-tight">
            Built around the one thing you actually want: to be seen, soon.
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-40px' }}
          className="grid sm:grid-cols-2 gap-x-12 gap-y-10 border-t border-slate-200"
        >
          {features.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} className="pt-7">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-xl text-primary-700 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display text-xl text-ink mb-1.5">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{f.body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { title: 'Search', body: 'Find hospitals and doctors near you. Filter by specialty, city, and the soonest available slot.' },
    { title: 'Choose a time', body: 'See live openings for the next two weeks and pick whatever fits your schedule.' },
    { title: 'Confirm', body: 'Review the details and confirm. Pay securely online, or settle at the hospital desk.' },
  ]
  return (
    <section className="section bg-paper-deep border-y border-slate-200" id="how-it-works">
      <div className="container-custom">
        <motion.h2
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="font-display text-3xl md:text-[2.6rem] font-medium text-ink tracking-tight mb-14 max-w-xl leading-[1.05]"
        >
          Three steps from symptom to seen.
        </motion.h2>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-40px' }}
          className="grid md:grid-cols-3 gap-px bg-slate-200 border border-slate-200 rounded-xl overflow-hidden"
        >
          {steps.map((step, i) => (
            <motion.div key={step.title} variants={fadeUp} className="bg-paper-deep p-7">
              <span className="font-display text-2xl text-slate-300 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-display text-xl text-ink mt-3 mb-2">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed text-[15px]">{step.body}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="mt-10">
          <Link to="/hospitals" className="btn-primary">
            Start booking
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="section">
      <div className="container-custom">
        <div className="bg-ink rounded-2xl px-8 py-16 md:px-16 md:py-20">
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-5xl font-medium text-paper leading-[1.02] tracking-tight">
              Your next appointment is a minute away.
            </h2>
            <p className="text-slate-400 mt-5 max-w-md leading-relaxed">
              Join 50,000 people who stopped waiting on hold and started booking care online.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link to="/hospitals" className="btn bg-paper text-ink px-5 py-2.5 hover:bg-white">
                Find a doctor
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:108" className="inline-flex items-center gap-2 text-sm font-medium text-paper/80 hover:text-paper transition-colors">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
                Emergency: 108
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div>
      <Hero />
      <StatsStrip />
      <Features />
      <HowItWorks />
      <CTA />
    </div>
  )
}
