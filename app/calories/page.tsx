"use client"

import { FormEvent, useMemo, useState } from "react"
import { Search, Utensils } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FOOD_DATASET, matchesFood, normalizeQuery, type FoodRecord } from "@/lib/calorie-dataset"

type CaloriesUi = {
  query: string
  grams: number
}

function kcalFor(food: FoodRecord, grams: number): number {
  return Math.round((food.kcalPer100g * grams) / 100)
}

export default function CaloriesPage() {
  const [ui, setUi] = useState<CaloriesUi>({ query: "", grams: 100 })

  const results = useMemo(() => {
    const q = normalizeQuery(ui.query)
    const filtered = FOOD_DATASET.filter((f) => matchesFood(f, q))
    return filtered.slice(0, 50)
  }, [ui.query])

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = String(formData.get("query") ?? "")
    const gramsRaw = String(formData.get("grams") ?? "").trim()
    const g = Number(gramsRaw)
    setUi({
      query,
      grams: Number.isFinite(g) && g > 0 && g <= 5000 ? g : 100,
    })
  }

  return (
    <div className="pb-16 pt-28 md:pt-32">
      <div className="container mx-auto max-w-5xl px-6">
        <header className="mb-8">
          <p className="text-sm font-medium text-primary">Calories</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            음식 칼로리 검색
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            음식 이름을 검색하면 100g 기준 칼로리와 입력한 그램 기준 칼로리를 계산해 보여줍니다.
            (현재는 데모 데이터셋입니다.)
          </p>
        </header>

        <Card className="border-border/80 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Search className="h-4 w-4 text-primary" aria-hidden />
              검색
            </CardTitle>
            <CardDescription>예: 공기밥, 닭가슴살, 요거트, 바나나, 프로틴바…</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_140px_auto] sm:items-end">
              <div className="space-y-1.5">
                <Label htmlFor="query">음식명</Label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <Input
                    id="query"
                    name="query"
                    type="search"
                    defaultValue={ui.query}
                    placeholder="검색어 입력"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="grams">그램(g)</Label>
                <Input
                  id="grams"
                  name="grams"
                  type="number"
                  min={1}
                  max={5000}
                  step={1}
                  inputMode="numeric"
                  defaultValue={String(ui.grams)}
                />
              </div>

              <Button type="submit" className="sm:mb-[1px]">
                검색
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="text-lg font-semibold text-foreground">결과</h2>
              <span className="text-sm text-muted-foreground">({results.length}개)</span>
            </div>
            <Badge variant="secondary">계산 기준: {ui.grams}g</Badge>
          </div>

          <div className="rounded-xl border border-border/70 bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>음식</TableHead>
                  <TableHead>분류</TableHead>
                  <TableHead className="text-right">kcal / 100g</TableHead>
                  <TableHead className="text-right">kcal / {ui.grams}g</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((food) => (
                    <TableRow key={food.id}>
                      <TableCell className="whitespace-normal">
                        <p className="font-medium text-foreground">{food.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          기본 1회 제공량 {food.defaultServingG}g ≈ {kcalFor(food, food.defaultServingG)} kcal
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{food.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{food.kcalPer100g.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-primary">{kcalFor(food, ui.grams).toLocaleString()}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Separator className="my-8" />

          <Card className="border-border/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">다음 단계</CardTitle>
              <CardDescription>
                나중에 CSV/공공데이터/API로 데이터셋을 교체할 때는 `lib/calorie-dataset.ts`만 바꾸면 됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              현재는 데모 데이터로 동작하며, 실제 서비스용 데이터(식품의약품안전처/식품영양DB 등)로 확장 가능합니다.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

