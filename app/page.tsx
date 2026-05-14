import Image from "next/image"
import { Suspense } from "react"

import { HomeMainTabs } from "@/components/home-main-tabs"

const heroScrim: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(to right, var(--background) 0%, color-mix(in oklch, var(--background) 58%, transparent) 48%, transparent 82%)",
    "linear-gradient(to bottom, color-mix(in oklch, var(--background) 82%, transparent) 0%, transparent 45%)",
  ].join(","),
}

export default function HomePage() {
  return (
    <div className="relative isolate overflow-hidden pt-28 md:pt-32 pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0">
          <Image
            src="/images/pace-hero.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right opacity-[0.28] sm:opacity-[0.34] md:opacity-[0.38]"
            priority
          />
        </div>
        <div aria-hidden className="absolute inset-0" style={heroScrim} />
      </div>

      <div className="container relative z-10 mx-auto max-w-5xl px-6">
        <Suspense fallback={<div className="min-h-[24rem] animate-pulse rounded-2xl bg-secondary/30" aria-hidden />}>
          <HomeMainTabs />
        </Suspense>
      </div>
    </div>
  )
}
