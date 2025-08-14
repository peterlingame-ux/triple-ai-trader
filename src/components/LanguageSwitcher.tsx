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
        <SelectTrigger className="group w-auto min-w-[180px] border-0 bg-gradient-to-r from-teal-800/40 to-green-700/40 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-teal-500/20 hover:from-teal-700/50 hover:to-green-600/50">
           <div className="flex items-center gap-4 px-2 py-1">
             <div className="relative">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500/30 to-green-500/20 flex items-center justify-center shadow-lg">
                 <Globe className="w-7 h-7 text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
               </div>
               <div className="absolute -bottom-1 -right-1">
                 <FlagIcon countryCode={currentLang?.countryCode || 'us'} size="sm" className="ring-2 ring-teal-400/50 rounded-sm shadow-lg" />
               </div>
             </div>
             <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                 <h3 className="text-base font-semibold text-teal-400 truncate">
                   {currentLang?.nativeName || 'English'}
                 </h3>
                 <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
               </div>
               <p className="text-sm text-teal-400/70 truncate">
                 {t('language.switch')}
               </p>
             </div>
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