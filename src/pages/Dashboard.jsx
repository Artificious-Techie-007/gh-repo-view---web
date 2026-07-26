import { useEffect, useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'
import { api } from '../lib/api'
import { deriveStatus, STATUS } from '../utils/constants'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .listTasks()
      .then((res) => setTasks(res.tasks))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // Members only see their own tasks reflected in dashboard stats;
  // leads and admins see the whole project.
  const visibleTasks = useMemo(
    () => (user.role === 'member' ? tasks.filter((t) => t.assignedTo === user.id) : tasks),
    [tasks, user],
  )

  const stats = useMemo(() => {
    const withStatus = visibleTasks.map((t) => ({ ...t, derivedStatus: deriveStatus(t) }))
    const total = withStatus.length
    const completed = withStatus.filter((t) => t.derivedStatus === STATUS.COMPLETED).length
    const overdue = withStatus.filter((t) => t.derivedStatus === STATUS.OVERDUE).length
    const pending = total - completed
    const overall = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, pending, overdue, overall }
  }, [visibleTasks])

  if (loading) {
    return (
      <div className="flex-1">
        <TopBar title="Dashboard" />
        <p className="p-8 text-sm text-muted">Loading…</p>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <TopBar title="Dashboard" />
      {error && <p className="mx-6 mt-4 text-sm text-status-overdue md:mx-8">{error}</p>}

      <div className="space-y-6 p-6 md:p-8">
        <div className="rounded-xl border border-border bg-card p-6">
          <ProgressBar value={stats.overall} label="Overall Project Progress" size="lg" />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Total Tasks" value={stats.total} />
          <StatCard label="Completed" value={stats.completed} accent="text-status-completed" />
          <StatCard label="Pending" value={stats.pending} accent="text-status-progress" />
          <StatCard label="Overdue" value={stats.overdue} accent="text-status-overdue" />
        </div>
      </div>
    </div>
  )
}
