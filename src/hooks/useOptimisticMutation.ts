
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface OptimisticMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: string[];
  optimisticUpdate?: (oldData: any, variables: TVariables) => any;
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

export const useOptimisticMutation = <TData, TVariables>({
  mutationFn,
  queryKey,
  optimisticUpdate,
  successMessage,
  errorMessage,
  onSuccess,
  onError
}: OptimisticMutationOptions<TData, TVariables>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(queryKey);

      // Optimistically update to the new value
      if (optimisticUpdate && previousData) {
        queryClient.setQueryData(queryKey, (old: any) => 
          optimisticUpdate(old, variables)
        );
      }

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (error: Error, variables: TVariables, context: any) => {
      // Rollback to the previous value if there's an error
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      if (errorMessage) {
        toast.error(errorMessage);
      }
      
      onError?.(error, variables);
      console.error('Mutation error:', error);
    },
    onSuccess: (data: TData, variables: TVariables) => {
      if (successMessage) {
        toast.success(successMessage);
      }
      
      onSuccess?.(data, variables);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
