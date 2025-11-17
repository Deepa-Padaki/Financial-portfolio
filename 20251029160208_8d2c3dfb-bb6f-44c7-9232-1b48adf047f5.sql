-- Add UPDATE policy for orders table
-- Users can update (cancel) their own pending orders
CREATE POLICY "Users can update their own pending orders"
ON public.orders
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.accounts
    WHERE accounts.id = orders.account_id
    AND accounts.user_id = auth.uid()
  )
  AND status = 'pending'
);

-- Add DELETE policy for orders table (optional - for cleanup)
CREATE POLICY "Users can delete their own orders"
ON public.orders
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.accounts
    WHERE accounts.id = orders.account_id
    AND accounts.user_id = auth.uid()
  )
);