"use client"

import { Sparkles } from "lucide-react"

import { CurrentWeather } from "@/components/current-weather"
import { GeminiChat } from "@/components/gemini-chat"

/** 날씨 우측 열 너비 */
const rightRailClass =
  "w-full sm:max-w-[13rem] sm:ml-auto lg:col-start-2 lg:ml-0 lg:w-full lg:max-w-none"

export function HomeMainTabs() {
  return (
    <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:grid-rows-[auto_auto_minmax(0,1fr)] lg:gap-x-8 lg:gap-y-6">
      <div className="mb-5 min-w-0 md:mb-7 lg:col-start-1 lg:row-start-1 lg:mb-0">
        <div className="relative inline-flex items-center gap-2 rounded-full border border-primary/25 bg-secondary/80 px-3 py-1.5 text-xs shadow-sm shadow-primary/5 backdrop-blur-sm sm:px-3.5 sm:py-2 sm:text-sm">
          <Sparkles className="size-3.5 shrink-0 text-primary sm:size-4" aria-hidden />
          <span className="font-medium tracking-wide text-foreground/90">헬스 · 러닝 · 사이클</span>
        </div>

        <h1 className="relative mt-4 text-balance text-3xl font-bold leading-[1.15] tracking-tight text-foreground drop-shadow-[0_2px_20px_oklch(0.05_0_0/0.65)] sm:text-4xl md:mt-5 md:text-[2.125rem] lg:text-5xl">
          <span className="block">
          Sync Your Mind,  <span className="text-primary"></span>
          </span>
          <span className="mt-0.5 block md:mt-1">
          Find Your <span className="text-primary">Pace.</span>
          </span>
        </h1>
      </div>

      <CurrentWeather
        variant="compact"
        className={`${rightRailClass} mb-5 shrink-0 lg:col-start-2 lg:row-start-1 lg:mb-0 lg:mt-1 lg:self-start`}
      />

      <div className="relative max-w-3xl rounded-r-lg border-l-2 border-primary/40 bg-background/25 py-0.5 pl-4 backdrop-blur-[2px] md:pl-6 lg:col-start-1 lg:row-start-2">
        <p className="text-sm leading-relaxed text-muted-foreground md:text-base md:leading-relaxed">
        의욕 넘치는 아침도, 무기력한 퇴근길도 괜찮습니다. 오늘의 감정과 컨디션을 분석해 오직 당신만을 위해 유연하게 변화하는 AI 운동 비서{" "}
          <strong className="font-semibold tracking-wide text-foreground">PACE</strong>.
        </p>
      </div>

      <div className="mt-6 flex min-h-0 min-w-0 flex-1 flex-col lg:col-span-2 lg:col-start-1 lg:row-start-3 lg:mt-0">
        <GeminiChat />
      </div>
    </div>
  )
}
