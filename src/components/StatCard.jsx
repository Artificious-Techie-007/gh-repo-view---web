export default function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p
        className={`mt-2 font-mono text-3xl font-medium ${accent || 'text-ink'}`}
      >
        {value}
      </p>
    </div>
  )
}
