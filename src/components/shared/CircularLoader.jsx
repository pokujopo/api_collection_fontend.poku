import React from 'react'
import { motion } from 'framer-motion'

export function CircularLoader({ size = 48, color = '#00ff88', thickness = 3, className = '' }) {
  const radius = (size - thickness) / 2
  const circumference = radius * 2 * Math.PI

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Background ring */}
      <svg width={size} height={size} className="absolute inset-0 rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={thickness}
        />
      </svg>

      {/* Animated ring */}
      <motion.svg
        width={size}
        height={size}
        className="absolute inset-0 rotate-[-90deg]"
        animate={{ rotate: 270 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.7}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </motion.svg>

      {/* Inner pulse dot */}
      <motion.div
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  )
}

export function NeuralPulse({ className = '' }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-emerald-400/30"
          style={{
            width: 20 + i * 20,
            height: 20 + i * 20,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}
      <div className="w-3 h-3 rounded-full bg-emerald-400"
        style={{ boxShadow: '0 0 10px rgba(0,255,136,0.8)' }}
      />
    </div>
  )
}
