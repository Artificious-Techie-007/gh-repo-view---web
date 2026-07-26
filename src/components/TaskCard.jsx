import StatusBadge from './StatusBadge'
import ProgressSlider from './ProgressSlider'
import { deriveStatus, STATUS } from '../utils/constants'

export default function TaskCard({ task, onProgressChange }) {
  const status = deriveStatus(task)

  function handleChange(value) {
    const nextStatus = value === 100 ? STATUS.COMPLETED : STATUS.IN_PROGRESS
    onProgressChange(task, value, value === 0 ? STATUS.NOT_STARTED : nextStatus)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-medium">{task.name}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="mt-1 text-sm text-muted">
        Due{' '}
        {new Date(task.deadline).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })}
      </p>
      <div className="mt-4">
        <ProgressSlider
          value={task.progress}
          onChange={handleChange}
          disabled={status === STATUS.COMPLETED}
        />
      </div>
    </div>
  )
}
