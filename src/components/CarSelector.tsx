import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RealisticCar3DModel } from './RealisticCar3DModel';
import { Car, Sparkles } from 'lucide-react';

// Import car logos
import ferrariLogo from '@/assets/car-logos/ferrari-logo.png';
import lamborghiniLogo from '@/assets/car-logos/lamborghini-logo.png';
import porscheLogo from '@/assets/car-logos/porsche-logo.png';
import mclarenLogo from '@/assets/car-logos/mclaren-logo.png';
import bugattiLogo from '@/assets/car-logos/bugatti-logo.png';
import astonMartinLogo from '@/assets/car-logos/aston-martin-logo.png';

interface CarBrand {
  id: string;
  name: string;
  color: string;
  emoji: string;
  logo: string;
}

const carBrands: CarBrand[] = [
  { id: 'ferrari', name: '法拉利', color: '#DC143C', emoji: '🏎️', logo: ferrariLogo },
  { id: 'lamborghini', name: '兰博基尼', color: '#FFD700', emoji: '🚗', logo: lamborghiniLogo },
  { id: 'porsche', name: '保时捷', color: '#C0C0C0', emoji: '🏁', logo: porscheLogo },
  { id: 'mclaren', name: '迈凯伦', color: '#FF6600', emoji: '🚀', logo: mclarenLogo },
  { id: 'bugatti', name: '布加迪', color: '#000080', emoji: '💎', logo: bugattiLogo },
  { id: 'aston_martin', name: '阿斯顿马丁', color: '#006400', emoji: '🎯', logo: astonMartinLogo },
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
    <div className="flex flex-col items-center gap-2">
      {/* Car Selection and Name - Top */}
      <div className="flex flex-col items-center gap-1">
        <Select value={currentCar} onValueChange={handleCarChange}>
          <SelectTrigger className="w-36 h-8 text-xs bg-gradient-to-r from-slate-700/50 to-slate-600/50 border-accent/30 hover:border-accent/50 transition-all duration-200">
            <SelectValue>
              <div className="flex items-center gap-1.5 justify-center">
                <img 
                  src={selectedBrand.logo} 
                  alt={selectedBrand.name}
                  className="w-4 h-4 object-contain"
                />
                <span className="truncate font-medium text-center">{selectedBrand.name}</span>
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
                  <img 
                    src={brand.logo} 
                    alt={brand.name}
                    className="w-5 h-5 object-contain"
                  />
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

      {/* 3D Car Display - Bottom */}
      <div className="relative group">
        <div className="relative">
          <RealisticCar3DModel 
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
        
        {/* Brand indicator with real logo */}
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 backdrop-blur-sm">
          <img 
            src={selectedBrand.logo} 
            alt={selectedBrand.name}
            className="w-6 h-6 object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default CarSelector;