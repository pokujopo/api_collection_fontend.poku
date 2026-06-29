import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link2, X, Clipboard, CheckCircle, Globe } from 'lucide-react'
import { isValidUrl, detectPlatform, getPlatformColor } from '../../utils/urlUtils'

const PLACEHOLDERS = [
  'https://youtube.com/watch?v=...',
  'https://instagram.com/p/...',
  'https://twitter.com/...',
  'https://tiktok.com/@user/video/...',
  'https://vimeo.com/...',
]

export function UrlInput({ value, onChange, disabled }) {
  const [focused, setFocused] = useState(false)
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [pasted, setPasted] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!value) {
      const interval = setInterval(() => {
        setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length)
      }, 2500)
      return () => clearInterval(interval)
    }
  }, [value])

  const isValid = value && isValidUrl(value)
  const platform = value ? detectPlatform(value) : null
  const platformColor = platform ? getPlatformColor(platform) : null

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text && isValidUrl(text)) {
        onChange({ target: { value: text } })
        setPasted(true)
        setTimeout(() => setPasted(false), 2000)
      }
    } catch {
      inputRef.current?.focus()
    }
  }, [onChange])

  const handleClear = useCallback(() => {
    onChange({ target: { value: '' } })
    inputRef.current?.focus()
  }, [onChange])

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono text-white/40 uppercase tracking-widest">
        Media URL
      </label>

      <div
        className={`relative flex items-center glass rounded-xl border transition-all duration-300
          ${focused ? 'border-emerald-500/40 shadow-[0_0_20px_rgba(0,255,136,0.08)]' : 'border-white/8'}
          ${isValid ? 'border-emerald-500/30' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Icon */}
        <div className="pl-4 pr-2 flex items-center shrink-0">
          {isValid ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.6))' }} />
          ) : (
            <Link2 className="w-4 h-4 text-white/25" />
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="url"
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent py-4 text-sm font-mono text-white placeholder-white/15 outline-none min-w-0"
          aria-label="Media URL"
          aria-describedby="url-hint"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
        />

        {/* Animated placeholder */}
        {!value && !focused && (
          <div className="absolute left-11 top-1/2 -translate-y-1/2 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.span
                key={placeholderIdx}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-sm font-mono text-white/15"
              >
                {PLACEHOLDERS[placeholderIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pr-3 shrink-0">
          {value ? (
            <button
              onClick={handleClear}
              disabled={disabled}
              className="p-1.5 rounded-lg text-white/25 hover:text-white/60 transition-colors focus-ring"
              aria-label="Clear URL"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handlePaste}
              disabled={disabled}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all focus-ring
                ${pasted ? 'text-emerald-400' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}
              aria-label="Paste from clipboard"
            >
              {pasted ? <CheckCircle className="w-3 h-3" /> : <Clipboard className="w-3 h-3" />}
              {pasted ? 'Pasted' : 'Paste'}
            </button>
          )}
        </div>
      </div>

      {/* Platform detection */}
      <AnimatePresence>
        {platform && isValid && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="flex items-center gap-2"
          >
            <Globe className="w-3 h-3" style={{ color: platformColor }} />
            <span className="text-xs font-mono" style={{ color: platformColor }}>
              Detected: {platform}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <p id="url-hint" className="text-xs font-mono text-white/20">
        Supports YouTube, Instagram, TikTok, Twitter, Vimeo, and 1000+ more
      </p>
    </div>
  )
}
