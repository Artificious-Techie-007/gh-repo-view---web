import { useEffect, useMemo, useState } from 'react'
import TopBar from '../components/TopBar'
import TaskTable from '../components/TaskTable'
import TaskModal from '../components/TaskModal'
import { api } from '../lib/api'
import { deriveStatus } from '../utils/constants'

export default function TaskManagement() {
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [assigneeFilter, setAssigneeFilter] = useState('All')
  const [sortByDeadline, setSortByDeadline] = useState('asc')

  const [modalTask, setModalTask] = useState(null) // null = closed, {} = new, {...} = edit
  const [error2, setError2] = useState('')

  async function refresh() {
    setLoading(true)
    try {
      const [taskRes, userRes] = await Promise.all([api.listTasks(), api.listUsers()])
      setTasks(taskRes.tasks)
      setMembers(userRes.users)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const filtered = useMemo(() => {
    let list = tasks.map((t) => ({
      ...t,
      derivedStatus: deriveStatus(t),
      assignedToName: members.find((m) => m.id === t.assignedTo)?.name || 'Unassigned',
    }))

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((t) => t.name.toLowerCase().includes(q))
    }
    if (statusFilter !== 'All') {
      list = list.filter((t) => t.derivedStatus === statusFilter)
    }
    if (assigneeFilter !== 'All') {
      list = list.filter((t) => t.assignedTo === assigneeFilter)
    }
    list.sort((a, b) => {
      const diff = new Date(a.deadline) - new Date(b.deadline)
      return sortByDeadline === 'asc' ? diff : -diff
    })
    return list
  }, [tasks, members, search, statusFilter, assigneeFilter, sortByDeadline])

  async function handleSave(form) {
    if (form.id) {
      await api.updateTask(form)
    } else {
      await api.addTask(form)
    }
    setModalTask(null)
    await refresh()
  }

  async function handleDelete(task) {
    if (!confirm(`Delete "${task.name}"? This can't be undone.`)) return
    setError2('')
    try {
      await api.removeTask(task.id)
      await refresh()
    } catch (err) {
      setError2(err.message)
    }
  }

  return (
    <div className="flex-1">
      <TopBar title="Task Management">
        <button
          onClick={() => setModalTask({})}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
        >
          + New Task
        </button>
      </TopBar>

      <div className="p-6 md:p-8">
        <div className="mb-4 flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search tasks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-accent"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-accent"
          >
            {['All', 'Not Started', 'In Progress', 'Completed', 'Overdue'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-accent"
          >
            <option value="All">All Members</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortByDeadline((s) => (s === 'asc' ? 'desc' : 'asc'))}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted hover:bg-surface"
          >
            Deadline {sortByDeadline === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {error && <p className="mb-4 text-sm text-status-overdue">{error}</p>}
        {error2 && <p className="mb-4 text-sm text-status-overdue">{error2}</p>}

        {loading ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : (
          <TaskTable
            tasks={filtered}
            canManage
            onEdit={(task) => setModalTask(task)}
            onDelete={handleDelete}
          />
        )}
      </div>

      {modalTask !== null && (
        <TaskModal
          task={modalTask.id ? modalTask : null}
          members={members}
          onClose={() => setModalTask(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
