"use client"

import { useEffect, useMemo, useState } from "react"
import { ScanFace, Loader2, ShieldCheck, CheckCircle2, Ban, Inbox } from "lucide-react"
import type { Inspection } from "@/lib/truepass-data"
import { computeVerdict } from "@/lib/verdict"
import { VehicleHeader } from "./vehicle-header"
import { PassengerTable } from "./passenger-table"
import { OverallResult } from "./overall-result"
import { ActionButtons } from "./action-buttons"

type Phase = "scanning" | "result"

type DashboardProps = {
  /**
   * The inspection to display. Wire this to your external data source (API/MCP).
   * When null/undefined, the screen shows the "waiting for a vehicle" empty state.
   */
  inspection?: Inspection | null
}

export function Dashboard({ inspection = null }: DashboardProps) {
  const activeInspection = inspection

  const [phase, setPhase] = useState<Phase>("scanning")
  const [decision, setDecision] = useState<"manual" | "allow" | null>(null)

  // Play a short face-matching animation whenever the active inspection changes.
  useEffect(() => {
    if (!activeInspection) return
    setDecision(null)
    setPhase("scanning")
    const t = setTimeout(() => setPhase("result"), 1400)
    return () => clearTimeout(t)
  }, [activeInspection])

  const verdict = useMemo(
    () => (activeInspection ? computeVerdict(activeInspection) : null),
    [activeInspection],
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border bg-navy text-navy-foreground">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand text-brand-foreground">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <p className="text-lg font-extrabold leading-tight">TruePass</p>
              <p className="text-xs text-navy-foreground/60">نظام التحقق الذكي من هوية الركاب</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 text-sm md:flex">
              <span className="text-navy-foreground/60">الموظف:</span>
              <span className="font-semibold">م. سعود الغامدي</span>
              <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8 lg:py-8">
        {!activeInspection ? (
          <StateCard
            icon={<Inbox className="size-10 text-muted-foreground" />}
            title="لا توجد مركبة قيد التفتيش"
            desc="بانتظار وصول مركبة جديدة إلى المنفذ. سيتم عرض بيانات الركاب تلقائيًا عند توفرها."
          />
        ) : (
          <>
            <VehicleHeader vehicle={activeInspection.vehicle} />

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_420px]">
              <PassengerTable
                passengers={activeInspection.registeredPassengers}
                actualCount={activeInspection.actualCount}
              />

              <div className="flex flex-col gap-6">
                {phase === "scanning" ? (
                  <ScanningCard />
                ) : (
                  verdict && (
                    <>
                      <OverallResult verdict={verdict} />
                      <ActionButtons
                        decision={decision}
                        onManual={() => setDecision("manual")}
                        onAllow={() => setDecision("allow")}
                      />
                      {decision && <DecisionNote decision={decision} />}
                    </>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function StateCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center">
      {icon}
      <div>
        <p className="text-xl font-bold text-foreground">{title}</p>
        <p className="mx-auto mt-1 max-w-md text-base text-muted-foreground">{desc}</p>
      </div>
    </section>
  )
}

function ScanningCard() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-brand/40 bg-brand/5 px-6 py-12 text-center">
      <div className="relative flex size-20 items-center justify-center">
        <ScanFace className="size-12 text-brand" />
        <Loader2 className="absolute inset-0 size-20 animate-spin text-brand/40" />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground">جارٍ مطابقة الوجوه...</p>
        <p className="mt-1 text-base text-muted-foreground">
          يتم التحقق من هوية الركاب مقابل السجلات المسبقة
        </p>
      </div>
    </section>
  )
}

function DecisionNote({ decision }: { decision: "manual" | "allow" }) {
  const isAllow = decision === "allow"
  return (
    <div
      role="status"
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-base font-semibold ${
        isAllow
          ? "border-ok/30 bg-ok/10 text-ok"
          : "border-danger/30 bg-danger/10 text-danger"
      }`}
    >
      {isAllow ? <CheckCircle2 className="size-5" /> : <Ban className="size-5" />}
      {isAllow
        ? "تم تسجيل السماح بالعبور — يمكن للمركبة المتابعة."
        : "تمت إحالة المركبة إلى ساحة التفتيش اليدوي."}
    </div>
  )
}
