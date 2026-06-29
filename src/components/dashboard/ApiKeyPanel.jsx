import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Copy, Eye, EyeOff, RefreshCw, CheckCircle, AlertTriangle, Zap } from 'lucide-react'
import { useApiKey } from '../../hooks/useApiKey'
import { MagneticButton } from '../shared/MagneticButton'
import { GlassPanel } from '../shared/GlassPanel'
import { useNotif } from '../../context/NotifContext'

function KeyDisplay({ apiKey, maskedKey, revealed, onToggleReveal, onCopy }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const ok = await onCopy()
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest">
        API Key
      </label>
      <div className="relative flex items-center gap-2">
        <div className="flex-1 glass rounded-xl p-4 font-mono text-sm border border-white/8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={revealed ? 'revealed' : 'masked'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={revealed ? 'text-emerald-400 break-all' : 'text-white/30 tracking-widest'}
            >
              {revealed ? apiKey : maskedKey}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={onToggleReveal}
            className="p-2.5 glass rounded-lg border border-white/8 text-white/40 hover:text-white/80 hover:border-white/15 transition-all focus-ring"
            aria-label={revealed ? 'Hide key' : 'Reveal key'}
          >
            {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={handleCopy}
            className={`p-2.5 glass rounded-lg border transition-all focus-ring
              ${copied
                ? 'border-emerald-500/40 text-emerald-400'
                : 'border-white/8 text-white/40 hover:text-white/80 hover:border-white/15'
              }`}
            aria-label="Copy key"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/8 border border-yellow-500/15"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
          <p className="text-xs font-mono text-yellow-400/80">Keep this key confidential. Treat it like a password.</p>
        </motion.div>
      )}
    </div>
  )
}

function InitializationModule({ onGenerate, loading, error }) {
  return (
    <div className="text-center py-8">
      {/* Animated shield */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute w-32 h-32 rounded-full border border-emerald-500/20"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute w-44 h-44 rounded-full border border-emerald-500/10"
        />
        <div className="w-20 h-20 rounded-2xl glass-emerald flex items-center justify-center"
          style={{ boxShadow: '0 0 40px rgba(0,255,136,0.2)' }}>
          <Shield className="w-9 h-9 text-emerald-400" />
        </div>
      </div>

      <h3 className="text-lg font-display font-bold text-white mb-2">Secure API Key Required</h3>
      <p className="text-sm font-mono text-white/30 mb-8 max-w-xs mx-auto leading-relaxed">
        Generate a unique cryptographic key to authenticate your extraction requests
      </p>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-3 rounded-xl bg-red-500/8 border border-red-500/20 text-sm font-mono text-red-400"
        >
          {error}
        </motion.div>
      )}

      <MagneticButton
        onClick={onGenerate}
        loading={loading}
        size="lg"
        className="mx-auto"
      >
        <Shield className="w-4 h-4" />
        Initialize Secure API Key
      </MagneticButton>
    </div>
  )
}

export function ApiKeyPanel() {
  const { apiKey, maskedKey, loading, error, revealed, generate, revoke, toggleReveal, copyKey } = useApiKey()
  const { success, error: notifError } = useNotif()
  const [regenerating, setRegenerating] = useState(false)

  const handleGenerate = async () => {
    const res = await generate()
    if (res.success) success('API key generated successfully')
    else notifError(res.error)
  }

  const handleRegenerate = async () => {
    setRegenerating(true)
    revoke()
    setTimeout(async () => {
      const res = await generate()
      setRegenerating(false)
      if (res.success) success('API key regenerated')
      else notifError(res.error)
    }, 300)
  }

  return (
    <GlassPanel className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg glass-emerald flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white">API Authentication</h3>
            <p className="text-xs font-mono text-white/30">Manage your extraction credentials</p>
          </div>
        </div>

        {apiKey && (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400/70">Active</span>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!apiKey ? (
          <motion.div key="init" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InitializationModule onGenerate={handleGenerate} loading={loading} error={error} />
          </motion.div>
        ) : (
          <motion.div key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <KeyDisplay
              apiKey={apiKey}
              maskedKey={maskedKey}
              revealed={revealed}
              onToggleReveal={toggleReveal}
              onCopy={copyKey}
            />

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <MagneticButton
                onClick={handleRegenerate}
                variant="ghost"
                size="sm"
                loading={regenerating}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </MagneticButton>

              <div className="flex items-center gap-2 ml-auto">
                <Zap className="w-3.5 h-3.5 text-emerald-400/60" />
                <span className="text-xs font-mono text-white/25">Ready for extraction</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassPanel>
  )
}
