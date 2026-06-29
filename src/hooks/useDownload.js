import { useState, useRef, useCallback, useEffect } from 'react'
import { downloadApi } from '../services/api'

const POLL_INTERVAL = 3000

export function useDownload() {
  const [state, setState] = useState({
    status: 'idle', // idle | submitting | pending | success | failed
    taskId: null,
    downloadLink: null,
    error: null,
    logs: [],
    elapsed: 0,
  })

  const pollRef = useRef(null)
  const startTimeRef = useRef(null)
  const elapsedRef = useRef(null)

  const addLog = useCallback((msg, type = 'info') => {
    setState((s) => ({
      ...s,
      logs: [...s.logs, { msg, type, ts: Date.now() }],
    }))
  }, [])

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
    if (elapsedRef.current) {
      clearInterval(elapsedRef.current)
      elapsedRef.current = null
    }
  }, [])

  const startElapsedTimer = useCallback(() => {
    startTimeRef.current = Date.now()
    elapsedRef.current = setInterval(() => {
      setState((s) => ({
        ...s,
        elapsed: Math.floor((Date.now() - startTimeRef.current) / 1000),
      }))
    }, 1000)
  }, [])

  const pollStatus = useCallback(async (id) => {
    try {
      const res = await downloadApi.status(id)
      const data = res.data
      const statusRaw = (data?.status || '').toLowerCase()

      if (statusRaw === 'success' || statusRaw === 'completed' || statusRaw === 'done') {
        stopPolling()
        const link = data?.download_link || data?.url || data?.file_url || data?.link
        addLog('▶ Extraction complete. Media ready for download.', 'success')
        setState((s) => ({
          ...s,
          status: 'success',
          downloadLink: link,
        }))
      } else if (statusRaw === 'failed' || statusRaw === 'error') {
        stopPolling()
        const errMsg = data?.error || data?.message || 'Extraction pipeline failed.'
        addLog(`✗ ${errMsg}`, 'error')
        setState((s) => ({
          ...s,
          status: 'failed',
          error: errMsg,
        }))
      } else {
        addLog(`◈ Task ${statusRaw || 'pending'} — awaiting pipeline...`, 'pending')
      }
    } catch (err) {
      if (err.response?.status === 404) {
        addLog('◈ Task queued — initializing pipeline...', 'pending')
      } else {
        addLog(`⚠ Poll error: ${err.message}`, 'warn')
      }
    }
  }, [stopPolling, addLog])

  const submit = useCallback(async (link, formatType, quality, apiKey) => {
    setState({
      status: 'submitting',
      taskId: null,
      downloadLink: null,
      error: null,
      logs: [],
      elapsed: 0,
    })

    addLog('◈ Initializing extraction engine...', 'info')
    addLog(`◈ Target: ${link}`, 'info')
    addLog(`◈ Format: ${formatType} ${quality ? `| Quality: ${quality}` : ''}`, 'info')

    try {
      const payload = { link, format_type: formatType }
      if (quality) payload.quality = quality

      addLog('◈ Submitting to processing cluster...', 'info')
      const res = await downloadApi.start(payload, apiKey)

      const id = res.data?.id || res.data?.task_id || res.data?.job_id
      if (!id) throw new Error('No task ID returned from server')

      addLog(`◈ Task registered [ID: ${id}]`, 'info')
      addLog('◈ Monitoring extraction pipeline...', 'info')

      setState((s) => ({ ...s, status: 'pending', taskId: id }))
      startElapsedTimer()

      // Start polling
      pollRef.current = setInterval(() => pollStatus(id), POLL_INTERVAL)
      // Immediate first poll
      pollStatus(id)

      return { success: true, id }
    } catch (err) {
      const msg = err.response?.data?.detail
        || err.response?.data?.error
        || err.message
        || 'Submission failed'
      addLog(`✗ ${msg}`, 'error')
      setState((s) => ({ ...s, status: 'failed', error: msg }))
      return { success: false, error: msg }
    }
  }, [addLog, pollStatus, startElapsedTimer])

  const reset = useCallback(() => {
    stopPolling()
    setState({
      status: 'idle',
      taskId: null,
      downloadLink: null,
      error: null,
      logs: [],
      elapsed: 0,
    })
  }, [stopPolling])

  useEffect(() => () => stopPolling(), [stopPolling])

  return { ...state, submit, reset }
}
