"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  BarChart3,
  Home,
  LogIn,
  Megaphone,
  Ship,
  UserCircle2,
  UserPlus,
  Users,
  Zap,
} from "lucide-react"

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AUTH_SESSION_EVENT, getLoggedInUserId } from "@/lib/auth-session"

type BottomNavLinkItem = {
  href: string
  label: string
  Icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>
}

const bottomNavItems: BottomNavLinkItem[] = [
  { href: "/", label: "메인", Icon: Home },
  { href: "/train", label: "훈련", Icon: Zap },
  { href: "/analytics", label: "분석", Icon: BarChart3 },
  { href: "/community", label: "커뮤니티", Icon: Users },
  { href: "/notices", label: "공지", Icon: Megaphone },
  { href: "/titanic", label: "수업용", Icon: Ship },
]

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [accountOpen, setAccountOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(() => Boolean(getLoggedInUserId()))

  useEffect(() => {
    const handler = () => setLoggedIn(Boolean(getLoggedInUserId()))
    handler()
    window.addEventListener(AUTH_SESSION_EVENT, handler)
    return () => window.removeEventListener(AUTH_SESSION_EVENT, handler)
  }, [])

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/90 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="하단 탭 바"
    >
      <div className="mx-auto grid max-w-lg grid-cols-7 px-1">
        {bottomNavItems.slice(0, 3).map(({ href, label, Icon }) => {
          const active = isActivePath(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden />
              <span>{label}</span>
            </Link>
          )
        })}

        <button
          type="button"
          onClick={() => {
            if (loggedIn) {
              router.push("/mypage")
              return
            }
            setAccountOpen(true)
          }}
          className={[
            "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
            isActivePath(pathname, "/mypage")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          ].join(" ")}
          aria-label="계정"
          aria-current={isActivePath(pathname, "/mypage") ? "page" : undefined}
        >
          <UserCircle2 className="h-[18px] w-[18px]" aria-hidden />
          <span>계정</span>
        </button>

        {bottomNavItems.slice(3).map(({ href, label, Icon }) => {
          const active = isActivePath(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>

      <Sheet open={accountOpen} onOpenChange={setAccountOpen}>
        <SheetContent side="bottom" className="pb-8">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-primary" aria-hidden />
              계정
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 grid gap-3">
            <SheetClose asChild>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary/60 hover:bg-primary/15"
              >
                <LogIn className="h-4 w-4" aria-hidden />
                로그인
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/signup"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:border-accent/60 hover:bg-accent/15"
              >
                <UserPlus className="h-4 w-4" aria-hidden />
                회원가입
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}

