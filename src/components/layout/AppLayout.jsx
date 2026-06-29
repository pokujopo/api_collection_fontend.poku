import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Key, LayoutDashboard, LogOut, Menu, X, Zap, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { AuroraBackground } from '../shared/AuroraBackground'

const NAV = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/download', label: 'Extract', icon: Download },
  { to: '/app/keys', label: 'API Keys', icon: Key },
]

export function AppLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <AuroraBackground />

      {/* Sidebar */}
      <aside className="relative z-20 hidden md:flex flex-col w-64 shrink-0 border-r border-white/5">
        <div className="flex flex-col h-full glass-strong">
          {/* Logo */}
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg glass-emerald flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.8))' }} />
              </div>
              <div>
                <span className="font-display font-bold text-white tracking-tight">NEXUS</span>
                <span className="block text-[10px] font-mono text-white/25 tracking-widest uppercase">v2.1.0</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-mono
                   transition-all duration-200 focus-ring
                   ${isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-emerald-400' : 'text-white/30 group-hover:text-white/60'}`} />
                    <span>{label}</span>
                    {isActive && <ChevronRight className="w-3 h-3 ml-auto text-emerald-400/60" />}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-500/20 flex items-center justify-center">
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-white/70 truncate">{user?.username}</p>
                <p className="text-[10px] font-mono text-white/25 tracking-widest">AUTHENTICATED</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-mono text-white/30
                hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 focus-ring"
              aria-label="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 glass-strong border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <span className="font-display font-bold text-white text-sm tracking-tight">NEXUS</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg glass text-white/50 hover:text-white focus-ring"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 bottom-0 z-50 w-72 glass-strong border-r border-white/8 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span className="font-display font-bold text-white">NEXUS</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg glass text-white/50 focus-ring">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {NAV.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-mono transition-all
                       ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-white/5">
                <button onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-mono text-red-400 hover:bg-red-500/5 transition-all">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="relative z-10 flex-1 overflow-auto md:pt-0 pt-16">
        <motion.div
          key="main"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
