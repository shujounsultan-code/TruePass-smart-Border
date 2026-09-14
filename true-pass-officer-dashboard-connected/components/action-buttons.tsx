"use client"

import { Hand, CircleCheckBig } from "lucide-react"

export function ActionButtons({
  onManual,
  onAllow,
  decision,
}: {
  onManual: () => void
  onAllow: () => void
  decision: "manual" | "allow" | null
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={onManual}
        aria-pressed={decision === "manual"}
        className={`flex items-center justify-center gap-3 rounded-xl border-2 px-6 py-5 text-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger/30 ${
          decision === "manual"
            ? "border-danger bg-danger text-danger-foreground shadow-lg"
            : "border-danger/40 bg-danger/10 text-danger hover:bg-danger hover:text-danger-foreground"
        }`}
      >
        <Hand className="size-6" />
        تفتيش يدوي
      </button>
      <button
        type="button"
        onClick={onAllow}
        aria-pressed={decision === "allow"}
        className={`flex items-center justify-center gap-3 rounded-xl border-2 px-6 py-5 text-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ok/30 ${
          decision === "allow"
            ? "border-ok bg-ok text-ok-foreground shadow-lg"
            : "border-ok/40 bg-ok/10 text-ok hover:bg-ok hover:text-ok-foreground"
        }`}
      >
        <CircleCheckBig className="size-6" />
        السماح بالعبور
      </button>
    </div>
  )
}
