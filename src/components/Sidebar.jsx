import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/constants'

const LINK_BASE =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors'

export default function Sidebar() {
  const { user, logout } = useAuth()

  const links = [
    { to: '/', label: 'Dashboard', icon: '◧' },
    { to: '/tasks', label: 'Task Management', icon: '☰', roles: [ROLES.ADMIN, ROLES.TEAM_LEAD] },
    { to: '/my-tasks', label: 'My Tasks', icon: '◎' },
    { to: '/users', label: 'Manage Users', icon: '◍', roles: [ROLES.ADMIN] },
  ]

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="h-2.5 w-2.5 rounded-full bg-accent" />
        <span className="font-display text-lg font-semibold tracking-tight">Pace</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links
          .filter((l) => !l.roles || l.roles.includes(user?.role))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
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
  )
}
