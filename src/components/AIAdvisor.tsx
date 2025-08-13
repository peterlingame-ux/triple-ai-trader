import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, TrendingUp } from "lucide-react";

interface AIAdvisorProps {
  name: string;
  specialty: string;
  confidence: number;
  recommendation: string;
  reasoning: string;
  avatar?: string;
}

export const AIAdvisor = ({ name, specialty, confidence, recommendation, reasoning }: AIAdvisorProps) => {
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
    <Card className="p-6 bg-gradient-ai border-border hover:shadow-glow transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
          <Brain className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{specialty}</p>
        </div>
        <div className="ml-auto">
          <Badge variant="outline" className={getConfidenceColor(confidence)}>
            {confidence}% confident
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Recommendation
          </h4>
          <Badge variant={getRecommendationVariant(recommendation)} className="text-sm px-3 py-1">
            {recommendation}
          </Badge>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            AI Analysis
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {reasoning}
          </p>
        </div>

        <Button variant="outline" className="w-full mt-4 border-accent/30 hover:bg-accent/10">
          Get Detailed Analysis
        </Button>
      </div>
    </Card>
  );
};