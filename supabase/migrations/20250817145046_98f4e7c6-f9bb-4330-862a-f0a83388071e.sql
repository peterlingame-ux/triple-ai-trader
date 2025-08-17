-- 为positions表添加更详细的交易建议参数
ALTER TABLE public.positions 
ADD COLUMN first_take_profit NUMERIC,              -- 第一止盈点
ADD COLUMN second_take_profit NUMERIC,             -- 第二止盈点
ADD COLUMN position_ratio NUMERIC DEFAULT 10,      -- 建议仓位比例(总仓位的%)
ADD COLUMN stop_loss_required BOOLEAN DEFAULT true, -- 是否建议必须止损
ADD COLUMN safety_factor NUMERIC DEFAULT 5,        -- 安全系数(1-10)
ADD COLUMN risk_level VARCHAR(20) DEFAULT 'medium', -- 风险等级(low, medium, high)
ADD COLUMN signal_strength NUMERIC DEFAULT 0,      -- 信号强度(0-100)
ADD COLUMN market_condition VARCHAR(30);           -- 市场状况描述

-- 添加注释说明
COMMENT ON COLUMN public.positions.first_take_profit IS '第一止盈点价格';
COMMENT ON COLUMN public.positions.second_take_profit IS '第二止盈点价格';
COMMENT ON COLUMN public.positions.position_ratio IS '建议仓位比例(总仓位的%)';
COMMENT ON COLUMN public.positions.stop_loss_required IS '是否建议必须止损';
COMMENT ON COLUMN public.positions.safety_factor IS '安全系数(1-10，10最安全)';
COMMENT ON COLUMN public.positions.risk_level IS '风险等级: low低风险, medium中风险, high高风险';
COMMENT ON COLUMN public.positions.signal_strength IS '信号强度(0-100)';
COMMENT ON COLUMN public.positions.market_condition IS '市场状况描述';