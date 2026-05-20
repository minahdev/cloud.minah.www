"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, type FormEvent, useState } from "react"

import { setLoggedInUser } from "@/lib/auth-session"

const inputClass =
  "w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"

type LoginUiState = {
  submitting: boolean
  error: string | null
}

const initialUiState: LoginUiState = {
  submitting: false,
  error: null,
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, setState] = useState<LoginUiState>(initialUiState)

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState((prev) => ({ ...prev, error: null, submitting: true }))

    const formData = new FormData(e.currentTarget)
    const entries = Object.fromEntries(formData.entries())
    const formProps = {
      userId: String(entries.userId ?? "").trim(),
      password: String(entries.password ?? ""),
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formProps),
      })
      const json = (await res.json()) as {
        message?: string
        userId?: string
        role?: string
        error?: string
      }

      if (!res.ok) {
        setState((prev) => ({
          ...prev,
          submitting: false,
          error: json.error ?? "로그인에 실패했습니다.",
        }))
        return
      }

      setLoggedInUser(
        json.userId ?? formProps.userId,
        json.role === "admin" ? "admin" : "user",
      )
      const from = searchParams.get("from")
      router.push(from?.startsWith("/") ? from : "/")
    } catch {
      setState((prev) => ({
        ...prev,
        submitting: false,
        error: "서버에 연결할 수 없습니다. 백엔드(uvicorn) 실행 여부를 확인하세요.",
      }))
    }
  }

  const { submitting, error } = state

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label htmlFor="login-user-id" className="block text-sm font-medium text-foreground mb-2">
            아이디
          </label>
          <input
            type="text"
            id="login-user-id"
            name="userId"
            autoComplete="username"
            required
            disabled={submitting}
            className={inputClass}
            placeholder="pace_user"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <label htmlFor="login-password" className="block text-sm font-medium text-foreground">
              비밀번호
            </label>
            <Link
              href="#"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
              tabIndex={-1}
            >
              비밀번호 찾기
            </Link>
          </div>
          <input
            type="password"
            id="login-password"
            name="password"
            autoComplete="current-password"
            required
            disabled={submitting}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {submitting ? "로그인 중…" : "로그인"}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-primary font-medium hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
      <div className="h-10 rounded-xl bg-secondary mb-4" />
      <div className="h-10 rounded-xl bg-secondary mb-4" />
      <div className="h-12 rounded-xl bg-secondary" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="pt-28 md:pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">로그인</h1>
          <p className="text-muted-foreground">계정으로 Pace에 접속하세요</p>
        </div>

        <Suspense fallback={<LoginFallback />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
