import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, TrendingUp } from "lucide-react";
import { ElonAvatar3D } from "./ElonAvatar3D";
import { useLanguage } from "@/hooks/useLanguage";

interface AIAdvisorProps {
  name: string;
  specialty: string;
  confidence: number;
  recommendation: string;
  reasoning: string;
  avatar?: string;
  isSpecial?: boolean;
}

export const AIAdvisor = ({ name, specialty, confidence, recommendation, reasoning, avatar, isSpecial }: AIAdvisorProps) => {
  const { t } = useLanguage();
  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return "text-success";
    if (conf >= 60) return "text-accent";
    return "text-destructive";
  };

  const getRecommendationVariant = (rec: string) => {
    if (rec.toLowerCase().includes('buy')) return "default";
    if (rec.toLowerCase().includes('sell')) return "destructive";
    return "secondary";
  };

  return (
    <Card className="p-6 bg-gradient-ai border-border hover:shadow-glow transition-all duration-300 relative overflow-hidden">
      {isSpecial && (
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-accent/20 text-accent border-accent/50">
            {t('advisor.featured')}
          </Badge>
        </div>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className={`${name === 'Elon Musk' || name === 'Warren Buffett' || name === '比尔盖茨' ? 'w-20 h-20' : 'w-12 h-12'} rounded-full bg-accent/20 flex items-center justify-center overflow-hidden`}>
          {avatar && name === 'Elon Musk' ? (
            <ElonAvatar3D />
          ) : avatar ? (
            <img 
              src={avatar} 
              alt={name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <Brain className="w-6 h-6 text-accent" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{specialty}</p>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className={getConfidenceColor(confidence)}>
            {confidence}% {t('advisor.confidence')}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            {t('advisor.recommendation')}
          </h4>
          <Badge variant={getRecommendationVariant(recommendation)} className="text-sm px-3 py-1">
            {recommendation}
          </Badge>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            {t('advisor.analysis')}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {reasoning}
          </p>
        </div>

        <Button variant="outline" className="w-full mt-4 border-accent/30 hover:bg-accent/10">
          {t('advisor.detailed')}
        </Button>
      </div>
    </Card>
  );
};