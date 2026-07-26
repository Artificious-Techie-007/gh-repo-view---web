import { useEffect, useState } from 'react'
import TopBar from '../components/TopBar'
import TaskCard from '../components/TaskCard'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function MyTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const res = await api.listTasks()
      setTasks(res.tasks.filter((t) => t.assignedTo === user.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleProgressChange(task, progress, status) {
    // Optimistic update so the slider feels instant on mobile.
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, progress, status } : t)))
    try {
      await api.updateTask({ ...task, progress, status })
    } catch (err) {
      setError(err.message)
      refresh()
    }
  }

  return (
    <div className="flex-1">
      <TopBar title="My Tasks" />
      <div className="p-6 md:p-8">
        {error && <p className="mb-4 text-sm text-status-overdue">{error}</p>}
        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : tasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted">
            Nothing assigned to you yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onProgressChange={handleProgressChange} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
