import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, AlertCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useDownload } from '../hooks/useDownload'
import { useApiKey } from '../hooks/useApiKey'
import { isValidUrl } from '../utils/urlUtils'
import { UrlInput } from '../components/download/UrlInput'
import { FormatSelector } from '../components/download/FormatSelector'
import { TerminalLog } from '../components/download/TerminalLog'
import { DownloadResult } from '../components/download/DownloadResult'
import { MagneticButton } from '../components/shared/MagneticButton'
import { GlassPanel } from '../components/shared/GlassPanel'

export function DownloadPage() {
  const { apiKey } = useApiKey()
  const { status, downloadLink, error, logs, elapsed, taskId, submit, reset } = useDownload()
  const [url, setUrl] = useState('')
  const [format, setFormat] = useState('video')
  const [quality, setQuality] = useState('1080p')
  const [urlError, setUrlError] = useState('')

  const isProcessing = status === 'submitting' || status === 'pending'
  const isDone = status === 'success' || status === 'failed'

  const handleSubmit = useCallback(async () => {
    setUrlError('')
    if (!url.trim()) { setUrlError('URL is required'); return }
    if (!isValidUrl(url.trim())) { setUrlError('Enter a valid URL starting with http:// or https://'); return }
    if (!apiKey) return

    await submit(url.trim(), format, format === 'video' ? quality : null, apiKey)
  }, [url, format, quality, apiKey, submit])

  const handleReset = useCallback(() => {
    reset()
    setUrl('')
    setUrlError('')
  }, [reset])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !isProcessing && !isDone && apiKey) {
      handleSubmit()
    }
  }, [handleSubmit, isProcessing, isDone, apiKey])

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto" onKeyDown={handleKeyDown}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg glass-emerald flex items-center justify-center">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <h1 className="text-xl font-display font-bold text-white">Extraction Engine</h1>
        </div>
        <p className="text-sm font-mono text-white/30 ml-11">
          Submit a URL · Configure output · Pull media
        </p>
      </motion.div>

      {/* No API key warning */}
      <AnimatePresence>
        {!apiKey && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-yellow-500/8 border border-yellow-500/20"
          >
            <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-mono text-yellow-400 font-medium">API Key Required</p>
              <p className="text-xs font-mono text-yellow-400/60 mt-0.5">
                Generate a secure API key before extracting media.
              </p>
            </div>
            <Link to="/app/keys">
              <button className="flex items-center gap-1.5 text-xs font-mono text-yellow-400 hover:text-yellow-300 transition-colors shrink-0">
                Initialize <ArrowRight className="w-3 h-3" />
              </button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Input form */}
        <div className="lg:col-span-3 space-y-4">
          <GlassPanel className="p-6 space-y-6">
            {/* URL Input */}
            <div>
              <UrlInput
                value={url}
                onChange={(e) => { setUrl(e.target.value); setUrlError('') }}
                disabled={isProcessing || isDone}
              />
              {urlError && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs font-mono text-red-400"
                >
                  {urlError}
                </motion.p>
              )}
            </div>

            {/* Format & Quality */}
            <FormatSelector
              format={format}
              quality={quality}
              onFormatChange={setFormat}
              onQualityChange={setQuality}
              disabled={isProcessing || isDone}
            />

            {/* Submit */}
            {status === 'idle' && (
              <MagneticButton
                onClick={handleSubmit}
                size="lg"
                className="w-full"
                disabled={!apiKey || !url}
                loading={false}
              >
                <Zap className="w-4 h-4" />
                Execute Extraction
              </MagneticButton>
            )}

            {/* Keyboard hint */}
            {status === 'idle' && apiKey && (
              <p className="text-center text-xs font-mono text-white/15">
                Press <kbd className="px-1.5 py-0.5 rounded glass border border-white/10 text-white/25">Enter</kbd> to execute
              </p>
            )}
          </GlassPanel>

          {/* Result panel */}
          <AnimatePresence>
            {(isProcessing || isDone) && (
              <GlassPanel className="p-6">
                <DownloadResult
                  status={status}
                  downloadLink={downloadLink}
                  error={error}
                  elapsed={elapsed}
                  taskId={taskId}
                  onReset={handleReset}
                />
              </GlassPanel>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Terminal log */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <TerminalLog logs={logs} status={status} />

            {/* Status info */}
            <div className="mt-4 p-4 glass rounded-xl space-y-3">
              <p className="text-xs font-mono text-white/25 uppercase tracking-widest">System Info</p>
              <div className="space-y-2">
                {[
                  { label: 'Engine', value: 'v2.1.0' },
                  { label: 'Cluster', value: 'render-prod' },
                  { label: 'Format', value: `${format} ${format === 'video' ? quality : 'best'}` },
                  { label: 'Status', value: status, highlight: true },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs font-mono text-white/25">{label}</span>
                    <span className={`text-xs font-mono ${highlight ? 'text-emerald-400' : 'text-white/50'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
