"use client"

import { FormEvent, useState } from "react"
import { KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getLoggedInUserId } from "@/lib/auth-session"
import { setScheduleAccessPassword } from "@/lib/pace-schedule-access"

type ScheduleAccessSettingsProps = {
  configured: boolean
  onConfiguredChange: (configured: boolean) => void
  className?: string
}

export function ScheduleAccessSettings({
  configured,
  onConfiguredChange,
  className,
}: ScheduleAccessSettingsProps) {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaved(null)

    const userId = getLoggedInUserId()
    if (!userId) {
      setError("로그인이 필요합니다.")
      return
    }
    if (password.length < 4) {
      setError("접근 암호는 4자 이상으로 설정해 주세요.")
      return
    }
    if (password !== confirm) {
      setError("암호 확인이 일치하지 않습니다.")
      return
    }

    setLoading(true)
    try {
      await setScheduleAccessPassword(userId, password)
      setPassword("")
      setConfirm("")
      setSaved("회원용 접근 암호가 저장되었습니다.")
      onConfiguredChange(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      className={
        className ?? "mb-8 border-dashed border-primary/30 bg-secondary/20"
      }
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <KeyRound className="h-5 w-5 text-primary" aria-hidden />
          회원 접근 암호
        </CardTitle>
        <CardDescription>
          {configured
            ? "회원은 스케줄 입장 시 아래 암호를 입력해야 합니다. 암호를 바꾸면 입장 기록이 초기화되어 회원 탭이 비워지고, 회원은 다시 입력해야 합니다."
            : "아직 접근 암호가 없습니다. 설정 후 회원이 암호를 입력하면 회원 탭에 표시됩니다."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="coach-schedule-password">새 접근 암호</Label>
            <Input
              id="coach-schedule-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={4}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-1">
            <Label htmlFor="coach-schedule-password-confirm">암호 확인</Label>
            <Input
              id="coach-schedule-password-confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              minLength={4}
              required
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <Button type="submit" disabled={loading}>
              {loading ? "저장 중…" : configured ? "암호 변경" : "암호 설정"}
            </Button>
            {saved ? <p className="text-sm text-primary">{saved}</p> : null}
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
