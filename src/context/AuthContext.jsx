import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case 'LOGOUT':
      return { ...initialState, isLoading: false }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'INIT_EMPTY':
      return { ...state, isLoading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Session restoration on mount
  useEffect(() => {
    const token = localStorage.getItem('nexus_token')
    const userRaw = localStorage.getItem('nexus_user')
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw)
        dispatch({ type: 'INIT', payload: { user, token } })
      } catch {
        localStorage.removeItem('nexus_token')
        localStorage.removeItem('nexus_user')
        dispatch({ type: 'INIT_EMPTY' })
      }
    } else {
      dispatch({ type: 'INIT_EMPTY' })
    }
  }, [])

  // Listen for unauthorized events
  useEffect(() => {
    const handler = () => logout()
    window.addEventListener('nexus:unauthorized', handler)
    return () => window.removeEventListener('nexus:unauthorized', handler)
  }, [])

  const login = useCallback(async (username, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })
    try {
      const res = await authApi.login({ username, password })
      const { token, user_id } = res.data
      const user = { id: user_id, username }
      localStorage.setItem('nexus_token', token)
      localStorage.setItem('nexus_user', JSON.stringify(user))
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } })
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.detail
        || err.response?.data?.non_field_errors?.[0]
        || 'Authentication failed. Verify credentials.'
      dispatch({ type: 'SET_ERROR', payload: msg })
      return { success: false, error: msg }
    }
  }, [])

  const register = useCallback(async (username, email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })
    try {
      const res = await authApi.register({ username, email, password })
      const { token, user_id } = res.data
      const user = { id: user_id, username, email }
      localStorage.setItem('nexus_token', token)
      localStorage.setItem('nexus_user', JSON.stringify(user))
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } })
      return { success: true }
    } catch (err) {
      const data = err.response?.data
      const msg = data?.username?.[0]
        || data?.email?.[0]
        || data?.password?.[0]
        || data?.detail
        || 'Registration failed. Try again.'
      dispatch({ type: 'SET_ERROR', payload: msg })
      return { success: false, error: msg }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('nexus_token')
    localStorage.removeItem('nexus_user')
    localStorage.removeItem('nexus_apikey')
    dispatch({ type: 'LOGOUT' })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
