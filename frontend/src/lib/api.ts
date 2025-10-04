const API_BASE = process.env.NEXT_PUBLIC_API_URL!

export async function fetchEmails() {
  const res = await fetch(`${API_BASE}/emails`); return res.json()
}

export async function fetchDashboardStats() {
  const res = await fetch(`${API_BASE}/dashboard/stats`); return res.json()
}

export async function uploadCatalog(form: FormData) {
  const res = await fetch(`${API_BASE}/catalog/upload`, { method: 'POST', body: form }); return res.json()
}

export async function fetchNotifications() {
  const res = await fetch(`${API_BASE}/notifications`); return res.json()
}

export async function fetchSettings() {
  const res = await fetch(`${API_BASE}/settings`); return res.json()
}

export async function saveSettings(data:any) {
  const res = await fetch(`${API_BASE}/settings`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) }); return res.json()
}

export async function fetchProfile() {
  const res = await fetch(`${API_BASE}/profile`); return res.json()
}

export async function saveProfile(data:any) {
  const res = await fetch(`${API_BASE}/profile`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)}); return res.json()
}
