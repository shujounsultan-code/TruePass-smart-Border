"use client"

import { useState } from "react"
import { Plus, Send, CheckCircle2 } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { VehicleInfoForm } from "@/components/vehicle-info-form"
import { PassengerCard } from "@/components/passenger-card"
import {
  createEmptyPassenger,
  type VehicleInfo,
  type Passenger,
  type SubmissionStatus,
} from "@/lib/truepass-types"

export default function Page() {
  const [vehicle, setVehicle] = useState<VehicleInfo>({
    plateNumber: "",
    type: "",
    seats: "",
  })
  const [passengers, setPassengers] = useState<Passenger[]>([
    createEmptyPassenger(),
  ])
  const [status, setStatus] = useState<SubmissionStatus>("idle")
  const [referenceCode, setReferenceCode] = useState<string | null>(null)

  const disabled = status === "submitting" || status === "success"

  function updatePassenger(updated: Passenger) {
    setPassengers((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    )
  }

  function removePassenger(id: string) {
    setPassengers((prev) => prev.filter((p) => p.id !== id))
  }

  function addPassenger() {
    setPassengers((prev) => [...prev, createEmptyPassenger()])
  }

  const MOCKAPI_URL = "https://6aa7a6d59b08676cd32b6432.mockapi.io/passengers"

  async function handleSubmit() {
    setStatus("submitting")

    try {
      // نرسل كل راكب كسجل منفصل، ونربطه بالمركبة عبر مسار الصورة
      // بنفس تنسيق البيانات الموجودة أصلاً: data/cars/{رقم اللوحة}/...
      await Promise.all(
        passengers.map((p) =>
          fetch(MOCKAPI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: p.name,
              national_id: p.idNumber,
              photo_url: `data/cars/${vehicle.plateNumber}/${p.name}.jpg`,
              status: "not_matched", // بانتظار التحقق عند وصول المركبة
            }),
          }),
        ),
      )

      setStatus("success")
      setReferenceCode(Math.floor(100000 + Math.random() * 900000).toString())
    } catch (error) {
      console.error("[TruePass] Failed to submit to MockAPI:", error)
      setStatus("error")
    }
  }

  const canSubmit =
    !disabled &&
    vehicle.plateNumber.trim() !== "" &&
    vehicle.type !== "" &&
    passengers.every((p) => p.name.trim() !== "" && p.idNumber.trim() !== "")

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader captainName="السائق" borderName="منفذ البطحاء" />

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {status === "success" ? (
          <section className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-6 py-16 text-center">
            <CheckCircle2 className="size-14 text-brand-green" />
            <div>
              <p className="text-xl font-bold text-foreground">
                تم التسجيل بنجاح
              </p>
              <p className="mt-1 text-base text-muted-foreground">
                الرقم المرجعي: <span dir="ltr">{referenceCode}</span>
              </p>
            </div>
          </section>
        ) : (
          <div className="flex flex-col gap-6">
            {status === "error" && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                تعذر إرسال البيانات، تأكد من الاتصال بالإنترنت وحاول مرة أخرى.
              </div>
            )}
            <VehicleInfoForm
              value={vehicle}
              onChange={setVehicle}
              disabled={disabled}
            />

            <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-bold">تسجيل الركاب</h2>
                <button
                  type="button"
                  onClick={addPassenger}
                  disabled={disabled}
                  className="flex items-center gap-1.5 rounded-lg bg-brand-green px-3 py-2 text-sm font-semibold text-brand-green-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="size-4" aria-hidden="true" />
                  إضافة راكب
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {passengers.map((p, i) => (
                  <PassengerCard
                    key={p.id}
                    passenger={p}
                    index={i}
                    onChange={updatePassenger}
                    onRemove={() => removePassenger(p.id)}
                    canRemove={passengers.length > 1}
                    disabled={disabled}
                  />
                ))}
              </div>
            </section>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex items-center gap-2 rounded-xl bg-brand-navy px-6 py-3 text-base font-bold text-brand-navy-fg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="size-5" aria-hidden="true" />
                {status === "submitting" ? "جارٍ الإرسال..." : "إرسال للتحقق المسبق"}
              </button>
              <p className="text-xs text-muted-foreground">
                عدد الركاب المسجلين حتى الآن: {passengers.length}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
