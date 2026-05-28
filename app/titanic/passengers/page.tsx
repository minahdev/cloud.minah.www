import Link from "next/link"

import { PassengerList } from "@/components/passenger-list"

export default async function TitanicPassengersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = (await searchParams) ?? {}
  const pageRaw = Array.isArray(sp.page) ? sp.page[0] : sp.page
  const page = Math.max(1, Number(pageRaw ?? "1") || 1)

  return (
    <div className="px-6 pt-24 pb-14 md:pt-28 md:pb-16">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Lesson</p>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
            <h1 className="text-3xl font-bold text-foreground">승객 목록</h1>
            <Link
              href="/titanic/data-collection"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              데이터 수집으로 이동
            </Link>
          </div>
          <p className="mt-2 text-muted-foreground">DB에 저장된 타이타닉 승객 데이터를 조회합니다.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <PassengerList page={page} />
        </div>
      </div>
    </div>
  )
}

