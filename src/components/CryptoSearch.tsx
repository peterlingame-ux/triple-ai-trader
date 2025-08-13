import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

interface CryptoSearchProps {
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  searchQuery: string;
  totalCryptos: number;
  filteredCount: number;
}

export const CryptoSearch = ({ 
  onSearch, 
  onClearSearch, 
  searchQuery, 
  totalCryptos, 
  filteredCount 
}: CryptoSearchProps) => {
  const { t } = useLanguage();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (value: string) => {
    setLocalQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setLocalQuery("");
    onClearSearch();
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder={t('search.placeholder')}
          value={localQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-12 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-primary"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto text-muted-foreground hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-slate-300 border-slate-600">
            {t('search.showing')} {filteredCount} {t('search.of')} {totalCryptos} {t('search.currencies')}
          </Badge>
          {searchQuery && (
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              {t('search.filter')}: "{searchQuery}"
            </Badge>
          )}
        </div>
        
        {searchQuery && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="text-xs border-slate-600 text-slate-300 hover:text-white"
          >
            {t('search.clear')}
          </Button>
        )}
      </div>
    </div>
  );
};