import { apiClient } from '@/core/api/axios'
import { SpeciesWiki } from '@/types/garden.types'

export interface GetSpeciesResponse {
  data: SpeciesWiki[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const getSpecies = async (): Promise<GetSpeciesResponse> => {
  const response = await apiClient.get('/species')
  return response.data || { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } }
}
