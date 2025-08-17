-- 创建持仓管理表
CREATE TABLE public.positions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol VARCHAR(20) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('buy', 'sell', 'long', 'short')) NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'pending')) NOT NULL,
  entry_price DECIMAL(20, 8) NOT NULL,
  current_price DECIMAL(20, 8) NOT NULL,
  stop_loss DECIMAL(20, 8),
  take_profit DECIMAL(20, 8),
  position_size DECIMAL(20, 8) NOT NULL,
  leverage INTEGER DEFAULT 1,
  pnl DECIMAL(20, 8) DEFAULT 0,
  pnl_percent DECIMAL(10, 4) DEFAULT 0,
  confidence INTEGER NOT NULL,
  strategy VARCHAR(20) DEFAULT 'conservative',
  trading_type VARCHAR(20) DEFAULT 'spot',
  ai_reasoning TEXT,
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
CREATE POLICY "Users can view their own positions" 
ON public.positions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own positions" 
ON public.positions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own positions" 
ON public.positions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own positions" 
ON public.positions 
FOR DELETE 
USING (auth.uid() = user_id);

-- 创建触发器用于自动更新时间戳
CREATE TRIGGER update_positions_updated_at
BEFORE UPDATE ON public.positions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 添加索引以提高查询性能
CREATE INDEX idx_positions_user_id ON public.positions(user_id);
CREATE INDEX idx_positions_symbol ON public.positions(symbol);
CREATE INDEX idx_positions_status ON public.positions(status);
CREATE INDEX idx_positions_created_at ON public.positions(created_at DESC);