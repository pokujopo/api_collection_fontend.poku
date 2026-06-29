import React from 'react'
import { motion } from 'framer-motion'

export function GlassPanel({ children, className = '', glow = false, emerald = false, sapphire = false, animate = true, ...props }) {
  const glowClass = glow
    ? emerald
      ? 'glow-emerald glass-emerald'
      : sapphire
      ? 'glow-sapphire glass-sapphire'
      : 'glow-emerald glass-emerald'
    : 'glass'

  const Component = animate ? motion.div : 'div'
  const animProps = animate
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
      }
    : {}

  return (
    <Component
      className={`rounded-2xl relative ${glowClass} ${className}`}
      {...animProps}
      {...props}
    >
      {children}
    </Component>
  )
}
