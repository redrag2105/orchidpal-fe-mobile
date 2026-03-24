import { apiClient } from '@/core/api/axios'
import { Plant } from '@/types/garden.types'

export interface GetMyPlantsResponse {
  plants: Plant[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export const getMyPlants = async (): Promise<GetMyPlantsResponse> => {
  const response = await apiClient.get('/my-plants')
  return response.data || { plants: [], total: 0, page: 1, limit: 10, totalPages: 0 }
}

export interface AssignPlantToZoneRequest {
  plant_id: string
  zone_id: string | null
}

export const assignPlantToZone = async (payload: AssignPlantToZoneRequest) => {
  const response = await apiClient.post('/my-plants/assign-zone', payload)
  return response.data
}

export const getPlantById = async (id: string): Promise<any> => {
  const response = await apiClient.get('/my-plants/' + id)
  return response.data
}

export interface CreatePlantRequest {
  species_id: string
  nickname: string
  planted_at: string
  image_url: string
}

export const createPlant = async (payload: CreatePlantRequest): Promise<any> => {
  const response = await apiClient.post('/my-plants', payload)
  return response.data
}

export interface UpdatePlantRequest {
  nickname?: string
  image_url?: string
}

export const updatePlant = async (id: string, payload: UpdatePlantRequest) => {
  const response = await apiClient.patch(`/my-plants/${id}`, payload)
  return response.data
}

export const removePlantFromZone = async (id: string): Promise<any> => {
  const response = await apiClient.delete(`/my-plants/${id}/remove-garden`)
  return response.data
}
