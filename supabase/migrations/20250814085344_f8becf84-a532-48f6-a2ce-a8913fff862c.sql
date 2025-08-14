-- Create table for securely storing user API configurations
CREATE TABLE public.user_api_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  config_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, service)
);

-- Enable Row Level Security
ALTER TABLE public.user_api_configs ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own API configs" 
ON public.user_api_configs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API configs" 
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
CREATE TRIGGER update_user_api_configs_updated_at
  BEFORE UPDATE ON public.user_api_configs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();