import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, Music, Tv2 } from 'lucide-react'

const FORMAT_OPTIONS = [
  { value: 'video', label: 'Video', icon: Video, desc: 'MP4 with audio' },
  { value: 'audio', label: 'Audio', icon: Music, desc: 'MP3 / AAC' },
]

const QUALITY_OPTIONS = [
  { value: '2160p', label: '4K', sub: '2160p UHD' },
  { value: '1440p', label: '2K', sub: '1440p QHD' },
  { value: '1080p', label: 'FHD', sub: '1080p Full HD' },
  { value: '720p', label: 'HD', sub: '720p Ready' },
  { value: '480p', label: 'SD', sub: '480p Standard' },
  { value: '360p', label: 'LQ', sub: '360p Low' },
]

export function FormatSelector({ format, quality, onFormatChange, onQualityChange, disabled }) {
  return (
    <div className="space-y-5">
      {/* Format */}
      <div className="space-y-2">
        <label className="block text-xs font-mono text-white/40 uppercase tracking-widest">
          Output Format
        </label>
        <div className="flex gap-2">
          {FORMAT_OPTIONS.map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              onClick={() => onFormatChange(value)}
              disabled={disabled}
              className={`flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 text-left focus-ring
                ${format === value
                  ? 'glass-emerald border-emerald-500/30 shadow-[0_0_20px_rgba(0,255,136,0.08)]'
                  : 'glass border-white/8 hover:border-white/15'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              aria-pressed={format === value}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                ${format === value ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                <Icon className={`w-4 h-4 transition-colors ${format === value ? 'text-emerald-400' : 'text-white/30'}`} />
              </div>
              <div>
                <p className={`text-sm font-mono font-medium transition-colors ${format === value ? 'text-emerald-400' : 'text-white/60'}`}>
                  {label}
                </p>
                <p className="text-xs font-mono text-white/25">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quality — only for video */}
      <AnimatePresence>
        {format === 'video' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-2 overflow-hidden"
          >
            <label className="block text-xs font-mono text-white/40 uppercase tracking-widest">
              Quality Preset
            </label>
            <div className="grid grid-cols-3 gap-2">
              {QUALITY_OPTIONS.map(({ value, label, sub }) => (
                <button
                  key={value}
                  onClick={() => onQualityChange(value)}
                  disabled={disabled}
                  className={`p-3 rounded-xl border text-center transition-all duration-200 focus-ring
                    ${quality === value
                      ? 'glass-emerald border-emerald-500/30'
                      : 'glass border-white/8 hover:border-white/15'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-pressed={quality === value}
                >
                  <p className={`text-sm font-mono font-bold transition-colors ${quality === value ? 'text-emerald-400' : 'text-white/60'}`}>
                    {label}
                  </p>
                  <p className="text-[10px] font-mono text-white/25 mt-0.5">{sub}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
