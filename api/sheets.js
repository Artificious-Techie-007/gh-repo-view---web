// Vercel serverless function — the ONLY place the Apps Script web app URL
// is known. The browser never sees it. Set APPS_SCRIPT_URL and
// APPS_SCRIPT_SECRET as environment variables in the Vercel project
// settings (see README).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL
  const secret = process.env.APPS_SCRIPT_SECRET

  if (!scriptUrl) {
    res.status(500).json({ message: 'Server misconfigured: APPS_SCRIPT_URL is not set.' })
    return
  }

  try {
    const upstream = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // The shared secret is attached here, server-side, so a browser
      // inspecting network traffic never sees it either.
      body: JSON.stringify({ ...req.body, secret }),
      redirect: 'follow',
    })

    const text = await upstream.text()
    let data
    try {
      data = JSON.parse(text)
    } catch {
      res.status(502).json({ message: 'Unexpected response from the backend.' })
      return
    }

    if (!upstream.ok || data.error) {
      res.status(data.status || 400).json({ message: data.error || 'Request failed.' })
      return
    }

    res.status(200).json(data)
  } catch (err) {
    res.status(502).json({ message: 'Could not reach the backend. Try again shortly.' })
  }
}
