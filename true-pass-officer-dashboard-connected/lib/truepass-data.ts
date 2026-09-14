export type MatchStatus = "matched" | "mismatch" | "review"

export type Passenger = {
  id: string
  name: string
  nationalId: string
  photo: string
  status: MatchStatus
}

export type Vehicle = {
  plate: string
  plateRegion: string
  type: string
  driverName: string
  origin: string
  gate: string
  arrivedAt: string
}

/**
 * A single inspection event.
 * Wire this shape to your external data source (API/MCP).
 * All components accept it as props, so no code changes are needed to connect it.
 */
export type Inspection = {
  vehicle: Vehicle
  registeredPassengers: Passenger[]
  /** Number of people physically detected in the vehicle by the gate sensors */
  actualCount: number
}
