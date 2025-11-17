import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, RefreshCw, Unlink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAccounts } from '@/hooks/useAccounts';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Accounts() {
  const { accounts, isLoading, createAccount, updateAccount, deleteAccount } = useAccounts();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [syncingAccounts, setSyncingAccounts] = useState<Set<string>>(new Set());
  const [reconnectingAccounts, setReconnectingAccounts] = useState<Set<string>>(new Set());
  const [newAccount, setNewAccount] = useState({
    name: '',
    broker_name: '',
    account_type: 'brokerage' as const,
    account_number: ''
  });

  const handleSyncAccount = async (accountId: string) => {
    setSyncingAccounts(prev => new Set(prev).add(accountId));
    
    try {
      // Simulate syncing with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update last_synced_at timestamp
      await updateAccount.mutateAsync({
        id: accountId,
        updates: {
          last_synced_at: new Date().toISOString(),
          is_connected: true
        }
      });
      
      toast({
        title: '✓ Account synced',
        description: 'Your account data has been updated successfully'
      });
    } catch (error) {
      toast({
        title: 'Sync failed',
        description: 'Unable to sync account. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setSyncingAccounts(prev => {
        const next = new Set(prev);
        next.delete(accountId);
        return next;
      });
    }
  };

  const handleReconnect = async (accountId: string) => {
    setReconnectingAccounts(prev => new Set(prev).add(accountId));
    
    try {
      // Simulate reconnection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await updateAccount.mutateAsync({
        id: accountId,
        updates: {
          is_connected: true,
          last_synced_at: new Date().toISOString()
        }
      });
      
      toast({
        title: '✓ Account reconnected',
        description: 'Your account has been successfully reconnected'
      });
    } catch (error) {
      toast({
        title: 'Reconnection failed',
        description: 'Unable to reconnect account. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setReconnectingAccounts(prev => {
        const next = new Set(prev);
        next.delete(accountId);
        return next;
      });
    }
  };

  const handleDisconnect = async (accountId: string, accountName: string) => {
    if (!confirm(`Are you sure you want to disconnect ${accountName}? This will remove all synced data.`)) {
      return;
    }
    
    try {
      await deleteAccount.mutateAsync(accountId);
      toast({
        title: '✓ Account disconnected',
        description: 'Your account has been removed successfully'
      });
    } catch (error) {
      toast({
        title: 'Disconnection failed',
        description: 'Unable to disconnect account. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.name.trim() || !newAccount.broker_name.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide account name and broker name',
        variant: 'destructive'
      });
      return;
    }

    try {
      await createAccount.mutateAsync({
        name: newAccount.name,
        broker_name: newAccount.broker_name,
        account_type: newAccount.account_type,
        account_number: newAccount.account_number || null,
        is_connected: true,
        balance: 0,
        buying_power: 0,
        last_synced_at: new Date().toISOString()
      });

      toast({
        title: '✓ Account added',
        description: 'Your account has been successfully connected'
      });

      setNewAccount({
        name: '',
        broker_name: '',
        account_type: 'brokerage',
        account_number: ''
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Failed to add account',
        description: 'Unable to connect account. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getTimeSinceSync = (lastSynced?: string) => {
    if (!lastSynced) return 'Never synced';
    
    const now = new Date();
    const synced = new Date(lastSynced);
    const diffMs = now.getTime() - synced.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Connected Accounts</h1>
            <p className="text-muted-foreground">Manage your brokerage connections</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Account</DialogTitle>
                <DialogDescription>
                  Connect a new brokerage account to track your investments.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Name *</Label>
                  <Input
                    id="account-name"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                    placeholder="My Trading Account"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="broker-name">Broker Name *</Label>
                  <Input
                    id="broker-name"
                    value={newAccount.broker_name}
                    onChange={(e) => setNewAccount({ ...newAccount, broker_name: e.target.value })}
                    placeholder="Robinhood, Fidelity, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-type">Account Type</Label>
                  <Select
                    value={newAccount.account_type}
                    onValueChange={(value: any) => setNewAccount({ ...newAccount, account_type: value })}
                  >
                    <SelectTrigger id="account-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brokerage">Brokerage</SelectItem>
                      <SelectItem value="ira">IRA</SelectItem>
                      <SelectItem value="roth_ira">Roth IRA</SelectItem>
                      <SelectItem value="401k">401(k)</SelectItem>
                      <SelectItem value="taxable">Taxable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number (Optional)</Label>
                  <Input
                    id="account-number"
                    value={newAccount.account_number}
                    onChange={(e) => setNewAccount({ ...newAccount, account_number: e.target.value })}
                    placeholder="Last 4 digits"
                    maxLength={4}
                  />
                </div>
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAccount} disabled={createAccount.isPending}>
                    {createAccount.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Account'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {accounts && accounts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No connected accounts yet</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {accounts?.map((account) => {
              const isSyncing = syncingAccounts.has(account.id);
              const isReconnecting = reconnectingAccounts.has(account.id);
              
              return (
                <Card key={account.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-bold">
                            {account.broker_name?.charAt(0).toUpperCase() || account.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl">{account.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {account.broker_name} • {account.account_type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      {account.is_connected ? (
                        <Badge className="gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Connection Error
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Account Balance</span>
                        <span className="font-bold">
                          ${account.balance?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Buying Power</span>
                        <span className="font-bold">
                          ${account.buying_power?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Sync</span>
                        <span className="text-sm">{getTimeSinceSync(account.last_synced_at || undefined)}</span>
                      </div>
                      
                      {!account.is_connected && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                          <p className="text-sm text-destructive">
                            Connection lost. Please reconnect your account to continue syncing data.
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleSyncAccount(account.id)}
                          disabled={isSyncing || isReconnecting || !account.is_connected}
                        >
                          {isSyncing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Sync Now
                            </>
                          )}
                        </Button>
                        {!account.is_connected ? (
                          <Button 
                            className="flex-1"
                            onClick={() => handleReconnect(account.id)}
                            disabled={isReconnecting}
                          >
                            {isReconnecting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Reconnecting...
                              </>
                            ) : (
                              'Reconnect'
                            )}
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleDisconnect(account.id, account.name)}
                            disabled={deleteAccount.isPending}
                          >
                            <Unlink className="mr-2 h-4 w-4" />
                            Disconnect
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Popular Brokers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Quick connect to popular brokerage platforms
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold">E</span>
                </div>
                <span className="text-sm">E*TRADE</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold">T</span>
                </div>
                <span className="text-sm">TD Ameritrade</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold">W</span>
                </div>
                <span className="text-sm">Webull</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sync Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-sync</p>
                <p className="text-sm text-muted-foreground">Automatically sync accounts every 15 minutes</p>
              </div>
              <Badge>Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Real-time Updates</p>
                <p className="text-sm text-muted-foreground">Get instant updates during market hours</p>
              </div>
              <Badge>Enabled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
