import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Wallet, Shield, Smartphone, Globe, Zap, CheckCircle, AlertTriangle, Star, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'browser' | 'mobile' | 'hardware' | 'institutional';
  securityLevel: 'high' | 'very-high' | 'extreme';
  platforms: string[];
  features: string[];
  marketShare: number;
  isRecommended?: boolean;
  isInstalled?: boolean;
}

const walletOptions: WalletOption[] = [
  // Browser Extension Wallets
  {
    id: 'metamask',
    name: 'MetaMask',
    description: '全球最受欢迎的以太坊钱包，拥有广泛的DApp支持',
    icon: '🦊',
    category: 'browser',
    securityLevel: 'high',
    platforms: ['Chrome', 'Firefox', 'Brave', 'Edge', 'iOS', 'Android'],
    features: ['DApp集成', 'NFT支持', '多链支持', '硬件钱包支持'],
    marketShare: 35,
    isRecommended: true,
    isInstalled: typeof window !== 'undefined' && !!window.ethereum
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    description: 'Coinbase出品的自托管钱包，具有机构级安全性',
    icon: '🔷',
    category: 'browser',
    securityLevel: 'very-high',
    platforms: ['Chrome', 'Safari', 'iOS', 'Android'],
    features: ['DApp浏览器', 'NFT画廊', '多链支持', '云备份'],
    marketShare: 15,
    isRecommended: true
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    description: '连接300+钱包到DApps的通用协议',
    icon: '🔗',
    category: 'browser',
    securityLevel: 'high',
    platforms: ['通用', '所有设备'],
    features: ['跨平台', '300+钱包支持', '二维码连接', '多链支持'],
    marketShare: 20
  },
  {
    id: 'trust',
    name: 'Trust Wallet',
    description: '币安旗下的多加密货币钱包',
    icon: '🛡️',
    category: 'mobile',
    securityLevel: 'high',
    platforms: ['iOS', 'Android', 'Chrome'],
    features: ['70+区块链', 'NFT支持', 'DApp浏览器', '质押功能'],
    marketShare: 12
  },
  {
    id: 'phantom',
    name: 'Phantom',
    description: '领先的Solana钱包，拥有精美的界面设计',
    icon: '👻',
    category: 'browser',
    securityLevel: 'high',
    platforms: ['Chrome', 'Firefox', 'Brave', 'iOS', 'Android'],
    features: ['Solana原生', 'NFT支持', 'DeFi集成', '多链支持'],
    marketShare: 8
  },
  {
    id: 'tokenpocket',
    name: 'TokenPocket (TP钱包)',
    description: '亚洲领先的多链钱包，支持100+公链生态',
    icon: '🔷',
    category: 'mobile',
    securityLevel: 'high',
    platforms: ['iOS', 'Android', 'Chrome', 'Desktop'],
    features: ['100+公链', 'DApp商店', 'NFT市场', '去中心化交易'],
    marketShare: 9,
    isRecommended: true
  },

  // Hardware Wallets
  {
    id: 'ledger',
    name: 'Ledger',
    description: '行业领先的硬件钱包，银行级安全保护',
    icon: '🔐',
    category: 'hardware',
    securityLevel: 'extreme',
    platforms: ['Nano S Plus', 'Nano X', '桌面端', '移动端'],
    features: ['冷存储', '5500+币种', '蓝牙连接', '安全芯片'],
    marketShare: 25,
    isRecommended: true
  },
  {
    id: 'trezor',
    name: 'Trezor',
    description: '硬件钱包先驱，开源安全解决方案',
    icon: '⚡',
    category: 'hardware',
    securityLevel: 'extreme',
    platforms: ['Model T', 'Model One', '桌面端', '网页端'],
    features: ['开源代码', 'PIN保护', '1600+币种', '密码短语支持'],
    marketShare: 15
  },

  // Mobile Wallets
  {
    id: 'exodus',
    name: 'Exodus',
    description: '精美的多加密货币钱包，内置交易功能',
    icon: '🌟',
    category: 'mobile',
    securityLevel: 'high',
    platforms: ['Windows', 'Mac', 'Linux', 'iOS', 'Android'],
    features: ['260+资产', '内置交易', '投资组合跟踪', '硬件支持'],
    marketShare: 6
  },
  {
    id: 'atomic',
    name: 'Atomic Wallet',
    description: '去中心化钱包，支持原子交换',
    icon: '⚛️',
    category: 'mobile',
    securityLevel: 'high',
    platforms: ['Windows', 'Mac', 'Linux', 'iOS', 'Android'],
    features: ['500+资产', '原子交换', '质押功能', '购买加密货币'],
    marketShare: 4
  },

  // Institutional Wallets
  {
    id: 'gnosis',
    name: 'Gnosis Safe',
    description: '为机构和团队设计的多签名钱包',
    icon: '🏛️',
    category: 'institutional',
    securityLevel: 'extreme',
    platforms: ['网页端', '移动端', '桌面端'],
    features: ['多重签名', '团队管理', '高级安全', 'DeFi集成'],
    marketShare: 3
  },
  {
    id: 'argent',
    name: 'Argent',
    description: '智能合约钱包，支持社交恢复',
    icon: '🛡️',
    category: 'mobile',
    securityLevel: 'very-high',
    platforms: ['iOS', 'Android'],
    features: ['社交恢复', '免Gas交易', 'DeFi原生', '二层网络'],
    marketShare: 2
  },

  // Additional Popular Wallets
  {
    id: 'binance',
    name: 'Binance Wallet',
    description: '币安官方钱包，深度集成交易所功能',
    icon: '🟡',
    category: 'mobile',
    securityLevel: 'high',
    platforms: ['iOS', 'Android', 'Chrome'],
    features: ['交易所集成', '理财产品', '多链支持', '法币入金'],
    marketShare: 7
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    description: 'OKX交易所出品的Web3钱包',
    icon: '⚫',
    category: 'browser',
    securityLevel: 'high',
    platforms: ['Chrome', 'Firefox', 'iOS', 'Android'],
    features: ['多链支持', 'NFT市场', 'DeFi协议', '交易所集成'],
    marketShare: 5
  }
];

export const WalletConnector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const { toast } = useToast();

  const categories = [
    { id: 'all', name: '全部钱包', icon: Wallet },
    { id: 'browser', name: '浏览器扩展', icon: Globe },
    { id: 'mobile', name: '移动应用', icon: Smartphone },
    { id: 'hardware', name: '硬件钱包', icon: Shield },
    { id: 'institutional', name: '机构级', icon: Star }
  ];

  const filteredWallets = selectedCategory === 'all' 
    ? walletOptions 
    : walletOptions.filter(wallet => wallet.category === selectedCategory);

  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'extreme': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'very-high': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'browser': return '🌐';
      case 'mobile': return '📱';
      case 'hardware': return '🔒';
      case 'institutional': return '🏢';
      default: return '💼';
    }
  };

  const handleConnect = async (wallet: WalletOption) => {
    try {
      if (wallet.id === 'metamask' && window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
          setConnectedWallet(wallet.id);
          setWalletAddress(accounts[0]);
          setIsOpen(false);
          
          toast({
            title: "钱包连接成功",
            description: `已成功连接到 ${wallet.name}`,
          });
        }
      } else {
        // For other wallets, simulate connection
        setConnectedWallet(wallet.id);
        setWalletAddress('0x742d35Cc6634C0532925a3b8D404F...');
        setIsOpen(false);
        
        toast({
          title: "钱包连接成功",
          description: `已成功连接到 ${wallet.name}`,
        });
      }
    } catch (error) {
      toast({
        title: "连接失败",
        description: "钱包连接失败，请重试",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    setConnectedWallet(null);
    setWalletAddress('');
    toast({
      title: "钱包已断开",
      description: "已成功断开钱包连接",
    });
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast({
        title: "地址已复制",
        description: "钱包地址已复制到剪贴板",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getConnectedWalletInfo = () => {
    return walletOptions.find(w => w.id === connectedWallet);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 px-4 py-2 ${
            connectedWallet 
              ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' 
              : 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30 hover:from-purple-600/30 hover:to-blue-600/30'
          }`}
          onClick={connectedWallet ? disconnect : () => setIsOpen(true)}
        >
          <Wallet className="w-4 h-4" />
          {connectedWallet 
            ? formatAddress(walletAddress)
            : '连接钱包'
          }
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[900px] bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-white flex items-center gap-2 font-orbitron text-xl">
            <Wallet className="w-6 h-6" />
            连接您的钱包
          </DialogTitle>
          <p className="text-slate-400">选择市场上最安全可靠的钱包开始交易和管理您的投资组合</p>
        </DialogHeader>
        
        {connectedWallet ? (
          // Connected Wallet View
          <div className="space-y-4">
            <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{getConnectedWalletInfo()?.icon}</div>
                <div>
                  <h3 className="text-white font-semibold">{getConnectedWalletInfo()?.name}</h3>
                  <p className="text-green-400 text-sm">已连接</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">钱包地址:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-mono">
                      {formatAddress(walletAddress)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyAddress}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">网络:</span>
                  <span className="text-white font-medium">Ethereum</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.open(`https://etherscan.io/address/${walletAddress}`, '_blank')}
                className="flex-1 text-sm"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                在区块浏览器查看
              </Button>
              <Button 
                variant="destructive" 
                onClick={disconnect}
                className="flex-1 text-sm"
              >
                断开连接
              </Button>
            </div>
          </div>
        ) : (
          // Wallet Selection View
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${
                      selectedCategory === category.id 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-600'
                    }`}
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {category.name}
                  </Button>
                );
              })}
            </div>

            {/* Wallet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredWallets.map((wallet) => (
                <Card 
                  key={wallet.id} 
                  className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-all cursor-pointer group"
                >
                  <div className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{wallet.icon}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-semibold">{wallet.name}</h3>
                            {wallet.isRecommended && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">推荐</Badge>
                            )}
                            {wallet.isInstalled && (
                              <Badge className="bg-green-500/20 text-green-400 text-xs">已安装</Badge>
                            )}
                          </div>
                          <p className="text-slate-400 text-sm">{wallet.description}</p>
                        </div>
                      </div>
                      <div className="text-slate-500 group-hover:text-slate-400">
                        {getCategoryIcon(wallet.category)}
                      </div>
                    </div>

                    {/* Security & Market Share */}
                    <div className="flex items-center justify-between">
                      <Badge className={`text-xs ${getSecurityColor(wallet.securityLevel)}`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {wallet.securityLevel === 'extreme' ? '极高安全' : 
                         wallet.securityLevel === 'very-high' ? '很高安全' : '高安全'}
                      </Badge>
                      <span className="text-slate-400 text-xs">市场份额: {wallet.marketShare}%</span>
                    </div>

                    {/* Platforms */}
                    <div>
                      <p className="text-slate-400 text-xs mb-1">支持平台:</p>
                      <div className="flex flex-wrap gap-1">
                        {wallet.platforms.slice(0, 3).map((platform) => (
                          <Badge key={platform} variant="outline" className="text-xs border-slate-600 text-slate-300">
                            {platform}
                          </Badge>
                        ))}
                        {wallet.platforms.length > 3 && (
                          <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                            +{wallet.platforms.length - 3}更多
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <p className="text-slate-400 text-xs mb-1">主要功能:</p>
                      <div className="flex flex-wrap gap-1">
                        {wallet.features.slice(0, 2).map((feature) => (
                          <Badge key={feature} className="bg-blue-500/20 text-blue-400 text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {wallet.features.length > 2 && (
                          <Badge className="bg-slate-600/20 text-slate-400 text-xs">
                            +{wallet.features.length - 2}更多
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Connect Button */}
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnect(wallet);
                      }}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      连接 {wallet.name}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-amber-400 font-medium mb-1">安全提示</p>
                  <p className="text-amber-200/80">
                    连接钱包即表示您同意我们的服务条款。请确保只在安全的网络环境下连接钱包，并妥善保管您的私钥和助记词。始终从官方渠道下载钱包应用。
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};