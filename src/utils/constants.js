// Progress is quantized to five steps — this mirrors the data model,
// not just the UI, so the slider can never produce an "in-between" value.
export const PROGRESS_STEPS = [0, 25, 50, 75, 100]

export const ROLES = {
  ADMIN: 'admin',
  TEAM_LEAD: 'team_lead',
  MEMBER: 'member',
}

export const STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue',
}

// Tailwind class pairs (text/bg) per status, kept in one place so the
// palette only has to be changed here if the brand shifts.
export const STATUS_STYLES = {
  [STATUS.COMPLETED]: { text: 'text-status-completed', bg: 'bg-status-completedBg' },
  [STATUS.IN_PROGRESS]: { text: 'text-status-progress', bg: 'bg-status-progressBg' },
  [STATUS.NOT_STARTED]: { text: 'text-status-notstarted', bg: 'bg-status-notstartedBg' },
  [STATUS.OVERDUE]: { text: 'text-status-overdue', bg: 'bg-status-overdueBg' },
}

/**
 * Derives the *displayed* status of a task: a task is shown as Overdue
 * whenever its deadline has passed and it isn't complete, regardless of
 * what's stored, so the sheet never has to be kept in sync by a cron job.
 * @param {{status: string, deadline: string}} task
 */
export function deriveStatus(task) {
  if (task.status === STATUS.COMPLETED) return STATUS.COMPLETED
  const deadline = new Date(task.deadline)
  const isPast = !Number.isNaN(deadline.getTime()) && deadline < new Date(new Date().toDateString())
  if (isPast) return STATUS.OVERDUE
  return task.status || STATUS.NOT_STARTED
}
