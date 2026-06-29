import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal } from 'lucide-react'

const LOG_COLORS = {
  info: 'text-white/50',
  success: 'text-emerald-400',
  error: 'text-red-400',
  warn: 'text-yellow-400',
  pending: 'text-cyan-400/70',
}

function LogLine({ log, index }) {
  const color = LOG_COLORS[log.type] || LOG_COLORS.info
  const ts = new Date(log.ts).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="flex items-start gap-3 py-0.5"
    >
      <span className="text-white/20 text-xs font-mono shrink-0 mt-0.5 w-16">{ts}</span>
      <span className={`text-xs font-mono leading-relaxed ${color}`}>{log.msg}</span>
    </motion.div>
  )
}

export function TerminalLog({ logs, status }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  return (
    <div className="glass rounded-2xl overflow-hidden border border-white/8">
      {/* Terminal header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-black/20">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <div className="flex items-center gap-2 ml-2">
          <Terminal className="w-3.5 h-3.5 text-white/30" />
          <span className="text-xs font-mono text-white/30 tracking-widest">EXTRACTION ENGINE — STDOUT</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {status === 'pending' && (
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          )}
          {status === 'success' && (
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
          {status === 'failed' && (
            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
          )}
          <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{status}</span>
        </div>
      </div>

      {/* Log output */}
      <div className="p-4 h-56 overflow-y-auto space-y-0.5 scan-line">
        {logs.length === 0 && (
          <p className="text-xs font-mono text-white/15 italic">Awaiting command...</p>
        )}
        <AnimatePresence>
          {logs.map((log, i) => (
            <LogLine key={log.ts + i} log={log} index={i} />
          ))}
        </AnimatePresence>
        {status === 'pending' && (
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-xs font-mono text-cyan-400/50 pt-1"
          >
            ▶ processing...
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
