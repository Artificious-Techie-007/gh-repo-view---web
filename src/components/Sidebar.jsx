import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/constants'
import logo from '../assets/logo.png'
import Avatar from './Avatar'

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

  const brandBlock = (
    <div className="flex items-center gap-2.5">
      <img src={logo} alt="Lead City Voices" className="h-9 w-9 flex-shrink-0" />
      <div className="min-w-0">
        <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted">
          Lead City Voices
        </p>
        <p className="font-display text-lg font-semibold leading-tight tracking-tight">Pulse</p>
      </div>
    </div>
  )

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
          sits directly below it — never below the full menu. Kept compact:
          no tagline here, just enough to identify the app and open the menu. */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Lead City Voices" className="h-7 w-7" />
          <span className="font-display text-lg font-semibold tracking-tight">Pulse</span>
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
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            {brandBlock}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="rounded-lg border border-border p-2 text-muted md:hidden"
            >
              ✕
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">Operating System for the Merlins ⚡</p>
        </div>

        {navLinks}

        <div className="border-t border-border px-6 py-4">
          <div className="mb-3 flex items-center gap-2.5">
            <Avatar name={user?.name} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs capitalize text-muted">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
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
