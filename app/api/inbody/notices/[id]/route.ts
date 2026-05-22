const backendBase = (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "")

function err(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") return fallback
  const d = data as { detail?: string; error?: string }
  return d.detail || d.error || fallback
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params
  const userId = new URL(req.url).searchParams.get("userId")?.trim()
  if (!userId) return Response.json({ error: "userId가 필요합니다." }, { status: 400 })
  const q = new URLSearchParams({ userId })
  const res = await fetch(`${backendBase}/inbody/notices/${encodeURIComponent(id)}?${q}`, {
    method: "DELETE",
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) return Response.json({ error: err(data, "삭제 실패") }, { status: res.status })
  return Response.json(data)
}
