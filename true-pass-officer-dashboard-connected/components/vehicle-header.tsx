import { Car, User, MapPin, Clock, DoorOpen } from "lucide-react"
import type { Vehicle } from "@/lib/truepass-data"

export function VehicleHeader({ vehicle }: { vehicle: Vehicle }) {
  return (
    <section
      aria-label="معلومات المركبة"
      className="rounded-2xl border border-white/10 bg-navy text-navy-foreground shadow-lg"
    >
      <div className="flex flex-col gap-6 p-5 lg:flex-row lg:items-stretch lg:gap-8 lg:p-6">
        {/* License plate */}
        <div className="flex shrink-0 flex-col items-center justify-center gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-brand">
            رقم اللوحة
          </span>
          <div className="flex flex-col items-center rounded-xl border-2 border-brand/60 bg-white px-6 py-3 text-navy shadow-inner">
            <span className="text-3xl font-bold tracking-[0.2em] lg:text-4xl">
              {vehicle.plate}
            </span>
            <span className="mt-1 text-sm font-medium text-navy/70">
              {vehicle.plateRegion} — السعودية
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden w-px shrink-0 bg-white/10 lg:block" aria-hidden="true" />

        {/* Details grid */}
        <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-3">
          <Detail icon={Car} label="نوع المركبة" value={vehicle.type} />
          <Detail icon={User} label="قائد المركبة" value={vehicle.driverName} />
          <Detail icon={MapPin} label="مصدر القدوم" value={vehicle.origin.replace("قادمة من: ", "")} />
          <Detail icon={DoorOpen} label="المسار / الكشك" value={vehicle.gate} />
          <Detail icon={Clock} label="وقت الوصول" value={vehicle.arrivedAt} />
        </div>
      </div>
    </section>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-navy-foreground/60">{label}</p>
        <p className="truncate text-base font-semibold">{value}</p>
      </div>
    </div>
  )
}
