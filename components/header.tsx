"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Activity, ArrowRight } from "lucide-react"

const navItems = [
  { href: "/", label: "소개" },
  { href: "/projects", label: "프로젝트" },
  { href: "/portfolio", label: "포트폴리오" },
  { href: "/qa", label: "헬스케어 Q&A" },
]

function navPillClass(active: boolean) {
  return `px-4 py-2.5 lg:px-5 lg:py-3 rounded-full text-base font-medium transition-colors ${
    active ? "bg-secondary text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
  }`
}

export function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const profileTab = pathname === "/" && searchParams.get("profile") === "1"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-6 sm:px-8 h-20 md:h-24 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-primary/20 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          </div>
          <span className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">Pace</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 flex-1 justify-center min-w-0">
          {navItems.map((item) => {
            if (item.href === "/") {
              const introActive = pathname === "/" && !profileTab
              return (
                <span key="home" className="inline-flex items-center gap-1.5">
                  <Link href="/" className={navPillClass(introActive)}>
                    소개
                  </Link>
                  <Link href="/?profile=1" className={navPillClass(profileTab)}>
                    프로필
                  </Link>
                </span>
              )
            }
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={navPillClass(isActive)}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <Link
            href="/signup"
            className="hidden sm:flex items-center gap-2 px-5 py-3 lg:px-6 bg-accent text-accent-foreground rounded-full text-base font-medium hover:bg-accent/90 transition-colors"
          >
            회원가입
            <ArrowRight className="w-5 h-5 shrink-0" />
          </Link>
          <Link
            href="/login"
            className={`px-5 py-3 lg:px-6 rounded-full text-base font-medium transition-colors ${
              pathname === "/login"
                ? "bg-secondary text-foreground border border-border"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            로그인
          </Link>
          <Link
            href="/titanic"
            className={`px-4 py-2.5 lg:px-5 lg:py-3 rounded-full text-base font-medium transition-colors border ${
              pathname === "/titanic"
                ? "bg-secondary text-foreground border-border"
                : "text-muted-foreground border-border/60 hover:text-foreground hover:border-border"
            }`}
          >
            타이타닉
          </Link>
        </div>
      </div>
    </header>
  )
}
