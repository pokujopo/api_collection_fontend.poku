import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, AlertTriangle } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-md"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl glass border border-white/8">
          <AlertTriangle className="w-9 h-9 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-5xl font-mono font-black text-white mb-3">404</h1>
          <p className="text-sm font-mono text-white/30">Route not found in this system</p>
        </div>
        <Link to="/app">
          <button className="flex items-center gap-2 px-6 py-3 mx-auto glass-emerald rounded-xl text-sm font-mono text-emerald-400 border border-emerald-500/25 hover:border-emerald-400/40 transition-all">
            <Home className="w-4 h-4" />
            Return to Base
          </button>
        </Link>
      </motion.div>
    </div>
  )
}
