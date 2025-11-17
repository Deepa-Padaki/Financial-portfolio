import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface WatchlistItem {
  id: string;
  watchlist_id: string;
  symbol: string;
  notes?: string;
  created_at: string;
}

export function useWatchlists() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: watchlists, isLoading } = useQuery({
    queryKey: ['watchlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlists')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Watchlist[];
    },
  });

  const createWatchlist = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from('watchlists')
        .insert([{ name } as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      toast({ title: 'Watchlist created successfully' });
    },
  });

  const deleteWatchlist = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('watchlists').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] });
      toast({ title: 'Watchlist deleted successfully' });
    },
  });

  return {
    watchlists,
    isLoading,
    createWatchlist,
    deleteWatchlist,
  };
}

export function useWatchlistItems(watchlistId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items, isLoading } = useQuery({
    queryKey: ['watchlist-items', watchlistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('watchlist_items')
        .select('*')
        .eq('watchlist_id', watchlistId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WatchlistItem[];
    },
    enabled: !!watchlistId,
  });

  const addItem = useMutation({
    mutationFn: async ({ symbol, notes }: { symbol: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('watchlist_items')
        .insert([{ watchlist_id: watchlistId, symbol, notes }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist-items', watchlistId] });
      toast({ title: 'Stock added to watchlist' });
    },
    onError: (error: any) => {
      if (error.message.includes('duplicate')) {
        toast({
          title: 'Stock already in watchlist',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Failed to add stock',
          description: error.message,
          variant: 'destructive',
        });
      }
    },
  });

  const removeItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('watchlist_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist-items', watchlistId] });
      toast({ title: 'Stock removed from watchlist' });
    },
  });

  return {
    items,
    isLoading,
    addItem,
    removeItem,
  };
}
