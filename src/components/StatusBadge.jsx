import { STATUS_STYLES } from '../utils/constants'

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES['Not Started']
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${style.text} ${style.bg}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
