const PALETTE = [
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-teal-100 text-teal-700',
  'bg-emerald-100 text-emerald-700',
  'bg-cyan-100 text-cyan-700',
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-orange-100 text-orange-700',
]

const SIZES = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
}

function initialsFor(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function colorFor(name) {
  const hash = (name || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return PALETTE[hash % PALETTE.length]
}

/** Colored initials circle, derived from a name — no image storage needed. */
export default function Avatar({ name, size = 'md' }) {
  return (
    <span
      title={name}
      className={`inline-flex flex-shrink-0 items-center justify-center rounded-full font-semibold ${colorFor(
        name,
      )} ${SIZES[size] || SIZES.md}`}
    >
      {initialsFor(name)}
    </span>
  )
}
