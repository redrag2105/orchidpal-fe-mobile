import { useQuery } from '@tanstack/react-query';
import { getZoneById, ZoneDetail } from '@/apis/zone.api';

export const useZoneDetail = (id: string, enabled: boolean = true) => {
  return useQuery<ZoneDetail, Error>({
    queryKey: ['zone', id],
    queryFn: () => getZoneById(id),
    enabled: !!id && enabled,
  });
};
