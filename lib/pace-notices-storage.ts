/** 앱 공지사항 (localStorage) */

export const PACE_NOTICES_KEY = "pace-notices"

export type Notice = {
  id: string
  title: string
  body: string
  authorId: string
  createdAt: string
}

const SEED_NOTICES: Notice[] = [
  {
    id: "notice-welcome",
    title: "Pace에 오신 것을 환영합니다",
    body: "훈련·분석·커뮤니티·칼로리 검색·공지 기능을 이용해 보세요. 문의는 마이페이지 정보를 참고해 주세요.",
    authorId: "pace_admin",
    createdAt: "2026-05-15T09:00:00.000Z",
  },
]

function isNotice(row: unknown): row is Notice {
  if (row === null || typeof row !== "object") return false
  const o = row as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.title === "string" &&
    typeof o.body === "string" &&
    typeof o.authorId === "string" &&
    typeof o.createdAt === "string"
  )
}

export function loadNotices(): Notice[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(PACE_NOTICES_KEY)
    if (!raw) {
      localStorage.setItem(PACE_NOTICES_KEY, JSON.stringify(SEED_NOTICES))
      return [...SEED_NOTICES]
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter(isNotice)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch {
    return []
  }
}

export function addNotice(authorId: string, title: string, body: string): Notice {
  const notice: Notice = {
    id: `notice-${Date.now()}`,
    title: title.trim(),
    body: body.trim(),
    authorId,
    createdAt: new Date().toISOString(),
  }
  const rest = loadNotices()
  rest.unshift(notice)
  localStorage.setItem(PACE_NOTICES_KEY, JSON.stringify(rest))
  return notice
}

export function deleteNotice(id: string): void {
  const rest = loadNotices().filter((n) => n.id !== id)
  localStorage.setItem(PACE_NOTICES_KEY, JSON.stringify(rest))
}
