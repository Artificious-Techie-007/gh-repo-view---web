import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import TaskManagement from './pages/TaskManagement'
import MyTasks from './pages/MyTasks'
import UserManagement from './pages/UserManagement'
import { ROLES } from './utils/constants'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RequireRole({ roles, children }) {
  const { user } = useAuth()
  if (!roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function Shell({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {children}
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Shell>
              <Dashboard />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/tasks"
        element={
          <RequireAuth>
            <RequireRole roles={[ROLES.ADMIN, ROLES.TEAM_LEAD]}>
              <Shell>
                <TaskManagement />
              </Shell>
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/my-tasks"
        element={
          <RequireAuth>
            <Shell>
              <MyTasks />
            </Shell>
          </RequireAuth>
        }
      />
      <Route
        path="/users"
        element={
          <RequireAuth>
            <RequireRole roles={[ROLES.ADMIN]}>
              <Shell>
                <UserManagement />
              </Shell>
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
