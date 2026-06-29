import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { GlassInput } from '../shared/GlassInput'
import { MagneticButton } from '../shared/MagneticButton'

function PasswordStrength({ password }) {
  const checks = [
    { label: 'Length ≥ 8', pass: password.length >= 8 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
  ]
  const score = checks.filter((c) => c.pass).length
  const colors = ['bg-red-500', 'bg-yellow-500', 'bg-emerald-500']

  if (!password) return null

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : 'bg-white/10'}`} />
        ))}
      </div>
      <div className="flex gap-4">
        {checks.map((c) => (
          <span key={c.label} className={`text-[10px] font-mono flex items-center gap-1 ${c.pass ? 'text-emerald-400' : 'text-white/25'}`}>
            <CheckCircle className="w-2.5 h-2.5" />
            {c.label}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export function RegisterForm({ onSwitch }) {
  const { register, isLoading, error, clearError } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [localError, setLocalError] = useState('')

  const handleChange = useCallback((e) => {
    clearError()
    setLocalError('')
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }, [clearError])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!form.username.trim()) { setLocalError('Username required'); return }
    if (!form.email.trim() || !form.email.includes('@')) { setLocalError('Valid email required'); return }
    if (form.password.length < 8) { setLocalError('Password must be at least 8 characters'); return }
    await register(form.username.trim(), form.email.trim(), form.password)
  }, [form, register])

  const displayError = localError || error

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-display font-bold text-white mb-2">Initialize Account</h2>
        <p className="text-sm font-mono text-white/30">Create your NEXUS identity</p>
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
        />
        <GlassInput
          label="Email"
          name="email"
          type="email"
          placeholder="you@domain.com"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          prefix={<Mail className="w-4 h-4" />}
        />
        <div className="space-y-2">
          <GlassInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
            prefix={<Lock className="w-4 h-4" />}
          />
          <PasswordStrength password={form.password} />
        </div>

        <MagneticButton
          type="submit"
          size="lg"
          className="w-full mt-6"
          loading={isLoading}
          disabled={isLoading}
        >
          <span>Create Identity</span>
          <ArrowRight className="w-4 h-4" />
        </MagneticButton>
      </form>

      <p className="mt-6 text-center text-sm font-mono text-white/25">
        Already initialized?{' '}
        <button
          onClick={onSwitch}
          className="text-emerald-400/70 hover:text-emerald-400 transition-colors focus-ring rounded"
        >
          Access Terminal
        </button>
      </p>
    </motion.div>
  )
}
