"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { MessageSquarePlus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getLoggedInUserId } from "@/lib/auth-session"
import {
  WORKOUT_TYPE_OPTIONS,
  addCommunityPost,
  loadCommunityPosts,
  type CommunityPost,
} from "@/lib/pace-community-storage"

type CommunityUi = {
  submitting: boolean
  error: string | null
  posts: CommunityPost[] | null
}

function formatPostDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}

export default function CommunityPage() {
  const [ui, setUi] = useState<CommunityUi>({
    submitting: false,
    error: null,
    posts: null,
  })
  const [formKey, setFormKey] = useState(0)
  const loggedInId = getLoggedInUserId()

  const refreshPosts = () => {
    setUi((prev) => ({ ...prev, posts: loadCommunityPosts() }))
  }

  useEffect(() => {
    refreshPosts()
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUi((prev) => ({ ...prev, error: null, submitting: true }))

    const authorId = getLoggedInUserId()
    if (!authorId) {
      setUi((prev) => ({
        ...prev,
        submitting: false,
        error: "게시물을 올리려면 먼저 로그인해 주세요.",
      }))
      return
    }

    const formData = new FormData(e.currentTarget)
    const workoutType = String(formData.get("workoutType") ?? "").trim()
    const content = String(formData.get("content") ?? "").trim()

    if (!content) {
      setUi((prev) => ({
        ...prev,
        submitting: false,
        error: "운동 내용을 입력해 주세요.",
      }))
      return
    }

    if (content.length > 2000) {
      setUi((prev) => ({
        ...prev,
        submitting: false,
        error: "내용은 2000자 이하로 작성해 주세요.",
      }))
      return
    }

    addCommunityPost(authorId, { workoutType, content })
    refreshPosts()
    setFormKey((k) => k + 1)
    setUi((prev) => ({ ...prev, submitting: false, error: null }))
  }

  return (
    <div className="pb-16 pt-28 md:pt-32">
      <div className="container mx-auto max-w-3xl px-6">
        <header className="mb-8">
          <p className="text-sm font-medium text-primary">Community</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            운동 커뮤니티
          </h1>
          <p className="mt-2 text-muted-foreground">
            오늘 한 운동을 공유하고, 다른 사람들의 기록을 응어보세요.
          </p>
        </header>

        <Card className="mb-8 border-border/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquarePlus className="h-4 w-4 text-primary" aria-hidden />
              운동 기록 올리기
            </CardTitle>
            <CardDescription>
              {loggedInId ? (
                <>
                  <span className="font-medium text-foreground">{loggedInId}</span> 님으로
                  게시합니다.
                </>
              ) : (
                <>
                  로그인한 뒤 게시할 수 있습니다.{" "}
                  <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                    로그인
                  </Link>
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="workoutType">운동 종류</Label>
                <select
                  id="workoutType"
                  name="workoutType"
                  defaultValue="러닝"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {WORKOUT_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="content">내용</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="오늘의 운동, 거리, 느낀 점 등을 적어 주세요."
                  rows={4}
                  className="resize-none"
                  required
                />
              </div>
              {ui.error ? (
                <p className="text-sm text-destructive" role="alert">
                  {ui.error}
                </p>
              ) : null}
              <Button type="submit" disabled={ui.submitting || !loggedInId}>
                {ui.submitting ? "올리는 중…" : "게시하기"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" aria-hidden />
          <h2 className="text-lg font-semibold text-foreground">피드</h2>
          {ui.posts ? (
            <span className="text-sm text-muted-foreground">({ui.posts.length}개)</span>
          ) : null}
        </div>

        {ui.posts === null ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-xl border border-border/60 bg-secondary/40"
                aria-hidden
              />
            ))}
          </div>
        ) : ui.posts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            아직 게시물이 없습니다. 첫 운동 기록을 올려 보세요.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {ui.posts.map((post) => (
              <li key={post.id}>
                <Card className="border-border/80 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <CardTitle className="text-sm font-semibold text-foreground">
                        {post.authorId}
                      </CardTitle>
                      <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {post.workoutType}
                      </span>
                    </div>
                    <CardDescription>{formatPostDate(post.createdAt)}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                      {post.content}
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
