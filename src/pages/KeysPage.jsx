import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Info } from 'lucide-react'
import { ApiKeyPanel } from '../components/dashboard/ApiKeyPanel'
import { GlassPanel } from '../components/shared/GlassPanel'

const DOCS = [
  {
    step: '01',
    title: 'Generate Key',
    desc: 'Initialize a secure cryptographic API key tied to your account.',
  },
  {
    step: '02',
    title: 'Include in Requests',
    desc: 'Pass your key as the X-API-Key header in every extraction request.',
  },
  {
    step: '03',
    title: 'Rotate Regularly',
    desc: 'Regenerate your key periodically or if you suspect compromise.',
  },
]

export function KeysPage() {
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg glass-emerald flex items-center justify-center">
            <Shield className="w-4 h-4 text-emerald-400" />
          </div>
          <h1 className="text-xl font-display font-bold text-white">API Keys</h1>
        </div>
        <p className="text-sm font-mono text-white/30 ml-11">
          Manage extraction credentials
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ApiKeyPanel />
      </motion.div>

      {/* Usage guide */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <GlassPanel className="p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-white/30" />
            <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest">Usage Guide</h2>
          </div>

          <div className="space-y-4">
            {DOCS.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-4"
              >
                <span className="text-xs font-mono text-emerald-400/50 mt-0.5 shrink-0 w-6">{step}</span>
                <div>
                  <p className="text-sm font-mono text-white/70 font-medium mb-0.5">{title}</p>
                  <p className="text-xs font-mono text-white/30 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Code example */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-xs font-mono text-white/25 uppercase tracking-widest mb-3">Example Request</p>
            <div className="glass rounded-xl p-4 font-mono text-xs leading-relaxed">
              <span className="text-cyan-400">POST</span>{' '}
              <span className="text-white/50">/api/v1/download/</span>
              <br />
              <span className="text-emerald-400/70">X-API-Key:</span>{' '}
              <span className="text-white/30">{'<your-api-key>'}</span>
              <br />
              <span className="text-emerald-400/70">Content-Type:</span>{' '}
              <span className="text-white/30">application/json</span>
              <br />
              <br />
              <span className="text-white/20">{'{'}</span>
              <br />
              {'  '}<span className="text-blue-400">"link"</span>
              <span className="text-white/30">: </span>
              <span className="text-yellow-400/70">"https://..."</span>
              <span className="text-white/30">,</span>
              <br />
              {'  '}<span className="text-blue-400">"format_type"</span>
              <span className="text-white/30">: </span>
              <span className="text-yellow-400/70">"video"</span>
              <span className="text-white/30">,</span>
              <br />
              {'  '}<span className="text-blue-400">"quality"</span>
              <span className="text-white/30">: </span>
              <span className="text-yellow-400/70">"1080p"</span>
              <br />
              <span className="text-white/20">{'}'}</span>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  )
}
