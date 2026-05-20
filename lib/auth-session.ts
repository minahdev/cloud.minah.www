export const PACE_USER_ID_KEY = "pace-user-id"
export const PACE_USER_ROLE_KEY = "pace-user-role"
export const AUTH_SESSION_EVENT = "pace-auth-change"

export function getLoggedInUserId(): string | null {
  if (typeof window === "undefined") return null
  const id = localStorage.getItem(PACE_USER_ID_KEY)?.trim()
  return id || null
}

export function getLoggedInUserRole(): string | null {
  if (typeof window === "undefined") return null
  const role = localStorage.getItem(PACE_USER_ROLE_KEY)?.trim()
  return role || null
}

function notifyAuthChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_SESSION_EVENT))
  }
}

export function setLoggedInUser(userId: string, role: string = "user"): void {
  localStorage.setItem(PACE_USER_ID_KEY, userId.trim())
  localStorage.setItem(PACE_USER_ROLE_KEY, role.trim() || "user")
  notifyAuthChange()
}

/** @deprecated setLoggedInUser 사용 */
export function setLoggedInUserId(userId: string): void {
  setLoggedInUser(userId, getLoggedInUserRole() ?? "user")
}

export function clearLoggedInUserId(): void {
  localStorage.removeItem(PACE_USER_ID_KEY)
  localStorage.removeItem(PACE_USER_ROLE_KEY)
  notifyAuthChange()
}
