-- Drop the existing update policy for orders
DROP POLICY IF EXISTS "Users can update their own pending orders" ON orders;

-- Create a new update policy that allows updating pending orders to any status
CREATE POLICY "Users can update their own pending orders"
ON orders
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM accounts
    WHERE accounts.id = orders.account_id
    AND accounts.user_id = auth.uid()
  )
  AND status = 'pending'
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM accounts
    WHERE accounts.id = orders.account_id
    AND accounts.user_id = auth.uid()
  )
);