# 🟡 币安API集成指南

## 功能概览
已为您的加密货币市场数据预留币安API接口，支持实时获取准确的市场数据。

## ✅ 已完成的功能

### 1. 币安API配置界面
- **位置**: 首页交易面板中的专用配置卡片
- **功能**: 
  - API Key和Secret Key输入
  - 测试网络/正式网络切换
  - 连接状态实时显示
  - 安全的密钥管理

### 2. API接口预留
- **主数据接口**: `/functions/v1/binance-api`
  - 获取实时价格数据
  - 24小时交易统计
  - 支持多个交易对
  
- **连接测试接口**: `/functions/v1/binance-test`
  - 验证API密钥有效性
  - 检查账户权限
  - 返回连接状态

### 3. 数据处理优化
- **智能回退机制**: 币安API → 备用API → 模拟数据
- **数据格式标准化**: 自动转换币安API格式到系统标准格式
- **错误处理**: 完善的错误捕获和用户提示

## 🔧 使用方法

### 第一步：获取币安API密钥
1. 登录 [binance.com](https://binance.com)
2. 前往 **用户中心 → API管理**
3. 创建新的API密钥
4. 设置权限：**读取信息、现货交易**
5. 记录API Key和Secret Key

### 第二步：配置API密钥
1. 在交易面板找到 **"币安API配置"** 卡片
2. 输入您的API Key和Secret Key
3. 选择是否使用测试网络
4. 点击 **"测试连接"** 验证
5. 确认无误后点击 **"保存配置"**

### 第三步：验证数据源
- 配置成功后，市场数据将自动切换到币安实时数据
- 在数据卡片上会显示数据来源为 "Binance"
- 数据更新频率：每5分钟自动刷新

## 📊 支持的数据类型

### 实时市场数据
- ✅ 当前价格
- ✅ 24小时涨跌幅
- ✅ 24小时最高/最低价
- ✅ 24小时交易量
- ✅ 价格变化金额

### 技术指标（计算生成）
- ✅ RSI相对强弱指数
- ✅ 移动平均线（MA20, MA50）
- ✅ 支撑/阻力位
- ✅ 市值估算

## 🔒 安全特性

### 本地存储（当前）
- API密钥临时存储在浏览器localStorage
- 密钥显示/隐藏切换功能
- 一键清除配置功能

### 生产环境安全（推荐）
- 将API密钥存储在Supabase Secrets中
- 服务器端API调用，不暴露密钥
- 定期密钥轮换机制

## 🚀 高级功能

### 最强大脑AI集成
币安API数据将直接馈送给AI分析系统：
- **价格分析**: 使用真实价格数据进行趋势分析
- **技术分析**: 基于实时指标计算技术信号
- **胜率提升**: 真实数据提高AI预测准确性

### 多源数据融合
- 主要数据源：币安API
- 备用数据源：预留的crypto-data接口
- 兜底方案：智能模拟数据

## 📱 用户体验

### 状态指示
- 🟢 **已连接**: 币安API正常工作
- 🔴 **连接失败**: 显示具体错误信息
- 🟡 **配置中**: 正在测试连接

### 智能提示
- 配置向导帮助用户正确设置
- 错误诊断和解决建议
- 数据源切换透明提示

## 🛠️ 开发者信息

### API端点结构
```typescript
// 主数据接口
POST /functions/v1/binance-api
{
  "symbols": ["BTC", "ETH", "BNB"],
  "apiKey": "your_api_key",
  "secretKey": "your_secret_key", 
  "testnet": false
}

// 测试接口
POST /functions/v1/binance-test
{
  "apiKey": "your_api_key",
  "secretKey": "your_secret_key",
  "testnet": false
}
```

### 数据响应格式
```typescript
interface BinanceDataResponse {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}
```

## 🔄 自动更新机制
- **数据刷新**: 5分钟间隔自动更新
- **连接监控**: 自动检测API连接状态
- **故障转移**: 自动切换到备用数据源

---

**🎯 现在您可以开始配置币安API，享受实时精准的市场数据！**