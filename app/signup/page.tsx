"use client"

import { FormEvent, useState } from "react"

const inputClass =
  "w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"

export default function SignupPage() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const data = new FormData(form)
    const userId = String(data.get("userId") ?? "").trim()
    const password = String(data.get("password") ?? "")
    const email = String(data.get("email") ?? "").trim()
    const nickname = String(data.get("nickname") ?? "").trim()

    setSubmitting(true)
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password, email, nickname }),
      })
      const json = (await res.json()) as {
        message?: string
        userId?: string
        email?: string
        nickname?: string
        error?: string
      }

      if (!res.ok) {
        setError(json.error ?? "회원가입에 실패했습니다.")
        return
      }

      alert(
        `${json.message ?? "회원가입 요청이 접수되었습니다."}\n\n` +
          `아이디: ${json.userId ?? userId}\n` +
          `이메일: ${json.email ?? email}\n` +
          `닉네임: ${json.nickname ?? nickname}`,
      )
      form.reset()
    } catch {
      setError("서버에 연결할 수 없습니다. 백엔드(uvicorn) 실행 여부를 확인하세요.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-28 md:pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">회원가입</h1>
          <p className="text-muted-foreground">Pace와 함께 헬스케어의 미래를 만들어가세요</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="signup-user-id" className="block text-sm font-medium text-foreground mb-2">
                아이디
              </label>
              <input
                type="text"
                id="signup-user-id"
                name="userId"
                autoComplete="username"
                required
                disabled={submitting}
                className={inputClass}
                placeholder="pace_user"
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-foreground mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="signup-password"
                name="password"
                autoComplete="new-password"
                required
                disabled={submitting}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-foreground mb-2">
                이메일
              </label>
              <input
                type="email"
                id="signup-email"
                name="email"
                autoComplete="email"
                required
                disabled={submitting}
                className={inputClass}
                placeholder="example@pace.dev"
              />
            </div>

            <div>
              <label htmlFor="signup-nickname" className="block text-sm font-medium text-foreground mb-2">
                닉네임
              </label>
              <input
                type="text"
                id="signup-nickname"
                name="nickname"
                autoComplete="nickname"
                required
                disabled={submitting}
                className={inputClass}
                placeholder="민아"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {submitting ? "처리 중…" : "가입하기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
