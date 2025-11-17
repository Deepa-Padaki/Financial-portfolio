import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Bell, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';

const alerts = [
  { id: 1, symbol: 'TSLA', condition: 'above', targetPrice: 250, currentPrice: 245.80, active: true },
  { id: 2, symbol: 'NVDA', condition: 'below', targetPrice: 490, currentPrice: 495.30, active: true },
  { id: 3, symbol: 'AMZN', condition: 'above', targetPrice: 180, currentPrice: 178.90, active: false },
];

export default function Alerts() {
  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Price Alerts</h1>
            <p className="text-muted-foreground">Get notified when stocks reach your target prices</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Alert
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Create Alert Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Alert</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Stock Symbol</Label>
                <Input id="symbol" placeholder="e.g., AAPL" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Select defaultValue="above">
                  <SelectTrigger id="condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Price goes above</SelectItem>
                    <SelectItem value="below">Price goes below</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetPrice">Target Price</Label>
                <Input id="targetPrice" type="number" step="0.01" placeholder="0.00" />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Push Notifications</Label>
                <Switch id="notifications" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email Notifications</Label>
                <Switch id="email" />
              </div>

              <Button className="w-full">
                <Bell className="mr-2 h-4 w-4" />
                Create Alert
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts on your device</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts via text message</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily Summary</p>
                    <p className="text-sm text-muted-foreground">Daily portfolio performance report</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Market News</p>
                    <p className="text-sm text-muted-foreground">Breaking market news and updates</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {alert.condition === 'above' ? (
                        <TrendingUp className="h-5 w-5 text-secondary" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-destructive" />
                      )}
                      <div>
                        <p className="font-medium">{alert.symbol}</p>
                        <p className="text-sm text-muted-foreground">
                          Alert when price goes {alert.condition} ${alert.targetPrice}
                        </p>
                      </div>
                    </div>
                    <Badge variant={alert.active ? 'default' : 'secondary'}>
                      {alert.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Current: ${alert.currentPrice}
                    </span>
                    <Switch checked={alert.active} />
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
