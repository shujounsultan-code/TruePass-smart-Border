import { ShieldCheck } from "lucide-react"

interface DashboardHeaderProps {
  captainName?: string
  borderName?: string
}

export function DashboardHeader({
  captainName,
  borderName,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-brand-navy text-brand-navy-fg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-green text-brand-green-fg">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight">
              TruePass
              <span className="mr-2 text-sm font-medium text-brand-navy-fg/70">
                نظام التسجيل المسبق
              </span>
            </p>
            <p className="text-sm text-brand-navy-fg/70">
              لوحة تحكم قائد المركبة — تسجيل الركاب قبل الوصول للمنفذ البري
            </p>
          </div>
        </div>

        <div className="hidden text-left sm:block">
          {captainName ? (
            <p className="text-sm font-semibold">{captainName}</p>
          ) : null}
          {borderName ? (
            <p className="text-xs text-brand-navy-fg/70">
              منفذ: {borderName}
            </p>
          ) : null}
        </div>
      </div>
    </header>
  )
}
