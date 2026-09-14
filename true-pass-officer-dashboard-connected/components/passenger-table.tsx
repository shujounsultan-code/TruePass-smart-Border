import Image from "next/image"
import { Users } from "lucide-react"
import type { Passenger } from "@/lib/truepass-data"
import { toArabic } from "@/lib/verdict"
import { StatusBadge } from "./status-badge"

export function PassengerTable({
  passengers,
  actualCount,
}: {
  passengers: Passenger[]
  actualCount: number
}) {
  const countMismatch = actualCount !== passengers.length

  return (
    <section
      aria-label="قائمة الركاب المسجلين"
      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-muted/40 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <Users className="size-5 text-brand" />
          <h2 className="text-lg font-bold text-foreground">الركاب المسجلون مسبقًا</h2>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">مسجل:</span>
          <span className="font-bold text-foreground">{toArabic(passengers.length)}</span>
          <span className="text-muted-foreground">/ فعلي:</span>
          <span
            className={`font-bold ${countMismatch ? "text-danger" : "text-ok"}`}
          >
            {toArabic(actualCount)}
          </span>
        </div>
      </header>

      {/* Column headers */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid-cols-[56px_1fr_1fr_auto]">
        <span>الصورة</span>
        <span>الاسم</span>
        <span className="hidden lg:block">رقم الهوية</span>
        <span className="text-left">حالة التحقق</span>
      </div>

      <ul className="divide-y divide-border">
        {passengers.map((p) => (
          <li
            key={p.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/30 lg:grid-cols-[56px_1fr_1fr_auto]"
          >
            <Image
              src={p.photo || "/placeholder.svg"}
              alt={`صورة ${p.name}`}
              width={56}
              height={56}
              className="size-14 rounded-lg border border-border object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-foreground">{p.name}</p>
              <p className="mt-0.5 text-sm tracking-wide text-muted-foreground lg:hidden">
                {p.nationalId}
              </p>
            </div>
            <p className="hidden text-base tracking-wide text-foreground lg:block">{p.nationalId}</p>
            <div className="flex justify-end">
              <StatusBadge status={p.status} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
