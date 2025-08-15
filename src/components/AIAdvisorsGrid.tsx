import { CompactAdvisorCard } from "./CompactAdvisorCard";
import { ProfessionalAIControls } from "./ProfessionalAIControls";
import { useLanguage } from "@/hooks/useLanguage";
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
    isSpecial: true
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
    isSpecial: true
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
    isSpecial: true
  },
  {
    name: "Jeff Bezos",
    specialty: "ecommerce.innovation",
    confidence: 89,
    recommendation: "BUY AWS, AMZN",
    netWorth: "$177.5 Billion",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    backgroundColor: "bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-800",
    borderColor: "border-purple-500/30",
    accentColor: "text-purple-300",
    isSpecial: false
  },
  {
    name: "Mark Cuban",
    specialty: "sports.tech.investment",
    confidence: 85,
    recommendation: "BUY BTC, ETH",
    netWorth: "$5.4 Billion",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    backgroundColor: "bg-gradient-to-br from-red-900 via-orange-900 to-yellow-800",
    borderColor: "border-red-500/30",
    accentColor: "text-red-300",
    isSpecial: false
  },
  {
    name: "Ray Dalio",
    specialty: "hedge.fund.strategy",
    confidence: 91,
    recommendation: "DIVERSIFY, GOLD",
    netWorth: "$19.1 Billion",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    backgroundColor: "bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-800",
    borderColor: "border-gray-500/30",
    accentColor: "text-gray-300",
    isSpecial: false
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
          />
        ))}
      </div>
    </div>
  );
};