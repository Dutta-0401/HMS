import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

const variants = {
  success: {
    icon: CheckCircle,
    bg: 'bg-secondary-500',
    iconColor: 'text-white',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-500',
    iconColor: 'text-white',
  },
  warning: {
    icon: AlertCircle,
    bg: 'bg-yellow-500',
    iconColor: 'text-white',
  },
  info: {
    icon: Info,
    bg: 'bg-primary-500',
    iconColor: 'text-white',
  },
}

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null

  const { icon: Icon, bg, iconColor } = variants[type] || variants.info

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        className={`fixed bottom-6 right-6 ${bg} text-white px-4 py-3 rounded-xl shadow-soft-lg 
                   flex items-center gap-3 max-w-sm z-50`}
      >
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
        <span className="flex-1 text-sm font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
