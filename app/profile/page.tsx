import Image from "next/image"
import { Suspense } from "react"

import { ProfileContent } from "@/components/profile-content"

const heroScrim: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(to right, var(--background) 0%, color-mix(in oklch, var(--background) 58%, transparent) 48%, transparent 82%)",
    "linear-gradient(to bottom, color-mix(in oklch, var(--background) 82%, transparent) 0%, transparent 45%)",
  ].join(","),
}

export default function ProfilePage() {
  return (
    <div className="relative isolate flex min-h-0 flex-1 flex-col overflow-hidden pt-24 pb-14 md:min-h-[calc(100dvh-5rem)] md:pt-28 md:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0">
          <Image
            src="/images/pace-hero.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[88%_46%] opacity-[0.28] sm:opacity-[0.34] md:opacity-[0.38]"
            priority
          />
        </div>
        <div aria-hidden className="absolute inset-0" style={heroScrim} />
      </div>

      <div className="container relative z-10 mx-auto flex min-h-[50vh] flex-1 flex-col px-6 max-w-6xl">
        <Suspense fallback={<div className="min-h-[16rem] animate-pulse rounded-2xl bg-secondary/30" aria-hidden />}>
          <ProfileContent />
        </Suspense>
      </div>
    </div>
  )
}
