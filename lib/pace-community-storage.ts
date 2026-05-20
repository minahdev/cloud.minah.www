/** 커뮤니티 운동 게시물 (브라우저 localStorage) */

export const PACE_COMMUNITY_POSTS_KEY = "pace-community-posts"

export type CommunityPost = {
  id: string
  authorId: string
  workoutType: string
  content: string
  createdAt: string
}

const SEED_POSTS: CommunityPost[] = [
  {
    id: "seed-1",
    authorId: "pace_runner",
    workoutType: "러닝",
    content: "한강 5km 뛰었어요. 페이스 6:10, 컨디션 좋았습니다!",
    createdAt: "2026-05-19T07:30:00.000Z",
  },
  {
    id: "seed-2",
    authorId: "gym_lover",
    workoutType: "헬스",
    content: "오늘은 등·이두 위주. 데드리프트 80kg 3세트 완료.",
    createdAt: "2026-05-18T12:15:00.000Z",
  },
  {
    id: "seed-3",
    authorId: "cycle_pace",
    workoutType: "사이클",
    content: "주말 그룹 라이드 42km. 평균 속도 24km/h.",
    createdAt: "2026-05-17T09:00:00.000Z",
  },
]

function isCommunityPost(row: unknown): row is CommunityPost {
  if (row === null || typeof row !== "object") return false
  const o = row as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    typeof o.authorId === "string" &&
    typeof o.workoutType === "string" &&
    typeof o.content === "string" &&
    typeof o.createdAt === "string"
  )
}

export function loadCommunityPosts(): CommunityPost[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(PACE_COMMUNITY_POSTS_KEY)
    if (!raw) {
      localStorage.setItem(PACE_COMMUNITY_POSTS_KEY, JSON.stringify(SEED_POSTS))
      return [...SEED_POSTS]
    }
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    const posts = parsed.filter(isCommunityPost)
    return posts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  } catch {
    return []
  }
}

export function addCommunityPost(
  authorId: string,
  fields: { workoutType: string; content: string },
): CommunityPost {
  const post: CommunityPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    authorId: authorId.trim() || "익명",
    workoutType: fields.workoutType.trim() || "기타",
    content: fields.content.trim(),
    createdAt: new Date().toISOString(),
  }
  const existing = loadCommunityPosts()
  const all = [post, ...existing]
  localStorage.setItem(PACE_COMMUNITY_POSTS_KEY, JSON.stringify(all))
  return post
}

export const WORKOUT_TYPE_OPTIONS = ["러닝", "헬스", "사이클", "수영", "요가·필라테스", "기타"] as const
