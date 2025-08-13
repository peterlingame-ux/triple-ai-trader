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
          className="pl-10 pr-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-ring"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-muted-foreground border-border">
            {t('search.showing')} {filteredCount} {t('search.of')} {totalCryptos} {t('search.currencies')}
          </Badge>
          {searchQuery && (
            <Badge variant="secondary" className="bg-accent/20 text-accent">
              {t('search.filter')}: "{searchQuery}"
            </Badge>
          )}
        </div>
        
        {searchQuery && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="text-xs border-border text-muted-foreground hover:text-foreground"
          >
            {t('search.clear')}
          </Button>
        )}
      </div>
    </div>
  );
};