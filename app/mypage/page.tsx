"use client"

import { Suspense } from "react"

import { MyPageTabs } from "@/components/mypage-tabs"
import { RequireAuth } from "@/components/require-auth"

function MyPageFallback() {
  return (
    <div className="pt-28 md:pt-32 pb-16">
      <div className="container mx-auto px-6">
        <div className="min-h-[20rem] animate-pulse rounded-2xl bg-secondary/30" aria-hidden />
      </div>
    </div>
  )
}

export default function MyPagePage() {
  return (
    <RequireAuth loginRedirect="/mypage">
      <div className="pt-28 md:pt-32 pb-16">
        <div className="container mx-auto px-6">
          <Suspense fallback={<MyPageFallback />}>
            <MyPageTabs />
          </Suspense>
        </div>
      </div>
    </RequireAuth>
  )
}
