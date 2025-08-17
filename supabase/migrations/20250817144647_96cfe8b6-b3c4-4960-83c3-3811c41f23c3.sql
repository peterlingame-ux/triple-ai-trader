-- 添加更详细的交易数据字段到positions表
ALTER TABLE public.positions 
ADD COLUMN margin NUMERIC DEFAULT 0,                    -- 保证金
ADD COLUMN maintenance_margin_rate NUMERIC DEFAULT 0,   -- 维持保证金率
ADD COLUMN mark_price NUMERIC DEFAULT 0,               -- 标记价格
ADD COLUMN liquidation_price NUMERIC,                  -- 预估强平价
ADD COLUMN contract_type VARCHAR(20) DEFAULT 'spot',   -- 合约类型 (spot, perpetual, futures)
ADD COLUMN position_value NUMERIC DEFAULT 0,           -- 持仓价值
ADD COLUMN unrealized_pnl NUMERIC DEFAULT 0,           -- 未实现盈亏
ADD COLUMN fees NUMERIC DEFAULT 0,                     -- 手续费
ADD COLUMN funding_fee NUMERIC DEFAULT 0;              -- 资金费用

-- 添加注释说明
COMMENT ON COLUMN public.positions.margin IS '保证金金额';
COMMENT ON COLUMN public.positions.maintenance_margin_rate IS '维持保证金率(%)';
COMMENT ON COLUMN public.positions.mark_price IS '标记价格';
COMMENT ON COLUMN public.positions.liquidation_price IS '预估强平价';
COMMENT ON COLUMN public.positions.contract_type IS '合约类型: spot现货, perpetual永续, futures期货';
COMMENT ON COLUMN public.positions.position_value IS '持仓价值';
COMMENT ON COLUMN public.positions.unrealized_pnl IS '未实现盈亏';
COMMENT ON COLUMN public.positions.fees IS '总手续费';
COMMENT ON COLUMN public.positions.funding_fee IS '资金费用';