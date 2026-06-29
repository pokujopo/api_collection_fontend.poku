import React from 'react'
import { motion } from 'framer-motion'
import { Download, RotateCcw, CheckCircle, AlertTriangle } from 'lucide-react'
import { MagneticButton } from '../shared/MagneticButton'
import { CircularLoader, NeuralPulse } from '../shared/CircularLoader'

export function DownloadResult({ status, downloadLink, error, elapsed, taskId, onReset }) {
  if (status === 'pending' || status === 'submitting') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center py-8 text-center space-y-6"
      >
        {/* Animated loader cluster */}
        <div className="relative">
          <CircularLoader size={72} color="#00ff88" thickness={2} />
          <div className="absolute inset-0 flex items-center justify-center">
            <NeuralPulse />
          </div>
        </div>

        <div>
          <p className="text-sm font-mono text-white/60 mb-1">
            {status === 'submitting' ? 'Submitting request...' : 'Processing extraction...'}
          </p>
          {elapsed > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-mono text-white/25"
            >
              Elapsed: {elapsed}s {taskId && `• Task ${taskId}`}
            </motion.p>
          )}
        </div>

        {/* Animated progress segments */}
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-6 h-1 rounded-full bg-emerald-500/30"
              animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </motion.div>
    )
  }

  if (status === 'success' && downloadLink) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        {/* Success indicator */}
        <div className="flex flex-col items-center py-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-2xl glass-emerald flex items-center justify-center mb-4"
            style={{ boxShadow: '0 0 40px rgba(0,255,136,0.3)' }}
          >
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <h3 className="text-base font-display font-bold text-white mb-1">Extraction Complete</h3>
          <p className="text-xs font-mono text-white/30">Media is ready for download</p>
        </div>

        {/* Download button */}
        <motion.a
          href={downloadLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`
            relative w-full flex items-center justify-center gap-3 px-8 py-5 rounded-xl
            text-base font-mono font-bold text-emerald-400 tracking-wide
            border border-emerald-500/40 overflow-hidden group
            transition-all duration-300
            hover:border-emerald-400/70 hover:shadow-[0_0_50px_rgba(0,255,136,0.3)]
          `}
          style={{ background: 'rgba(0,255,136,0.06)' }}
        >
          {/* Animated glow sweep */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
          <Download className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Download Media</span>
        </motion.a>

        {/* Reset */}
        <MagneticButton onClick={onReset} variant="ghost" size="sm" className="w-full">
          <RotateCcw className="w-3.5 h-3.5" />
          Extract Another
        </MagneticButton>
      </motion.div>
    )
  }

  if (status === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <div className="flex items-start gap-4 p-5 rounded-xl bg-red-500/8 border border-red-500/20">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-mono text-red-400 font-medium mb-1">Extraction Failed</p>
            <p className="text-xs font-mono text-red-400/60 leading-relaxed">{error || 'An unexpected error occurred in the pipeline.'}</p>
          </div>
        </div>

        <MagneticButton onClick={onReset} variant="ghost" size="sm" className="w-full">
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </MagneticButton>
      </motion.div>
    )
  }

  return null
}
