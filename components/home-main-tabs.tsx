"use client"

import { Sparkles } from "lucide-react"

import { CurrentWeather } from "@/components/current-weather"
import { GeminiChat } from "@/components/gemini-chat"

/** 날씨·통계 우측 열 너비 — 오른쪽 끝 정렬용 */
const rightRailClass =
  "w-full sm:max-w-[13rem] sm:ml-auto lg:col-start-2 lg:ml-0 lg:w-full lg:max-w-none"

function HomeStats({ className }: { className?: string }) {
  return (
    <aside
      className={[
        "flex shrink-0 flex-row flex-wrap items-start justify-between gap-x-8 gap-y-4 border-t border-border/50 pt-6 sm:justify-start",
        "lg:flex-col lg:justify-center lg:gap-5 lg:border-t-0 lg:pt-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <p className="text-base font-semibold tabular-nums text-foreground sm:text-lg">12+</p>
        <p className="text-[11px] text-muted-foreground sm:text-xs">AI 프로젝트</p>
      </div>
      <div>
        <p className="text-base font-semibold tabular-nums text-foreground sm:text-lg">50M+</p>
        <p className="text-[11px] text-muted-foreground sm:text-xs">데이터 처리량</p>
      </div>
      <div>
        <p className="text-base font-semibold tabular-nums text-foreground sm:text-lg">5년</p>
        <p className="text-[11px] text-muted-foreground sm:text-xs">헬스케어 경력</p>
      </div>
    </aside>
  )
}

export function HomeMainTabs() {
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:grid-rows-[auto_auto_minmax(0,1fr)] lg:gap-x-8 lg:gap-y-6">
      <div className="mb-5 min-w-0 md:mb-7 lg:col-start-1 lg:row-start-1 lg:mb-0">
        <div className="relative inline-flex items-center gap-2 rounded-full border border-primary/25 bg-secondary/80 px-3 py-1.5 text-xs shadow-sm shadow-primary/5 backdrop-blur-sm sm:px-3.5 sm:py-2 sm:text-sm">
          <Sparkles className="size-3.5 shrink-0 text-primary sm:size-4" aria-hidden />
          <span className="font-medium tracking-wide text-foreground/90">AI · 실시간 운동 피드백</span>
        </div>

        <h1 className="relative mt-4 text-balance text-3xl font-bold leading-tight tracking-tight text-foreground drop-shadow-[0_2px_20px_oklch(0.05_0_0/0.65)] sm:text-4xl md:mt-5 md:text-[2.125rem] lg:text-5xl">
          <span className="block">
            데이터로 <span className="text-primary">건강한 변화</span>를 이끄는
          </span>
          <span className="mt-0.5 block md:mt-1">
            개발자, <span className="text-primary">김민아</span>입니다.
          </span>
        </h1>
      </div>

      <CurrentWeather
        variant="compact"
        className={`${rightRailClass} mb-5 shrink-0 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:mt-1 lg:self-start`}
      />

      <div className="relative max-w-3xl rounded-r-lg border-l-2 border-primary/40 bg-background/25 py-0.5 pl-4 backdrop-blur-[2px] md:pl-6 lg:col-start-1 lg:row-start-2">
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
          현재 AI 기반 실시간 운동 피드백 솔루션{" "}
          <strong className="font-semibold text-foreground">&apos;Pace&apos;</strong>를 개발하고 있습니다. 정교한 데이터 분석과 사용자 중심의 설계를
          통해, 누구나 자신만의 페이스로 나아갈 수 있는 헬스케어의 미래를 만듭니다.
        </p>
      </div>

      <div className="mt-6 flex min-h-0 min-w-0 flex-1 flex-col lg:col-start-1 lg:row-start-3 lg:mt-0">
        <GeminiChat />
      </div>

      <HomeStats className={`${rightRailClass} mt-6 lg:col-start-2 lg:row-start-3 lg:mt-0 lg:self-center`} />
    </div>
  )
}
