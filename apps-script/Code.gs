/**
 * Pace — Apps Script backend.
 *
 * Paste this into the Apps Script editor of a bound script on your Google
 * Sheet (Extensions > Apps Script), then deploy it as a Web App. See the
 * README for the full setup. This file is the entire "backend" — there is
 * no separate database, no Firebase project, nothing else to provision.
 *
 * Expected sheet tabs:
 *   Users: id | name | email | pin | role
 *   Tasks: id | name | assignedTo | deadline | status | progress
 */

const SHEET_ID = 'YOUR_SPREADSHEET_ID' // Replace with your actual Sheet ID
const SHARED_SECRET = 'YOUR_SHARED_SECRET' // Must match APPS_SCRIPT_SECRET in Vercel

function doPost(e) {
  let body
  try {
    body = JSON.parse(e.postData.contents)
  } catch (err) {
    return jsonOut({ error: 'Malformed request body.' }, 400)
  }

  if (body.secret !== SHARED_SECRET) {
    return jsonOut({ error: 'Unauthorized.' }, 401)
  }

  const ss = SpreadsheetApp.openById(SHEET_ID)
  const lock = LockService.getScriptLock()
  // Waiting for the lock up front avoids two simultaneous progress-slider
  // updates clobbering each other — the tradeoff Fortune's LCV system also
  // makes: a short wait per write beats a rare silent data loss.
  lock.waitLock(10000)

  try {
    switch (body.action) {
      case 'login':
        return jsonOut(handleLogin(ss, body))
      case 'listUsers':
        return jsonOut({ users: readUsers(ss).map(stripPin) })
      case 'addUser':
        return jsonOut(addUser(ss, body.user))
      case 'updateUser':
        return jsonOut(updateUser(ss, body.user))
      case 'removeUser':
        return jsonOut(removeRow(ss, 'Users', body.id))
      case 'listTasks':
        return jsonOut({ tasks: readTasks(ss) })
      case 'addTask':
        return jsonOut(addTask(ss, body.task))
      case 'updateTask':
        return jsonOut(updateTask(ss, body.task))
      case 'removeTask':
        return jsonOut(removeRow(ss, 'Tasks', body.id))
      default:
        return jsonOut({ error: 'Unknown action: ' + body.action }, 400)
    }
  } catch (err) {
    return jsonOut({ error: err.message }, 500)
  } finally {
    lock.releaseLock()
  }
}

// ---------- Auth ----------

function handleLogin(ss, body) {
  const user = readUsers(ss).find(
    (u) => u.email === (body.email || '').toLowerCase() && String(u.pin) === String(body.pin),
  )
  if (!user) return { ok: false, message: 'Invalid email or PIN.' }
  return { ok: true, user: stripPin(user) }
}

function stripPin(user) {
  const { pin, ...rest } = user
  return rest
}

// ---------- Users ----------

function readUsers(ss) {
  return readSheet(ss, 'Users')
}

function addUser(ss, user) {
  if (!user.name || !user.email || !/^\d{4}$/.test(String(user.pin))) {
    throw new Error('Name, email, and a 4-digit PIN are required.')
  }
  const sheet = ss.getSheetByName('Users')
  const id = Utilities.getUuid()
  sheet.appendRow([id, user.name, user.email.toLowerCase(), user.pin, user.role])
  return { ok: true, id }
}

function updateUser(ss, user) {
  const sheet = ss.getSheetByName('Users')
  const row = findRowById(sheet, user.id)
  if (!row) throw new Error('User not found.')
  const headers = ['id', 'name', 'email', 'pin', 'role']
  headers.forEach((key, i) => {
    if (user[key] !== undefined) sheet.getRange(row, i + 1).setValue(user[key])
  })
  return { ok: true }
}

// ---------- Tasks ----------

function readTasks(ss) {
  return readSheet(ss, 'Tasks').map((t) => ({ ...t, progress: Number(t.progress) || 0 }))
}

function addTask(ss, task) {
  if (!task.name || !task.assignedTo || !task.deadline) {
    throw new Error('Task name, assignee, and deadline are required.')
  }
  const sheet = ss.getSheetByName('Tasks')
  const id = Utilities.getUuid()
  sheet.appendRow([
    id,
    task.name,
    task.assignedTo,
    task.deadline,
    task.status || 'Not Started',
    task.progress || 0,
  ])
  return { ok: true, id }
}

function updateTask(ss, task) {
  const sheet = ss.getSheetByName('Tasks')
  const row = findRowById(sheet, task.id)
  if (!row) throw new Error('Task not found.')
  const headers = ['id', 'name', 'assignedTo', 'deadline', 'status', 'progress']
  headers.forEach((key, i) => {
    if (task[key] !== undefined) sheet.getRange(row, i + 1).setValue(task[key])
  })
  return { ok: true }
}

// ---------- Shared helpers ----------

function readSheet(ss, name) {
  const sheet = ss.getSheetByName(name)
  const [headers, ...rows] = sheet.getDataRange().getValues()
  return rows
    .filter((r) => r[0]) // skip blank trailing rows
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i]])))
}

function findRowById(sheet, id) {
  const ids = sheet.getRange(2, 1, sheet.getLastRow() - 1 || 1, 1).getValues().flat()
  const index = ids.indexOf(id)
  return index === -1 ? null : index + 2 // +2: header row + 1-indexing
}

function removeRow(ss, sheetName, id) {
  const sheet = ss.getSheetByName(sheetName)
  const row = findRowById(sheet, id)
  if (!row) throw new Error('Row not found.')
  sheet.deleteRow(row)
  return { ok: true }
}

function jsonOut(obj, status) {
  const output = ContentService.createTextOutput(JSON.stringify(obj))
  output.setMimeType(ContentService.MimeType.JSON)
  return output
}
