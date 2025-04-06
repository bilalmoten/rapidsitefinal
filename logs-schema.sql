-- Schema for system_logs table in Supabase
-- This table will store all application logs for monitoring and debugging

CREATE TABLE system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')),
  message TEXT NOT NULL,
  feature TEXT,
  component TEXT,
  user_id UUID REFERENCES auth.users(id),
  website_id UUID REFERENCES websites(id),
  path TEXT,
  error_name TEXT,
  error_message TEXT,
  error_stack TEXT,
  context JSONB,
  
  -- Indexing for faster queries
  CONSTRAINT system_logs_pkey PRIMARY KEY (id)
);

-- Create indexes for common queries
CREATE INDEX system_logs_timestamp_idx ON system_logs (timestamp DESC);
CREATE INDEX system_logs_level_idx ON system_logs (level);
CREATE INDEX system_logs_user_id_idx ON system_logs (user_id);
CREATE INDEX system_logs_website_id_idx ON system_logs (website_id);
CREATE INDEX system_logs_feature_idx ON system_logs (feature);

-- Create RLS policies
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

-- Only allow admin users to select from the logs table
CREATE POLICY "Allow admin users to view logs" 
  ON system_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (SELECT user_id FROM admin_users));

-- Allow service role to insert logs
CREATE POLICY "Allow service role to insert logs" 
  ON system_logs
  FOR INSERT
  TO service_role
  USING (true);

-- Functions for easy logging from client-side
CREATE OR REPLACE FUNCTION log_event(
  p_level TEXT,
  p_message TEXT,
  p_feature TEXT DEFAULT NULL,
  p_component TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_website_id UUID DEFAULT NULL,
  p_path TEXT DEFAULT NULL,
  p_error_name TEXT DEFAULT NULL,
  p_error_message TEXT DEFAULT NULL,
  p_error_stack TEXT DEFAULT NULL,
  p_context JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO system_logs (
    level, message, feature, component, user_id, website_id, 
    path, error_name, error_message, error_stack, context
  ) VALUES (
    p_level, p_message, p_feature, p_component, p_user_id, p_website_id,
    p_path, p_error_name, p_error_message, p_error_stack, p_context
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 