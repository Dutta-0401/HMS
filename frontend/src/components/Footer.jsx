import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import FindHospitalLink from './FindHospitalLink'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="font-display text-2xl font-medium tracking-tight text-paper">
                cityhealth<span className="text-primary-400 text-base align-top ml-px">+</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Making healthcare accessible, one appointment at a time.
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <a href="tel:18001234567" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" /> 1800-123-4567
              </a>
              <a href="mailto:support@cityhealth.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" /> support@cityhealth.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Healthcare District, India
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Press</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Services</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><FindHospitalLink to="/hospitals" className="hover:text-white transition-colors">Find Hospitals</FindHospitalLink></li>
              <li><FindHospitalLink to="/hospitals" className="hover:text-white transition-colors">Book Appointments</FindHospitalLink></li>
              <li><Link to="/" className="hover:text-white transition-colors">Health Records</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Insurance</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-300 mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><a href="tel:108" className="hover:text-white transition-colors">Emergency: 108</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CityHealth. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg 
                                            flex items-center justify-center transition-colors">
                <Icon className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
