export default function TopBar({ title, children }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-6 py-4 md:px-8">
      <h1 className="font-display text-xl font-semibold">{title}</h1>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </header>
  )
}
