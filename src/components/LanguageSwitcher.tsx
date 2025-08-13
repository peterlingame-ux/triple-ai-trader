import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import { Globe, ChevronDown } from "lucide-react";
import { FlagIcon } from "./FlagIcon";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
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
        <SelectTrigger className="w-auto min-w-[160px] bg-slate-800/90 border-slate-600 hover:border-amber-500/50 transition-all duration-300 backdrop-blur-sm">
           <div className="flex items-center gap-3">
             <Globe className="w-4 h-4 text-amber-400" />
             <FlagIcon countryCode={currentLang?.countryCode || 'us'} size="md" />
             <span className="text-xs text-slate-400 font-mono">{(currentLang?.countryCode || 'us').toUpperCase()}</span>
             <span className="text-sm font-medium text-white hidden md:block">
               {currentLang?.nativeName}
             </span>
             <span className="text-sm font-medium text-white md:hidden">
               {currentLang?.code.toUpperCase()}
             </span>
           </div>
        </SelectTrigger>
        
        <SelectContent className="bg-slate-800/95 border-slate-600 max-h-80 overflow-y-auto backdrop-blur-md">
          {Object.entries(groupedLanguages).map(([region, langs]) => (
            <div key={region}>
              <div className="px-3 py-2">
                <Badge variant="outline" className="text-xs text-amber-400 border-amber-600/30 bg-amber-600/10">
                  {region}
                </Badge>
              </div>
              {langs.map((lang) => (
                <SelectItem 
                  key={lang.code} 
                  value={lang.code}
                  className="hover:bg-slate-700/80 focus:bg-slate-700/80 cursor-pointer py-3 transition-all duration-200"
                >
                   <div className="flex items-center gap-4 w-full">
                     <div className="flex items-center gap-2">
                       <FlagIcon countryCode={lang.countryCode} size="md" className="flex-shrink-0" />
                       <span className="text-xs text-slate-500 font-mono">{lang.countryCode.toUpperCase()}</span>
                     </div>
                     <div className="flex flex-col items-start flex-grow">
                       <span className="text-white font-medium text-sm">
                         {lang.nativeName}
                       </span>
                       <span className="text-slate-400 text-xs">
                         {lang.name}
                       </span>
                     </div>
                     {language === lang.code && (
                       <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0"></div>
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