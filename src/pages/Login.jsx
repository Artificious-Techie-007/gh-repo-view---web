import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email.trim().toLowerCase(), pin.trim())
      navigate('/')
    } catch (err) {
      setError(err.message || 'Could not sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        <div className="mb-6 flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-display text-lg font-semibold">Pace</span>
        </div>
        <h1 className="font-display text-xl font-semibold">Sign in</h1>
        <p className="mt-1 text-sm text-muted">Track and assign work for your team.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent"
              placeholder="you@team.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-muted">PIN</label>
            <input
              type="password"
              required
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent"
              placeholder="4-digit PIN"
            />
          </div>

          {error && <p className="text-sm text-status-overdue">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-xs text-muted">
          No account? Ask your admin to add you from Manage Users — they'll give you a PIN.
        </p>
      </div>
    </div>
  )
}
