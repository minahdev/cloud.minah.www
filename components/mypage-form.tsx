"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Activity, Heart, Save, UserRound } from "lucide-react"

import Link from "next/link"

import { getLoggedInUserId } from "@/lib/auth-session"
import {
  calcBmi,
  EXPERIENCE_OPTIONS,
  FAVORITE_EXERCISE_OPTIONS,
  fetchMyPageProfileFromApi,
  formatBirthDate,
  isValidBirthDate,
  saveMyPageProfileToApi,
  type ExerciseExperience,
  type FavoriteExercise,
  type WeeklyExerciseGoal,
  WEEKLY_GOAL_OPTIONS,
} from "@/lib/mypage-profile"

const inputClass =
  "w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"

function RadioGroup<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  disabled,
}: {
  name: string
  legend: string
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  disabled?: boolean
}) {
  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="mb-1 block text-sm font-medium text-foreground">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((opt) => {
          const id = `${name}-${opt.value}`
          const checked = value === opt.value
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                checked
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="size-4 accent-primary"
              />
              <span>{opt.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function MyPageForm() {
  const [hydrated, setHydrated] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [phone, setPhone] = useState("")
  const [heightCm, setHeightCm] = useState("")
  const [weightKg, setWeightKg] = useState("")
  const [favoriteExercise, setFavoriteExercise] = useState<FavoriteExercise>("gym")
  const [favoriteExerciseOther, setFavoriteExerciseOther] = useState("")
  const [experience, setExperience] = useState<ExerciseExperience>("under_1")
  const [weeklyGoal, setWeeklyGoal] = useState<WeeklyExerciseGoal>("3_4")
  const [healthNote, setHealthNote] = useState("")

  useEffect(() => {
    const id = getLoggedInUserId()
    setUserId(id)
    if (!id) {
      setHydrated(true)
      return
    }

    void (async () => {
      try {
        const saved = await fetchMyPageProfileFromApi(id)
        if (saved) {
          setName(saved.name)
          setBirthDate(saved.birthDate)
          setPhone(saved.phone)
          setHeightCm(saved.heightCm)
          setWeightKg(saved.weightKg)
          setFavoriteExercise(saved.favoriteExercise)
          setFavoriteExerciseOther(saved.favoriteExerciseOther ?? "")
          setExperience(saved.experience)
          setWeeklyGoal(saved.weeklyGoal ?? "3_4")
          setHealthNote(saved.healthNote ?? "")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "프로필을 불러오지 못했습니다.")
      } finally {
        setHydrated(true)
      }
    })()
  }, [])

  const bmi = useMemo(() => calcBmi(heightCm, weightKg), [heightCm, weightKg])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSavedMessage(null)

    if (!userId) {
      setError("로그인 후 마이페이지를 저장할 수 있습니다.")
      return
    }

    if (!isValidBirthDate(birthDate)) {
      setError("생년월일은 8자리(예: 20030401)로 입력해 주세요.")
      return
    }
    if (favoriteExercise === "other" && !favoriteExerciseOther.trim()) {
      setError("기타 운동을 선택한 경우 운동 종목을 입력해 주세요.")
      return
    }

    setSubmitting(true)
    try {
      const message = await saveMyPageProfileToApi(userId, {
        name: name.trim(),
        birthDate: birthDate.replace(/\D/g, ""),
        phone: phone.trim(),
        heightCm: heightCm.trim(),
        weightKg: weightKg.trim(),
        favoriteExercise,
        favoriteExerciseOther: favoriteExerciseOther.trim(),
        experience,
        weeklyGoal,
        healthNote: healthNote.trim(),
      })
      setSavedMessage(message)
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!hydrated) {
    return <div className="min-h-[20rem] animate-pulse rounded-2xl bg-secondary/30" aria-hidden />
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-8 text-center md:text-left">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-secondary/80 px-3 py-1.5 text-xs font-medium text-foreground/90">
          <UserRound className="size-3.5 text-primary" aria-hidden />
          헬스 프로필
        </div>
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">마이페이지</h1>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">
          맞춤 운동·피드백을 위해 기초 신체 정보와 운동 습관을 입력해 주세요. Neon DB에 저장됩니다.
          {userId ? (
            <span className="mt-1 block text-xs text-muted-foreground">로그인 아이디: {userId}</span>
          ) : null}
        </p>
      </div>

      {!userId ? (
        <p className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
          마이페이지를 저장하려면{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            로그인
          </Link>
          이 필요합니다.
        </p>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="space-y-8 rounded-2xl border border-border bg-card/90 p-6 shadow-lg shadow-black/10 backdrop-blur-sm md:p-8"
      >
        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <UserRound className="size-5 text-primary" aria-hidden />
            기본 정보
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="mypage-name" className="mb-2 block text-sm font-medium text-foreground">
                이름
              </label>
              <input
                id="mypage-name"
                name="name"
                required
                disabled={submitting}
                className={inputClass}
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="mypage-birth" className="mb-2 block text-sm font-medium text-foreground">
                생년월일
              </label>
              <input
                id="mypage-birth"
                name="birthDate"
                required
                inputMode="numeric"
                maxLength={10}
                disabled={submitting}
                className={inputClass}
                placeholder="20030401"
                value={formatBirthDate(birthDate)}
                onChange={(e) => setBirthDate(e.target.value.replace(/\D/g, "").slice(0, 8))}
              />
              <p className="mt-1 text-xs text-muted-foreground">숫자 8자리 (YYYYMMDD)</p>
            </div>
            <div>
              <label htmlFor="mypage-phone" className="mb-2 block text-sm font-medium text-foreground">
                전화번호
              </label>
              <input
                id="mypage-phone"
                name="phone"
                type="tel"
                required
                disabled={submitting}
                className={inputClass}
                placeholder="010-1234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Activity className="size-5 text-primary" aria-hidden />
            신체 정보
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="mypage-height" className="mb-2 block text-sm font-medium text-foreground">
                키 (cm)
              </label>
              <input
                id="mypage-height"
                name="heightCm"
                type="number"
                min={100}
                max={250}
                required
                disabled={submitting}
                className={inputClass}
                placeholder="170"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="mypage-weight" className="mb-2 block text-sm font-medium text-foreground">
                몸무게 (kg)
              </label>
              <input
                id="mypage-weight"
                name="weightKg"
                type="number"
                min={30}
                max={300}
                step="0.1"
                required
                disabled={submitting}
                className={inputClass}
                placeholder="65"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            </div>
          </div>
          {bmi != null ? (
            <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
              계산된 BMI: <strong className="text-primary">{bmi}</strong>
              <span className="ml-2 text-muted-foreground">(참고용, 의료 진단이 아닙니다)</span>
            </p>
          ) : null}
        </section>

        <RadioGroup
          name="favoriteExercise"
          legend="자주 하는 운동"
          options={FAVORITE_EXERCISE_OPTIONS}
          value={favoriteExercise}
          onChange={setFavoriteExercise}
          disabled={submitting}
        />

        {favoriteExercise === "other" ? (
          <div>
            <label htmlFor="mypage-exercise-other" className="mb-2 block text-sm font-medium text-foreground">
              기타 운동 종목
            </label>
            <input
              id="mypage-exercise-other"
              name="favoriteExerciseOther"
              disabled={submitting}
              className={inputClass}
              placeholder="예: 수영, 요가, 클라이밍"
              value={favoriteExerciseOther}
              onChange={(e) => setFavoriteExerciseOther(e.target.value)}
            />
          </div>
        ) : null}

        <RadioGroup
          name="experience"
          legend="운동 경력"
          options={EXPERIENCE_OPTIONS}
          value={experience}
          onChange={setExperience}
          disabled={submitting}
        />

        <RadioGroup
          name="weeklyGoal"
          legend="주간 운동 목표 (추가)"
          options={WEEKLY_GOAL_OPTIONS}
          value={weeklyGoal}
          onChange={setWeeklyGoal}
          disabled={submitting}
        />

        <section className="space-y-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Heart className="size-5 text-primary" aria-hidden />
            건강 메모 (추가)
          </h2>
          <p className="text-xs text-muted-foreground">부상 이력, 알레르기, 복용 약 등 AI·코치 참고용 (선택)</p>
          <textarea
            id="mypage-health-note"
            name="healthNote"
            rows={3}
            disabled={submitting}
            className={`${inputClass} resize-y min-h-[5rem]`}
            placeholder="예: 무릎 통증 있어 러닝 시 주의"
            value={healthNote}
            onChange={(e) => setHealthNote(e.target.value)}
          />
        </section>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {savedMessage ? <p className="text-sm text-primary">{savedMessage}</p> : null}

        <button
          type="submit"
          disabled={submitting || !userId}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          <Save className="size-4" aria-hidden />
          {submitting ? "저장 중…" : "프로필 저장"}
        </button>
      </form>
    </div>
  )
}