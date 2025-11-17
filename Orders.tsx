import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/tables/DataTable';
import { Download, X } from 'lucide-react';
import { useOrders, Order } from '@/hooks/useOrders';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Orders() {
  const [selectedTab, setSelectedTab] = useState('all');
  const { orders, isLoading, cancelOrder } = useOrders();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      filled: 'secondary',
      pending: 'default',
      cancelled: 'destructive',
      rejected: 'destructive',
    };
    return <Badge variant={variants[status.toLowerCase()] || 'default'}>{status}</Badge>;
  };

  const columns = [
    {
      key: 'submitted_at',
      header: 'Date',
      sortable: true,
      render: (item: Order) => new Date(item.submitted_at).toLocaleString(),
    },
    {
      key: 'symbol',
      header: 'Symbol',
      sortable: true,
    },
    {
      key: 'side',
      header: 'Side',
      render: (item: Order) => (
        <Badge variant={item.side === "buy" ? "default" : "destructive"}>
          {item.side.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'order_type',
      header: 'Type',
      sortable: true,
      render: (item: Order) => (
        <span className="capitalize">{item.order_type.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      sortable: true,
    },
    {
      key: 'price',
      header: 'Price',
      render: (item: Order) => item.price ? `$${item.price.toFixed(2)}` : 'Market',
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: Order) => getStatusBadge(item.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: Order) => (
        item.status === "pending" ? (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => cancelOrder.mutate(item.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null
      ),
    },
  ];

  const filteredOrders = selectedTab === 'all' 
    ? orders || []
    : (orders || []).filter(order => order.status.toLowerCase() === selectedTab);

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order History</h1>
            <p className="text-muted-foreground">View and manage your trading orders</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <Card>
          <CardHeader>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="filled">Filled</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {filteredOrders.length > 0 ? (
              <DataTable data={filteredOrders} columns={columns} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No orders found. Place your first trade to see orders here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}