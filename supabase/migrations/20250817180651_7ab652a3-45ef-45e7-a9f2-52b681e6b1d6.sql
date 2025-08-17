-- Create user_settings table for storing monitoring and auto-trading settings
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  super_brain_monitoring BOOLEAN NOT NULL DEFAULT false,
  auto_trading_enabled BOOLEAN NOT NULL DEFAULT false,
  trading_strategy VARCHAR(20) NOT NULL DEFAULT 'conservative',
  max_positions INTEGER NOT NULL DEFAULT 5,
  risk_per_trade NUMERIC NOT NULL DEFAULT 2.0,
  virtual_balance NUMERIC NOT NULL DEFAULT 100000,
  monitoring_symbols TEXT[] NOT NULL DEFAULT '{"BTC","ETH","BNB","XRP","ADA","SOL"}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_settings UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own settings" 
ON public.user_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
ON public.user_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_settings_updated_at
BEFORE UPDATE ON public.user_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create virtual_trades table for tracking AI trading history
CREATE TABLE public.virtual_trades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  action VARCHAR(10) NOT NULL, -- 'buy' or 'sell'
  entry_price NUMERIC NOT NULL,
  stop_loss NUMERIC NOT NULL,
  take_profit NUMERIC NOT NULL,
  position_size NUMERIC NOT NULL,
  confidence INTEGER NOT NULL,
  strategy VARCHAR(20) NOT NULL,
  reasoning TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'open', -- 'open', 'closed', 'stopped'
  pnl NUMERIC DEFAULT 0,
  pnl_percent NUMERIC DEFAULT 0,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.virtual_trades ENABLE ROW LEVEL SECURITY;

-- Create policies for virtual_trades
CREATE POLICY "Users can view their own trades" 
ON public.virtual_trades 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trades" 
ON public.virtual_trades 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trades" 
ON public.virtual_trades 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for virtual_trades
CREATE TRIGGER update_virtual_trades_updated_at
BEFORE UPDATE ON public.virtual_trades
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();