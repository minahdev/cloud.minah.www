import { NextResponse } from "next/server"

const backendBase = (process.env.BACKEND_URL ?? "http://localhost:8000").replace(/\/$/, "")

function err(data: unknown, fallback: string) {
  if (!data || typeof data !== "object") return fallback
  const d = data as { detail?: string; error?: string }
  if (typeof d.error === "string" && d.error.trim()) return d.error
  if (typeof d.detail === "string") return d.detail
  return fallback
}

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const res = await fetch(`${backendBase}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json({ error: err(data, "Gemini 요청 실패") }, { status: res.status })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      {
        error:
          "백엔드에 연결할 수 없습니다. FastAPI(uvicorn)가 실행 중인지, backend/.env 에 GEMINI_API_KEY가 있는지 확인하세요.",
      },
      { status: 503 },
    )
  }
}
