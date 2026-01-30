import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Check } from 'lucide-react'

export default function SlotGrid({ slots = [], selectedSlot, onSelect }) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="font-medium">No slots available for this date</p>
        <p className="text-sm">Please try selecting a different date</p>
      </div>
    )
  }

  // Group slots by time of day
  const morning = slots.filter(s => {
    const hour = parseInt(s.time?.split(':')[0])
    return hour >= 6 && hour < 12
  })
  const afternoon = slots.filter(s => {
    const hour = parseInt(s.time?.split(':')[0])
    return hour >= 12 && hour < 17
  })
  const evening = slots.filter(s => {
    const hour = parseInt(s.time?.split(':')[0])
    return hour >= 17 || hour < 6
  })

  const sections = [
    { label: 'Morning', slots: morning, icon: '🌅' },
    { label: 'Afternoon', slots: afternoon, icon: '☀️' },
    { label: 'Evening', slots: evening, icon: '🌙' },
  ].filter(section => section.slots.length > 0)

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIdx) => (
        <div key={section.label}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{section.icon}</span>
            <span className="text-sm font-medium text-slate-600">{section.label}</span>
            <span className="text-xs text-slate-400">({section.slots.length} slots)</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {section.slots.map((s, i) => {
              const isSelected = selectedSlot?.id === s.id
              return (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (sectionIdx * section.slots.length + i) * 0.02 }}
                  disabled={!s.available}
                  onClick={() => onSelect(s)}
                  whileHover={s.available ? { scale: 1.05 } : {}}
                  whileTap={s.available ? { scale: 0.95 } : {}}
                  className={`relative p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-glow ring-2 ring-primary-300'
                      : s.available
                        ? 'bg-white border-2 border-surface-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50'
                        : 'bg-surface-100 text-slate-400 cursor-not-allowed border-2 border-surface-100'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-secondary-500 rounded-full 
                                flex items-center justify-center shadow-sm"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                  <div className="flex items-center justify-center gap-1">
                    <Clock className={`w-3 h-3 ${isSelected ? 'text-white/80' : 'text-slate-400'}`} />
                    <span>{s.time}</span>
                  </div>
                  {!s.available && (
                    <div className="text-xs mt-1 text-slate-400">Booked</div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
