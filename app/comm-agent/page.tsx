"use client"

import { type FormEvent, useState } from "react"
import { Mail, Send, Sparkles } from "lucide-react"

const inputClass =
  "w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"

type SendResult = {
  success: boolean
  to: string
  subject: string
  message: string
}

export default function CommAgentPage() {
  const [email, setEmail] = useState("")
  const [topic, setTopic] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SendResult | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)

    const trimmedEmail = email.trim()
    const trimmedTopic = topic.trim()
    if (!trimmedEmail || !trimmedTopic) {
      setError("이메일과 주제를 모두 입력하세요.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/comm-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, topic: trimmedTopic }),
      })
      const data: unknown = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg =
          data && typeof data === "object" && "error" in data
            ? String((data as { error?: string }).error)
            : "메일 발송에 실패했습니다."
        setError(msg)
        return
      }

      setResult(data as SendResult)
      setTopic("")
    } catch {
      setError("요청 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col pb-16 pt-28 md:pt-32">
      <div className="container mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col px-6">
        <header className="mb-6 shrink-0 text-center md:text-left">
          <p className="text-sm font-medium text-primary">Comm Agent</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            AI 이메일 발송
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            받는 사람과 주제만 입력하면 AI가 본문을 작성해 메일을 보냅니다.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              받는 사람 이메일
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="someone@example.com"
                className={`${inputClass} pl-9`}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="topic" className="text-sm font-medium text-foreground">
              주제
            </label>
            <textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="예: 다음 주 팀 회식 안내"
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : null}

          {result ? (
            <div className="rounded-xl border border-border bg-secondary px-4 py-3 text-sm">
              <p className="font-medium text-foreground">{result.message}</p>
              <p className="mt-1 text-muted-foreground">
                받는 사람: {result.to}
              </p>
              <p className="text-muted-foreground">제목: {result.subject}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="size-4" aria-hidden />
            {submitting ? "발송 중…" : "AI로 작성해서 발송"}
          </button>
        </form>

        <p className="mt-4 shrink-0 text-center text-xs text-muted-foreground md:text-left">
          <Sparkles className="mr-1 inline size-3.5 text-primary" aria-hidden />
          본문은 AI가 자동 생성하며, 발송 전 검토할 수 없습니다.
        </p>
      </div>
    </div>
  )
}
