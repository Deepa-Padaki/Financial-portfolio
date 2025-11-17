import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp } from 'lucide-react';
import { useWatchlistItems } from '@/hooks/useWatchlist';

const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
];

export default function TradeSearch() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/trade/${searchQuery.toUpperCase()}`);
    }
  };

  const handleStockClick = (symbol: string) => {
    navigate(`/trade/${symbol}`);
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trade Stocks</h1>
          <p className="text-muted-foreground">
            Search for a stock to start trading
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Stock</CardTitle>
            <CardDescription>
              Enter a stock symbol or company name
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="e.g., AAPL, TSLA, GOOGL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular Stocks
            </CardTitle>
            <CardDescription>
              Quick access to frequently traded stocks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularStocks.map((stock) => (
                <Button
                  key={stock.symbol}
                  variant="outline"
                  className="justify-start h-auto py-4"
                  onClick={() => handleStockClick(stock.symbol)}
                >
                  <div className="text-left">
                    <div className="font-semibold">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {stock.name}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
