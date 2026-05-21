/** 브라우저 localStorage — 레슨 일정·기록 (추후 Neon API 연동 예정) */

export const PACE_SCHEDULE_KEY = "pace-lesson-schedule"

export type LessonMedia = {
  id: string
  type: "image" | "video"
  name: string
  mimeType: string
  dataUrl: string
}

export type LessonRecord = {
  text: string
  media: LessonMedia[]
  updatedAt: string
}

export type LessonEntry = {
  id: string
  date: string
  title: string
  time: string
  /** 코치·회원 메모 (일정) */
  scheduleNote: string
  record: LessonRecord | null
  createdAt: string
  /** 회원 userId — 코치 탭·회원 본인 스케줄 구분 */
  memberUserId?: string
}

export function scheduleDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function parseLessons(raw: string | null): LessonEntry[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x): x is LessonEntry =>
        x !== null &&
        typeof x === "object" &&
        typeof (x as LessonEntry).id === "string" &&
        typeof (x as LessonEntry).date === "string",
    )
  } catch {
    return []
  }
}

function loadAllLessons(): LessonEntry[] {
  if (typeof window === "undefined") return []
  return parseLessons(localStorage.getItem(PACE_SCHEDULE_KEY))
}

function saveAllLessons(lessons: LessonEntry[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PACE_SCHEDULE_KEY, JSON.stringify(lessons))
}

/** 회원 본인 스케줄 열람 시, 예전 공용 저장분을 해당 회원 소유로 한 번 이관 */
function claimLegacyLessonsForMember(memberUserId: string): void {
  const all = loadAllLessons()
  const hasOrphans = all.some((l) => !l.memberUserId)
  if (!hasOrphans) return
  const onlyOrphans = all.every((l) => !l.memberUserId)
  if (!onlyOrphans) return
  saveAllLessons(all.map((l) => ({ ...l, memberUserId })))
}

function lessonBelongsToMember(lesson: LessonEntry, memberUserId: string): boolean {
  return lesson.memberUserId === memberUserId
}

export function loadLessons(memberUserId: string): LessonEntry[] {
  claimLegacyLessonsForMember(memberUserId)
  return loadAllLessons().filter((l) => lessonBelongsToMember(l, memberUserId))
}

export function upsertLesson(entry: LessonEntry, memberUserId: string): void {
  const list = loadAllLessons()
  const withMember: LessonEntry = { ...entry, memberUserId }
  const idx = list.findIndex((l) => l.id === withMember.id)
  if (idx >= 0) list[idx] = withMember
  else list.push(withMember)
  saveAllLessons(list)
}

export function deleteLesson(id: string, memberUserId: string): void {
  const list = loadAllLessons()
  saveAllLessons(
    list.filter((l) => !(l.id === id && lessonBelongsToMember(l, memberUserId))),
  )
}

export function lessonsForDate(lessons: LessonEntry[], dateKey: string): LessonEntry[] {
  return lessons
    .filter((l) => l.date === dateKey)
    .sort((a, b) => a.time.localeCompare(b.time) || a.title.localeCompare(b.title))
}

export function datesWithLessons(lessons: LessonEntry[]): Date[] {
  const keys = new Set(lessons.map((l) => l.date))
  return [...keys].map((k) => {
    const [y, m, d] = k.split("-").map(Number)
    return new Date(y, m - 1, d)
  })
}

export function emptyLessonRecord(): LessonRecord {
  return { text: "", media: [], updatedAt: new Date().toISOString() }
}
