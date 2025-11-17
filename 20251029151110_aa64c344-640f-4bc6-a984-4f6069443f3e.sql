-- Create enum types
CREATE TYPE public.account_type AS ENUM ('brokerage', 'ira', 'roth_ira', '401k', 'taxable');
CREATE TYPE public.order_type AS ENUM ('market', 'limit', 'stop_loss', 'stop_limit');
CREATE TYPE public.order_status AS ENUM ('pending', 'filled', 'cancelled', 'rejected', 'expired');
CREATE TYPE public.alert_condition AS ENUM ('above', 'below', 'percent_change');
CREATE TYPE public.transaction_type AS ENUM ('buy', 'sell', 'dividend', 'transfer', 'fee');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  risk_tolerance TEXT,
  investment_goals TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create accounts table (brokerage accounts)
CREATE TABLE public.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  account_type public.account_type NOT NULL,
  broker_name TEXT,
  account_number TEXT,
  is_connected BOOLEAN DEFAULT false,
  last_synced_at TIMESTAMPTZ,
  balance NUMERIC(15,2) DEFAULT 0,
  buying_power NUMERIC(15,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create holdings table
CREATE TABLE public.holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  quantity NUMERIC(15,4) NOT NULL,
  average_cost NUMERIC(15,4),
  current_price NUMERIC(15,4),
  market_value NUMERIC(15,2),
  total_return NUMERIC(15,2),
  total_return_percent NUMERIC(8,4),
  day_change NUMERIC(15,2),
  day_change_percent NUMERIC(8,4),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(account_id, symbol)
);

-- Create watchlists table
CREATE TABLE public.watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create watchlist_items table
CREATE TABLE public.watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID REFERENCES public.watchlists(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(watchlist_id, symbol)
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  symbol TEXT NOT NULL,
  condition public.alert_condition NOT NULL,
  target_price NUMERIC(15,4) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  order_type public.order_type NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity NUMERIC(15,4) NOT NULL,
  price NUMERIC(15,4),
  stop_price NUMERIC(15,4),
  status public.order_status NOT NULL DEFAULT 'pending',
  filled_quantity NUMERIC(15,4) DEFAULT 0,
  filled_price NUMERIC(15,4),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  filled_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT,
  transaction_type public.transaction_type NOT NULL,
  quantity NUMERIC(15,4),
  price NUMERIC(15,4),
  amount NUMERIC(15,2) NOT NULL,
  fees NUMERIC(15,2) DEFAULT 0,
  transaction_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create market_data_cache table
CREATE TABLE public.market_data_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL UNIQUE,
  current_price NUMERIC(15,4),
  open_price NUMERIC(15,4),
  high_price NUMERIC(15,4),
  low_price NUMERIC(15,4),
  previous_close NUMERIC(15,4),
  volume BIGINT,
  market_cap BIGINT,
  pe_ratio NUMERIC(10,2),
  data JSONB,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create news_cache table
CREATE TABLE public.news_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  source TEXT,
  published_at TIMESTAMPTZ NOT NULL,
  cached_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_data_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for accounts
CREATE POLICY "Users can view their own accounts"
  ON public.accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own accounts"
  ON public.accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
  ON public.accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
  ON public.accounts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for holdings
CREATE POLICY "Users can view holdings for their accounts"
  ON public.holdings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.accounts
    WHERE accounts.id = holdings.account_id
    AND accounts.user_id = auth.uid()
  ));

-- RLS Policies for watchlists
CREATE POLICY "Users can view their own watchlists"
  ON public.watchlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own watchlists"
  ON public.watchlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlists"
  ON public.watchlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlists"
  ON public.watchlists FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for watchlist_items
CREATE POLICY "Users can view items in their watchlists"
  ON public.watchlist_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.watchlists
    WHERE watchlists.id = watchlist_items.watchlist_id
    AND watchlists.user_id = auth.uid()
  ));

CREATE POLICY "Users can add items to their watchlists"
  ON public.watchlist_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.watchlists
    WHERE watchlists.id = watchlist_items.watchlist_id
    AND watchlists.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete items from their watchlists"
  ON public.watchlist_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.watchlists
    WHERE watchlists.id = watchlist_items.watchlist_id
    AND watchlists.user_id = auth.uid()
  ));

-- RLS Policies for alerts
CREATE POLICY "Users can view their own alerts"
  ON public.alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alerts"
  ON public.alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON public.alerts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alerts"
  ON public.alerts FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view orders for their accounts"
  ON public.orders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.accounts
    WHERE accounts.id = orders.account_id
    AND accounts.user_id = auth.uid()
  ));

CREATE POLICY "Users can create orders for their accounts"
  ON public.orders FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.accounts
    WHERE accounts.id = orders.account_id
    AND accounts.user_id = auth.uid()
  ));

-- RLS Policies for transactions
CREATE POLICY "Users can view transactions for their accounts"
  ON public.transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.accounts
    WHERE accounts.id = transactions.account_id
    AND accounts.user_id = auth.uid()
  ));

-- Market data and news cache are publicly readable
CREATE POLICY "Market data cache is publicly readable"
  ON public.market_data_cache FOR SELECT
  USING (true);

CREATE POLICY "News cache is publicly readable"
  ON public.news_cache FOR SELECT
  USING (true);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON public.accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_holdings_updated_at
  BEFORE UPDATE ON public.holdings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_watchlists_updated_at
  BEFORE UPDATE ON public.watchlists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX idx_holdings_account_id ON public.holdings(account_id);
CREATE INDEX idx_holdings_symbol ON public.holdings(symbol);
CREATE INDEX idx_watchlists_user_id ON public.watchlists(user_id);
CREATE INDEX idx_watchlist_items_watchlist_id ON public.watchlist_items(watchlist_id);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_symbol ON public.alerts(symbol);
CREATE INDEX idx_orders_account_id ON public.orders(account_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_transactions_account_id ON public.transactions(account_id);
CREATE INDEX idx_transactions_date ON public.transactions(transaction_date);
CREATE INDEX idx_market_data_symbol ON public.market_data_cache(symbol);
CREATE INDEX idx_news_symbol ON public.news_cache(symbol);
CREATE INDEX idx_news_published ON public.news_cache(published_at DESC);