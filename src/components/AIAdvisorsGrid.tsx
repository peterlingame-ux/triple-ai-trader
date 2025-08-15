import { CompactAdvisorCard } from "./CompactAdvisorCard";
import { ProfessionalAIControls } from "./ProfessionalAIControls";
import { useLanguage } from "@/hooks/useLanguage";
import trumpAvatar from "../assets/trump-avatar.jpg";
import { Brain } from "lucide-react";

// AI advisors data
const aiAdvisors = [
  {
    name: "Elon Musk",
    specialty: "elon.specialty",
    confidence: 94,
    recommendation: "BUY DOGE, BTC",
    netWorth: "$219.2 Billion",
    avatar: "/lovable-uploads/efc313aa-5268-413f-bb28-d1bf3b1f6f9f.png",
    backgroundColor: "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800",
    borderColor: "border-blue-500/30",
    accentColor: "text-blue-300",
    isSpecial: true,
    investmentStyle: "颠覆性创新",
    historicalReturn: "+340%",
    riskLevel: "高",
    famousQuote: "当其他人都谨慎时，要大胆；当其他人都大胆时，要谨慎。",
    mainAchievements: ["SpaceX CEO", "Tesla创始人", "世界首富", "可重复火箭技术"],
    currentHoldings: ["DOGE", "BTC", "TSLA"],
    tags: ["火星殖民", "电动汽车", "AI"]
  },
  {
    name: "Warren Buffett",
    specialty: "warren.specialty",
    confidence: 88,
    recommendation: "HOLD BTC, BUY ETH",
    netWorth: "$118.3 Billion",
    avatar: "/lovable-uploads/4cd6a022-c475-4af7-a9c1-681f2a8c06b1.png",
    backgroundColor: "bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-800",
    borderColor: "border-amber-500/30",
    accentColor: "text-amber-300",
    isSpecial: true,
    investmentStyle: "价值投资",
    historicalReturn: "+20.1%",
    riskLevel: "低",
    famousQuote: "在别人贪婪时恐惧，在别人恐惧时贪婪。",
    mainAchievements: ["伯克希尔CEO", "投资教父", "慈善家", "奥马哈先知"],
    currentHoldings: ["BRK.A", "AAPL", "KO"],
    tags: ["价值投资", "长期持有", "基本面"]
  },
  {
    name: "Bill Gates",
    specialty: "bill.specialty",
    confidence: 92,
    recommendation: "BUY ETH, HOLD MATIC",
    netWorth: "$128.6 Billion",
    avatar: "/lovable-uploads/11d23e11-5de1-45f8-9894-919cd96033d1.png",
    backgroundColor: "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-800",
    borderColor: "border-emerald-500/30",
    accentColor: "text-emerald-300",
    isSpecial: true,
    investmentStyle: "科技创新",
    historicalReturn: "+28.5%",
    riskLevel: "中",
    famousQuote: "成功是一个糟糕的老师，它会让聪明人觉得自己不会失败。",
    mainAchievements: ["微软创始人", "盖茨基金会", "慈善事业", "全球健康倡导者"],
    currentHoldings: ["MSFT", "ETH", "清洁能源"],
    tags: ["慈善", "健康", "教育"]
  },
  {
    name: "Jeff Bezos",
    specialty: "电商与云计算",
    confidence: 89,
    recommendation: "BUY AWS, CLOUD",
    netWorth: "$177.5 Billion",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    backgroundColor: "bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-800",
    borderColor: "border-purple-500/30",
    accentColor: "text-purple-300",
    isSpecial: false,
    investmentStyle: "长期增长",
    historicalReturn: "+31.2%",
    riskLevel: "中",
    famousQuote: "你的品牌就是人们在你不在房间时对你的评价。",
    mainAchievements: ["亚马逊创始人", "蓝色起源", "华盛顿邮报", "全球首富"],
    currentHoldings: ["AMZN", "蓝色起源", "房地产"],
    tags: ["电商", "太空", "媒体"]
  },
  {
    name: "Mark Cuban",
    specialty: "体育与科技投资",
    confidence: 85,
    recommendation: "BUY BTC, ETH",
    netWorth: "$5.4 Billion",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    backgroundColor: "bg-gradient-to-br from-red-900 via-orange-900 to-yellow-800",
    borderColor: "border-red-500/30",
    accentColor: "text-red-300",
    isSpecial: false,
    investmentStyle: "高风险高回报",
    historicalReturn: "+45.7%",
    riskLevel: "高",
    famousQuote: "汗水是成功的润滑剂。",
    mainAchievements: ["达拉斯独行侠老板", "鲨鱼坦克投资人", "科技创业家", "媒体大亨"],
    currentHoldings: ["BTC", "ETH", "NBA球队"],
    tags: ["体育", "创业", "加密货币"]
  },
  {
    name: "Ray Dalio",
    specialty: "宏观对冲策略",
    confidence: 91,
    recommendation: "分散投资, 黄金",
    netWorth: "$19.1 Billion",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    backgroundColor: "bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-800",
    borderColor: "border-gray-500/30",
    accentColor: "text-gray-300",
    isSpecial: false,
    investmentStyle: "全天候策略",
    historicalReturn: "+12.3%",
    riskLevel: "低",
    famousQuote: "拥有可信度的人应该坦诚地分享自己的想法。",
    mainAchievements: ["桥水基金创始人", "原则作者", "宏观经济专家", "全球最大对冲基金"],
    currentHoldings: ["黄金", "债券", "多元化"],
    tags: ["宏观", "原则", "风险平价"]
  },
  {
    name: "Vitalik Buterin",
    specialty: "区块链与以太坊",
    confidence: 96,
    recommendation: "BUY ETH, STAKE ETH",
    netWorth: "$400 Million",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    backgroundColor: "bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-800",
    borderColor: "border-violet-500/30",
    accentColor: "text-violet-300",
    isSpecial: true,
    investmentStyle: "去中心化未来",
    historicalReturn: "+1,200%",
    riskLevel: "高",
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
    avatar: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&h=400&fit=crop&crop=face",
    backgroundColor: "bg-gradient-to-br from-rose-900 via-pink-900 to-red-800",
    borderColor: "border-rose-500/30",
    accentColor: "text-rose-300",
    isSpecial: false,
    investmentStyle: "营销驱动增长",
    historicalReturn: "+890%",
    riskLevel: "极高",
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
    avatar: trumpAvatar,
    backgroundColor: "bg-gradient-to-br from-yellow-900 via-orange-900 to-amber-800",
    borderColor: "border-yellow-500/30",
    accentColor: "text-yellow-300",
    isSpecial: true,
    investmentStyle: "品牌价值驱动",
    historicalReturn: "+156%",
    riskLevel: "中高",
    famousQuote: "我们要让美国再次伟大，让投资再次伟大！",
    mainAchievements: ["特朗普集团主席", "美国第45任总统", "房地产大亨", "品牌授权专家"],
    currentHoldings: ["房地产", "特朗普NFT", "黄金", "Trump Media"],
    tags: ["房地产", "品牌", "政治"]
  }
];

interface AIAdvisorsGridProps {
  cryptoData?: any[];
  newsData?: any[];
}

export const AIAdvisorsGrid = ({ cryptoData = [], newsData = [] }: AIAdvisorsGridProps) => {
  const { t } = useLanguage();

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
            isSpecial={advisor.isSpecial}
            investmentStyle={advisor.investmentStyle}
            historicalReturn={advisor.historicalReturn}
            riskLevel={advisor.riskLevel}
            famousQuote={advisor.famousQuote}
            mainAchievements={advisor.mainAchievements}
            currentHoldings={advisor.currentHoldings}
            tags={advisor.tags}
          />
        ))}
      </div>
    </div>
  );
};