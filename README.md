# Pace — Team Productivity Tracker

A minimal productivity tracker for small-to-medium teams. Team leads assign
tasks, members update progress with a slider, everyone sees live project
progress on a dashboard.

**No Firebase, no Supabase, no database to provision.** The "backend" is a
Google Sheet plus a small Apps Script, fronted by one Vercel serverless
function so the Sheet's credentials never reach the browser.

```
Browser (React)  →  /api/sheets (Vercel function)  →  Apps Script Web App  →  Google Sheet
```

---

## 1. Create the Google Sheet

1. Create a new Google Sheet. Name it whatever you like (e.g. "Pace Data").
2. Create two tabs, named exactly `Users` and `Tasks`, with these headers in row 1:

   **Users**: `id | name | email | pin | role`
   **Tasks**: `id | name | assignedTo | deadline | status | progress`

3. Add yourself as the first admin row in `Users` manually, e.g.:
   `u1 | Fortune | you@team.com | 1234 | admin`
   (`role` must be one of `admin`, `team_lead`, `member`.)

4. Copy the Sheet ID from its URL:
   `https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

## 2. Deploy the Apps Script backend

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete the placeholder code and paste in the contents of `apps-script/Code.gs`.
3. Replace `YOUR_SPREADSHEET_ID` with the Sheet ID from step 1.
4. Replace `YOUR_SHARED_SECRET` with a long random string you make up — this
   is a private password between Vercel and Apps Script, not something
   users ever see. (e.g. run `openssl rand -hex 24` locally, or just mash
   the keyboard for 30+ characters.)
5. Click **Deploy → New deployment**. Type: **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   *(this sounds open, but nothing works without the shared secret, which
   only your Vercel function knows)*
6. Copy the deployment's **Web app URL** — you'll need it next.

## 3. Configure environment variables

Set these in your Vercel project (**Settings → Environment Variables**),
or in a local `.env` file for `vercel dev` (never commit it):

```
APPS_SCRIPT_URL=<the Web app URL from step 2.6>
APPS_SCRIPT_SECRET=<the same shared secret from step 2.4>
```

## 4. Run locally

```bash
npm install
npx vercel dev     # serves /api functions on :3000
npm run dev         # in a second terminal — Vite on :5173, proxies /api to :3000
```

Visit `http://localhost:5173` and sign in with the admin row you added to
the `Users` tab.

## 5. Deploy

```bash
npx vercel --prod
```

Vercel will build the React app and deploy `/api/sheets.js` as a
serverless function automatically — no separate backend hosting needed.

---

## How the pieces fit together

- **Frontend** — React + Tailwind (Vite). Pages: Dashboard, Task
  Management (leads/admin), My Tasks (members), Manage Users (admin).
- **Auth** — deliberately simple: an email + 4-digit PIN checked against
  the `Users` tab, not a full identity provider. Good enough for an
  internal team of ~100, with zero third-party setup. Session is kept in
  `localStorage`.
- **Roles** — `admin`, `team_lead`, `member`, enforced both in the route
  guards (`RequireRole` in `App.jsx`) and — more importantly — in what the
  Apps Script backend allows each action to do. Add stricter server-side
  checks in `Code.gs` if you need role enforcement to be airtight (right
  now it trusts the client to send the right action; fine for a trusted
  internal tool, not fine for a public product).
- **Overdue status** is computed on the fly from `deadline` vs. today,
  never stored — so it's always correct without a scheduled job.
- **Progress** is quantized to 0/25/50/75/100 in both the slider and the
  data model, and hitting 100% auto-sets status to Completed.

## Extending it

- Swap the PIN auth for something stronger (e.g. magic links) without
  touching the Sheet schema — just change `handleLogin` in `Code.gs` and
  `login()` in `AuthContext.jsx`.
- If the team outgrows Sheets (rule of thumb: sluggish past a few thousand
  task rows), the `api/sheets.js` proxy is the only place that needs to
  change to point at a real database instead.
