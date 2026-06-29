import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useNotif } from '../../context/NotifContext'

const icons = {
  success: CheckCircle,
  error: XCircle,
  warn: AlertTriangle,
  info: Info,
}

const colors = {
  success: {
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(0,255,136,0.15)]',
    bar: 'bg-emerald-500',
  },
  error: {
    border: 'border-red-500/30',
    text: 'text-red-400',
    glow: 'shadow-[0_0_20px_rgba(255,50,50,0.15)]',
    bar: 'bg-red-500',
  },
  warn: {
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    glow: 'shadow-[0_0_20px_rgba(255,200,0,0.15)]',
    bar: 'bg-yellow-500',
  },
  info: {
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    glow: 'shadow-[0_0_20px_rgba(0,136,255,0.15)]',
    bar: 'bg-blue-500',
  },
}

function Toast({ notif, onDismiss }) {
  const Icon = icons[notif.type] || icons.info
  const c = colors[notif.type] || colors.info

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        relative glass rounded-xl overflow-hidden max-w-sm w-full
        border ${c.border} ${c.glow}
      `}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${c.text}`} />
        <p className="text-white/80 text-sm leading-relaxed flex-1">{notif.message}</p>
        <button
          onClick={() => onDismiss(notif.id)}
          className="text-white/30 hover:text-white/70 transition-colors mt-0.5 focus-ring rounded"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Progress bar */}
      {notif.duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-0.5 ${c.bar} opacity-50`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: notif.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  )
}

export function ToastContainer() {
  const { notifs, dismiss } = useNotif()

  return (
    <div
      className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {notifs.map((n) => (
          <div key={n.id} className="pointer-events-auto">
            <Toast notif={n} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
