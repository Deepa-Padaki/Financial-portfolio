-- Fix security issues for transactions, profiles, holdings, and watchlist_items tables

-- ============================================
-- 1. TRANSACTIONS TABLE - Add write policies
-- ============================================

-- Allow users to insert transactions for their own accounts
-- This enables proper audit trail while maintaining ownership checks
CREATE POLICY "Users can create transactions for their accounts"
ON public.transactions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.accounts
    WHERE accounts.id = transactions.account_id
    AND accounts.user_id = auth.uid()
  )
);

-- Note: No UPDATE policy - transactions should be immutable
-- If corrections needed, create adjustment/reversal transactions instead

-- Allow users to delete transactions from their accounts (for test data cleanup only)
CREATE POLICY "Users can delete transactions for their accounts"
ON public.transactions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.accounts
    WHERE accounts.id = transactions.account_id
    AND accounts.user_id = auth.uid()
  )
);

-- ============================================
-- 2. PROFILES TABLE - Add soft delete capability
-- ============================================

-- Add deleted_at column for soft delete (recommended for financial apps)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Drop existing SELECT policy to recreate with deleted_at check
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Recreate SELECT policy to exclude deleted profiles
CREATE POLICY "Users can view their own active profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Allow users to delete their own profile (hard delete)
-- For production, consider only allowing soft delete via UPDATE
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- 3. HOLDINGS TABLE - Add full CRUD policies
-- ============================================

-- Allow users to insert holdings into their accounts
CREATE POLICY "Users can create holdings for their accounts"
ON public.holdings
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.accounts
    WHERE accounts.id = holdings.account_id
    AND accounts.user_id = auth.uid()
  )
);

-- Allow users to update holdings in their accounts
CREATE POLICY "Users can update holdings in their accounts"
ON public.holdings
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.accounts
    WHERE accounts.id = holdings.account_id
    AND accounts.user_id = auth.uid()
  )
);

-- Allow users to delete holdings from their accounts
CREATE POLICY "Users can delete holdings from their accounts"
ON public.holdings
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.accounts
    WHERE accounts.id = holdings.account_id
    AND accounts.user_id = auth.uid()
  )
);

-- ============================================
-- 4. WATCHLIST_ITEMS TABLE - Add UPDATE policy
-- ============================================

-- Allow users to update items (especially notes) in their watchlists
CREATE POLICY "Users can update items in their watchlists"
ON public.watchlist_items
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.watchlists
    WHERE watchlists.id = watchlist_items.watchlist_id
    AND watchlists.user_id = auth.uid()
  )
);