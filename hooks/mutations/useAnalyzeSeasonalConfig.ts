import { analyzeSeasonalConfig } from '@/apis/zone.api'
import { useMutation } from '@tanstack/react-query'

export const useAnalyzeSeasonalConfig = () => {
  return useMutation({
    mutationFn: ({ zoneId, days = 30 }: { zoneId: string; days?: number }) => analyzeSeasonalConfig(zoneId, days)
  })
}
