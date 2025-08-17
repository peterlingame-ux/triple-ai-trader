-- 启用positions表的实时功能
ALTER TABLE public.positions REPLICA IDENTITY FULL;

-- 将positions表添加到realtime发布
ALTER PUBLICATION supabase_realtime ADD TABLE public.positions;