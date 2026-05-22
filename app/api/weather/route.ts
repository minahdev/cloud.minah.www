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
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const city = searchParams.get("city")

  const qs = new URLSearchParams()
  if (lat != null && lon != null) {
    qs.set("lat", lat)
    qs.set("lon", lon)
  } else if (city?.trim()) {
    qs.set("city", city.trim())
  } else {
    return Response.json(
      { error: "lat·lon 또는 city 쿼리가 필요합니다." },
      { status: 400 },
    )
  }

  try {
    const res = await fetch(`${backendBase}/weather?${qs.toString()}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    })
    const data: unknown = await res.json().catch(() => ({}))

    if (!res.ok) {
      return Response.json(
        { error: errorFromFastAPI(data, "날씨 조회에 실패했습니다.") },
        { status: res.status },
      )
    }

    return Response.json(data)
  } catch (e: unknown) {
    const timedOut =
      e instanceof Error &&
      (e.name === "TimeoutError" || e.name === "AbortError" || e.message.includes("timeout"))
    return Response.json(
      {
        error: timedOut
          ? "날씨 서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요."
          : "백엔드에 연결할 수 없습니다. FastAPI(uvicorn)가 실행 중인지 확인하세요.",
      },
      { status: timedOut ? 504 : 503 },
    )
  }
}
