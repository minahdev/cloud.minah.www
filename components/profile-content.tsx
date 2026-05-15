"use client"

import Image from "next/image"
import { GraduationCap } from "lucide-react"

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

export function ProfileContent() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center px-6 py-6 md:py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 md:flex-row md:items-start md:justify-center md:gap-12 lg:max-w-5xl lg:gap-16">
        <div className="relative aspect-[3/4] w-full max-w-[280px] shrink-0 overflow-hidden rounded-2xl border border-border bg-secondary shadow-lg shadow-black/20 lg:max-w-[300px]">
          <Image
            src="/images/pace-hero.png"
            alt="프로필 예시"
            fill
            sizes="(max-width:768px) 280px, 300px"
            className="object-cover object-[22%_28%]"
            priority
          />
        </div>
        <div className="w-full min-w-0 max-w-xl md:flex-1">
          <div className="mb-6 flex items-center gap-2">
            <GraduationCap className="size-6 text-primary" aria-hidden />
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">학력</h1>
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
    </div>
  )
}
