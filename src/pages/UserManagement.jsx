import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import { api } from '../lib/api'
import { ROLES } from '../utils/constants'

const emptyForm = { name: '', email: '', pin: '', role: ROLES.MEMBER }

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  async function refresh() {
    try {
      const res = await api.listUsers()
      setUsers(res.users)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !/^\d{4}$/.test(form.pin)) {
      setError('Name, email, and a 4-digit PIN are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await api.addUser({ ...form, email: form.email.trim().toLowerCase() })
      setForm(emptyForm)
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleRoleChange(user, role) {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role } : u)))
    try {
      await api.updateUser({ ...user, role })
    } catch (err) {
      setError(err.message)
      refresh()
    }
  }

  async function handleRemove(user) {
    if (!confirm(`Remove ${user.name}? Their assigned tasks will stay, but unassigned.`)) return
    try {
      await api.removeUser(user.id)
      await refresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex-1">
      <TopBar title="Manage Users" />
      <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_320px]">
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-4 text-muted" colSpan={4}>
                    Loading…
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        className="rounded-lg border border-border bg-card px-2 py-1 text-xs"
                      >
                        <option value={ROLES.ADMIN}>Admin</option>
                        <option value={ROLES.TEAM_LEAD}>Team Lead</option>
                        <option value={ROLES.MEMBER}>Member</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleRemove(u)}
                        className="text-xs font-medium text-status-overdue hover:underline"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="h-fit rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-sm font-semibold">Add a team member</h2>
          <form onSubmit={handleAdd} className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent"
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent"
            />
            <input
              type="text"
              placeholder="4-digit PIN"
              inputMode="numeric"
              maxLength={4}
              value={form.pin}
              onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value }))}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent"
            />
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent"
            >
              <option value={ROLES.MEMBER}>Member</option>
              <option value={ROLES.TEAM_LEAD}>Team Lead</option>
              <option value={ROLES.ADMIN}>Admin</option>
            </select>
            {error && <p className="text-sm text-status-overdue">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-accent py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60"
            >
              {saving ? 'Adding…' : 'Add User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
