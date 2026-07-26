import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'pace_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  async function login(email, pin) {
    const result = await api.login(email, pin)
    if (!result.ok) throw new Error(result.message || 'Invalid email or PIN')
    setUser(result.user)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result.user))
    return result.user
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
