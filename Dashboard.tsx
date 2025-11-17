import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart } from '@/components/charts/LineChart';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data
const portfolioData = [
  { date: 'Mon', value: 45000 },
  { date: 'Tue', value: 46200 },
  { date: 'Wed', value: 45800 },
  { date: 'Thu', value: 47500 },
  { date: 'Fri', value: 48200 },
];

const recentTransactions = [
  { id: 1, symbol: 'AAPL', type: 'Buy', shares: 10, price: 175.50, date: '2025-01-15' },
  { id: 2, symbol: 'GOOGL', type: 'Sell', shares: 5, price: 142.30, date: '2025-01-14' },
  { id: 3, symbol: 'MSFT', type: 'Buy', shares: 15, price: 380.20, date: '2025-01-13' },
];

const watchlistPreview = [
  { symbol: 'TSLA', price: 245.80, change: 2.5, changePercent: 1.03 },
  { symbol: 'NVDA', price: 495.30, change: -5.20, changePercent: -1.04 },
  { symbol: 'AMZN', price: 178.90, change: 3.10, changePercent: 1.76 },
];

const marketIndices = [
  { name: 'S&P 500', value: 4783.45, change: 12.34, changePercent: 0.26 },
  { name: 'Dow Jones', value: 37863.80, change: -45.20, changePercent: -0.12 },
  { name: 'Nasdaq', value: 15310.97, change: 89.50, changePercent: 0.59 },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        {/* Portfolio Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$48,200</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 text-secondary">
                <TrendingUp className="h-3 w-3" />
                +3.2% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Change</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">+$850</div>
              <p className="text-xs text-muted-foreground">+1.79% today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,500</div>
              <p className="text-xs text-muted-foreground">Available to trade</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positions</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">Active holdings</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={portfolioData} />
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Link to="/orders">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{tx.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.type} {tx.shares} shares @ ${tx.price}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">{tx.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Watchlist Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Watchlist</CardTitle>
              <Link to="/watchlist">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {watchlistPreview.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm">${stock.price.toFixed(2)}</p>
                    </div>
                    <div className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                      {stock.change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span className="text-sm font-medium">
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {marketIndices.map((index) => (
                <div key={index.name} className="flex flex-col space-y-1">
                  <p className="text-sm text-muted-foreground">{index.name}</p>
                  <p className="text-2xl font-bold">{index.value.toFixed(2)}</p>
                  <p className={`text-sm flex items-center gap-1 ${index.change >= 0 ? 'text-secondary' : 'text-destructive'}`}>
                    {index.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="flex gap-4">
          <Link to="/trade/AAPL" className="flex-1">
            <Button className="w-full" size="lg">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Quick Trade
            </Button>
          </Link>
          <Link to="/portfolio" className="flex-1">
            <Button variant="outline" className="w-full" size="lg">
              View Full Portfolio
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
