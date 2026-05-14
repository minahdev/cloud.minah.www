import Image from "next/image"

import { TitanicCsvUpload } from "@/components/titanic-csv-upload"

/** 상단(제목)·하단(배)만 살짝 어둡게, 중앙은 사진이 드러나게 */
const heroScrim: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(to bottom, var(--background) 0%, color-mix(in oklch, var(--background) 32%, transparent) 36%, transparent 58%, color-mix(in oklch, var(--background) 72%, transparent) 100%)",
    "linear-gradient(to top, color-mix(in oklch, var(--background) 40%, transparent) 0%, transparent 46%)",
  ].join(","),
}

export default function TitanicHomePage() {
  return (
    <div className="relative isolate flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center gap-10 overflow-hidden px-6 py-16 md:gap-14">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0">
          <Image
            src="/images/titanic-hero.png"
            alt=""
            fill
            sizes="100vw"
            className="scale-[1.08] object-cover object-bottom opacity-[0.58] sm:opacity-[0.64] md:opacity-[0.7]"
            priority
          />
        </div>
        <div aria-hidden className="absolute inset-0" style={heroScrim} />
      </div>

      <h1 className="relative z-10 text-4xl font-bold leading-relaxed tracking-[0.12em] text-balance text-primary drop-shadow-[0_2px_20px_oklch(0.05_0_0/0.9),0_0_40px_oklch(0.05_0_0/0.45)] sm:text-6xl md:text-7xl md:tracking-[0.18em] lg:text-8xl">
        Titanic Home
      </h1>
      <div className="relative z-10 w-full max-w-xl">
        <TitanicCsvUpload />
      </div>
    </div>
  )
}
