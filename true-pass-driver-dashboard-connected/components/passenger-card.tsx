"use client"

import { useRef } from "react"
import { IdCard, Trash2, Upload, User } from "lucide-react"
import type { Passenger } from "@/lib/truepass-types"

interface PassengerCardProps {
  passenger: Passenger
  index: number
  onChange: (passenger: Passenger) => void
  onRemove: () => void
  canRemove: boolean
  disabled?: boolean
}

const fieldClasses =
  "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"

export function PassengerCard({
  passenger,
  index,
  onChange,
  onRemove,
  canRemove,
  disabled,
}: PassengerCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handlePhoto(file: File | null) {
    if (!file) {
      onChange({ ...passenger, photoFile: null, photoPreview: null })
      return
    }
    const preview = URL.createObjectURL(file)
    onChange({ ...passenger, photoFile: file, photoPreview: preview })
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
          <span className="flex size-6 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-brand-green-fg">
            {index + 1}
          </span>
          راكب رقم {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove || disabled}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="size-4" aria-hidden="true" />
          حذف
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row-reverse">
        {/* رفع الصورة الشخصية */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="group relative flex size-24 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-brand-surface transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`رفع صورة الراكب رقم ${index + 1}`}
          >
            {passenger.photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={passenger.photoPreview || "/placeholder.svg"}
                alt={`صورة ${passenger.name || `الراكب رقم ${index + 1}`}`}
                className="size-full object-cover"
              />
            ) : (
              <span className="flex flex-col items-center gap-1 text-muted-foreground">
                <Upload className="size-6" aria-hidden="true" />
                <span className="text-[11px] font-medium">صورة شخصية</span>
              </span>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => handlePhoto(e.target.files?.[0] ?? null)}
          />
          {passenger.photoPreview ? (
            <button
              type="button"
              onClick={() => handlePhoto(null)}
              className="text-[11px] font-medium text-muted-foreground underline-offset-2 hover:text-destructive hover:underline"
            >
              إزالة الصورة
            </button>
          ) : null}
        </div>

        {/* حقول البيانات */}
        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label
              htmlFor={`name-${passenger.id}`}
              className="flex items-center gap-1.5 text-xs font-medium"
            >
              <User
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              الاسم الكامل
            </label>
            <input
              id={`name-${passenger.id}`}
              type="text"
              placeholder="الاسم كما في الهوية"
              className={fieldClasses}
              value={passenger.name}
              disabled={disabled}
              onChange={(e) =>
                onChange({ ...passenger, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor={`id-${passenger.id}`}
              className="flex items-center gap-1.5 text-xs font-medium"
            >
              <IdCard
                className="size-3.5 text-muted-foreground"
                aria-hidden="true"
              />
              رقم الهوية / الإقامة
            </label>
            <input
              id={`id-${passenger.id}`}
              type="text"
              inputMode="numeric"
              dir="ltr"
              placeholder="10 أرقام"
              className={`${fieldClasses} text-right`}
              value={passenger.idNumber}
              disabled={disabled}
              onChange={(e) =>
                onChange({ ...passenger, idNumber: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
