import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  account_type: 'brokerage' | 'ira' | 'roth_ira' | '401k' | 'taxable';
  broker_name?: string;
  account_number?: string;
  is_connected: boolean;
  last_synced_at?: string;
  balance: number;
  buying_power: number;
  created_at: string;
  updated_at: string;
}

export function useAccounts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Account[];
    },
  });

  const createAccount = useMutation({
    mutationFn: async (account: Partial<Account>) => {
      const { data, error } = await supabase
        .from('accounts')
        .insert([account as any])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({ title: 'Account created successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create account',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateAccount = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Account> }) => {
      const { data, error } = await supabase
        .from('accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({ title: 'Account updated successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update account',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('accounts').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({ title: 'Account deleted successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete account',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    accounts,
    isLoading,
    createAccount,
    updateAccount,
    deleteAccount,
  };
}
