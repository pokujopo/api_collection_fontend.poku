import React, { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

export function MagneticButton({
  children,
  className = '',
  variant = 'emerald',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) {
  const ref = useRef(null)
  const [ripples, setRipples] = useState([])
  const [magnetic, setMagnetic] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e) => {
    if (disabled || loading) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    setMagnetic({ x: x * 0.15, y: y * 0.15 })
  }, [disabled, loading])

  const handleMouseLeave = useCallback(() => {
    setMagnetic({ x: 0, y: 0 })
  }, [])

  const handleClick = useCallback((e) => {
    if (disabled || loading) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const id = Date.now()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRipples((r) => [...r, { id, x, y }])
    setTimeout(() => setRipples((r) => r.filter((rip) => rip.id !== id)), 600)
    onClick?.(e)
  }, [disabled, loading, onClick])

  const variants = {
    emerald: {
      base: 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-400 hover:border-emerald-400/60 hover:bg-emerald-500/25',
      glow: 'hover:shadow-[0_0_30px_rgba(0,255,136,0.3)]',
    },
    sapphire: {
      base: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400 hover:border-blue-400/60 hover:bg-blue-500/25',
      glow: 'hover:shadow-[0_0_30px_rgba(0,136,255,0.3)]',
    },
    ghost: {
      base: 'bg-white/5 border border-white/10 text-white/70 hover:border-white/20 hover:text-white hover:bg-white/8',
      glow: '',
    },
    danger: {
      base: 'bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 text-red-400 hover:border-red-400/60',
      glow: 'hover:shadow-[0_0_30px_rgba(255,50,50,0.3)]',
    },
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg',
  }

  const v = variants[variant] || variants.emerald
  const s = sizes[size] || sizes.md

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={{ x: magnetic.x, y: magnetic.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative overflow-hidden rounded-xl font-medium font-mono tracking-wide
        transition-all duration-300 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
        focus-ring select-none
        ${v.base} ${v.glow} ${s} ${className}
      `}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: r.x - 10,
            top: r.y - 10,
            width: 20,
            height: 20,
            background: 'rgba(0,255,136,0.3)',
            animationDuration: '600ms',
            animationIterationCount: 1,
          }}
        />
      ))}

      {/* Content */}
      <span className={`relative z-10 flex items-center justify-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {children}
      </span>

      {/* Loading spinner */}
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </span>
      )}
    </motion.button>
  )
}
