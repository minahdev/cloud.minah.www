"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import { Megaphone, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getLoggedInUserId } from "@/lib/auth-session"
import { canManageNotices } from "@/lib/pace-admin"
import { addNotice, deleteNotice, loadNotices, type Notice } from "@/lib/pace-notices-storage"

type NoticeUi = {
  submitting: boolean
  error: string | null
  notices: Notice[] | null
}

function formatNoticeDate(iso: string) {
  try {
    return format(parseISO(iso), "yyyy.MM.dd HH:mm", { locale: ko })
  } catch {
    return iso
  }
}

export default function NoticesPage() {
  const [ui, setUi] = useState<NoticeUi>({
    submitting: false,
    error: null,
    notices: null,
  })
  const [formKey, setFormKey] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)

  const refresh = () => {
    setUi((prev) => ({ ...prev, notices: loadNotices() }))
    setIsAdmin(canManageNotices())
  }

  useEffect(() => {
    refresh()
    window.addEventListener("focus", refresh)
    return () => window.removeEventListener("focus", refresh)
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const authorId = getLoggedInUserId()
    if (!authorId || !canManageNotices()) {
      setUi((prev) => ({
        ...prev,
        error: "공지 등록은 관리자 계정으로 로그인한 뒤 이용할 수 있습니다.",
      }))
      return
    }

    setUi((prev) => ({ ...prev, submitting: true, error: null }))
    const formData = new FormData(e.currentTarget)
    const title = String(formData.get("title") ?? "").trim()
    const body = String(formData.get("body") ?? "").trim()

    if (!title) {
      setUi((prev) => ({
        ...prev,
        submitting: false,
        error: "제목을 입력해 주세요.",
      }))
      return
    }
    if (!body) {
      setUi((prev) => ({
        ...prev,
        submitting: false,
        error: "내용을 입력해 주세요.",
      }))
      return
    }

    addNotice(authorId, title, body)
    refresh()
    setFormKey((k) => k + 1)
    setUi((prev) => ({ ...prev, submitting: false, error: null }))
  }

  const handleDelete = (id: string) => {
    if (!canManageNotices()) return
    if (!window.confirm("이 공지를 삭제할까요?")) return
    deleteNotice(id)
    refresh()
  }

  return (
    <div className="pb-16 pt-28 md:pt-32">
      <div className="container mx-auto max-w-3xl px-6">
        <header className="mb-8">
          <p className="text-sm font-medium text-primary">Notices</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            공지사항
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pace 앱 업데이트, 점검, 이벤트 안내를 확인하세요.
          </p>
        </header>

        {isAdmin ? (
          <Card className="mb-8 border-primary/30 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Megaphone className="h-4 w-4 text-primary" aria-hidden />
                관리자 — 공지 등록
              </CardTitle>
              <CardDescription>
                로그인 아이디 <span className="font-medium text-foreground">{getLoggedInUserId()}</span>
                으로 등록됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="notice-title">제목</Label>
                  <Input
                    id="notice-title"
                    name="title"
                    placeholder="예: 5월 서버 점검 안내"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notice-body">내용</Label>
                  <Textarea
                    id="notice-body"
                    name="body"
                    placeholder="공지 내용을 입력하세요."
                    rows={5}
                    className="resize-y leading-relaxed"
                    required
                  />
                </div>
                {ui.error ? (
                  <p className="text-sm text-destructive" role="alert">
                    {ui.error}
                  </p>
                ) : null}
                <Button type="submit" disabled={ui.submitting}>
                  {ui.submitting ? "등록 중…" : "공지 등록"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8 border-border/80 bg-secondary/20">
            <CardContent className="py-4 text-sm text-muted-foreground">
              공지 등록은 관리자 전용입니다. 회원가입에서{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                관리자 가입
              </Link>
              후 로그인해 주세요.
            </CardContent>
          </Card>
        )}

        <h2 className="mb-4 text-lg font-semibold text-foreground">전체 공지</h2>

        {ui.notices === null ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-border/60 bg-secondary/40"
                aria-hidden
              />
            ))}
          </div>
        ) : ui.notices.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            등록된 공지가 없습니다.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {ui.notices.map((notice) => (
              <li key={notice.id}>
                <Card className="border-border/80 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base leading-snug">{notice.title}</CardTitle>
                      {isAdmin ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          aria-label="공지 삭제"
                          onClick={() => handleDelete(notice.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                    <CardDescription>
                      {formatNoticeDate(notice.createdAt)} · {notice.authorId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {notice.body}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
