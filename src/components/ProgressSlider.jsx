import { PROGRESS_STEPS } from '../utils/constants'

/**
 * A slider that can only land on 0/25/50/75/100 — uses a native range
 * input stepped to the index of PROGRESS_STEPS so it snaps cleanly on
 * touch devices instead of relying on custom drag math.
 */
export default function ProgressSlider({ value, onChange, disabled }) {
  const index = PROGRESS_STEPS.indexOf(value)

  return (
    <div className="w-full">
      <input
        type="range"
        min={0}
        max={PROGRESS_STEPS.length - 1}
        step={1}
        value={index === -1 ? 0 : index}
        disabled={disabled}
        onChange={(e) => onChange(PROGRESS_STEPS[Number(e.target.value)])}
        className="w-full accent-accent disabled:opacity-50"
        aria-label="Task progress"
      />
      <div className="mt-1 flex justify-between font-mono text-[11px] text-muted">
        {PROGRESS_STEPS.map((step) => (
          <span key={step}>{step}%</span>
        ))}
      </div>
    </div>
  )
}
