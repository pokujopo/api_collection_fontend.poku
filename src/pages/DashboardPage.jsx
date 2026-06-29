import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Download, Key, Zap, ArrowRight, Activity, Shield, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApiKey } from '../hooks/useApiKey'
import { ApiKeyPanel } from '../components/dashboard/ApiKeyPanel'
import { GlassPanel } from '../components/shared/GlassPanel'

const STATS = [
  { label: 'Engine Status', value: 'Online', icon: Activity, color: 'text-emerald-400', dot: true },
  { label: 'API Version', value: 'v1.0', icon: Zap, color: 'text-cyan-400' },
  { label: 'Supported Sources', value: '1000+', icon: Globe, color: 'text-blue-400' },
]

const QUICK_ACTIONS = [
  { to: '/app/download', label: 'Extract Media', desc: 'Pull video or audio from any URL', icon: Download, color: 'emerald' },
  { to: '/app/keys', label: 'Manage API Keys', desc: 'Generate and rotate credentials', icon: Key, color: 'sapphire' },
]

function StatCard({ stat, index }) {
  const Icon = stat.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      className="glass rounded-xl p-4 border border-white/5 flex items-center gap-4"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0
        ${stat.color === 'text-emerald-400' ? 'bg-emerald-500/10' : stat.color === 'text-cyan-400' ? 'bg-cyan-500/10' : 'bg-blue-500/10'}`}>
        <Icon className={`w-4 h-4 ${stat.color}`} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className={`text-sm font-mono font-bold ${stat.color}`}>{stat.value}</p>
          {stat.dot && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
        </div>
        <p className="text-xs font-mono text-white/30">{stat.label}</p>
      </div>
    </motion.div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const { apiKey } = useApiKey()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <p className="text-xs font-mono text-white/25 uppercase tracking-widest mb-1">{greeting}</p>
          <h1 className="text-2xl md:text-3xl font-display font-black text-white">
            {user?.username}
            <span className="text-emerald-400">.</span>
          </h1>
          <p className="text-sm font-mono text-white/30 mt-1">NEXUS Media Extraction Engine — Control Panel</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400/70">System nominal</span>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STATS.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest px-1">Quick Actions</p>
          {QUICK_ACTIONS.map(({ to, label, desc, icon: Icon, color }) => (
            <Link key={to} to={to}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`group flex items-center gap-4 p-5 glass rounded-xl border border-white/5 cursor-pointer
                  hover:border-${color === 'emerald' ? 'emerald' : 'blue'}-500/20 transition-all duration-200`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                  ${color === 'emerald' ? 'glass-emerald' : 'glass-sapphire'}`}>
                  <Icon className={`w-5 h-5 ${color === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono font-bold text-white group-hover:text-white/90">{label}</p>
                  <p className="text-xs font-mono text-white/30 mt-0.5">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* API Key panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ApiKeyPanel />
        </motion.div>
      </div>

      {/* Getting started / status */}
      {!apiKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-emerald rounded-2xl p-6 border border-emerald-500/15"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-mono font-bold text-emerald-400 mb-1">Initialize Your API Key</h3>
              <p className="text-xs font-mono text-white/40 leading-relaxed">
                Before extracting media, generate a secure API key. This one-time operation provisions your extraction credentials.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
