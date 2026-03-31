export type PlantData = {
  nickname: string
  species_id: string
  zone_id: string | null
  planted_at: string
  image_url: string
}

export type StepProps = {
  plantData: PlantData
  setPlantData: (data: PlantData) => void
  nextStep: () => void
  enteringAnim?: any
  exitingAnim?: any
  [key: string]: any
}
