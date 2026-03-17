import { useQuery } from '@tanstack/react-query';
import { getZones, Zone } from '@/apis/zone.api';

export const useZones = () => {
  return useQuery<Zone[], Error>({
    queryKey: ['zones'],
    queryFn: getZones,
  });
};
