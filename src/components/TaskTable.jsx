import StatusBadge from './StatusBadge'
import ProgressBar from './ProgressBar'
import Avatar from './Avatar'
import { deriveStatus } from '../utils/constants'

/**
 * Read/write table for team leads and admins. Members use TaskCard in
 * MyTasks instead — kept separate because their permissions differ
 * enough (no edit/delete) that sharing one component would mean
 * threading permission checks through every cell.
 */
export default function TaskTable({ tasks, onEdit, onDelete, canManage }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted">
        No tasks match the current filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-border bg-surface text-xs uppercase tracking-wide text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Task Name</th>
            <th className="px-4 py-3 font-medium">Assigned To</th>
            <th className="px-4 py-3 font-medium">Deadline</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Progress</th>
            {canManage && <th className="px-4 py-3 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const status = deriveStatus(task)
            return (
              <tr key={task.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{task.name}</td>
                <td className="px-4 py-3 text-muted">
                  <div className="flex items-center gap-2">
                    <Avatar name={task.assignedToName} size="sm" />
                    {task.assignedToName}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Date(task.deadline).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={status} />
                </td>
                <td className="px-4 py-3">
                  <div className="w-32">
                    <ProgressBar value={task.progress} />
                  </div>
                </td>
                {canManage && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onEdit(task)}
                      className="mr-3 text-xs font-medium text-accent hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(task)}
                      className="text-xs font-medium text-status-overdue hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
