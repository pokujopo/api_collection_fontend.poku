import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'

export const GlassInput = forwardRef(function GlassInput(
  { label, error, hint, prefix, suffix, className = '', containerClassName = '', ...props },
  ref
) {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-mono text-white/40 uppercase tracking-widest">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full glass rounded-xl px-4 py-3.5 text-white placeholder-white/20
            text-sm font-mono
            border border-white/8
            focus:outline-none focus:border-emerald-500/40
            focus:shadow-[0_0_20px_rgba(0,255,136,0.08)]
            transition-all duration-300
            ${prefix ? 'pl-10' : ''}
            ${suffix ? 'pr-10' : ''}
            ${error ? 'border-red-500/40 focus:border-red-500/60' : ''}
            ${className}
          `}
          {...props}
        />
        {suffix && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-mono text-red-400"
        >
          {error}
        </motion.p>
      )}
      {hint && !error && (
        <p className="text-xs font-mono text-white/25">{hint}</p>
      )}
    </div>
  )
})
