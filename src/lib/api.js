// Every request goes through /api/sheets — a Vercel serverless function —
// never directly to Google. The Apps Script URL and Sheet ID stay server-side.
// This keeps the whole backend to "one URL and one JSON contract" instead of
// a real database + auth provider, while still being a real shared backend.

const BASE = '/api/sheets'

async function call(action, payload = {}) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Request failed (${res.status})`)
  }
  return res.json()
}

export const api = {
  // Auth: sheet-based, not a full identity provider — a user row is
  // matched by email + PIN. Good enough for a small internal team,
  // and there's no third-party auth setup required.
  login: (email, pin) => call('login', { email, pin }),

  listUsers: () => call('listUsers'),
  addUser: (user) => call('addUser', { user }),
  updateUser: (user) => call('updateUser', { user }),
  removeUser: (id) => call('removeUser', { id }),

  listTasks: () => call('listTasks'),
  addTask: (task) => call('addTask', { task }),
  updateTask: (task) => call('updateTask', { task }),
  removeTask: (id) => call('removeTask', { id }),
}
