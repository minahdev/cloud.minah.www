"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Activity, BarChart3, ChevronDown, Menu, UserRound, Zap } from "lucide-react"

import { cn } from "@/lib/utils"

import { CurrentWeather } from "@/components/current-weather"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const navItems = [
  { href: "/", label: "메인" },
  { href: "/pace-ai", label: "Pace AI" },
  { href: "/schedule", label: "스케줄" },
  { href: "/community", label: "커뮤니티" },
  { href: "/notices", label: "공지사항" },
  { href: "/titanic", label: "수업용" },
]

const lessonItems = [
  { href: "/titanic/data-collection", label: "데이터 수집" },
  { href: "/titanic/passengers", label: "승객 목록" },
  { href: "/titanic/conversations", label: "스미스 선장과의 대화" },
] as const

const mypageItems = [
  { href: "/mypage", label: "프로필", icon: UserRound },
  { href: "/mypage?tab=train", label: "훈련", icon: Zap },
  { href: "/mypage?tab=analytics", label: "분석", icon: BarChart3 },
] as const

function navPillClass(active: boolean) {
  return `px-4 py-2.5 lg:px-5 lg:py-3 rounded-full text-base font-medium transition-colors ${
    active ? "bg-secondary text-foreground border border-border" : "text-muted-foreground hover:text-foreground"
  }`
}

function isMypageItemActive(pathname: string, tab: string | null, href: string) {
  if (pathname !== "/mypage") return false
  if (href === "/mypage") return !tab || tab === "profile"
  if (href.includes("tab=train")) return tab === "train"
  if (href.includes("tab=analytics")) return tab === "analytics"
  return false
}

const LESSON_DRAG_THRESHOLD_PX = 28

type LessonDragState = {
  active: boolean
  startY: number
  dragged: boolean
}

function LessonMenuSection({
  pathname,
  isTitanicActive,
}: {
  pathname: string
  isTitanicActive: boolean
}) {
  const [expanded, setExpanded] = useState(isTitanicActive)
  const dragRef = useRef<LessonDragState>({ active: false, startY: 0, dragged: false })

  useEffect(() => {
    if (isTitanicActive) setExpanded(true)
  }, [isTitanicActive])

  const showSubs = expanded || isTitanicActive

  const endDrag = (target: HTMLElement, pointerId: number) => {
    dragRef.current.active = false
    try {
      target.releasePointerCapture(pointerId)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={showSubs}
        aria-label="수업용 메뉴, 아래로 드래그하면 하위 메뉴가 열립니다"
        className={cn(
          "flex touch-none select-none items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors",
          "cursor-grab active:cursor-grabbing",
          isTitanicActive
            ? "border border-border bg-secondary text-foreground"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
        )}
        onPointerDown={(e) => {
          dragRef.current = { active: true, startY: e.clientY, dragged: false }
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!dragRef.current.active) return
          const dy = e.clientY - dragRef.current.startY
          if (dy >= LESSON_DRAG_THRESHOLD_PX && !dragRef.current.dragged) {
            dragRef.current.dragged = true
            setExpanded(true)
          }
        }}
        onPointerUp={(e) => {
          const dy = e.clientY - dragRef.current.startY
          endDrag(e.currentTarget, e.pointerId)
          if (!dragRef.current.dragged && Math.abs(dy) < 8) {
            setExpanded((open) => !open)
          }
        }}
        onPointerCancel={(e) => {
          endDrag(e.currentTarget, e.pointerId)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setExpanded((open) => !open)
          }
        }}
      >
        <span>수업용</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform", showSubs && "rotate-180")}
          aria-hidden
        />
      </div>

      {showSubs ? (
        <div className="ml-4 border-l border-border/70 pl-2">
          {lessonItems.map((sub) => {
            const active = pathname === sub.href
            return (
              <SheetClose asChild key={sub.href}>
                <Link
                  href={sub.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border border-border bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                  )}
                >
                  {sub.label}
                </Link>
              </SheetClose>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const mypageTab = searchParams.get("tab")
  const mypageActive = pathname === "/mypage"
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center gap-2 px-4 sm:px-6 md:h-20 md:gap-3 lg:h-24">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Link href="/" className="flex shrink-0 items-center" aria-label="메인으로 이동" title="메인">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 sm:h-10 sm:w-10 md:h-11 md:w-11">
              <Activity className="h-6 w-6 text-primary md:h-7 md:w-7" />
            </div>
          </Link>
          <CurrentWeather variant="header" fallbackCity="Seoul" />
        </div>

        <nav className="hidden" aria-hidden>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={navPillClass(isActive)}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/mypage"
            className={[
              "inline-flex h-9 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-bold tracking-wide transition-colors",
              mypageActive
                ? "border-primary/60 bg-primary/20 text-primary"
                : "border-border/60 bg-secondary/40 text-foreground hover:bg-secondary/60",
              "sm:h-10 sm:px-4",
            ].join(" ")}
            aria-label="마이페이지"
            title="마이페이지"
          >
            MY
          </Link>

          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-full border border-border/60 bg-secondary/40 px-3 text-sm font-semibold tracking-wide text-foreground transition-colors hover:bg-secondary/60 sm:h-10 sm:px-4"
            aria-label="로그인"
            title="로그인"
          >
            로그인
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-secondary/40 text-foreground transition-colors hover:bg-secondary/60 sm:h-10 sm:w-10"
            aria-label="메뉴 열기"
            title="메뉴"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <Activity className="h-5 w-5 text-primary" aria-hidden />
              </div>
              메뉴
            </SheetTitle>
            <SheetDescription className="sr-only">
              마이페이지와 주요 페이지로 이동하는 메뉴입니다.
            </SheetDescription>
          </SheetHeader>

          <nav className="mt-6 flex flex-col gap-2">
            <p className="px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              마이페이지
            </p>
            {mypageItems.map((item) => {
              const isActive = isMypageItemActive(pathname, mypageTab, item.href)
              const Icon = item.icon
              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "border border-border bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    {item.label}
                  </Link>
                </SheetClose>
              )
            })}

            <p className="mt-4 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              바로가기
            </p>
            {navItems.map((item) => {
              const isActive = pathname === item.href
              if (item.href === "/titanic") {
                return (
                  <LessonMenuSection
                    key={item.href}
                    pathname={pathname}
                    isTitanicActive={isActive || pathname.startsWith("/titanic")}
                  />
                )
              }
              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "border border-border bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
