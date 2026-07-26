import { useState } from 'react'
import { STATUS } from '../utils/constants'

export default function TaskModal({ task, members, onClose, onSave }) {
  const [form, setForm] = useState(
    task || {
      name: '',
      assignedTo: members[0]?.id || '',
      deadline: '',
      status: STATUS.NOT_STARTED,
      progress: 0,
    },
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.assignedTo || !form.deadline) {
      setError('Task name, assignee, and deadline are all required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave(form)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg">
        <h2 className="font-display text-lg font-semibold">
          {task ? 'Edit Task' : 'New Task'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted">Task Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">Assigned To</label>
            <select
              value={form.assignedTo}
              onChange={(e) => update('assignedTo', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted">Deadline</label>
            <input
              type="date"
              value={form.deadline?.slice(0, 10) || ''}
              onChange={(e) => update('deadline', e.target.value)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm focus:border-accent"
            />
          </div>

          {error && <p className="text-sm text-status-overdue">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted hover:bg-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
