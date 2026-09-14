"use client"

import { Car, Hash, Users } from "lucide-react"
import {
  VEHICLE_TYPE_LABELS,
  type VehicleInfo,
  type VehicleType,
} from "@/lib/truepass-types"

interface VehicleInfoFormProps {
  value: VehicleInfo
  onChange: (value: VehicleInfo) => void
  disabled?: boolean
}

const fieldClasses =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"

export function VehicleInfoForm({
  value,
  onChange,
  disabled,
}: VehicleInfoFormProps) {
  return (
    <section
      aria-labelledby="vehicle-info-title"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Car className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 id="vehicle-info-title" className="text-base font-bold">
            بيانات المركبة
          </h2>
          <p className="text-xs text-muted-foreground">
            أدخل معلومات المركبة قبل تسجيل الركاب
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <label
            htmlFor="plateNumber"
            className="flex items-center gap-1.5 text-sm font-medium"
          >
            <Hash className="size-4 text-muted-foreground" aria-hidden="true" />
            رقم اللوحة
          </label>
          <input
            id="plateNumber"
            type="text"
            inputMode="text"
            dir="ltr"
            placeholder="أ ب ج 1234"
            className={`${fieldClasses} text-right`}
            value={value.plateNumber}
            disabled={disabled}
            onChange={(e) =>
              onChange({ ...value, plateNumber: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="vehicleType"
            className="flex items-center gap-1.5 text-sm font-medium"
          >
            <Car className="size-4 text-muted-foreground" aria-hidden="true" />
            نوع المركبة
          </label>
          <select
            id="vehicleType"
            className={fieldClasses}
            value={value.type}
            disabled={disabled}
            onChange={(e) =>
              onChange({ ...value, type: e.target.value as VehicleType })
            }
          >
            <option value="" disabled>
              اختر النوع
            </option>
            {(Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[]).map((key) => (
              <option key={key} value={key}>
                {VEHICLE_TYPE_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="seats"
            className="flex items-center gap-1.5 text-sm font-medium"
          >
            <Users
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
            عدد المقاعد
          </label>
          <input
            id="seats"
            type="number"
            min={1}
            max={60}
            placeholder="مثال: 7"
            className={fieldClasses}
            value={value.seats}
            disabled={disabled}
            onChange={(e) =>
              onChange({
                ...value,
                seats: e.target.value === "" ? "" : Number(e.target.value),
              })
            }
          />
        </div>
      </div>
    </section>
  )
}
