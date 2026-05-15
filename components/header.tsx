"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, ArrowRight, Menu } from "lucide-react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

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

function sheetLinkClass(isActive: boolean) {
  return `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
    isActive
      ? "border border-border bg-secondary text-foreground"
      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
  }`
}

export function Header() {
  const pathname = usePathname()
  const profileTab = pathname === "/profile"
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between gap-4 px-6 sm:px-8 md:h-24">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 md:h-11 md:w-11">
            <Activity className="h-6 w-6 text-primary md:h-7 md:w-7" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">Pace</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 md:flex lg:gap-2">
          {navItems.map((item) => {
            if (item.href === "/") {
              const introActive = pathname === "/"
              return (
                <span key="home" className="inline-flex items-center gap-1.5">
                  <Link href="/" className={navPillClass(introActive)}>
                    소개
                  </Link>
                  <Link href="/profile" className={navPillClass(profileTab)}>
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          <Link
            href="/signup"
            className="hidden items-center gap-2 rounded-full bg-accent px-5 py-3 text-base font-medium text-accent-foreground transition-colors hover:bg-accent/90 sm:flex lg:px-6"
          >
            회원가입
            <ArrowRight className="h-5 w-5 shrink-0" />
          </Link>
          <Link
            href="/login"
            className={`rounded-full px-5 py-3 text-base font-medium transition-colors lg:px-6 ${
              pathname === "/login"
                ? "border border-border bg-secondary text-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            로그인
          </Link>
          <Link
            href="/titanic"
            className={`rounded-full border px-4 py-2.5 text-base font-medium transition-colors lg:px-5 lg:py-3 ${
              pathname === "/titanic"
                ? "border-border bg-secondary text-foreground"
                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            타이타닉
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 transition-colors hover:bg-secondary md:hidden"
            aria-label="메뉴 열기"
            onClick={() => setSheetOpen(true)}
          >
            <Menu className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <span>Pace</span>
            </SheetTitle>
          </SheetHeader>

          <nav className="mt-6 flex flex-col gap-2">
            <SheetClose asChild>
              <Link href="/" className={sheetLinkClass(pathname === "/")}>
                소개
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/profile" className={sheetLinkClass(profileTab)}>
                프로필
              </Link>
            </SheetClose>
            {navItems
              .filter((i) => i.href !== "/")
              .map((item) => {
                const isActive = pathname === item.href
                return (
                  <SheetClose asChild key={item.href}>
                    <Link href={item.href} className={sheetLinkClass(isActive)}>
                      {item.label}
                    </Link>
                  </SheetClose>
                )
              })}
            <SheetClose asChild>
              <Link href="/login" className={sheetLinkClass(pathname === "/login")}>
                로그인
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/titanic" className={sheetLinkClass(pathname === "/titanic")}>
                타이타닉
              </Link>
            </SheetClose>
          </nav>

          <div className="mt-8 border-t border-border pt-6">
            <SheetClose asChild>
              <Link
                href="/signup"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                회원가입
                <ArrowRight className="h-4 w-4" />
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
