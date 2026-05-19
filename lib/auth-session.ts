export const PACE_USER_ID_KEY = "pace-user-id"

export function getLoggedInUserId(): string | null {
  if (typeof window === "undefined") return null
  const id = localStorage.getItem(PACE_USER_ID_KEY)?.trim()
  return id || null
}

export function setLoggedInUserId(userId: string): void {
  localStorage.setItem(PACE_USER_ID_KEY, userId.trim())
}

export function clearLoggedInUserId(): void {
  localStorage.removeItem(PACE_USER_ID_KEY)
}
