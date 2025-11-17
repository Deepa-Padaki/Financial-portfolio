import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type OrderType = 'market' | 'limit' | 'stop_loss' | 'stop_limit';
export type OrderStatus = 'pending' | 'filled' | 'cancelled' | 'rejected';

export interface Order {
  id: string;
  account_id: string;
  symbol: string;
  side: string;
  order_type: OrderType;
  quantity: number;
  price?: number;
  stop_price?: number;
  status: OrderStatus;
  filled_quantity?: number;
  filled_price?: number;
  submitted_at: string;
  filled_at?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderParams {
  account_id: string;
  symbol: string;
  side: 'buy' | 'sell';
  order_type: OrderType;
  quantity: number;
  price?: number;
  stop_price?: number;
}

export function useOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  const createOrder = useMutation({
    mutationFn: async (orderParams: CreateOrderParams) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderParams])
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Order placed successfully',
        description: `${data.side.toUpperCase()} ${data.quantity} shares of ${data.symbol}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to place order',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const cancelOrder = useMutation({
    mutationFn: async (orderId: string) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled' as OrderStatus,
          cancelled_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .eq('status', 'pending')
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Order cancelled',
        description: 'Your order has been cancelled successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to cancel order',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    orders,
    isLoading,
    error,
    createOrder,
    cancelOrder,
  };
}