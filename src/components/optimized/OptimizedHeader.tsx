import { memo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { UserProfile } from "../UserProfile";
import { WalletConnector } from "../WalletConnector";
import { LanguageSwitcher } from "../LanguageSwitcher";

export const OptimizedHeader = memo(() => {
  const { t } = useLanguage();
  
  return (
    <div className="relative">
      {/* Background with enhanced glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-blue-950/80 to-slate-900/90 backdrop-blur-2xl rounded-2xl border border-white/5 shadow-2xl"></div>
      
      {/* Content */}
      <div className="relative px-6 py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left Section - Brand */}
          <div className="flex items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl lg:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-300 tracking-tight">
                Meta BrainX
              </h1>
              <p className="text-base text-slate-300 font-inter font-medium tracking-wide">
                {t('app.subtitle')}
              </p>
            </div>
          </div>
          
          {/* Center Section - Status Indicator */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Badge variant="outline" className="px-4 py-2 bg-gradient-to-r from-success/10 to-emerald-500/10 text-success border-success/20 backdrop-blur-sm hover:from-success/20 hover:to-emerald-500/20 transition-all duration-300">
                <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse shadow-lg shadow-success/50"></div>
                <Brain className="w-4 h-4 mr-2" />
                {t('status.live')}
              </Badge>
              <div className="absolute -inset-1 bg-gradient-to-r from-success/20 to-emerald-500/20 blur-md -z-10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
          {/* Right Section - User Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-xl border border-white/5 shadow-lg">
              <UserProfile />
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              <WalletConnector />
              <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle bottom accent */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent blur-sm"></div>
    </div>
  );
});

OptimizedHeader.displayName = 'OptimizedHeader';