import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car3DModel } from './Car3DModel';
import { Car, Sparkles } from 'lucide-react';

interface CarBrand {
  id: string;
  name: string;
  color: string;
  emoji: string;
}

const carBrands: CarBrand[] = [
  { id: 'ferrari', name: '法拉利', color: '#DC143C', emoji: '🏎️' },
  { id: 'lamborghini', name: '兰博基尼', color: '#FFD700', emoji: '🚗' },
  { id: 'porsche', name: '保时捷', color: '#C0C0C0', emoji: '🏁' },
  { id: 'mclaren', name: '迈凯伦', color: '#FF6600', emoji: '🚀' },
  { id: 'bugatti', name: '布加迪', color: '#000080', emoji: '💎' },
  { id: 'aston_martin', name: '阿斯顿马丁', color: '#006400', emoji: '🎯' },
];

interface CarSelectorProps {
  selectedCar?: string;
  onCarChange?: (carId: string) => void;
  size?: number;
}

export const CarSelector: React.FC<CarSelectorProps> = ({ 
  selectedCar = 'ferrari', 
  onCarChange,
  size = 60 
}) => {
  const [currentCar, setCurrentCar] = useState(selectedCar);

  const handleCarChange = (carId: string) => {
    setCurrentCar(carId);
    onCarChange?.(carId);
  };

  const selectedBrand = carBrands.find(brand => brand.id === currentCar) || carBrands[0];

  return (
    <div className="flex items-center gap-3">
      {/* 3D Car Display */}
      <div className="relative group">
        <div className="relative">
          <Car3DModel 
            brand={currentCar} 
            size={size} 
            color={selectedBrand.color}
          />
          {/* Glow effect */}
          <div 
            className="absolute inset-0 rounded-lg opacity-30 blur-sm group-hover:opacity-50 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle, ${selectedBrand.color}40 0%, transparent 70%)`
            }}
          />
        </div>
        
        {/* Brand indicator */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
          <span className="text-xs">{selectedBrand.emoji}</span>
        </div>
      </div>

      {/* Car Selection */}
      <div className="flex flex-col gap-1">
        <Select value={currentCar} onValueChange={handleCarChange}>
          <SelectTrigger className="w-32 h-8 text-xs bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-accent/30 hover:border-accent/50 transition-all duration-200">
            <SelectValue>
              <div className="flex items-center gap-1.5">
                <span>{selectedBrand.emoji}</span>
                <span className="truncate font-medium">{selectedBrand.name}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-slate-800/95 border-slate-600 backdrop-blur-xl z-50">
            {carBrands.map((brand) => (
              <SelectItem 
                key={brand.id} 
                value={brand.id} 
                className="text-foreground hover:bg-slate-700/50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>{brand.emoji}</span>
                  <span className="font-medium">{brand.name}</span>
                  <div 
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: brand.color }}
                  />
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Car info */}
        <div className="flex items-center gap-1 text-xs">
          <Car className="w-3 h-3 text-accent/60" />
          <span className="text-accent/80 font-medium">超跑</span>
          <Sparkles className="w-3 h-3 text-accent/60" />
        </div>
      </div>
    </div>
  );
};

export default CarSelector;