import { useState, useEffect, useCallback } from 'react'
import { keyApi } from '../services/api'

export function useApiKey() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('nexus_apikey') || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const generate = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await keyApi.generate()
      const key = res.data?.api_key || res.data?.key || res.data?.token || Object.values(res.data)[0]
      if (key) {
        localStorage.setItem('nexus_apikey', key)
        setApiKey(key)
        return { success: true, key }
      }
      throw new Error('No key returned from server')
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Key generation failed'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const revoke = useCallback(() => {
    localStorage.removeItem('nexus_apikey')
    setApiKey(null)
    setRevealed(false)
  }, [])

  const toggleReveal = useCallback(() => setRevealed((r) => !r), [])

  const copyKey = useCallback(async () => {
    if (!apiKey) return false
    try {
      await navigator.clipboard.writeText(apiKey)
      return true
    } catch {
      return false
    }
  }, [apiKey])

  const maskedKey = apiKey
    ? apiKey.slice(0, 8) + '••••••••••••••••••••' + apiKey.slice(-4)
    : null

  return { apiKey, maskedKey, loading, error, revealed, generate, revoke, toggleReveal, copyKey }
}
