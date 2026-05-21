/** 오늘의 이야기 · 감정 기록 (localStorage, 날짜별) */

export const PACE_TODAY_STORY_KEY = "pace-today-story"

export type MoodTag =
  | "활기참"
  | "평온"
  | "피곤"
  | "무기력"
  | "스트레스"
  | "불안"
  | "우울"
  | "짜증"

export type TodayStoryEntry = {
  date: string
  mood: MoodTag | null
  story: string
  recommendation: string | null
  updatedAt: string
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

function loadAll(): Record<string, TodayStoryEntry> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(PACE_TODAY_STORY_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, TodayStoryEntry>)
      : {}
  } catch {
    return {}
  }
}

export function loadTodayStory(): TodayStoryEntry | null {
  const entry = loadAll()[todayKey()]
  return entry ?? null
}

export function saveTodayStory(
  story: string,
  mood: MoodTag | null,
  recommendation?: string | null,
): TodayStoryEntry {
  const all = loadAll()
  const date = todayKey()
  const prev = all[date]
  const entry: TodayStoryEntry = {
    date,
    mood,
    story: story.trim(),
    recommendation: recommendation ?? prev?.recommendation ?? null,
    updatedAt: new Date().toISOString(),
  }
  all[date] = entry
  localStorage.setItem(PACE_TODAY_STORY_KEY, JSON.stringify(all))
  return entry
}

export const MOOD_OPTIONS: MoodTag[] = [
  "활기참",
  "평온",
  "피곤",
  "무기력",
  "스트레스",
  "불안",
  "우울",
  "짜증",
]
