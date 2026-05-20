"use client"

import { useEffect, useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import { CalendarDays, Dumbbell, Scale, UtensilsCrossed } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  hasWorkoutActivity,
  loadTrainLogs,
  trainLogTodayKey,
  type TrainDailyLog,
} from "@/lib/pace-train-storage"

function dateToKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function hasSavedRecord(log: TrainDailyLog): boolean {
  const dietFilled =
    Boolean(log.diet.breakfast.trim()) ||
    Boolean(log.diet.lunch.trim()) ||
    Boolean(log.diet.dinner.trim()) ||
    Boolean(log.diet.snack.trim()) ||
    log.diet.waterMl != null ||
    Boolean(log.diet.supplements.trim())
  return hasWorkoutActivity(log) || log.weightKg != null || dietFilled || Boolean(log.memo.trim())
}

function TrainDayDetail({ log }: { log: TrainDailyLog | null }) {
  if (!log || !hasSavedRecord(log)) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-secondary/25 px-4 py-10 text-center text-sm text-muted-foreground">
        이 날짜에 저장된 훈련 기록이 없습니다.
        <br />
        훈련 탭에서 기록을 남기면 여기에 표시됩니다.
      </p>
    )
  }

  const dietLines = [
    { label: "아침", value: log.diet.breakfast },
    { label: "점심", value: log.diet.lunch },
    { label: "저녁", value: log.diet.dinner },
    { label: "간식", value: log.diet.snack },
  ].filter((row) => row.value.trim())

  return (
    <div className="space-y-4 text-sm">
      {log.muscles.length > 0 ? (
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">운동 부위</p>
          <div className="flex flex-wrap gap-1.5">
            {log.muscles.map((m) => (
              <Badge key={m} variant="secondary">
                {m}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {log.workout.trim() ? (
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Dumbbell className="h-3.5 w-3.5" aria-hidden />
            오늘 한 운동
          </p>
          <p className="whitespace-pre-wrap rounded-lg border border-border/60 bg-secondary/20 px-3 py-2.5 leading-relaxed text-foreground">
            {log.workout}
          </p>
        </div>
      ) : null}

      {log.weightKg != null ? (
        <p className="flex items-center gap-1.5 text-foreground">
          <Scale className="h-4 w-4 text-primary" aria-hidden />
          몸무게 <span className="font-semibold">{log.weightKg} kg</span>
        </p>
      ) : null}

      {dietLines.length > 0 || log.diet.waterMl != null || log.diet.supplements.trim() ? (
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden />
            식단
          </p>
          <ul className="space-y-1.5 rounded-lg border border-border/60 bg-secondary/20 px-3 py-2.5">
            {dietLines.map((row) => (
              <li key={row.label}>
                <span className="font-medium text-foreground">{row.label}</span>
                <span className="text-muted-foreground"> — </span>
                <span className="text-foreground">{row.value}</span>
              </li>
            ))}
            {log.diet.waterMl != null ? (
              <li>
                <span className="font-medium text-foreground">물</span>
                <span className="text-muted-foreground"> — </span>
                {log.diet.waterMl} ml
              </li>
            ) : null}
            {log.diet.supplements.trim() ? (
              <li>
                <span className="font-medium text-foreground">영양제</span>
                <span className="text-muted-foreground"> — </span>
                {log.diet.supplements}
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      {log.memo.trim() ? (
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">메모</p>
          <p className="whitespace-pre-wrap rounded-lg border border-border/60 px-3 py-2 text-foreground">
            {log.memo}
          </p>
        </div>
      ) : null}
    </div>
  )
}

export default function AnalyticsPage() {
  const [logs, setLogs] = useState<TrainDailyLog[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date())
  const [calendarMonth, setCalendarMonth] = useState<Date>(() => new Date())

  useEffect(() => {
    const refresh = () => setLogs(loadTrainLogs())
    refresh()
    window.addEventListener("focus", refresh)
    return () => window.removeEventListener("focus", refresh)
  }, [])

  const logsByDate = useMemo(() => {
    const map = new Map<string, TrainDailyLog>()
    for (const log of logs) map.set(log.date, log)
    return map
  }, [logs])

  const selectedKey = dateToKey(selectedDate)
  const selectedLog = logsByDate.get(selectedKey) ?? null

  const loggedDates = useMemo(
    () => logs.filter(hasSavedRecord).map((l) => parseISO(l.date)),
    [logs],
  )

  const weightChartRows = useMemo(() => {
    return logs
      .filter((l) => l.weightKg != null)
      .map((l) => {
        const [, m, d] = l.date.split("-")
        return { label: `${m}/${d}`, weight: l.weightKg, date: l.date }
      })
  }, [logs])

  const hasWeight = weightChartRows.length > 0

  const selectedLabel = format(selectedDate, "yyyy년 M월 d일 (EEE)", { locale: ko })

  return (
    <div className="pb-16 pt-28 md:pt-32">
      <div className="container mx-auto max-w-5xl px-6">
        <header className="mb-8">
          <p className="text-sm font-medium text-primary">Analytics</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            나의 훈련 기록
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            훈련 탭에서 저장한 내용을 날짜별로 확인하고, 몸무게 추이는 아래 그래프에서 볼 수
            있습니다.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:items-start">
          <Card className="border-border/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4 w-4 text-primary" aria-hidden />
                기록 캘린더
              </CardTitle>
              <CardDescription>
                <span className="inline-block size-2 rounded-full bg-primary align-middle" />{" "}
                표시된 날짜에 저장된 기록이 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                modifiers={{ logged: loggedDates }}
                modifiersClassNames={{
                  logged:
                    "relative font-semibold after:pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
                }}
                className="rounded-lg [--cell-size:--spacing(9)]"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => {
                  const today = new Date()
                  setSelectedDate(today)
                  setCalendarMonth(today)
                }}
              >
                오늘로 이동
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{selectedLabel}</CardTitle>
              <CardDescription>
                {selectedKey === trainLogTodayKey() ? "오늘" : "선택한 날"}의 훈련·식단 기록
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TrainDayDetail log={selectedLog} />
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">몸무게 추이</CardTitle>
            <CardDescription>
              훈련 탭에서 입력한 체중만 모아 표시합니다. 기록이 있는 날짜만 연결됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!hasWeight ? (
              <p className="rounded-lg border border-dashed border-border bg-secondary/30 py-12 text-center text-sm text-muted-foreground">
                아직 몸무게 데이터가 없습니다. 훈련 탭에서 체중을 입력해 보세요.
              </p>
            ) : (
              <div className="h-[300px] w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightChartRows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        fontSize: "13px",
                      }}
                      labelFormatter={(l) => `날짜 ${l}`}
                      formatter={(value: number | string) => [
                        value === null || value === undefined ? "—" : `${value} kg`,
                        "몸무게",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      name="몸무게"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "hsl(var(--primary))" }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
