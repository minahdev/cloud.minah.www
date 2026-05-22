const backendBase = (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "")

function err(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") return fallback
  const d = data as { detail?: string; error?: string }
  return d.detail || d.error || fallback
}

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId")?.trim()
  const date = new URL(req.url).searchParams.get("date")
  if (!userId) return Response.json({ error: "userId가 필요합니다." }, { status: 400 })
  const q = new URLSearchParams({ userId })
  if (date) q.set("date", date)
  const res = await fetch(`${backendBase}/inbody/today-story?${q}`, { cache: "no-store" })
  const data = await res.json().catch(() => null)
  if (!res.ok) return Response.json({ error: err(data, "조회 실패") }, { status: res.status })
  return Response.json(data)
}

export async function PUT(req: Request) {
  const body = await req.json()
  const res = await fetch(`${backendBase}/inbody/today-story`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return Response.json({ error: err(data, "저장 실패") }, { status: res.status })
  return Response.json(data)
}
