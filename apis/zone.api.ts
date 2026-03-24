import { apiClient } from '@/core/api/axios'

export interface Zone {
  id: string
  user_id: string
  name: string
  exposure: string
  location_city: string
  image_url: string | null
  created_at: string
  has_plant: boolean
  has_device: boolean
}

export interface ZoneDetail extends Omit<Zone, 'has_plant' | 'has_device'> {
  my_plants: any[]
  devices: any[]
  automation_rules: any[]
}

export const getZones = async (): Promise<Zone[]> => {
  const response = await apiClient.get('/zones')
  return response.data || []
}

export const getZoneById = async (id: string): Promise<ZoneDetail> => {
  const response = await apiClient.get(`/zones/${id}`)
  return response.data
}

export const updateAutomationRules = async (id: string, logic: any[]): Promise<any> => {
  const response = await apiClient.patch(`/zones/${id}/automation-rules`, { logic })
  return response.data
}

export interface CreateZoneRequest {
  name: string
  location_city: string
  exposure: string
  image_url?: string
}

export const createZone = async (payload: CreateZoneRequest): Promise<any> => {
  const response = await apiClient.post('/zones', payload)
  return response.data
}

export interface UpdateZoneRequest {
  name?: string
  location_city?: string
  exposure?: string
  image_url?: string
}

export const updateZone = async (id: string, payload: UpdateZoneRequest): Promise<any> => {
  const response = await apiClient.patch(`/zones/${id}`, payload)
  return response.data
}

export const analyzeSeasonalConfig = async (zoneId: string, days: number = 30): Promise<any> => {
  const response = await apiClient.post(`/zones/analyze-seasonal-config`, { zoneId, days })
  return response.data
}


export const refreshAutomationRules = async (id: string): Promise<any> => {
  const response = await apiClient.post(`/zones/${id}/automation-rules/refresh`)
  return response.data
}
