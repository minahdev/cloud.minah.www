"use client"

import { FormEvent, useCallback, useEffect, useState } from "react"
import { Heart, Loader2, Sparkles } from "lucide-react"

import { ChatMessageContent } from "@/components/chat-message-content"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  loadTodayStory,
  MOOD_OPTIONS,
  saveTodayStory,
  type MoodTag,
} from "@/lib/pace-today-story-storage"
import { PeriodLines } from "@/components/period-lines"
import { cn } from "@/lib/utils"

const STORY_DESCRIPTION_LINES = [
  "오늘의 감정과 하루를 적어 주세요.",
  "AI가 분석해 맞춤 운동을 추천합니다.",
]

function buildRecommendationPrompt(story: string, mood: MoodTag | null): string {
  const moodLine = mood ? `선택한 오늘의 감정: ${mood}\n` : ""
  return `${moodLine}오늘 하루 이야기:
${story.trim()}

---
당신은 헬스·러닝·사이클 전문 AI 코치 PACE입니다.
위 내용을 바탕으로 사용자의 감정과 컨디션을 파악한 뒤, 다음 형식으로 짧고 실용적으로 한국어로 답해 주세요.

1. **감정 요약** (2~3문장)
2. **오늘의 운동 추천** (운동 종류·강도·시간·이유를 구체적으로)
3. **한 줄 격려**

의학적 진단이나 과장된 표현은 피하고, 따뜻하고 현실적인 톤을 유지하세요.`
}

export function TodayStoryPanel() {
  const [story, setStory] = useState("")
  const [mood, setMood] = useState<MoodTag | null>(null)
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const saved = loadTodayStory()
    if (!saved) return
    setStory(saved.story)
    setMood(saved.mood)
    setRecommendation(saved.recommendation)
  }, [])

  const analyze = useCallback(async () => {
    const text = story.trim()
    if (!text || loading) return

    setError(null)
    setLoading(true)
    saveTodayStory(text, mood, recommendation)

    try {
      const res = await fetch("/api/chat/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", text: buildRecommendationPrompt(text, mood) }],
        }),
      })
      const data = (await res.json()) as { text?: string; error?: string }
      if (!res.ok || !data.text?.trim()) {
        setError(data.error ?? "운동 추천을 받지 못했습니다. 백엔드가 켜져 있는지 확인해 주세요.")
        return
      }
      const reply = data.text.trim()
      setRecommendation(reply)
      saveTodayStory(text, mood, reply)
    } catch {
      setError("네트워크 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }, [story, mood, loading, recommendation])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void analyze()
  }

  return (
    <Card className="shrink-0 gap-0 border-border/80 bg-card/70 py-0 text-center shadow-sm backdrop-blur-sm">
      <CardHeader className="items-center gap-1 border-b border-border/60 px-4 py-3 sm:px-5">
        <CardTitle className="flex items-center justify-center gap-2 text-base">
          <Heart className="size-4 text-primary" aria-hidden />
          오늘 하루 이야기
        </CardTitle>
        <PeriodLines className="text-xs text-muted-foreground sm:text-sm" lines={STORY_DESCRIPTION_LINES} />
      </CardHeader>

      <CardContent className="space-y-4 px-4 py-4 sm:px-5">
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">지금 기분 (선택)</p>
          <div className="flex flex-wrap justify-center gap-2">
            {MOOD_OPTIONS.map((tag) => {
              const active = mood === tag
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setMood(active ? null : tag)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    active
                      ? "border-primary/60 bg-primary/15 text-primary"
                      : "border-border/70 bg-secondary/40 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>

        <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-md flex-col items-center space-y-3">
          <Textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="오늘 있었던 일, 기분, 몸 상태를 자유롭게 적어 주세요. 예: 퇴근 후 너무 지쳐서 소파에만 누워 있었어요…"
            rows={4}
            disabled={loading}
            className="min-h-[100px] w-full resize-none text-left text-sm leading-relaxed"
          />

          <Button type="submit" disabled={loading || !story.trim()} className="w-full">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                감정 분석 중…
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden />
                AI 운동 추천 받기
              </>
            )}
          </Button>
        </form>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        {recommendation ? (
          <div className="mx-auto w-full max-w-md rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 text-left">
            <p className="mb-2 text-center text-xs font-semibold text-primary">오늘의 PACE 추천</p>
            <ChatMessageContent text={recommendation} className="text-sm" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
