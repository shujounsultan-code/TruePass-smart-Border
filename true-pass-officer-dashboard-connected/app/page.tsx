"use client"

import { useEffect, useMemo, useState } from "react"
import { RefreshCw } from "lucide-react"
import { Dashboard } from "@/components/dashboard"
import type { Inspection, MatchStatus } from "@/lib/truepass-data"

const MOCKAPI_URL = "https://6aa7a6d59b08676cd32b6432.mockapi.io/passengers"

type RawPassenger = {
  id: string
  name: string
  national_id: string
  photo_url: string
  status: string
}

// يستخرج رقم اللوحة من مسار الصورة، مثل: data/cars/ABC123/... أو data/cars/ABC123.jpg
function extractPlate(photoUrl: string): string {
  const match = photoUrl.match(/data\/cars\/([^/.]+)/)
  return match ? match[1] : "غير معروف"
}

// يحوّل حالة MockAPI (matched/not_matched) إلى الحالات اللي تفهمها الواجهة
function mapStatus(raw: string): MatchStatus {
  if (raw === "matched") return "matched"
  if (raw === "not_matched") return "review" // بانتظار التحقق
  return "mismatch"
}

export default function Page() {
  const [rawPassengers, setRawPassengers] = useState<RawPassenger[]>([])
  const [selectedPlate, setSelectedPlate] = useState<string>("")
  const [loading, setLoading] = useState(true)

  async function loadData() {
    setLoading(true)
    try {
      const res = await fetch(MOCKAPI_URL)
      const data: RawPassenger[] = await res.json()
      setRawPassengers(data)
      if (data.length > 0 && !selectedPlate) {
        setSelectedPlate(extractPlate(data[data.length - 1].photo_url))
      }
    } catch (error) {
      console.error("[TruePass] Failed to load MockAPI data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const plates = useMemo(
    () => Array.from(new Set(rawPassengers.map((p) => extractPlate(p.photo_url)))),
    [rawPassengers],
  )

  const inspection: Inspection | null = useMemo(() => {
    if (!selectedPlate) return null
    const group = rawPassengers.filter(
      (p) => extractPlate(p.photo_url) === selectedPlate,
    )
    if (group.length === 0) return null

    return {
      vehicle: {
        plate: selectedPlate,
        plateRegion: "—",
        type: "—",
        driverName: "—",
        origin: "—",
        gate: "منفذ البطحاء",
        arrivedAt: new Date().toLocaleTimeString("ar-SA"),
      },
      registeredPassengers: group.map((p) => ({
        id: p.id,
        name: p.name || "بدون اسم",
        nationalId: p.national_id || "—",
        photo: "/placeholder-user.jpg",
        status: mapStatus(p.status),
      })),
      actualCount: group.length,
    }
  }, [rawPassengers, selectedPlate])

  return (
    <div>
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 pt-4 lg:px-8">
        <div className="flex items-center gap-2">
          <label htmlFor="plate-select" className="text-sm font-medium text-muted-foreground">
            اختر المركبة:
          </label>
          <select
            id="plate-select"
            value={selectedPlate}
            onChange={(e) => setSelectedPlate(e.target.value)}
            className="rounded-lg border border-input bg-card px-3 py-1.5 text-sm"
          >
            {plates.map((plate) => (
              <option key={plate} value={plate}>
                {plate}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          تحديث
        </button>
      </div>

      <Dashboard inspection={inspection} />
    </div>
  )
}
