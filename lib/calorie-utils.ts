import type { FoodRecord } from "@/lib/calorie-dataset"

export function kcalForFood(food: Pick<FoodRecord, "kcalPer100g">, grams: number): number {
  return Math.round((food.kcalPer100g * grams) / 100)
}
