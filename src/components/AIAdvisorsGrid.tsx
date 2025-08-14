import { ElonProfile } from "./ElonProfile";
import { WarrenProfile } from "./WarrenProfile";
import { BillProfile } from "./BillProfile";
import { useLanguage } from "@/hooks/useLanguage";
import { Brain } from "lucide-react";

// AI advisors data
const aiAdvisors = [
  {
    name: "Elon Musk",
    specialty: "elon.specialty",
    confidence: 94,
    recommendation: "BUY DOGE, BTC",
    reasoning: "elon.current.analysis",
    avatar: "/lovable-uploads/9cc92493-5e50-470d-9543-d2fe07d350f6.png",
    isSpecial: true
  },
  {
    name: "Warren Buffett",
    specialty: "warren.specialty",
    confidence: 88,
    recommendation: "HOLD BTC, BUY ETH",
    reasoning: "warren.current.analysis",
    avatar: "/lovable-uploads/ed9162db-2b3e-40ac-8c54-4c00f966b7a7.png",
    isSpecial: true
  },
  {
    name: "Bill Gates",
    specialty: "bill.specialty",
    confidence: 92,
    recommendation: "BUY ETH, HOLD MATIC",
    reasoning: "bill.current.analysis",
    avatar: "/lovable-uploads/11d23e11-5de1-45f8-9894-919cd96033d1.png",
    isSpecial: true
  }
];

export const AIAdvisorsGrid = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2 font-orbitron tracking-wide">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6" />
          {t('ai.advisors')}
        </h2>
      </div>

      {/* Three Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Elon Musk */}
        <ElonProfile
          name={aiAdvisors[0].name}
          specialty={t(aiAdvisors[0].specialty)}
          confidence={aiAdvisors[0].confidence}
          recommendation={aiAdvisors[0].recommendation}
          reasoning={t(aiAdvisors[0].reasoning)}
          avatar={aiAdvisors[0].avatar}
          isSpecial={aiAdvisors[0].isSpecial}
        />

        {/* Warren Buffett */}
        <WarrenProfile
          name={aiAdvisors[1].name}
          specialty={t(aiAdvisors[1].specialty)}
          confidence={aiAdvisors[1].confidence}
          recommendation={aiAdvisors[1].recommendation}
          reasoning={t(aiAdvisors[1].reasoning)}
          avatar={aiAdvisors[1].avatar}
          isSpecial={aiAdvisors[1].isSpecial}
        />

        {/* Bill Gates */}
        <BillProfile
          name={aiAdvisors[2].name}
          specialty={t(aiAdvisors[2].specialty)}
          confidence={aiAdvisors[2].confidence}
          recommendation={aiAdvisors[2].recommendation}
          reasoning={t(aiAdvisors[2].reasoning)}
          avatar={aiAdvisors[2].avatar}
          isSpecial={aiAdvisors[2].isSpecial}
        />
      </div>
    </div>
  );
};