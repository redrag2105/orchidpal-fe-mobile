/**
 * Device Types
 */

export interface Device {
  id: string
  name: string
  serialNumber: string
  status: 'online' | 'offline'
  lastSync: string
  signalStrength: number
  zoneName?: string
}
