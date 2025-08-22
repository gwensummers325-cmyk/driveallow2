import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface BalanceSyncHookProps {
  teenId: string;
  enabled: boolean;
}

// Custom hook to automatically sync card balance when allowance changes
export function useBalanceSync({ teenId, enabled }: BalanceSyncHookProps) {
  const queryClient = useQueryClient();

  const syncBalanceMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/stripe/sync-balance/${teenId}`);
      return response.json();
    },
    onError: (error) => {
      console.error('Failed to sync card balance:', error);
    },
  });

  // Auto-sync card balance when balance data changes
  useEffect(() => {
    if (enabled) {
      const syncBalance = () => {
        syncBalanceMutation.mutate();
      };

      // Set up a listener for balance changes
      const handleBalanceChange = () => {
        setTimeout(syncBalance, 1000); // Delay to allow transaction to complete
      };

      // Listen for balance-related query invalidations
      const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
        if (event.type === 'updated' && 
            event.query.queryKey.includes('/api/balance/') || 
            event.query.queryKey.includes('/api/dashboard/')) {
          handleBalanceChange();
        }
      });

      return unsubscribe;
    }
  }, [enabled, teenId, syncBalanceMutation, queryClient]);

  return {
    syncBalance: () => syncBalanceMutation.mutate(),
    isSyncing: syncBalanceMutation.isPending,
  };
}