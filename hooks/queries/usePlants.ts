import { useQuery } from '@tanstack/react-query';
import { getMyPlants, GetMyPlantsResponse } from '@/apis/plant.api';

export const usePlants = () => {
  return useQuery<GetMyPlantsResponse, Error>({
    queryKey: ['plants'],
    queryFn: getMyPlants,
  });
};
