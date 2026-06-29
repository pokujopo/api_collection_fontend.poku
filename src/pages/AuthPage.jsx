import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Globe, Cpu, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { LoginForm } from '../components/auth/LoginForm'
import { RegisterForm } from '../components/auth/RegisterForm'

const FEATURES = [
  { icon: Globe, label: 'Universal Extraction', desc: 'Pull media from any platform' },
  { icon: Cpu, label: 'AI-Powered Pipeline', desc: 'Intelligent format detection' },
  { icon: Lock, label: 'Encrypted Transit', desc: 'End-to-end secure processing' },
]

export function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const [mode, setMode] = useState('login')

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-[#0B0F17] relative">
      {/* Aurora background */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[#0B0F17]" />
        <div className="absolute -top-60 -left-60 w-[800px] h-[800px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #00ff88 0%, transparent 70%)', animation: 'float 10s ease-in-out infinite' }} />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #0088ff 0%, transparent 70%)', animation: 'float 14s ease-in-out infinite reverse' }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,255,136,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
      </div>

      {/* Left panel — branding */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex relative z-10 flex-col justify-between w-1/2 p-12 border-r border-white/5"
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl glass-emerald flex items-center justify-center"
            style={{ boxShadow: '0 0 30px rgba(0,255,136,0.2)' }}>
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="font-display font-black text-white text-xl tracking-tight">NEXUS</span>
            <span className="block text-[10px] font-mono text-white/25 tracking-[0.3em] uppercase">Media Engine</span>
          </div>
        </div>

        {/* Hero */}
        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-emerald-500/20 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400/80 tracking-widest uppercase">System Online</span>
            </div>

            <h1 className="text-5xl font-display font-black text-white leading-[1.05] mb-5">
              Extract{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #00ff88, #00e5ff)' }}
              >
                anything.
              </span>
              <br />
              From anywhere.
            </h1>
            <p className="text-lg text-white/35 font-sans leading-relaxed">
              Next-generation media extraction infrastructure. Pull video and audio from any platform at maximum quality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 space-y-4"
          >
            {FEATURES.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl glass border border-white/5"
              >
                <div className="w-9 h-9 rounded-lg glass-emerald flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-mono text-white/80 font-medium">{label}</p>
                  <p className="text-xs font-mono text-white/30">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-white/20">© 2025 NEXUS</span>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <span className="text-xs font-mono text-white/20">All rights reserved</span>
        </div>
      </motion.div>

      {/* Right panel — auth form */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
        className="relative z-10 flex-1 flex items-center justify-center p-6 lg:p-12"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Zap className="w-6 h-6 text-emerald-400" />
            <span className="font-display font-black text-white text-xl">NEXUS</span>
          </div>

          <div className="glass-strong rounded-2xl p-8 border border-white/8">
            {/* Mode tabs */}
            <div className="flex items-center gap-1 p-1 glass rounded-xl mb-8">
              {['login', 'register'].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-mono font-medium tracking-widest uppercase transition-all duration-200 focus-ring
                    ${mode === m
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'text-white/30 hover:text-white/60'
                    }`}
                >
                  {m === 'login' ? 'Sign In' : 'Register'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <LoginForm key="login" onSwitch={() => setMode('register')} />
              ) : (
                <RegisterForm key="register" onSwitch={() => setMode('login')} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
