import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimePortfolio() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to holdings changes
    const holdingsChannel = supabase
      .channel('holdings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'holdings',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['holdings'] });
          queryClient.invalidateQueries({ queryKey: ['portfolio'] });
        }
      )
      .subscribe();

    // Subscribe to orders changes
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
      )
      .subscribe();

    // Subscribe to accounts changes
    const accountsChannel = supabase
      .channel('accounts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'accounts',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['accounts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(holdingsChannel);
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(accountsChannel);
    };
  }, [queryClient]);
}
