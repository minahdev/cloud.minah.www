"use client"

import { FormEvent, useState } from "react"
import { LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getLoggedInUserId } from "@/lib/auth-session"
import {
  setScheduleUnlocked,
  verifyScheduleAccessPassword,
} from "@/lib/pace-schedule-access"

type ScheduleGateProps = {
  onUnlocked: () => void
}

export function ScheduleGate({ onUnlocked }: ScheduleGateProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const userId = getLoggedInUserId()
    if (!userId) {
      setError("로그인이 필요합니다.")
      setLoading(false)
      return
    }
    try {
      await verifyScheduleAccessPassword(userId, password)
      setScheduleUnlocked()
      onUnlocked()
    } catch (err) {
      setError(err instanceof Error ? err.message : "접근 암호 확인에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto max-w-md border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <LockKeyhole className="h-5 w-5 text-primary" aria-hidden />
          스케줄 접근
        </CardTitle>
        <CardDescription>
          코치가 설정한 접근 암호를 입력하면 레슨 스케줄을 이용할 수 있습니다. 한 번 맞게 입력하면
          코치 스케줄 회원 목록에도 표시됩니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schedule-access-password">접근 암호</Label>
            <Input
              id="schedule-access-password"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="코치에게 안내받은 암호"
              required
            />
          </div>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "확인 중…" : "입장"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
