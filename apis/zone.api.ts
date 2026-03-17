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
  my_plants: any[];
  devices: any[];
  automation_rules: any[];
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
