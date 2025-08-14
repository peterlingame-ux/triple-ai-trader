import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe, ChevronDown } from "lucide-react";
import { FlagIcon } from "./FlagIcon";

export const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English', countryCode: 'us', region: 'Americas' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', countryCode: 'cn', region: 'Asia' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', countryCode: 'jp', region: 'Asia' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', countryCode: 'kr', region: 'Asia' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', countryCode: 'es', region: 'Europe' },
    { code: 'fr', name: 'French', nativeName: 'Français', countryCode: 'fr', region: 'Europe' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', countryCode: 'de', region: 'Europe' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', countryCode: 'it', region: 'Europe' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', countryCode: 'br', region: 'Americas' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', countryCode: 'ru', region: 'Europe' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', countryCode: 'sa', region: 'Middle East' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', countryCode: 'in', region: 'Asia' },
    { code: 'th', name: 'Thai', nativeName: 'ไทย', countryCode: 'th', region: 'Asia' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', countryCode: 'vn', region: 'Asia' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', countryCode: 'tr', region: 'Europe' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', countryCode: 'nl', region: 'Europe' }
  ];

  const currentLang = languages.find(lang => lang.code === language);
  const groupedLanguages = languages.reduce((acc, lang) => {
    if (!acc[lang.region]) {
      acc[lang.region] = [];
    }
    acc[lang.region].push(lang);
    return acc;
  }, {} as Record<string, typeof languages>);

  return (
    <div className="relative">
      <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
        <SelectTrigger className="group w-auto min-w-[160px] bg-gradient-to-r from-green-600/20 to-teal-600/20 hover:from-green-600/30 hover:to-teal-600/30 border-green-500/30 hover:border-green-400/50 transition-all duration-300 backdrop-blur-sm hover-scale shadow-lg hover:shadow-green-500/25">
           <div className="flex items-center gap-3">
             <div className="relative">
               <Globe className="w-5 h-5 text-green-400 group-hover:rotate-12 transition-transform duration-300" />
               <div className="absolute -inset-1 bg-green-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             </div>
             <FlagIcon countryCode={currentLang?.countryCode || 'us'} size="md" className="ring-1 ring-green-500/30 rounded-sm" />
             <div className="hidden sm:flex flex-col items-start">
               <span className="text-sm font-medium text-green-400">
                 {currentLang?.nativeName}
               </span>
               <span className="text-xs text-green-400/70">
                 {t('language.switch')}
               </span>
             </div>
             <span className="text-sm font-medium text-green-400 sm:hidden">
               {currentLang?.code.toUpperCase()}
             </span>
           </div>
        </SelectTrigger>
        
        <SelectContent className="bg-slate-800/90 backdrop-blur-xl border-slate-600/50 max-h-80 overflow-y-auto z-50 shadow-2xl animate-fade-in">
          {Object.entries(groupedLanguages).map(([region, langs]) => (
            <div key={region}>
              <div className="px-3 py-2">
                <Badge variant="outline" className="text-xs text-green-400 border-green-600/30 bg-green-600/10">
                  {region}
                </Badge>
              </div>
              {langs.map((lang) => (
                <SelectItem 
                  key={lang.code} 
                  value={lang.code}
                  className={`hover:bg-green-500/20 focus:bg-green-500/20 cursor-pointer py-3 transition-all duration-200 ${
                    language === lang.code ? 'bg-green-500/10 text-green-400' : 'text-foreground'
                  }`}
                >
                   <div className="flex items-center gap-3 w-full">
                     <FlagIcon countryCode={lang.countryCode} size="md" className="flex-shrink-0" />
                     <div className="flex flex-col items-start flex-grow">
                       <span className="text-white font-medium text-sm">
                         {lang.nativeName}
                       </span>
                       <span className="text-slate-400 text-xs">
                         {lang.name}
                       </span>
                     </div>
                     {language === lang.code && (
                       <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 animate-pulse"></div>
                     )}
                   </div>
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};