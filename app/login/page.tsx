"use client"

import Link from "next/link"
import { FormEvent } from "react"

export default function LoginPage() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  return (
    <div className="pt-28 md:pt-32 pb-16">
      <div className="container mx-auto px-6 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">로그인</h1>
          <p className="text-muted-foreground">계정으로 Pace에 접속하세요</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-foreground mb-2">
                이메일
              </label>
              <input
                type="email"
                id="login-email"
                name="email"
                autoComplete="email"
                required
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="example@pace.dev"
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
                className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              로그인
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
