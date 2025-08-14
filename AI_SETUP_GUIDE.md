# 🧠 最强大脑AI检测 - 配置指南

## 功能说明
最强大脑AI检测功能通过多重AI分析，只在胜率达到90%以上时才提供交易建议：

✅ **价格图表分析** - GPT-4o模型分析价格趋势  
✅ **技术指标分析** - Claude-3.5-Sonnet分析技术指标  
✅ **市场情绪分析** - Perplexity分析新闻情绪  
✅ **综合胜率计算** - 只有90%+胜率才触发提醒

## API密钥配置

### 1. 在Supabase中配置AI服务API密钥

请在您的Supabase项目中添加以下密钥：

**前往: Supabase Dashboard → Settings → Edge Functions → Secrets**

添加以下密钥：
```
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_claude_api_key_here  
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

### 2. 获取API密钥

#### OpenAI API Key (用于价格分析)
1. 访问 https://platform.openai.com/api-keys
2. 创建新的API密钥
3. 复制密钥到Supabase中

#### Anthropic API Key (用于技术分析)
1. 访问 https://console.anthropic.com/
2. 获取Claude API密钥
3. 复制密钥到Supabase中

#### Perplexity API Key (用于新闻情绪分析)
1. 访问 https://perplexity.ai/
2. 在API keys部分获取密钥
3. 复制密钥到Supabase中

### 3. 验证配置
配置完成后，最强大脑AI检测将：
- 每30秒分析前6个加密货币
- 使用三个高级AI模型进行综合分析
- 只在胜率≥90%时发送提醒
- 显示详细的分析结果和信心度

## 功能特点
- 🎯 **高精度**: 只有90%以上胜率才触发
- 🤖 **多AI融合**: 3个顶级AI模型协同分析
- ⚡ **实时监控**: 30秒间隔深度分析
- 📊 **全面数据**: 价格+技术+情绪三维分析
- 🔔 **智能提醒**: 重要机会15秒长提醒

配置完成后，您将拥有最强大的AI交易助手！