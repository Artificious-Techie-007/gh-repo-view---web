import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/constants'

const LINK_BASE =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: 'Dashboard', icon: '◧' },
    { to: '/tasks', label: 'Task Management', icon: '☰', roles: [ROLES.ADMIN, ROLES.TEAM_LEAD] },
    { to: '/my-tasks', label: 'My Tasks', icon: '◎' },
    { to: '/users', label: 'Manage Users', icon: '◍', roles: [ROLES.ADMIN] },
  ]

  const visibleLinks = links.filter((l) => !l.roles || l.roles.includes(user?.role))

  const navLinks = (
    <nav className="flex-1 space-y-1 px-3">
      {visibleLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/'}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `${LINK_BASE} ${
              isActive ? 'bg-accent-light text-accent-dark' : 'text-muted hover:bg-surface'
            }`
          }
        >
          <span aria-hidden="true">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <>
      {/* Slim bar, mobile only. Stays in normal document flow so the dashboard
          sits directly below it — never below the full menu. */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="font-display text-lg font-semibold tracking-tight">Pace</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-lg border border-border p-2 text-muted"
        >
          ☰
        </button>
      </div>

      {/* Backdrop, mobile only, shown while the menu is open. Tap to close. */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Desktop (md+): normal sidebar, always visible, in flow, unchanged.
          Mobile: fixed overlay drawer, off-canvas until the menu button is tapped. */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-shrink-0 flex-col border-r border-border bg-card transition-transform duration-200 md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="font-display text-lg font-semibold tracking-tight">Pace</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg border border-border p-2 text-muted md:hidden"
          >
            ✕
          </button>
        </div>

        {navLinks}

        <div className="border-t border-border px-6 py-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="mb-3 text-xs capitalize text-muted">{user?.role?.replace('_', ' ')}</p>
          <button
            onClick={logout}
            className="text-xs font-medium text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
