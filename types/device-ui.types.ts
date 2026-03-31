/**
 * Device Types
 */

export interface Device {
  id: string
  
  serial_number: string
  status: "ONLINE" | "OFFLINE"
  last_online_at: string | null
  signalStrength: number
  zoneName?: string
}
