import React, { createContext, useContext, useReducer, useCallback } from 'react'

const NotifContext = createContext(null)

let idCounter = 0

function notifReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload]
    case 'REMOVE':
      return state.filter((n) => n.id !== action.payload)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function NotifProvider({ children }) {
  const [notifs, dispatch] = useReducer(notifReducer, [])

  const notify = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++idCounter
    dispatch({ type: 'ADD', payload: { id, message, type, duration } })
    if (duration > 0) {
      setTimeout(() => dispatch({ type: 'REMOVE', payload: id }), duration)
    }
    return id
  }, [])

  const dismiss = useCallback((id) => {
    dispatch({ type: 'REMOVE', payload: id })
  }, [])

  const success = useCallback((msg, dur) => notify(msg, 'success', dur), [notify])
  const error = useCallback((msg, dur) => notify(msg, 'error', dur), [notify])
  const warn = useCallback((msg, dur) => notify(msg, 'warn', dur), [notify])
  const info = useCallback((msg, dur) => notify(msg, 'info', dur), [notify])

  return (
    <NotifContext.Provider value={{ notifs, notify, dismiss, success, error, warn, info }}>
      {children}
    </NotifContext.Provider>
  )
}

export function useNotif() {
  const ctx = useContext(NotifContext)
  if (!ctx) throw new Error('useNotif must be used within NotifProvider')
  return ctx
}
