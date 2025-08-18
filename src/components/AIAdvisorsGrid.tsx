import { CompactAdvisorCard } from "./CompactAdvisorCard";
import { TradingExchangePanel } from "./TradingExchangePanel";
import { useLanguage } from "@/hooks/useLanguage";
import { Brain } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CryptoData, NewsArticle } from "@/types/api";

// AI advisors data with i18n support
const getAiAdvisorsData = (language: string) => [
  {
    name: "Elon Musk",
    specialty: language === 'zh' ? "远见科技与市场颠覆" : "Visionary Technology & Market Disruption",
    confidence: 94,
    recommendation: "BUY DOGE, BTC",
    netWorth: "$219.2 Billion",
    avatar: "/lovable-uploads/7d9761f6-da66-4be0-b4f6-482682564e52.png",
    backgroundColor: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800",
    borderColor: "border-blue-500/30",
    accentColor: "text-blue-300",
    isSpecial: true,
    investmentStyle: language === 'zh' ? "颠覆性创新" : "Disruptive Innovation",
    historicalReturn: "+340%",
    famousQuote: language === 'zh' ? "当其他人都谨慎时，要大胆；当其他人都大胆时，要谨慎。" : "When others are cautious, be bold; when others are bold, be cautious.",
    mainAchievements: language === 'zh' ? ["SpaceX CEO", "Tesla创始人", "世界首富", "可重复火箭技术"] : ["SpaceX CEO", "Tesla Founder", "Richest Person", "Reusable Rocket Technology"],
    currentHoldings: ["DOGE", "BTC", "TSLA"],
    tags: language === 'zh' ? ["火星殖民", "电动汽车", "AI"] : ["Mars Colonization", "Electric Vehicles", "AI"]
  },
  {
    name: "Warren Buffett",
    specialty: language === 'zh' ? "价值投资与长期财富建设" : "Value Investing & Long-term Wealth Building",
    confidence: 88,
    recommendation: "HOLD BTC, BUY ETH",
    netWorth: "$118.3 Billion",
    avatar: "/lovable-uploads/4d4ba882-5d48-4828-b81b-a2b60ad7c68b.png",
    backgroundColor: "bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-800",
    borderColor: "border-amber-500/30",
    accentColor: "text-amber-300",
    isSpecial: true,
    investmentStyle: language === 'zh' ? "价值投资" : "Value Investing",
    historicalReturn: "+20.1%",
    famousQuote: language === 'zh' ? "在别人贪婪时恐惧，在别人恐惧时贪婪。" : "Be fearful when others are greedy, and greedy when others are fearful.",
    mainAchievements: language === 'zh' ? ["伯克希尔CEO", "投资教父", "慈善家", "奥马哈先知"] : ["Berkshire CEO", "Investment Guru", "Philanthropist", "Oracle of Omaha"],
    currentHoldings: ["BRK.A", "AAPL", "KO"],
    tags: language === 'zh' ? ["价值投资", "长期持有", "基本面"] : ["Value Investing", "Long-term Holding", "Fundamentals"]
  },
  {
    name: "Bill Gates",
    specialty: language === 'zh' ? "科技创新与慈善投资" : "Technology Innovation & Philanthropic Investment",
    confidence: 92,
    recommendation: "BUY ETH, HOLD MATIC",
    netWorth: "$128.6 Billion",
    avatar: "/lovable-uploads/a11e3b1a-1c1c-403b-910c-bd42820384c4.png",
    backgroundColor: "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800",
    borderColor: "border-emerald-500/30",
    accentColor: "text-emerald-300",
    isSpecial: true,
    investmentStyle: language === 'zh' ? "科技创新" : "Tech Innovation",
    historicalReturn: "+28.5%",
    famousQuote: language === 'zh' ? "成功是一个糟糕的老师，它会让聪明人觉得自己不会失败。" : "Success is a lousy teacher. It seduces smart people into thinking they can't lose.",
    mainAchievements: language === 'zh' ? ["微软创始人", "盖茨基金会", "慈善事业", "全球健康倡导者"] : ["Microsoft Founder", "Gates Foundation", "Philanthropy", "Global Health Advocate"],
    currentHoldings: ["MSFT", "ETH", language === 'zh' ? "清洁能源" : "Clean Energy"],
    tags: language === 'zh' ? ["慈善", "健康", "教育"] : ["Philanthropy", "Health", "Education"]
  },
  {
    name: "Vitalik Buterin",
    specialty: language === 'zh' ? "区块链与去中心化" : "Blockchain & Decentralization",
    confidence: 96,
    recommendation: "BUY ETH, STAKE ETH",
    netWorth: "$400 Million",
    avatar: "/lovable-uploads/5616db28-ef44-4766-b461-7f9a97023859.png",
    backgroundColor: "bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-800",
    borderColor: "border-violet-500/30",
    accentColor: "text-violet-300",
    isSpecial: true,
    investmentStyle: language === 'zh' ? "去中心化未来" : "Decentralized Future",
    historicalReturn: "+1,200%",
    famousQuote: language === 'zh' ? "区块链不仅仅是金融革命，更是去中心化协调的新范式。" : "Blockchain is not just a financial revolution, but a new paradigm for decentralized coordination.",
    mainAchievements: language === 'zh' ? ["以太坊联合创始人", "智能合约先驱", "区块链布道者", "加密朋克精神领袖"] : ["Ethereum Co-founder", "Smart Contract Pioneer", "Blockchain Evangelist", "Crypto Punk Leader"],
    currentHoldings: ["ETH", language === 'zh' ? "各类DeFi代币" : "Various DeFi Tokens", language === 'zh' ? "公共物品基金" : "Public Goods Fund"],
    tags: language === 'zh' ? ["智能合约", "DeFi", "Web3"] : ["Smart Contracts", "DeFi", "Web3"]
  },
  {
    name: "Justin Sun",
    specialty: language === 'zh' ? "TRON生态与营销" : "TRON Ecosystem & Marketing",
    confidence: 87,
    recommendation: "BUY TRX, USDD",
    netWorth: "$1.1 Billion",
    avatar: "/lovable-uploads/95952d3d-a183-488d-9fc8-4b12a9e06365.png",
    backgroundColor: "bg-gradient-to-br from-rose-900 via-pink-900 to-red-800",
    borderColor: "border-rose-500/30",
    accentColor: "text-rose-300",
    isSpecial: true,
    investmentStyle: language === 'zh' ? "营销驱动增长" : "Marketing-Driven Growth",
    historicalReturn: "+890%",
    famousQuote: language === 'zh' ? "在加密货币世界中，营销和技术同样重要。" : "In the crypto world, marketing and technology are equally important.",
    mainAchievements: language === 'zh' ? ["TRON创始人", "火币全球顾问委员会", "天价NFT收藏家", "加密营销大师"] : ["TRON Founder", "Huobi Global Advisory", "Expensive NFT Collector", "Crypto Marketing Master"],
    currentHoldings: ["TRX", "USDD", "BTT", language === 'zh' ? "NFT收藏" : "NFT Collection"],
    tags: language === 'zh' ? ["TRON", "营销", "DeFi"] : ["TRON", "Marketing", "DeFi"]
  },
  {
    name: "Donald Trump",
    specialty: language === 'zh' ? "房地产与品牌投资" : "Real Estate & Brand Investment",
    confidence: 93,
    recommendation: "BUY REAL ESTATE, GOLD",
    netWorth: "$2.6 Billion",
    avatar: "/lovable-uploads/7d4748c1-c1ec-4468-891e-445541a5a42c.png",
    backgroundColor: "bg-gradient-to-br from-yellow-900 via-orange-900 to-amber-800",
    borderColor: "border-yellow-500/30",
    accentColor: "text-yellow-300",
    isSpecial: true,
    investmentStyle: language === 'zh' ? "品牌价值驱动" : "Brand Value Driven",
    historicalReturn: "+156%",
    famousQuote: language === 'zh' ? "我们要让美国再次伟大，让投资再次伟大！" : "We're going to make America great again, make investments great again!",
    mainAchievements: language === 'zh' ? ["特朗普集团主席", "美国第45任总统", "房地产大亨", "品牌授权专家"] : ["Trump Organization Chairman", "45th US President", "Real Estate Mogul", "Brand Licensing Expert"],
    currentHoldings: [language === 'zh' ? "房地产" : "Real Estate", language === 'zh' ? "特朗普NFT" : "Trump NFTs", language === 'zh' ? "黄金" : "Gold", "Trump Media"],
    tags: language === 'zh' ? ["房地产", "品牌", "政治"] : ["Real Estate", "Branding", "Politics"]
  },
  {
    name: language === 'zh' ? "神秘顾问 #1" : "Mystery Advisor #1",
    specialty: language === 'zh' ? "即将揭晓..." : "Coming Soon...",
    confidence: 0,
    recommendation: language === 'zh' ? "敬请期待" : "Stay Tuned",
    netWorth: "???",
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzkiIGZpbGw9IiM0QjU1NjMiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik00MCAyNUM0MS4xIDI1IDQyIDI1LjkgNDIgMjdWMzVDNDIgMzYuMSA0MS4xIDM3IDQwIDM3QzM4LjkgMzcgMzggMzYuMSAzOCAzNVYyN0MzOCAyNS45IDM4LjkgMjUgNDAgMjVaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDgiIHI9IjMiIGZpbGw9IiM5QjlDQTQiLz4KPC9zdmc+",
    backgroundColor: "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-700",
    borderColor: "border-gray-600/50",
    accentColor: "text-gray-400",
    isSpecial: false,
    investmentStyle: language === 'zh' ? "未知" : "Unknown",
    historicalReturn: "???",
    famousQuote: language === 'zh' ? "一切即将揭晓..." : "All will be revealed...",
    mainAchievements: language === 'zh' ? ["未公开", "保密中", "敬请期待"] : ["Classified", "Confidential", "Coming Soon"],
    currentHoldings: ["???", "???", "???"],
    tags: language === 'zh' ? ["神秘", "未知", "即将到来"] : ["Mystery", "Unknown", "Coming Soon"],
    isLocked: true
  },
  {
    name: language === 'zh' ? "神秘顾问 #2" : "Mystery Advisor #2",
    specialty: language === 'zh' ? "即将揭晓..." : "Coming Soon...",
    confidence: 0,
    recommendation: language === 'zh' ? "敬请期待" : "Stay Tuned",
    netWorth: "???",
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzkiIGZpbGw9IiM0QjU1NjMiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik00MCAyNUM0MS4xIDI1IDQyIDI1LjkgNDIgMjdWMzVDNDIgMzYuMSA0MS4xIDM3IDQwIDM3QzM4LjkgMzcgMzggMzYuMSAzOCAzNVYyN0MzOCAyNS45IDM4LjkgMjUgNDAgMjVaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDgiIHI9IjMiIGZpbGw9IiM5QjlDQTQiLz4KPC9zdmc+",
    backgroundColor: "bg-gradient-to-br from-purple-900 via-indigo-800 to-gray-700",
    borderColor: "border-purple-600/50",
    accentColor: "text-purple-400",
    isSpecial: false,
    investmentStyle: language === 'zh' ? "未知" : "Unknown",
    historicalReturn: "???",
    famousQuote: language === 'zh' ? "神秘的力量正在积聚..." : "Mysterious forces are gathering...",
    mainAchievements: language === 'zh' ? ["顶级机密", "传奇投资者", "隐秘大师"] : ["Top Secret", "Legendary Investor", "Hidden Master"],
    currentHoldings: ["???", "???", "???"],
    tags: language === 'zh' ? ["神秘", "传奇", "隐秘"] : ["Mystery", "Legend", "Hidden"],
    isLocked: true
  },
  {
    name: language === 'zh' ? "神秘顾问 #3" : "Mystery Advisor #3",
    specialty: language === 'zh' ? "即将揭晓..." : "Coming Soon...",
    confidence: 0,
    recommendation: language === 'zh' ? "敬请期待" : "Stay Tuned",
    netWorth: "???",
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzkiIGZpbGw9IiM0QjU1NjMiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik00MCAyNUM0MS4xIDI1IDQyIDI1LjkgNDIgMjdWMzVDNDIgMzYuMSA0MS4xIDM3IDQwIDM3QzM4LjkgMzcgMzggMzYuMSAzOCAzNVYyN0MzOCAyNS45IDM4LjkgMjUgNDAgMjVaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDgiIHI9IjMiIGZpbGw9IiM5QjlDQTQiLz4KPC9zdmc+",
    backgroundColor: "bg-gradient-to-br from-emerald-900 via-green-800 to-gray-700",
    borderColor: "border-emerald-600/50",
    accentColor: "text-emerald-400",
    isSpecial: false,
    investmentStyle: language === 'zh' ? "未知" : "Unknown",
    historicalReturn: "???",
    famousQuote: language === 'zh' ? "真相就在不远处..." : "Truth lies just ahead...",
    mainAchievements: language === 'zh' ? ["隐藏高手", "秘密策略师", "市场幽灵"] : ["Hidden Expert", "Secret Strategist", "Market Ghost"],
    currentHoldings: ["???", "???", "???"],
    tags: language === 'zh' ? ["神秘", "策略", "幽灵"] : ["Mystery", "Strategy", "Ghost"],
    isLocked: true
  },
  {
    name: language === 'zh' ? "神秘顾问 #4" : "Mystery Advisor #4",
    specialty: language === 'zh' ? "即将揭晓..." : "Coming Soon...",
    confidence: 0,
    recommendation: language === 'zh' ? "敬请期待" : "Stay Tuned",
    netWorth: "???",
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzkiIGZpbGw9IiM0QjU1NjMiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik00MCAyNUM0MS4xIDI1IDQyIDI1LjkgNDIgMjdWMzVDNDIgMzYuMUE0MS4xIDM3IDQwIDM3QzM4LjkgMzcgMzggMzYuMSAzOCAzNVYyN0MzOCAyNS45IDM4LjkgMjUgNDAgMjVaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDgiIHI9IjMiIGZpbGw9IiM5QjlDQTQiLz4KPC9zdmc+",
    backgroundColor: "bg-gradient-to-br from-red-900 via-pink-800 to-gray-700",
    borderColor: "border-red-600/50",
    accentColor: "text-red-400",
    isSpecial: false,
    investmentStyle: language === 'zh' ? "未知" : "Unknown",
    historicalReturn: "???",
    famousQuote: language === 'zh' ? "时机即将到来..." : "The time is almost here...",
    mainAchievements: language === 'zh' ? ["传奇人物", "暗中操盘", "神秘力量"] : ["Legendary Figure", "Shadow Trader", "Mysterious Power"],
    currentHoldings: ["???", "???", "???"],
    tags: language === 'zh' ? ["神秘", "传奇", "力量"] : ["Mystery", "Legend", "Power"],
    isLocked: true
  },
  {
    name: language === 'zh' ? "神秘顾问 #5" : "Mystery Advisor #5",
    specialty: language === 'zh' ? "即将揭晓..." : "Coming Soon...",
    confidence: 0,
    recommendation: language === 'zh' ? "敬请期待" : "Stay Tuned",
    netWorth: "???",
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzkiIGZpbGw9IiM0QjU1NjMiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik00MCAyNUM0MS4xIDI1IDQyIDI1LjkgNDIgMjdWMzVDNDIgMzYuMSA0MS4xIDM3IDQwIDM3QzM4LjkgMzcgMzggMzYuMSAzOCAzNVYyN0MzOCAyNS45IDM4LjkgMjUgNDAgMjVaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDgiIHI9IjMiIGZpbGw9IiM5QjlDQTQiLz4KPC9zdmc+",
    backgroundColor: "bg-gradient-to-br from-blue-900 via-cyan-800 to-gray-700",
    borderColor: "border-blue-600/50",
    accentColor: "text-blue-400",
    isSpecial: false,
    investmentStyle: language === 'zh' ? "未知" : "Unknown",
    historicalReturn: "???",
    famousQuote: language === 'zh' ? "未来即将展现..." : "The future will unfold...",
    mainAchievements: language === 'zh' ? ["未来先知", "隐秘导师", "神话人物"] : ["Future Oracle", "Hidden Mentor", "Mythical Figure"],
    currentHoldings: ["???", "???", "???"],
    tags: language === 'zh' ? ["神秘", "未来", "神话"] : ["Mystery", "Future", "Myth"],
    isLocked: true
  },
  {
    name: language === 'zh' ? "神秘顾问 #6" : "Mystery Advisor #6",
    specialty: language === 'zh' ? "即将揭晓..." : "Coming Soon...",
    confidence: 0,
    recommendation: language === 'zh' ? "敬请期待" : "Stay Tuned",
    netWorth: "???",
    avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzkiIGZpbGw9IiM0QjU1NjMiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxwYXRoIGQ9Ik00MCAyNUM0MS4xIDI1IDQyIDI1LjkgNDIgMjdWMzVDNDIgMzYuMSA0MS4xIDM3IDQwIDM3QzM4LjkgMzcgMzggMzYuMSAzOCAzNVYyN0MzOCAyNS45IDM4LjkgMjUgNDAgMjVaIiBmaWxsPSIjOUI5Q0E0Ii8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDgiIHI9IjMiIGZpbGw9IiM5QjlDQTQiLz4KPC9zdmc+",
    backgroundColor: "bg-gradient-to-br from-amber-900 via-orange-800 to-gray-700",
    borderColor: "border-amber-600/50",
    accentColor: "text-amber-400",
    isSpecial: false,
    investmentStyle: language === 'zh' ? "未知" : "Unknown",
    historicalReturn: "???",
    famousQuote: language === 'zh' ? "最后的秘密即将公开..." : "The final secret will be revealed...",
    mainAchievements: language === 'zh' ? ["最终大师", "终极导师", "至高顾问"] : ["Ultimate Master", "Final Mentor", "Supreme Advisor"],
    currentHoldings: ["???", "???", "???"],
    tags: language === 'zh' ? ["神秘", "终极", "至高"] : ["Mystery", "Ultimate", "Supreme"],
    isLocked: true
  }
];

interface AIAdvisorsGridProps {
  cryptoData?: CryptoData[];
  newsData?: NewsArticle[];
  onActivationChange?: (states: Record<string, boolean>) => void;
}

export const AIAdvisorsGrid = ({ cryptoData = [], newsData = [], onActivationChange }: AIAdvisorsGridProps) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [activationStates, setActivationStates] = useState<Record<string, boolean>>({
    "Elon Musk": true,
    "Warren Buffett": true,
    "Bill Gates": true,
    "Vitalik Buterin": true,
    "Justin Sun": true,
    "Donald Trump": true,
    [language === 'zh' ? "神秘顾问 #1" : "Mystery Advisor #1"]: false,
    [language === 'zh' ? "神秘顾问 #2" : "Mystery Advisor #2"]: false,
    [language === 'zh' ? "神秘顾问 #3" : "Mystery Advisor #3"]: false,
    [language === 'zh' ? "神秘顾问 #4" : "Mystery Advisor #4"]: false,
    [language === 'zh' ? "神秘顾问 #5" : "Mystery Advisor #5"]: false,
    [language === 'zh' ? "神秘顾问 #6" : "Mystery Advisor #6"]: false
  });

  // Get localized advisor data
  const aiAdvisors = getAiAdvisorsData(language);

  const handleActivationToggle = (name: string, isActive: boolean) => {
    const newStates = {
      ...activationStates,
      [name]: isActive
    };
    setActivationStates(newStates);
    onActivationChange?.(newStates);
    
    toast({
      title: isActive ? (language === 'zh' ? "顾问已激活" : "Advisor Activated") : (language === 'zh' ? "顾问已停用" : "Advisor Deactivated"),
      description: `${name} ${isActive ? (language === 'zh' ? '现在已激活并将提供投资建议' : 'is now activated and will provide investment advice') : (language === 'zh' ? '已停用，不再提供投资建议' : 'is deactivated and will no longer provide investment advice')}`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Trading Exchange Panel */}
      <TradingExchangePanel 
        cryptoData={cryptoData} 
        newsData={newsData}
        onOpenAIControlCenter={() => {
          // This will be handled by the parent TradingDashboard component
          const event = new CustomEvent('openAIControlCenter');
          window.dispatchEvent(event);
        }}
      />

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 font-orbitron tracking-wide">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
          {t('ai.advisors')}
        </h2>
      </div>

      {/* Six Cards Per Row Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {aiAdvisors.map((advisor, index) => (
          <CompactAdvisorCard
            key={index}
            name={advisor.name}
            specialty={advisor.specialty}
            confidence={advisor.confidence}
            recommendation={advisor.recommendation}
            netWorth={advisor.netWorth}
            avatar={advisor.avatar}
            backgroundColor={advisor.backgroundColor}
            borderColor={advisor.borderColor}
            accentColor={advisor.accentColor}
            isSpecial={activationStates[advisor.name]}
            isLocked={advisor.isLocked}
            investmentStyle={advisor.investmentStyle}
            historicalReturn={advisor.historicalReturn}
            famousQuote={advisor.famousQuote}
            mainAchievements={advisor.mainAchievements}
            currentHoldings={advisor.currentHoldings}
            tags={advisor.tags}
            onActivationToggle={handleActivationToggle}
          />
        ))}
      </div>
    </div>
  );
};