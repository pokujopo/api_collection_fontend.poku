import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { GlassInput } from '../shared/GlassInput'
import { MagneticButton } from '../shared/MagneticButton'

export function LoginForm({ onSwitch }) {
  const { login, isLoading, error, clearError } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [localError, setLocalError] = useState('')

  const handleChange = useCallback((e) => {
    clearError()
    setLocalError('')
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }, [clearError])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!form.username.trim()) { setLocalError('Username required'); return }
    if (!form.password) { setLocalError('Password required'); return }
    await login(form.username.trim(), form.password)
  }, [form, login])

  const displayError = localError || error

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-white mb-2">Access Terminal</h2>
        <p className="text-sm font-mono text-white/30">Authenticate to continue</p>
      </div>

      {displayError && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 mb-6"
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-mono text-red-400">{displayError}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <GlassInput
          label="Username"
          name="username"
          type="text"
          placeholder="your_username"
          value={form.username}
          onChange={handleChange}
          autoComplete="username"
          prefix={<User className="w-4 h-4" />}
          aria-label="Username"
        />
        <GlassInput
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••••••"
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          prefix={<Lock className="w-4 h-4" />}
          aria-label="Password"
        />

        <MagneticButton
          type="submit"
          size="lg"
          className="w-full mt-6"
          loading={isLoading}
          disabled={isLoading}
        >
          <span>Authenticate</span>
          <ArrowRight className="w-4 h-4" />
        </MagneticButton>
      </form>

      <p className="mt-6 text-center text-sm font-mono text-white/25">
        No credentials?{' '}
        <button
          onClick={onSwitch}
          className="text-emerald-400/70 hover:text-emerald-400 transition-colors focus-ring rounded underline-offset-2"
        >
          Initialize account
        </button>
      </p>
    </motion.div>
  )
}
