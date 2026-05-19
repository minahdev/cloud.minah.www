const backendBase = (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "")

type LoginBody = {
  userId?: string
  password?: string
}

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

export async function POST(req: Request) {
  let body: LoginBody
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const userId = body.userId?.trim()
  const password = body.password ?? ""

  if (!userId || !password) {
    return Response.json({ error: "아이디와 비밀번호를 입력하세요." }, { status: 400 })
  }

  try {
    const res = await fetch(`${backendBase}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    })

    const data: unknown = await res.json().catch(() => ({}))

    if (!res.ok) {
      return Response.json(
        { error: errorFromFastAPI(data, "로그인에 실패했습니다.") },
        { status: res.status },
      )
    }

    return Response.json(data)
  } catch (e) {
    console.error("[login proxy]", e)
    return Response.json(
      {
        error: "백엔드에 연결할 수 없습니다. FastAPI(uvicorn)가 실행 중인지 확인하세요.",
      },
      { status: 503 },
    )
  }
}
