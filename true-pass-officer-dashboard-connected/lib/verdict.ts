import type { Inspection } from "./truepass-data"

export type Verdict = {
  authorized: boolean
  reasons: string[]
}

export function computeVerdict(inspection: Inspection): Verdict {
  const { registeredPassengers, actualCount } = inspection
  const reasons: string[] = []

  const mismatched = registeredPassengers.filter((p) => p.status === "mismatch")
  const underReview = registeredPassengers.filter((p) => p.status === "review")
  const registeredCount = registeredPassengers.length

  if (actualCount !== registeredCount) {
    reasons.push(
      `عدد الركاب الفعلي (${toArabic(actualCount)}) لا يطابق عدد المسجلين مسبقًا (${toArabic(
        registeredCount,
      )}).`,
    )
  }

  if (mismatched.length > 0) {
    reasons.push(
      `${toArabic(mismatched.length)} من الركاب لم تتطابق هويته: ${mismatched
        .map((p) => p.name)
        .join("، ")}.`,
    )
  }

  if (underReview.length > 0) {
    reasons.push(
      `${toArabic(underReview.length)} من الركاب قيد المراجعة ولم يكتمل التحقق بعد.`,
    )
  }

  return {
    authorized: reasons.length === 0,
    reasons,
  }
}

export function toArabic(n: number): string {
  const map = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
  return String(n)
    .split("")
    .map((c) => map[Number(c)] ?? c)
    .join("")
}
