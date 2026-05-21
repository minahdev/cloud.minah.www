"use client"

import { Sparkles } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaceAiPage() {
  return (
    <div className="pb-16 pt-28 md:pt-32">
      <div className="container mx-auto max-w-2xl px-6">
        <header className="mb-10 text-center md:text-left">
          <p className="text-sm font-medium text-primary">Pace AI</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            헬스케어 AI 코치
          </h1>
          <p className="mt-2 text-muted-foreground">
            회원·일반 사용자 모두를 위한 운동 코칭 AI가 이곳에 연결될 예정입니다.
          </p>
        </header>

        <Card className="border-primary/30 bg-primary/5 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden />
              준비 중
            </CardTitle>
            <CardDescription>
              개발자가 헬스케어 전용 AI를 구현해 넣을 예정입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>예정 기능:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>운동·식단·부상 예방에 대한 질문과 맞춤 조언</li>
              <li>회원 프로필·훈련 기록과 연동한 코칭 (추후)</li>
              <li>코치 보조용 대화 요약 (추후)</li>
            </ul>
            <p className="pt-2 text-xs">
              현재 메인 화면의 Gemini 채팅은 별도 실험용입니다. Pace AI는 전용 모델·프롬프트로
              제공될 계획입니다.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
