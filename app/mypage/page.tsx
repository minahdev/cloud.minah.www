"use client"

import { MyPageForm } from "@/components/mypage-form"
import { RequireAuth } from "@/components/require-auth"

export default function MyPagePage() {
  return (
    <RequireAuth loginRedirect="/mypage">
      <div className="pt-28 md:pt-32 pb-16">
        <div className="container mx-auto px-6">
          <MyPageForm />
        </div>
      </div>
    </RequireAuth>
  )
}
