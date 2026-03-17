import { useQuery } from '@tanstack/react-query';
import { getSpecies, GetSpeciesResponse } from '@/apis/species.api';

export const useSpecies = () => {
  return useQuery<GetSpeciesResponse, Error>({
    queryKey: ['species'],
    queryFn: getSpecies,
  });
};
