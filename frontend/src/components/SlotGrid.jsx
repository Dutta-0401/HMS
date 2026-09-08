import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Sun, Sunset, Moon, Check } from 'lucide-react'

const timeGroups = [
  { label: 'Morning', icon: Sun, filter: (h) => h >= 6 && h < 12, color: 'text-slate-400' },
  { label: 'Afternoon', icon: Sunset, filter: (h) => h >= 12 && h < 17, color: 'text-slate-400' },
  { label: 'Evening', icon: Moon, filter: (h) => h >= 17 || h < 6, color: 'text-slate-400' },
]

function parseHour(time) {
  if (!time) return 0
  const match = time.match(/(\d{1,2}):(\d{2})/)
  if (!match) return 0
  let h = parseInt(match[1], 10)
  if (time.toLowerCase().includes('pm') && h < 12) h += 12
  if (time.toLowerCase().includes('am') && h === 12) h = 0
  return h
}

export default function SlotGrid({ slots = [], selectedSlot, onSelect }) {
  if (!slots.length) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 text-slate-200 mx-auto mb-3" />
        <p className="text-slate-400 font-medium">No slots available for this date</p>
        <p className="text-sm text-slate-300 mt-1">Try selecting a different date</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {timeGroups.map(({ label, icon: Icon, filter, color }) => {
        const groupSlots = slots.filter(s => filter(parseHour(s.time)))
        if (!groupSlots.length) return null

        return (
          <div key={label}>
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-sm font-medium text-slate-600">{label}</span>
              <span className="text-xs text-slate-400">({groupSlots.length})</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {groupSlots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id
                const isBooked = slot.status === 'booked' || slot.booked

                return (
                  <motion.button
                    key={slot.id}
                    whileHover={!isBooked ? { scale: 1.03 } : {}}
                    whileTap={!isBooked ? { scale: 0.97 } : {}}
                    onClick={() => !isBooked && onSelect(slot)}
                    disabled={isBooked}
                    className={`relative p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isBooked
                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                        : isSelected
                          ? 'bg-primary-600 text-white border border-primary-600'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="slot-check"
                        className="absolute top-1.5 right-1.5 w-4 h-4 bg-white/20 rounded-full flex items-center justify-center"
                      >
                        <Check className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                    {slot.time}
                    {isBooked && (
                      <span className="block text-[10px] text-slate-300 mt-0.5">Booked</span>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
