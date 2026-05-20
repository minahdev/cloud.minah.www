/** 브라우저에 저장되는 일일 훈련 로그 (분석 탭 차트용) */

export const PACE_TRAIN_LOGS_KEY = "pace-train-daily-logs"

export type TrainDailyLog = {
  date: string
  muscles: string[]
  /** 오늘 한 운동 — 자유 서술 */
  workout: string
  weightKg: number | null
  diet: {
    breakfast: string
    lunch: string
    dinner: string
    snack: string
    waterMl: number | null
    supplements: string
  }
  memo: string
  exerciseMinutes: number | null
}

export function trainLogTodayKey(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function normalizeWorkout(raw: unknown): string {
  if (typeof raw === "string") return raw
  if (raw === null || typeof raw !== "object") return ""
  const w = raw as Record<string, unknown>
  const parts: string[] = []
  if (typeof w.title === "string" && w.title.trim()) parts.push(w.title.trim())
  const detail: string[] = []
  if (w.sets != null && w.reps != null) detail.push(`${w.sets}세트 × ${w.reps}회`)
  else if (w.sets != null) detail.push(`${w.sets}세트`)
  else if (w.reps != null) detail.push(`${w.reps}회`)
  if (w.weightKg != null) detail.push(`${w.weightKg}kg`)
  if (w.distanceKm != null) detail.push(`${w.distanceKm}km`)
  if (w.durationMin != null) detail.push(`${w.durationMin}분`)
  if (w.intensity === "easy") detail.push("강도: 가볍게")
  if (w.intensity === "moderate") detail.push("강도: 보통")
  if (w.intensity === "hard") detail.push("강도: 강하게")
  if (detail.length) parts.push(detail.join(", "))
  if (typeof w.notes === "string" && w.notes.trim()) parts.push(w.notes.trim())
  return parts.join("\n")
}

function normalizeLog(row: unknown): TrainDailyLog | null {
  if (row === null || typeof row !== "object") return null
  const o = row as Record<string, unknown>
  const diet = o.diet as Record<string, unknown> | undefined
  if (typeof o.date !== "string") return null

  const muscles = Array.isArray(o.muscles)
    ? o.muscles.filter((m): m is string => typeof m === "string")
    : []

  return {
    date: o.date,
    muscles,
    workout: normalizeWorkout(o.workout),
    weightKg: o.weightKg === null || typeof o.weightKg === "number" ? (o.weightKg as number | null) : null,
    diet: {
      breakfast: typeof diet?.breakfast === "string" ? diet.breakfast : "",
      lunch: typeof diet?.lunch === "string" ? diet.lunch : "",
      dinner: typeof diet?.dinner === "string" ? diet.dinner : "",
      snack: typeof diet?.snack === "string" ? diet.snack : "",
      waterMl:
        diet?.waterMl === null || typeof diet?.waterMl === "number"
          ? (diet.waterMl as number | null)
          : null,
      supplements: typeof diet?.supplements === "string" ? diet.supplements : "",
    },
    memo: typeof o.memo === "string" ? o.memo : "",
    exerciseMinutes:
      o.exerciseMinutes === null || typeof o.exerciseMinutes === "number"
        ? (o.exerciseMinutes as number | null)
        : null,
  }
}

export function loadTrainLogs(): TrainDailyLog[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(PACE_TRAIN_LOGS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeLog).filter((l): l is TrainDailyLog => l !== null)
  } catch {
    return []
  }
}

export function getTodayTrainLog(): TrainDailyLog | null {
  const key = trainLogTodayKey()
  return loadTrainLogs().find((l) => l.date === key) ?? null
}

export function saveTodayTrainLog(fields: {
  muscles: string[]
  workout: string
  weightKg: number | null
  diet: TrainDailyLog["diet"]
  memo: string
  exerciseMinutes: number | null
}): void {
  if (typeof window === "undefined") return
  const date = trainLogTodayKey()
  const next: TrainDailyLog = {
    date,
    muscles: fields.muscles,
    workout: fields.workout,
    weightKg: fields.weightKg,
    diet: fields.diet,
    memo: fields.memo,
    exerciseMinutes: fields.exerciseMinutes,
  }
  const rest = loadTrainLogs().filter((l) => l.date !== date)
  rest.push(next)
  rest.sort((a, b) => a.date.localeCompare(b.date))
  localStorage.setItem(PACE_TRAIN_LOGS_KEY, JSON.stringify(rest))
}

export function hasWorkoutActivity(log: TrainDailyLog): boolean {
  return Boolean(log.workout.trim()) || log.muscles.length > 0
}
