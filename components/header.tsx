"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, ArrowRight } from "lucide-react"

const navItems = [
  { href: "/", label: "소개" },
  { href: "/projects", label: "프로젝트" },
  { href: "/portfolio", label: "포트폴리오" },
  { href: "/qa", label: "헬스케어 Q&A" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-semibold text-foreground">Pace</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-secondary text-foreground border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Link
          href="/signup"
          className="flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          회원가입
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </header>
  )
}
