import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
          placeholder="搜索加密货币 (例如: Bitcoin, BTC, 比特币)..."
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
            显示 {filteredCount} / {totalCryptos} 种货币
          </Badge>
          {searchQuery && (
            <Badge variant="secondary" className="bg-primary/20 text-primary">
              搜索: "{searchQuery}"
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
            清除搜索
          </Button>
        )}
      </div>
    </div>
  );
};