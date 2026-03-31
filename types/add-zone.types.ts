export const EXPOSURE_OPTIONS = [
  { value: 'FULL_SUN', label: 'Full Sun', description: 'Direct sunlight most of the day' },
  { value: 'PARTIAL_SHADE', label: 'Partial Shade', description: 'Some direct sunlight' },
  { value: 'FULL_SHADE', label: 'Full Shade', description: 'Little to no direct sun' }
] as const

export type ExposureType = (typeof EXPOSURE_OPTIONS)[number]['value']

export interface ZoneFormData {
  name: string
  locationCity: string
  exposure: ExposureType
  imageUrl: string | null
}
