import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Heart, Phone, Mail, MapPin, 
  Facebook, Twitter, Instagram, Linkedin,
  ChevronRight
} from 'lucide-react'

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ],
  services: [
    { label: 'Find Hospitals', href: '/hospitals' },
    { label: 'Book Appointment', href: '/hospitals' },
    { label: 'Health Packages', href: '/packages' },
    { label: 'Online Consultation', href: '/consultation' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 
                            rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">CityHealth</span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 max-w-sm">
              Your trusted partner for healthcare appointments. Connect with top doctors 
              and hospitals near you for quality medical care.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-slate-400">
              <a href="tel:1800-123-4567" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-primary-400" />
                1800-123-4567 (Toll Free)
              </a>
              <a href="mailto:support@cityhealth.com" className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-primary-400" />
                support@cityhealth.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                Mumbai, Maharashtra, India
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors 
                             flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map(link => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors 
                             flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map(link => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors 
                             flex items-center gap-1 group"
                  >
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CityHealth. All rights reserved.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(social => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center 
                          text-slate-400 hover:bg-primary-500 hover:text-white transition-all"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
