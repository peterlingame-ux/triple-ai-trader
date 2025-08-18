import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DEFAULT_SYMBOLS, CRYPTO_NAMES } from '@/constants/crypto';
import { useOptimizedCrypto } from '@/hooks/useOptimizedCrypto';
import { Crypto3DIcon } from './Crypto3DIcon';

interface CryptoCurrencySelectorProps {
  onCryptoSelect: (symbol: string, name: string) => void;
  selectedCrypto?: { symbol: string; name: string };
  compact?: boolean;
}

export const CryptoCurrencySelector = ({ 
  onCryptoSelect, 
  selectedCrypto, 
  compact = false 
}: CryptoCurrencySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cryptoData } = useOptimizedCrypto();

  // 热门货币（前8个）
  const popularCryptos = DEFAULT_SYMBOLS.slice(0, 8);

  // 搜索过滤
  const filteredCryptos = useMemo(() => {
    if (!searchQuery) return DEFAULT_SYMBOLS;
    
    const query = searchQuery.toLowerCase();
    return DEFAULT_SYMBOLS.filter(symbol => {
      const cryptoInfo = CRYPTO_NAMES[symbol];
      return (
        symbol.toLowerCase().includes(query) ||
        cryptoInfo?.name.toLowerCase().includes(query) ||
        cryptoInfo?.cn.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  // 获取货币的实时价格和涨幅
  const getCryptoData = (symbol: string) => {
    return cryptoData.find(crypto => crypto.symbol === symbol);
  };

  // 选择货币
  const handleSelect = (symbol: string) => {
    const cryptoInfo = CRYPTO_NAMES[symbol];
    onCryptoSelect(symbol, cryptoInfo?.name || symbol);
    setOpen(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          货币选择
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* 热门货币快捷按钮 */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-muted-foreground">热门货币</h4>
          <div className="grid grid-cols-4 gap-2">
            {popularCryptos.map((symbol) => {
              const cryptoInfo = CRYPTO_NAMES[symbol];
              const cryptoRealData = getCryptoData(symbol);
              const isSelected = selectedCrypto?.symbol === symbol;
              
              return (
                <Button
                  key={symbol}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSelect(symbol)}
                  className={`h-auto p-2 flex flex-col items-center gap-1 ${
                    isSelected ? 'ring-2 ring-primary/50' : ''
                  }`}
                >
                  <Crypto3DIcon symbol={symbol} size={20} />
                  <span className="text-xs font-medium">{symbol}</span>
                  {cryptoRealData && (
                    <span className={`text-xs ${
                      cryptoRealData.changePercent24h >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {cryptoRealData.changePercent24h >= 0 ? '+' : ''}
                      {cryptoRealData.changePercent24h?.toFixed(2)}%
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 当前选中的货币显示 */}
        <div className="border rounded-lg p-3 bg-secondary/20">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between h-auto p-3"
              >
                {selectedCrypto ? (
                  <div className="flex items-center gap-3">
                    <Crypto3DIcon symbol={selectedCrypto.symbol} size={24} />
                    <div className="text-left">
                      <div className="font-medium">
                        {selectedCrypto.symbol} · {selectedCrypto.name}
                      </div>
                      {getCryptoData(selectedCrypto.symbol) && (
                        <div className="text-sm text-muted-foreground">
                          ${getCryptoData(selectedCrypto.symbol)?.price?.toLocaleString() || 'N/A'}
                          <span className={`ml-2 ${
                            (getCryptoData(selectedCrypto.symbol)?.changePercent24h || 0) >= 0 
                              ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {(getCryptoData(selectedCrypto.symbol)?.changePercent24h || 0) >= 0 ? '+' : ''}
                            {getCryptoData(selectedCrypto.symbol)?.changePercent24h?.toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">选择要咨询的货币...</span>
                )}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput 
                    placeholder="搜索货币名称或代码..." 
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                </div>
                <CommandList className="max-h-64">
                  <CommandEmpty>未找到相关货币</CommandEmpty>
                  <CommandGroup>
                    {filteredCryptos.slice(0, 50).map((symbol) => {
                      const cryptoInfo = CRYPTO_NAMES[symbol];
                      const cryptoRealData = getCryptoData(symbol);
                      
                      return (
                        <CommandItem
                          key={symbol}
                          value={symbol}
                          onSelect={() => handleSelect(symbol)}
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/50"
                        >
                          <div className="flex items-center gap-3">
                            <Crypto3DIcon symbol={symbol} size={20} />
                            <div>
                              <div className="font-medium">{symbol}</div>
                              <div className="text-sm text-muted-foreground">
                                {cryptoInfo?.name} {cryptoInfo?.cn && `· ${cryptoInfo.cn}`}
                              </div>
                            </div>
                          </div>
                          {cryptoRealData && (
                            <div className="text-right">
                              <div className="text-sm font-medium">
                                ${cryptoRealData.price?.toLocaleString() || 'N/A'}
                              </div>
                              <Badge 
                                variant={cryptoRealData.changePercent24h >= 0 ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {cryptoRealData.changePercent24h >= 0 ? '+' : ''}
                                {cryptoRealData.changePercent24h?.toFixed(2)}%
                              </Badge>
                            </div>
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* 搜索结果统计 */}
        {searchQuery && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              找到 {filteredCryptos.length} 种货币
            </Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchQuery('')}
              className="text-xs h-auto p-1"
            >
              清除搜索
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};