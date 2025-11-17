import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { TrendingUp, TrendingDown, Star, Bell } from 'lucide-react';

const mockStockData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 175.50,
  change: 2.45,
  changePercent: 1.42,
  marketCap: '2.8T',
  pe: 28.5,
  volume: '52.3M',
  high52: 198.23,
  low52: 124.17,
};

const chartData = [
  { date: '10:00', open: 173, high: 175, low: 172.5, close: 174.2 },
  { date: '11:00', open: 174.2, high: 176, low: 173.8, close: 175.5 },
  { date: '12:00', open: 175.5, high: 176.8, low: 175, close: 176.2 },
  { date: '13:00', open: 176.2, high: 177, low: 175.5, close: 176.5 },
  { date: '14:00', open: 176.5, high: 177.5, low: 176, close: 175.5 },
];

const news = [
  { id: 1, title: 'Apple Announces New Product Line', time: '2 hours ago', source: 'Bloomberg' },
  { id: 2, title: 'Q4 Earnings Beat Expectations', time: '5 hours ago', source: 'Reuters' },
  { id: 3, title: 'Analysts Upgrade Price Target', time: '1 day ago', source: 'CNBC' },
];

export default function Stock() {
  const { symbol } = useParams();
  const stock = mockStockData;

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        {/* Stock Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{stock.symbol}</h1>
              <Badge variant="outline">{stock.name}</Badge>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-4xl font-bold">${stock.price.toFixed(2)}</span>
              <span className={`flex items-center gap-1 text-lg ${stock.change >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                {stock.change >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Star className="mr-2 h-4 w-4" />
              Add to Watchlist
            </Button>
            <Button variant="outline">
              <Bell className="mr-2 h-4 w-4" />
              Set Alert
            </Button>
            <Link to={`/trade/${symbol}`}>
              <Button>Trade</Button>
            </Link>
          </div>
        </div>

        {/* Price Chart */}
        <Card>
          <CardHeader>
            <Tabs defaultValue="1D">
              <TabsList>
                <TabsTrigger value="1D">1D</TabsTrigger>
                <TabsTrigger value="1W">1W</TabsTrigger>
                <TabsTrigger value="1M">1M</TabsTrigger>
                <TabsTrigger value="3M">3M</TabsTrigger>
                <TabsTrigger value="1Y">1Y</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <CandlestickChart data={chartData} />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Key Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Key Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap</span>
                <span className="font-medium">${stock.marketCap}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">P/E Ratio</span>
                <span className="font-medium">{stock.pe}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volume</span>
                <span className="font-medium">{stock.volume}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">52 Week High</span>
                <span className="font-medium">${stock.high52}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">52 Week Low</span>
                <span className="font-medium">${stock.low52}</span>
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle>About {stock.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, Mac, iPad, and Wearables, Home and Accessories products.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CEO</span>
                  <span>Tim Cook</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Founded</span>
                  <span>1976</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Employees</span>
                  <span>164,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* News */}
        <Card>
          <CardHeader>
            <CardTitle>Latest News</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.source} • {item.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
