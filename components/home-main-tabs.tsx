"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Activity, Brain, BarChart3, GraduationCap, Sparkles } from "lucide-react"
import { useCallback, useMemo } from "react"

import { cn } from "@/lib/utils"

const education = [
  {
    period: "2022 — 2024 (예시)",
    title: "OO대학교",
    detail: "OO학과 졸업",
  },
  {
    period: "2018 — 2022 (예시)",
    title: "OO대학교",
    detail: "컴퓨터공학과 학사 · 소프트웨어 공학·데이터베이스 트랙",
  },
  {
    period: "2015 — 2018 (예시)",
    title: "OO고등학교",
    detail: "이과 · 정보 올림피아드 동아리",
  },
]

function tabClass(active: boolean) {
  return cn(
    "rounded-full px-4 py-2 text-sm font-medium transition-colors md:px-5 md:py-2.5 md:text-base",
    active
      ? "border border-border bg-secondary text-foreground"
      : "text-muted-foreground hover:border hover:border-border/60 hover:bg-secondary/50 hover:text-foreground",
  )
}

export function HomeMainTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profile = searchParams.get("profile") === "1"
  const tab = profile ? "profile" : "intro"

  const setTab = useCallback(
    (next: "intro" | "profile") => {
      if (next === "profile") router.push("/?profile=1", { scroll: false })
      else router.push("/", { scroll: false })
    },
    [router],
  )

  const tabRow = useMemo(
    () => (
      <div className="mb-8 flex flex-wrap items-center gap-2 md:mb-10">
        <button type="button" className={tabClass(tab === "intro")} onClick={() => setTab("intro")}>
          소개
        </button>
        <button type="button" className={tabClass(tab === "profile")} onClick={() => setTab("profile")}>
          프로필
        </button>
      </div>
    ),
    [setTab, tab],
  )

  if (tab === "profile") {
    return (
      <>
        {tabRow}
        <div className="grid gap-10 md:grid-cols-[minmax(0,280px)_1fr] md:items-start md:gap-12 lg:grid-cols-[300px_1fr]">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-2xl border border-border bg-secondary shadow-lg shadow-black/20 md:mx-0">
            <Image
              src="/images/pace-hero.png"
              alt="프로필 예시"
              fill
              sizes="(max-width:768px) 280px, 300px"
              className="object-cover object-[22%_28%]"
            />
          </div>
          <div className="min-w-0">
            <div className="mb-6 flex items-center gap-2">
              <GraduationCap className="size-6 text-primary" aria-hidden />
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">학력</h2>
            </div>
            <ul className="space-y-0 border-l border-primary/30 pl-6">
              {education.map((row, i) => (
                <li key={i} className="relative pb-10 last:pb-0">
                  <span className="absolute -left-6 top-1.5 size-2.5 -translate-x-px rounded-full border-2 border-primary bg-background" />
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">{row.period}</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">{row.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{row.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {tabRow}
      <div className="relative mb-10 md:mb-14">
        <div className="relative inline-flex items-center gap-2.5 rounded-full border border-primary/25 bg-secondary/80 px-4 py-2.5 shadow-sm shadow-primary/5 backdrop-blur-sm">
          <Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
          <span className="text-sm font-medium tracking-wide text-foreground/90">AI · 실시간 운동 피드백</span>
        </div>

        <h1 className="relative mt-8 text-4xl font-bold leading-[1.12] tracking-tight text-balance drop-shadow-[0_2px_24px_oklch(0.05_0_0/0.75)] sm:text-5xl md:mt-10 md:text-6xl lg:text-7xl">
          <span className="block text-foreground">
            데이터로 <span className="text-primary">건강한 변화</span>를 이끄는
          </span>
          <span className="mt-1 block text-foreground md:mt-2">
            개발자, <span className="text-primary">김민아</span>입니다.
          </span>
        </h1>
      </div>

      <div className="relative max-w-3xl rounded-r-xl border-l-2 border-primary/40 bg-background/25 py-1 pl-6 backdrop-blur-[2px] md:pl-8">
        <p className="text-lg leading-relaxed text-muted-foreground md:text-xl md:leading-relaxed">
          현재 AI 기반 실시간 운동 피드백 솔루션{" "}
          <strong className="font-semibold text-foreground">&apos;Pace&apos;</strong>를 개발하고 있습니다. 정교한 데이터 분석과 사용자 중심의 설계를
          통해, 누구나 자신만의 페이스로 나아갈 수 있는 헬스케어의 미래를 만듭니다.
        </p>
      </div>

      <div className="mt-14 flex flex-wrap gap-8 md:mt-16 md:gap-12">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <Brain className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">12+</p>
            <p className="text-sm text-muted-foreground">AI 프로젝트</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/90 backdrop-blur-sm">
            <BarChart3 className="size-6 text-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">50M+</p>
            <p className="text-sm text-muted-foreground">데이터 처리량</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <Activity className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">5년</p>
            <p className="text-sm text-muted-foreground">헬스케어 경력</p>
          </div>
        </div>
      </div>
    </>
  )
}
