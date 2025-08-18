import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LuxuryWatch3DProps {
  brand: string;
  time: string;
}

const LuxuryWatch3D: React.FC<LuxuryWatch3DProps> = ({ brand, time }) => {
  // Calculate rotation angles for watch hands based on current time
  const { hourAngle, minuteAngle, secondAngle } = useMemo(() => {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    return {
      hourAngle: (hours * 30) + (minutes * 0.5), // 30 degrees per hour + minute adjustment
      minuteAngle: minutes * 6, // 6 degrees per minute
      secondAngle: seconds * 6, // 6 degrees per second
    };
  }, [time]);

  const WatchFace = () => {
    switch (brand) {
      case 'rolex':
        return <RolexWatch hourAngle={hourAngle} minuteAngle={minuteAngle} secondAngle={secondAngle} />;
      case 'richard-mille':
        return <RichardMilleWatch hourAngle={hourAngle} minuteAngle={minuteAngle} secondAngle={secondAngle} />;
      case 'audemars-piguet':
        return <APWatch hourAngle={hourAngle} minuteAngle={minuteAngle} secondAngle={secondAngle} />;
      case 'patek-philippe':
        return <PatekPhilippeWatch hourAngle={hourAngle} minuteAngle={minuteAngle} secondAngle={secondAngle} />;
      default:
        return <RolexWatch hourAngle={hourAngle} minuteAngle={minuteAngle} secondAngle={secondAngle} />;
    }
  };

  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, 5]} intensity={0.4} />
        <pointLight position={[0, 0, 10]} intensity={0.3} />
        
        <WatchFace />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate={false}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
      </Canvas>
    </div>
  );
};

// Rolex Submariner/GMT Master inspired design
const RolexWatch: React.FC<{ hourAngle: number; minuteAngle: number; secondAngle: number }> = ({ 
  hourAngle, minuteAngle, secondAngle 
}) => (
  <group>
    {/* Watch case - steel finish */}
    <mesh>
      <cylinderGeometry args={[1.2, 1.2, 0.3, 32]} />
      <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
    </mesh>
    
    {/* Bezel - iconic Rolex rotating bezel */}
    <mesh position={[0, 0.16, 0]}>
      <cylinderGeometry args={[1.25, 1.25, 0.1, 40]} />
      <meshStandardMaterial color="#2C3E50" metalness={0.8} roughness={0.2} />
    </mesh>
    
    {/* Watch face - classic black dial */}
    <mesh position={[0, 0.16, 0]}>
      <cylinderGeometry args={[1.1, 1.1, 0.02, 32]} />
      <meshStandardMaterial color="#000000" metalness={0.1} roughness={0.9} />
    </mesh>
    
    {/* Hour markers - Rolex style indices */}
    {[...Array(12)].map((_, i) => {
      const angle = (i * Math.PI) / 6;
      const isMainHour = i % 3 === 0;
      return (
        <mesh key={i} position={[Math.sin(angle) * 0.9, 0.17, Math.cos(angle) * 0.9]}>
          <boxGeometry args={isMainHour ? [0.15, 0.05, 0.3] : [0.08, 0.03, 0.15]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      );
    })}
    
    {/* Hour hand - Mercedes style */}
    <mesh rotation={[0, 0, -hourAngle * (Math.PI / 180)]} position={[0, 0.17, 0]}>
      <boxGeometry args={[0.08, 0.5, 0.02]} />
      <meshStandardMaterial color="#FFFFFF" />
    </mesh>
    
    {/* Minute hand - sword style */}
    <mesh rotation={[0, 0, -minuteAngle * (Math.PI / 180)]} position={[0, 0.17, 0]}>
      <boxGeometry args={[0.05, 0.8, 0.02]} />
      <meshStandardMaterial color="#FFFFFF" />
    </mesh>
    
    {/* Second hand - red sweep */}
    <mesh rotation={[0, 0, -secondAngle * (Math.PI / 180)]} position={[0, 0.18, 0]}>
      <boxGeometry args={[0.02, 0.9, 0.01]} />
      <meshStandardMaterial color="#FF0000" />
    </mesh>
    
    {/* Crown */}
    <mesh position={[1.3, 0, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
      <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
    </mesh>
  </group>
);

// Richard Mille inspired tonneau case design
const RichardMilleWatch: React.FC<{ hourAngle: number; minuteAngle: number; secondAngle: number }> = ({ 
  hourAngle, minuteAngle, secondAngle 
}) => (
  <group>
    {/* Tonneau case - signature RM barrel shape */}
    <mesh>
      <boxGeometry args={[2.2, 2.8, 0.4]} />
      <meshStandardMaterial color="#1A1A1A" metalness={0.7} roughness={0.3} />
    </mesh>
    
    {/* Case screws - RM signature */}
    {[...Array(8)].map((_, i) => {
      const angle = (i * Math.PI) / 4;
      return (
        <mesh key={i} position={[Math.sin(angle) * 1.15, Math.cos(angle) * 1.45, 0.21]}>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 6]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      );
    })}
    
    {/* Skeletonized dial */}
    <mesh position={[0, 0, 0.21]}>
      <boxGeometry args={[1.8, 2.4, 0.02]} />
      <meshStandardMaterial color="#2C3E50" transparent opacity={0.8} />
    </mesh>
    
    {/* Hour markers - minimal RM style */}
    {[...Array(12)].map((_, i) => {
      const angle = (i * Math.PI) / 6;
      return (
        <mesh key={i} position={[Math.sin(angle) * 0.85, Math.cos(angle) * 1.1, 0.22]}>
          <boxGeometry args={[0.03, 0.1, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" />
        </mesh>
      );
    })}
    
    {/* Hour hand - RM skeletonized */}
    <mesh rotation={[0, 0, -hourAngle * (Math.PI / 180)]} position={[0, 0, 0.22]}>
      <boxGeometry args={[0.06, 0.6, 0.01]} />
      <meshStandardMaterial color="#FF6B35" />
    </mesh>
    
    {/* Minute hand */}
    <mesh rotation={[0, 0, -minuteAngle * (Math.PI / 180)]} position={[0, 0, 0.22]}>
      <boxGeometry args={[0.04, 0.9, 0.01]} />
      <meshStandardMaterial color="#FF6B35" />
    </mesh>
    
    {/* Second hand */}
    <mesh rotation={[0, 0, -secondAngle * (Math.PI / 180)]} position={[0, 0, 0.23]}>
      <boxGeometry args={[0.02, 1.0, 0.005]} />
      <meshStandardMaterial color="#FFFFFF" />
    </mesh>
  </group>
);

// Audemars Piguet Royal Oak inspired design
const APWatch: React.FC<{ hourAngle: number; minuteAngle: number; secondAngle: number }> = ({ 
  hourAngle, minuteAngle, secondAngle 
}) => (
  <group>
    {/* Octagonal case - Royal Oak signature */}
    <mesh>
      <cylinderGeometry args={[1.3, 1.3, 0.3, 8]} />
      <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
    </mesh>
    
    {/* Octagonal bezel with screws */}
    <mesh position={[0, 0.16, 0]}>
      <cylinderGeometry args={[1.35, 1.35, 0.08, 8]} />
      <meshStandardMaterial color="#2C3E50" metalness={0.8} roughness={0.2} />
    </mesh>
    
    {/* Bezel screws - AP signature */}
    {[...Array(8)].map((_, i) => {
      const angle = (i * Math.PI) / 4;
      return (
        <mesh key={i} position={[Math.sin(angle) * 1.2, 0.16, Math.cos(angle) * 1.2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 6]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </mesh>
      );
    })}
    
    {/* Tapisserie dial - AP signature */}
    <mesh position={[0, 0.16, 0]}>
      <cylinderGeometry args={[1.2, 1.2, 0.02, 32]} />
      <meshStandardMaterial color="#1E3A8A" metalness={0.3} roughness={0.7} />
    </mesh>
    
    {/* Hour markers - AP baton style */}
    {[...Array(12)].map((_, i) => {
      const angle = (i * Math.PI) / 6;
      const isMainHour = i % 3 === 0;
      return (
        <mesh key={i} position={[Math.sin(angle) * 1.0, 0.17, Math.cos(angle) * 1.0]}>
          <boxGeometry args={isMainHour ? [0.12, 0.04, 0.25] : [0.08, 0.03, 0.15]} />
          <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
        </mesh>
      );
    })}
    
    {/* Hour hand */}
    <mesh rotation={[0, 0, -hourAngle * (Math.PI / 180)]} position={[0, 0.17, 0]}>
      <boxGeometry args={[0.08, 0.6, 0.02]} />
      <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
    </mesh>
    
    {/* Minute hand */}
    <mesh rotation={[0, 0, -minuteAngle * (Math.PI / 180)]} position={[0, 0.17, 0]}>
      <boxGeometry args={[0.05, 0.9, 0.02]} />
      <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
    </mesh>
    
    {/* Second hand */}
    <mesh rotation={[0, 0, -secondAngle * (Math.PI / 180)]} position={[0, 0.18, 0]}>
      <boxGeometry args={[0.02, 1.0, 0.01]} />
      <meshStandardMaterial color="#FF0000" />
    </mesh>
  </group>
);

// Patek Philippe Calatrava inspired design
const PatekPhilippeWatch: React.FC<{ hourAngle: number; minuteAngle: number; secondAngle: number }> = ({ 
  hourAngle, minuteAngle, secondAngle 
}) => (
  <group>
    {/* Classic round case - Calatrava style */}
    <mesh>
      <cylinderGeometry args={[1.1, 1.1, 0.25, 64]} />
      <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.05} />
    </mesh>
    
    {/* Thin bezel - elegant PP style */}
    <mesh position={[0, 0.13, 0]}>
      <cylinderGeometry args={[1.12, 1.12, 0.03, 64]} />
      <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.05} />
    </mesh>
    
    {/* White enamel dial */}
    <mesh position={[0, 0.13, 0]}>
      <cylinderGeometry args={[1.0, 1.0, 0.01, 64]} />
      <meshStandardMaterial color="#FEFEFE" metalness={0.0} roughness={0.9} />
    </mesh>
    
    {/* Roman numerals - PP classical style */}
    {['XII', 'III', 'VI', 'IX'].map((numeral, i) => {
      const angle = (i * Math.PI) / 2;
      return (
        <mesh key={i} position={[Math.sin(angle) * 0.8, 0.14, Math.cos(angle) * 0.8]}>
          <boxGeometry args={[0.1, 0.03, 0.2]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      );
    })}
    
    {/* Minute track */}
    <mesh position={[0, 0.14, 0]}>
      <ringGeometry args={[0.85, 0.87, 0, Math.PI * 2, 60]} />
      <meshStandardMaterial color="#000000" />
    </mesh>
    
    {/* Elegant hands - PP style */}
    <mesh rotation={[0, 0, -hourAngle * (Math.PI / 180)]} position={[0, 0.14, 0]}>
      <boxGeometry args={[0.04, 0.5, 0.01]} />
      <meshStandardMaterial color="#000000" />
    </mesh>
    
    <mesh rotation={[0, 0, -minuteAngle * (Math.PI / 180)]} position={[0, 0.14, 0]}>
      <boxGeometry args={[0.02, 0.75, 0.01]} />
      <meshStandardMaterial color="#000000" />
    </mesh>
    
    <mesh rotation={[0, 0, -secondAngle * (Math.PI / 180)]} position={[0, 0.15, 0]}>
      <boxGeometry args={[0.01, 0.8, 0.005]} />
      <meshStandardMaterial color="#FF0000" />
    </mesh>
    
    {/* Crown - elegant PP style */}
    <mesh position={[1.2, 0, 0]}>
      <cylinderGeometry args={[0.06, 0.06, 0.15, 16]} />
      <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.05} />
    </mesh>
  </group>
);

const watchBrands = [
  { 
    id: 'rolex', 
    name: 'Rolex', 
    model: 'Submariner',
    description: 'Classic dive watch with rotating bezel'
  },
  { 
    id: 'richard-mille', 
    name: 'Richard Mille', 
    model: 'RM 11-03',
    description: 'Tonneau case with skeletonized movement'
  },
  { 
    id: 'audemars-piguet', 
    name: 'Audemars Piguet', 
    model: 'Royal Oak',
    description: 'Iconic octagonal bezel with tapisserie dial'
  },
  { 
    id: 'patek-philippe', 
    name: 'Patek Philippe', 
    model: 'Calatrava',
    description: 'Timeless elegance with Roman numerals'
  },
];

export const LuxuryWatchTimer: React.FC = () => {
  const [selectedWatch, setSelectedWatch] = useState(watchBrands[0]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-400 border-amber-500/20 backdrop-blur-sm hover:from-amber-500/20 hover:to-yellow-500/20 transition-all duration-300 gap-2"
          >
            <LuxuryWatch3D brand={selectedWatch.id} time={currentTime} />
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="text-xs font-medium">{selectedWatch.name}</span>
              </div>
              <span className="text-xs font-mono">{currentTime}</span>
            </div>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="center" 
          className="w-80 bg-slate-900/95 backdrop-blur-xl border-slate-700/50"
        >
          {watchBrands.map((watch) => (
            <DropdownMenuItem
              key={watch.id}
              onClick={() => setSelectedWatch(watch)}
              className="flex items-center gap-3 p-4 hover:bg-slate-800/50 cursor-pointer"
            >
              <LuxuryWatch3D brand={watch.id} time={currentTime} />
              <div className="flex-1">
                <div className="font-semibold text-amber-400">{watch.name}</div>
                <div className="text-sm text-slate-300">{watch.model}</div>
                <div className="text-xs text-slate-500 mt-1">{watch.description}</div>
              </div>
              {selectedWatch.id === watch.id && (
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Active
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-md -z-10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};