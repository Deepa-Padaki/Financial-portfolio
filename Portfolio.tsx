import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/tables/DataTable';
import { PieChart } from '@/components/charts/PieChart';
import { LineChart } from '@/components/charts/LineChart';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const holdings = [
  { symbol: 'AAPL', name: 'Apple Inc.', quantity: 50, currentPrice: 175.50, marketValue: 8775, dayChange: 125, totalReturn: 12.5 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', quantity: 30, currentPrice: 142.30, marketValue: 4269, dayChange: -85, totalReturn: 8.3 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', quantity: 40, currentPrice: 380.20, marketValue: 15208, dayChange: 240, totalReturn: 15.7 },
  { symbol: 'TSLA', name: 'Tesla Inc.', quantity: 25, currentPrice: 245.80, marketValue: 6145, dayChange: -120, totalReturn: -5.2 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', quantity: 20, currentPrice: 495.30, marketValue: 9906, dayChange: 180, totalReturn: 22.1 },
];

const allocationData = [
  { name: 'Technology', value: 35, color: 'hsl(var(--primary))' },
  { name: 'Healthcare', value: 20, color: 'hsl(var(--secondary))' },
  { name: 'Finance', value: 15, color: 'hsl(var(--accent))' },
  { name: 'Consumer', value: 18, color: 'hsl(var(--chart-1))' },
  { name: 'Energy', value: 12, color: 'hsl(var(--chart-2))' },
];

const performanceData = [
  { date: 'Jan', value: 42000 },
  { date: 'Feb', value: 43500 },
  { date: 'Mar', value: 44200 },
  { date: 'Apr', value: 45800 },
  { date: 'May', value: 47200 },
  { date: 'Jun', value: 48200 },
];

export default function Portfolio() {
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [timePeriod, setTimePeriod] = useState('6M');

  const columns = [
    { key: 'symbol', header: 'Symbol', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'quantity', header: 'Quantity', sortable: true },
    { 
      key: 'currentPrice', 
      header: 'Price', 
      sortable: true,
      render: (item: typeof holdings[0]) => `$${item.currentPrice.toFixed(2)}`
    },
    { 
      key: 'marketValue', 
      header: 'Market Value', 
      sortable: true,
      render: (item: typeof holdings[0]) => `$${item.marketValue.toLocaleString()}`
    },
    { 
      key: 'dayChange', 
      header: 'Day Change', 
      sortable: true,
      render: (item: typeof holdings[0]) => (
        <span className={item.dayChange >= 0 ? 'text-secondary' : 'text-destructive'}>
          {item.dayChange >= 0 ? '+' : ''}${item.dayChange.toFixed(2)}
        </span>
      )
    },
    { 
      key: 'totalReturn', 
      header: 'Total Return', 
      sortable: true,
      render: (item: typeof holdings[0]) => (
        <span className={item.totalReturn >= 0 ? 'text-secondary' : 'text-destructive'}>
          {item.totalReturn >= 0 ? '+' : ''}{item.totalReturn.toFixed(2)}%
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: typeof holdings[0]) => (
        <Link to={`/stock/${item.symbol}`}>
          <Button variant="ghost" size="sm">View</Button>
        </Link>
      )
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        {/* Portfolio Summary Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl">Portfolio Overview</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Total portfolio value and performance</p>
              </div>
              <div className="flex gap-2">
                <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Accounts</SelectItem>
                    <SelectItem value="robinhood">Robinhood</SelectItem>
                    <SelectItem value="fidelity">Fidelity</SelectItem>
                    <SelectItem value="schwab">Charles Schwab</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-3xl font-bold">$48,200</p>
                <p className="text-sm text-secondary flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +$3,200 (+7.1%)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Change</p>
                <p className="text-3xl font-bold text-secondary">+$850</p>
                <p className="text-sm text-muted-foreground mt-1">+1.79%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Return</p>
                <p className="text-3xl font-bold text-secondary">+$8,200</p>
                <p className="text-sm text-muted-foreground mt-1">+20.5% all time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Performance</CardTitle>
              <Tabs value={timePeriod} onValueChange={setTimePeriod}>
                <TabsList>
                  <TabsTrigger value="1M">1M</TabsTrigger>
                  <TabsTrigger value="3M">3M</TabsTrigger>
                  <TabsTrigger value="6M">6M</TabsTrigger>
                  <TabsTrigger value="1Y">1Y</TabsTrigger>
                  <TabsTrigger value="ALL">ALL</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <LineChart data={performanceData} height={350} />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Asset Allocation */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={allocationData} height={300} />
            </CardContent>
          </Card>

          {/* Diversification */}
          <Card>
            <CardHeader>
              <CardTitle>Diversification Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Sector Diversification</span>
                  <span className="text-sm font-medium">Good</span>
                </div>
                <div className="w-full bg-secondary/20 rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Geographic Diversification</span>
                  <span className="text-sm font-medium">Moderate</span>
                </div>
                <div className="w-full bg-accent/20 rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Asset Class Mix</span>
                  <span className="text-sm font-medium">Excellent</span>
                </div>
                <div className="w-full bg-primary/20 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Your portfolio is well-diversified across sectors and asset classes. Consider adding more international exposure for better geographic diversification.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable data={holdings} columns={columns} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
