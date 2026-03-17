import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAutomationRules } from '@/apis/zone.api';

export const useUpdateAutomationRules = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, logic }: { id: string; logic: any[] }) => updateAutomationRules(id, logic),
    onSuccess: (_, variables) => {
      // Invalidate the specific zone detail cache when rules are updated
      queryClient.invalidateQueries({ queryKey: ['zone', variables.id] });
    },
  });
};
