const backendBase = (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "")

function errorFromFastAPI(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback
  const b = body as { error?: string; detail?: string | { msg?: string }[] }
  if (typeof b.error === "string" && b.error.trim()) return b.error
  if (typeof b.detail === "string") return b.detail
  if (Array.isArray(b.detail)) {
    return b.detail.map((d) => d?.msg ?? "").filter(Boolean).join(", ") || fallback
  }
  return fallback
}

export async function GET(req: Request) {
  const userId = new URL(req.url).searchParams.get("userId")?.trim()
  if (!userId) {
    return Response.json({ error: "userId가 필요합니다." }, { status: 400 })
  }

  try {
    const res = await fetch(
      `${backendBase}/mypage/profile?userId=${encodeURIComponent(userId)}`,
      { cache: "no-store" },
    )
    const body = await res.json()
    if (!res.ok) {
      return Response.json(
        { error: errorFromFastAPI(body, "프로필을 불러오지 못했습니다.") },
        { status: res.status },
      )
    }
    return Response.json(body)
  } catch {
    return Response.json({ error: "백엔드에 연결할 수 없습니다." }, { status: 502 })
  }
}

export async function PUT(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  try {
    const res = await fetch(`${backendBase}/mypage/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      return Response.json(
        { error: errorFromFastAPI(data, "프로필 저장에 실패했습니다.") },
        { status: res.status },
      )
    }
    return Response.json(data)
  } catch {
    return Response.json({ error: "백엔드에 연결할 수 없습니다." }, { status: 502 })
  }
}
