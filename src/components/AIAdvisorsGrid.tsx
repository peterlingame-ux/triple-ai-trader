import { CompactAdvisorCard } from "./CompactAdvisorCard";
import { ProfessionalAIControls } from "./ProfessionalAIControls";
import { useLanguage } from "@/hooks/useLanguage";
import { Brain } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CryptoData, NewsArticle } from "@/types/api";

// AI advisors data
const aiAdvisors = [
  {
    name: "Elon Musk",
    specialty: "远见科技与市场颠覆",
    confidence: 94,
    recommendation: "BUY DOGE, BTC",
    netWorth: "$219.2 Billion",
    avatar: "/lovable-uploads/7d9761f6-da66-4be0-b4f6-482682564e52.png",
    backgroundColor: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800",
    borderColor: "border-blue-500/30",
    accentColor: "text-blue-300",
    isSpecial: true,
    investmentStyle: "颠覆性创新",
    historicalReturn: "+340%",
    famousQuote: "当其他人都谨慎时，要大胆；当其他人都大胆时，要谨慎。",
    mainAchievements: ["SpaceX CEO", "Tesla创始人", "世界首富", "可重复火箭技术"],
    currentHoldings: ["DOGE", "BTC", "TSLA"],
    tags: ["火星殖民", "电动汽车", "AI"]
  },
  {
    name: "Warren Buffett",
    specialty: "价值投资与长期财富建设",
    confidence: 88,
    recommendation: "HOLD BTC, BUY ETH",
    netWorth: "$118.3 Billion",
    avatar: "/lovable-uploads/4d4ba882-5d48-4828-b81b-a2b60ad7c68b.png",
    backgroundColor: "bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-800",
    borderColor: "border-amber-500/30",
    accentColor: "text-amber-300",
    isSpecial: true,
    investmentStyle: "价值投资",
    historicalReturn: "+20.1%",
    famousQuote: "在别人贪婪时恐惧，在别人恐惧时贪婪。",
    mainAchievements: ["伯克希尔CEO", "投资教父", "慈善家", "奥马哈先知"],
    currentHoldings: ["BRK.A", "AAPL", "KO"],
    tags: ["价值投资", "长期持有", "基本面"]
  },
  {
    name: "Bill Gates",
    specialty: "科技创新与慈善投资",
    confidence: 92,
    recommendation: "BUY ETH, HOLD MATIC",
    netWorth: "$128.6 Billion",
    avatar: "/lovable-uploads/a11e3b1a-1c1c-403b-910c-bd42820384c4.png",
    backgroundColor: "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800",
    borderColor: "border-emerald-500/30",
    accentColor: "text-emerald-300",
    isSpecial: true,
    investmentStyle: "科技创新",
    historicalReturn: "+28.5%",
    famousQuote: "成功是一个糟糕的老师，它会让聪明人觉得自己不会失败。",
    mainAchievements: ["微软创始人", "盖茨基金会", "慈善事业", "全球健康倡导者"],
    currentHoldings: ["MSFT", "ETH", "清洁能源"],
    tags: ["慈善", "健康", "教育"]
  },
  {
    name: "Vitalik Buterin",
    specialty: "区块链与去中心化",
    confidence: 96,
    recommendation: "BUY ETH, STAKE ETH",
    netWorth: "$400 Million",
    avatar: "/lovable-uploads/5616db28-ef44-4766-b461-7f9a97023859.png",
    backgroundColor: "bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-800",
    borderColor: "border-violet-500/30",
    accentColor: "text-violet-300",
    isSpecial: true,
    investmentStyle: "去中心化未来",
    historicalReturn: "+1,200%",
    famousQuote: "区块链不仅仅是金融革命，更是去中心化协调的新范式。",
    mainAchievements: ["以太坊联合创始人", "智能合约先驱", "区块链布道者", "加密朋克精神领袖"],
    currentHoldings: ["ETH", "各类DeFi代币", "公共物品基金"],
    tags: ["智能合约", "DeFi", "Web3"]
  },
  {
    name: "Justin Sun",
    specialty: "TRON生态与营销",
    confidence: 87,
    recommendation: "BUY TRX, USDD",
    netWorth: "$1.1 Billion",
    avatar: "/lovable-uploads/95952d3d-a183-488d-9fc8-4b12a9e06365.png",
    backgroundColor: "bg-gradient-to-br from-rose-900 via-pink-900 to-red-800",
    borderColor: "border-rose-500/30",
    accentColor: "text-rose-300",
    isSpecial: true,
    investmentStyle: "营销驱动增长",
    historicalReturn: "+890%",
    famousQuote: "在加密货币世界中，营销和技术同样重要。",
    mainAchievements: ["TRON创始人", "火币全球顾问委员会", "天价NFT收藏家", "加密营销大师"],
    currentHoldings: ["TRX", "USDD", "BTT", "NFT收藏"],
    tags: ["TRON", "营销", "DeFi"]
  },
  {
    name: "Donald Trump",
    specialty: "房地产与品牌投资",
    confidence: 93,
    recommendation: "BUY REAL ESTATE, GOLD",
    netWorth: "$2.6 Billion",
    avatar: "/lovable-uploads/7d4748c1-c1ec-4468-891e-445541a5a42c.png",
    backgroundColor: "bg-gradient-to-br from-yellow-900 via-orange-900 to-amber-800",
    borderColor: "border-yellow-500/30",
    accentColor: "text-yellow-300",
    isSpecial: true,
    investmentStyle: "品牌价值驱动",
    historicalReturn: "+156%",
    famousQuote: "我们要让美国再次伟大，让投资再次伟大！",
    mainAchievements: ["特朗普集团主席", "美国第45任总统", "房地产大亨", "品牌授权专家"],
    currentHoldings: ["房地产", "特朗普NFT", "黄金", "Trump Media"],
    tags: ["房地产", "品牌", "政治"]
  }
];

interface AIAdvisorsGridProps {
  cryptoData?: CryptoData[];
  newsData?: NewsArticle[];
  onActivationChange?: (states: Record<string, boolean>) => void;
}

export const AIAdvisorsGrid = ({ cryptoData = [], newsData = [], onActivationChange }: AIAdvisorsGridProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [activationStates, setActivationStates] = useState<Record<string, boolean>>({
    "Elon Musk": true,
    "Warren Buffett": true,
    "Bill Gates": true,
    "Vitalik Buterin": true,
    "Justin Sun": true,
    "Donald Trump": true
  });

  const handleActivationToggle = (name: string, isActive: boolean) => {
    const newStates = {
      ...activationStates,
      [name]: isActive
    };
    setActivationStates(newStates);
    onActivationChange?.(newStates);
    
    toast({
      title: isActive ? "顾问已激活" : "顾问已停用",
      description: `${name} ${isActive ? '现在已激活并将提供投资建议' : '已停用，不再提供投资建议'}`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Professional AI Controls */}
      <ProfessionalAIControls 
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