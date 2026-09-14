import { Check, X, Clock } from "lucide-react"
import type { MatchStatus } from "@/lib/truepass-data"

const config: Record<
  MatchStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  matched: {
    label: "متطابق",
    className: "bg-ok/15 text-ok border-ok/30",
    icon: Check,
  },
  mismatch: {
    label: "غير متطابق",
    className: "bg-danger/15 text-danger border-danger/30",
    icon: X,
  },
  review: {
    label: "قيد المراجعة",
    className: "bg-warn/25 text-warn-foreground border-warn/50",
    icon: Clock,
  },
}

export function StatusBadge({ status }: { status: MatchStatus }) {
  const { label, className, icon: Icon } = config[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${className}`}
    >
      <Icon className="size-4" />
      {label}
    </span>
  )
}
