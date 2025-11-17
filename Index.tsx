import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowTrendingUpIcon, ChartBarIcon, BellIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Welcome to TradeShift</h1>
            <p className="text-muted-foreground mt-2">
              Your comprehensive investment portfolio management platform
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Portfolio Value
              </CardTitle>
              <ArrowTrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-secondary">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Positions
              </CardTitle>
              <ChartBarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Across 3 accounts
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Price Alerts
              </CardTitle>
              <BellIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">
                3 triggered today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to set up your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Connect Your Brokerage Account</p>
                <p className="text-sm text-muted-foreground">
                  Link your investment accounts for real-time tracking
                </p>
              </div>
              <Button>Connect</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Create Your First Watchlist</p>
                <p className="text-sm text-muted-foreground">
                  Track stocks you're interested in
                </p>
              </div>
              <Button variant="outline">Create</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Set Up Price Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when stocks hit your target price
                </p>
              </div>
              <Button variant="outline">Set Up</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
