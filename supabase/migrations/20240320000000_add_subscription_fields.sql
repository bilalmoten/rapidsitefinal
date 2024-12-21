-- Add subscription fields to user_usage table
ALTER TABLE user_usage
ADD COLUMN IF NOT EXISTS subscription_id text,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Add index for subscription_id
CREATE INDEX IF NOT EXISTS idx_user_usage_subscription_id ON user_usage(subscription_id);

-- Add billing_history table
CREATE TABLE IF NOT EXISTS billing_history (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id text,
    amount decimal(10,2),
    currency text,
    status text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    invoice_url text,
    receipt_url text
); 