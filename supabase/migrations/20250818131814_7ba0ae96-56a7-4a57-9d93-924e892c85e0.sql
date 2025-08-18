-- Create table for storing user API configurations
CREATE TABLE IF NOT EXISTS public.user_api_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  config_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service)
);

-- Enable RLS
ALTER TABLE public.user_api_configs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own API configs" 
ON public.user_api_configs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API configs" 
ON public.user_api_configs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API configs" 
ON public.user_api_configs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API configs" 
ON public.user_api_configs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_user_api_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_api_configs_updated_at_trigger
  BEFORE UPDATE ON public.user_api_configs
  FOR EACH ROW EXECUTE FUNCTION update_user_api_configs_updated_at();