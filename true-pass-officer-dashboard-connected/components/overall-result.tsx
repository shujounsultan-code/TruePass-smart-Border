import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react"
import type { Verdict } from "@/lib/verdict"

export function OverallResult({ verdict }: { verdict: Verdict }) {
  if (verdict.authorized) {
    return (
      <section
        aria-live="polite"
        className="flex items-center gap-5 rounded-2xl border-2 border-ok/40 bg-ok/10 px-6 py-5 shadow-sm"
      >
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-ok text-ok-foreground">
          <ShieldCheck className="size-9" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-ok">
            النتيجة الإجمالية
          </p>
          <h2 className="text-3xl font-extrabold text-ok lg:text-4xl">✅ مصرح بالعبور</h2>
          <p className="mt-1 text-base text-foreground/70">
            تطابقت هوية جميع الركاب مع التسجيل المسبق وتوافق العدد.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      aria-live="assertive"
      className="rounded-2xl border-2 border-danger/50 bg-danger/10 px-6 py-5 shadow-sm"
    >
      <div className="flex items-center gap-5">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-danger text-danger-foreground">
          <ShieldAlert className="size-9" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-danger">
            النتيجة الإجمالية
          </p>
          <h2 className="text-3xl font-extrabold text-danger lg:text-4xl">
            🚫 يتطلب تفتيش يدوي
          </h2>
          <p className="mt-1 text-base text-foreground/70">
            تم رصد عدم تطابق في بيانات الركاب — يُمنع العبور حتى إتمام التفتيش.
          </p>
        </div>
      </div>

      {/* Rejection reasons */}
      <ul className="mt-4 space-y-2 border-t border-danger/20 pt-4">
        {verdict.reasons.map((reason, i) => (
          <li key={i} className="flex items-start gap-2.5 text-base font-medium text-foreground">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
