export const maxDuration = 60

const backendBase = (process.env.BACKEND_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "")

type ChatMessage = { role: "user" | "model"; text: string }

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
  let body: { messages?: ChatMessage[] }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const messages = body.messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages가 필요합니다." }, { status: 400 })
  }

  try {
    const res = await fetch(`${backendBase}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    })

    const data: unknown = await res.json().catch(() => ({}))

    if (!res.ok) {
      return Response.json(
        { error: errorFromFastAPI(data, "요청에 실패했습니다.") },
        { status: res.status },
      )
    }

    const text = (data as { text?: string }).text
    if (!text?.trim()) {
      return Response.json({ error: "응답이 비어 있습니다." }, { status: 502 })
    }

    return Response.json({ text: text.trim() })
  } catch (e) {
    console.error("[chat proxy]", e)
    return Response.json(
      {
        error:
          "백엔드에 연결할 수 없습니다. FastAPI(uvicorn)가 실행 중인지 확인하세요.",
      },
      { status: 503 },
    )
  }
}
