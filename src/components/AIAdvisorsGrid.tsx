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
    name: "Mark Zuckerberg",
    specialty: language === 'zh' ? "社交媒体与元宇宙" : "Social Media & Metaverse",
    confidence: 91,
    recommendation: "BUY META, NVDA",
    netWorth: "$177.0 Billion",
    avatar: "/lovable-uploads/4debab92-a84d-4808-a965-e68dd21d0c80.png",
    backgroundColor: "bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-800",
    borderColor: "border-blue-500/30",
    accentColor: "text-blue-300",
    isSpecial: true,
    investmentStyle: language === 'zh' ? "平台生态驱动" : "Platform Ecosystem Driven",
    historicalReturn: "+285%",
    famousQuote: language === 'zh' ? "连接世界，构建元宇宙的未来。" : "Connecting the world and building the future of the metaverse.",
    mainAchievements: language === 'zh' ? ["Meta创始人", "Facebook创始人", "元宇宙先驱", "VR/AR技术领导者"] : ["Meta Founder", "Facebook Founder", "Metaverse Pioneer", "VR/AR Tech Leader"],
    currentHoldings: ["META", "VR/AR", language === 'zh' ? "元宇宙资产" : "Metaverse Assets", language === 'zh' ? "AI技术股" : "AI Tech Stocks"],
    tags: language === 'zh' ? ["社交网络", "元宇宙", "VR/AR"] : ["Social Network", "Metaverse", "VR/AR"]
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
    "Mark Zuckerberg": true
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

      {/* Six Column Grid */}
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