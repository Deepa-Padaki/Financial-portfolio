import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, TrendingUp, TrendingDown, Bell, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart } from '@/components/charts/LineChart';

const watchlists = {
  main: [
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.80, change: 2.5, changePercent: 1.03, hasAlert: true },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 495.30, change: -5.20, changePercent: -1.04, hasAlert: false },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.90, change: 3.10, changePercent: 1.76, hasAlert: true },
  ],
  tech: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, change: 2.45, changePercent: 1.42, hasAlert: false },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.30, change: -1.80, changePercent: -1.25, hasAlert: false },
  ],
};

const mockChartData = [
  { date: 'Mon', value: 240 },
  { date: 'Tue', value: 242 },
  { date: 'Wed', value: 243 },
  { date: 'Thu', value: 244 },
  { date: 'Fri', value: 245.8 },
];

export default function Watchlist() {
  const [activeList, setActiveList] = useState('main');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Watchlists</h1>
            <p className="text-muted-foreground">Track your favorite stocks</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Stock
            </Button>
          </div>
        </div>

        <Tabs value={activeList} onValueChange={setActiveList}>
          <TabsList>
            <TabsTrigger value="main">Main Watchlist</TabsTrigger>
            <TabsTrigger value="tech">Tech Stocks</TabsTrigger>
            <TabsTrigger value="new">
              <Plus className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeList} className="space-y-4 mt-6">
            {watchlists[activeList as keyof typeof watchlists]?.map((stock) => (
              <Card key={stock.symbol} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl">{stock.symbol}</CardTitle>
                        {stock.hasAlert && (
                          <Badge variant="outline" className="gap-1">
                            <Bell className="h-3 w-3" />
                            Alert
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{stock.name}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">${stock.price.toFixed(2)}</span>
                        <span className={`flex items-center gap-1 text-sm ${stock.change >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                          {stock.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/stock/${stock.symbol}`} className="flex-1">
                          <Button variant="outline" className="w-full">View Details</Button>
                        </Link>
                        <Link to={`/trade/${stock.symbol}`} className="flex-1">
                          <Button className="w-full">Trade</Button>
                        </Link>
                      </div>
                      {!stock.hasAlert && (
                        <Button variant="ghost" size="sm" className="w-full">
                          <Bell className="mr-2 h-4 w-4" />
                          Set Price Alert
                        </Button>
                      )}
                    </div>
                    <div className="h-32">
                      <LineChart data={mockChartData} height={120} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
