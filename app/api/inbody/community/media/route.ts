const backendBase = (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "")

function err(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") return fallback
  const d = data as { detail?: string; error?: string }
  return d.detail || d.error || fallback
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const res = await fetch(`${backendBase}/inbody/community/media`, {
    method: "POST",
    body: formData,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return Response.json({ error: err(data, "업로드 실패") }, { status: res.status })
  return Response.json(data)
}
