import { PROGRESS_STEPS } from '../utils/constants'

/**
 * A progress bar with tick marks at each valid step (0/25/50/75/100).
 * The ticks aren't decoration — they show the exact values progress can
 * ever take in this app, since sliders are quantized to those five steps.
 */
export default function ProgressBar({ value, label, size = 'md' }) {
  const height = size === 'lg' ? 'h-3' : 'h-2'
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="text-muted">{label}</span>
          <span className="font-mono text-ink">{value}%</span>
        </div>
      )}
      <div className={`relative w-full ${height} rounded-full bg-accent-light`}>
        <div
          className={`${height} rounded-full bg-accent transition-[width]`}
          style={{ width: `${value}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-0.5">
          {PROGRESS_STEPS.map((step) => (
            <span
              key={step}
              className={`h-1.5 w-1.5 rounded-full ${
                value >= step ? 'bg-card' : 'bg-white/70'
              }`}
              style={{ opacity: step === 0 || step === 100 ? 0 : 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
