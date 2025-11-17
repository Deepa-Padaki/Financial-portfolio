import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useOrders, OrderType } from '@/hooks/useOrders';
import { useAccounts } from '@/hooks/useAccounts';

export default function Trade() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { accounts } = useAccounts();
  const [orderType, setOrderType] = useState('market');
  const [quantity, setQuantity] = useState('1');
  const [limitPrice, setLimitPrice] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tradeAction, setTradeAction] = useState<'buy' | 'sell'>('buy');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  const currentPrice = 175.50;
  const availableCash = 12500;

  const handleTrade = () => {
    setShowConfirmation(true);
  };

  const confirmTrade = async () => {
    try {
      const accountId = selectedAccountId || accounts?.[0]?.id;
      
      if (!accountId) {
        toast({
          title: 'No account available',
          description: 'Please create an account first',
          variant: 'destructive',
        });
        setShowConfirmation(false);
        return;
      }

      await createOrder.mutateAsync({
        account_id: accountId,
        symbol: symbol!,
        side: tradeAction,
        order_type: orderType as OrderType,
        quantity: parseFloat(quantity),
        price: orderType === 'limit' ? parseFloat(limitPrice) : undefined,
      });
      setShowConfirmation(false);
      navigate("/orders");
    } catch (error) {
      // Error handling is done in the hook
      setShowConfirmation(false);
    }
  };

  const orderValue = parseFloat(quantity || '0') * (orderType === 'limit' ? parseFloat(limitPrice || '0') : currentPrice);

  return (
    <Layout>
      <div className="container mx-auto p-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Trade {symbol}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Current Price: <span className="font-medium">${currentPrice.toFixed(2)}</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Buy/Sell Toggle */}
            <Tabs value={tradeAction} onValueChange={(v) => setTradeAction(v as 'buy' | 'sell')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buy">Buy</TabsTrigger>
                <TabsTrigger value="sell">Sell</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Order Type */}
            <div className="space-y-2">
              <Label htmlFor="orderType">Order Type</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger id="orderType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                  <SelectItem value="stop">Stop Loss</SelectItem>
                  <SelectItem value="stop-limit">Stop Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, parseInt(quantity || '1') - 1).toString())}
                >
                  -
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity((parseInt(quantity || '0') + 1).toString())}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Limit Price (conditional) */}
            {(orderType === 'limit' || orderType === 'stop-limit') && (
              <div className="space-y-2">
                <Label htmlFor="limitPrice">Limit Price</Label>
                <Input
                  id="limitPrice"
                  type="number"
                  step="0.01"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  placeholder="Enter limit price"
                />
              </div>
            )}

            {/* Account Selection */}
            <div className="space-y-2">
              <Label htmlFor="account">Account</Label>
              <Select 
                value={selectedAccountId} 
                onValueChange={setSelectedAccountId}
                defaultValue={accounts?.[0]?.id}
              >
                <SelectTrigger id="account">
                  <SelectValue placeholder="Select an account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} - {account.broker_name || 'No broker'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Order Summary */}
            <Card className="bg-muted">
              <CardContent className="pt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Total</span>
                  <span className="font-bold">${orderValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Cash</span>
                  <span>${availableCash.toLocaleString()}</span>
                </div>
                {tradeAction === 'buy' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining After Trade</span>
                    <span className={orderValue > availableCash ? 'text-destructive' : ''}>
                      ${(availableCash - orderValue).toFixed(2)}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleTrade}
              disabled={!quantity || orderValue <= 0 || (tradeAction === 'buy' && orderValue > availableCash)}
            >
              {tradeAction === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
            </Button>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Order</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-2 text-foreground">
                  <p>Please review your order details:</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Action:</span>
                      <span className="font-medium">{tradeAction === 'buy' ? 'Buy' : 'Sell'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Symbol:</span>
                      <span className="font-medium">{symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity:</span>
                      <span className="font-medium">{quantity} shares</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Order Type:</span>
                      <span className="font-medium capitalize">{orderType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Total:</span>
                      <span className="font-medium">${orderValue.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmTrade}>Confirm Order</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
