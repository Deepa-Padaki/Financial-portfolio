import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface LoginHistoryEntry {
  id: string;
  timestamp: Date;
  device: 'desktop' | 'mobile' | 'tablet';
  location: string;
  ipAddress: string;
  success: boolean;
}

// Mock data - in production, fetch from database
const mockHistory: LoginHistoryEntry[] = [
  {
    id: '1',
    timestamp: new Date(),
    device: 'desktop',
    location: 'New York, USA',
    ipAddress: '192.168.1.1',
    success: true
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 86400000),
    device: 'mobile',
    location: 'New York, USA',
    ipAddress: '192.168.1.2',
    success: true
  }
];

export function LoginHistory() {
  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login History</CardTitle>
        <CardDescription>
          Recent sign-in activity on your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockHistory.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  {getDeviceIcon(entry.device)}
                </div>
                <div>
                  <p className="font-medium capitalize">{entry.device}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.location} • {entry.ipAddress}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={entry.success ? 'default' : 'destructive'}>
                  {entry.success ? 'Success' : 'Failed'}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  {entry.timestamp.toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
