// أنواع البيانات المشتركة للوحة تحكم TruePass.
// جميع المكونات تستقبل هذه الأنواع عبر props/state لتسهيل ربطها لاحقًا بمصدر بيانات خارجي (API).

export type VehicleType = "sedan" | "suv" | "van" | "bus" | "truck"

export interface VehicleInfo {
  plateNumber: string
  type: VehicleType | ""
  seats: number | ""
}

export interface Passenger {
  id: string
  name: string
  idNumber: string
  /** معاينة الصورة الشخصية (Object URL أو رابط قادم من الـ API لاحقًا) */
  photoPreview: string | null
  /** الملف الفعلي — يُرسل للـ API عند الربط */
  photoFile?: File | null
}

export type SubmissionStatus = "idle" | "submitting" | "success" | "error"

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  sedan: "سيارة صالون",
  suv: "دفع رباعي",
  van: "فان",
  bus: "حافلة",
  truck: "شاحنة",
}

export function createEmptyPassenger(): Passenger {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
    name: "",
    idNumber: "",
    photoPreview: null,
    photoFile: null,
  }
}
