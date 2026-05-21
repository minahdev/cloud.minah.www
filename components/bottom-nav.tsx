"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { CalendarClock, Home, Sparkles, Users, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

type NavItem = {
  href: string
  label: string
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  center?: boolean
  /** 마이페이지 탭과 매칭 (예: train → /mypage?tab=train) */
  mypageTab?: string
}

/** 메인 가운데 — Pace AI · 스케줄 | 메인 | 훈련 · 커뮤니티 */
const bottomNavItems: NavItem[] = [
  { href: "/pace-ai", label: "Pace AI", Icon: Sparkles },
  { href: "/schedule", label: "스케줄", Icon: CalendarClock },
  { href: "/", label: "메인", Icon: Home, center: true },
  { href: "/mypage?tab=train", label: "훈련", Icon: Zap, mypageTab: "train" },
  { href: "/community", label: "커뮤니티", Icon: Users },
]

function isNavItemActive(
  pathname: string,
  tab: string | null,
  item: NavItem,
): boolean {
  if (item.mypageTab) {
    return pathname === "/mypage" && tab === item.mypageTab
  }
  if (item.href === "/") return pathname === "/"
  const pathOnly = item.href.split("?")[0]
  return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`)
}

export function BottomNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab")

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="하단 탭 바"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end px-0.5">
        {bottomNavItems.map(({ href, label, Icon, center, mypageTab }) => {
          const active = isNavItemActive(pathname, tab, {
            href,
            label,
            Icon,
            center,
            mypageTab,
          })
          if (center) {
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative -top-2.5 flex flex-col items-center justify-center gap-0.5 rounded-2xl px-2 py-2.5 transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "border border-border/80 bg-card text-foreground shadow-sm hover:bg-secondary/80",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Home className="h-6 w-6 shrink-0" aria-hidden />
                <span className="text-[10px] font-bold sm:text-[11px]">메인</span>
              </Link>
            )
          }
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2 text-[9px] font-medium transition-colors sm:text-[10px]",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
              <span className="max-w-[3.25rem] truncate">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
