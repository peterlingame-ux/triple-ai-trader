import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';

// Custom RoundedBox component using Box with rounded corners effect
const RoundedBox = ({ args, radius, children, ...props }: any) => (
  <Box args={args} {...props}>
    {children}
  </Box>
);

interface RealisticCar3DModelProps {
  brand: string;
  size?: number;
  color?: string;
}

function RealisticCarMesh({ brand, color = '#ff6b6b' }: { brand: string; color: string }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2 + state.clock.elapsedTime * 0.15;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  const getRealisticCarGeometry = () => {
    switch (brand.toLowerCase()) {
      case 'ferrari':
        return (
          <group ref={meshRef}>
            {/* Main Body - Ferrari aerodynamic shape */}
            <RoundedBox args={[2.4, 0.3, 0.9]} radius={0.05} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.95} roughness={0.05} />
            </RoundedBox>
            
            {/* Hood */}
            <RoundedBox args={[0.8, 0.1, 0.7]} radius={0.02} position={[0.8, 0.2, 0]}>
              <meshStandardMaterial color={color} metalness={0.95} roughness={0.05} />
            </RoundedBox>
            
            {/* Windshield */}
            <Box args={[0.6, 0.4, 0.65]} position={[0.1, 0.35, 0]} rotation={[0, 0, 0.1]}>
              <meshPhysicalMaterial color="#87ceeb" transparent opacity={0.3} roughness={0} metalness={0} transmission={0.9} />
            </Box>
            
            {/* Side Windows */}
            <Box args={[0.3, 0.25, 0.05]} position={[0.2, 0.25, 0.45]} rotation={[0, 0, 0.1]}>
              <meshPhysicalMaterial color="#87ceeb" transparent opacity={0.3} roughness={0} metalness={0} transmission={0.9} />
            </Box>
            <Box args={[0.3, 0.25, 0.05]} position={[0.2, 0.25, -0.45]} rotation={[0, 0, 0.1]}>
              <meshPhysicalMaterial color="#87ceeb" transparent opacity={0.3} roughness={0} metalness={0} transmission={0.9} />
            </Box>
            
            {/* Front Nose */}
            <RoundedBox args={[0.3, 0.2, 0.6]} radius={0.05} position={[1.2, -0.05, 0]}>
              <meshStandardMaterial color={color} metalness={0.95} roughness={0.05} />
            </RoundedBox>
            
            {/* Rear Spoiler */}
            <RoundedBox args={[0.4, 0.06, 0.8]} radius={0.01} position={[-1.0, 0.4, 0]} rotation={[0, 0, -0.05]}>
              <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
            </RoundedBox>
            
            {/* Side Air Intakes */}
            <RoundedBox args={[0.3, 0.12, 0.15]} radius={0.02} position={[0.4, 0.05, 0.5]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
            </RoundedBox>
            <RoundedBox args={[0.3, 0.12, 0.15]} radius={0.02} position={[0.4, 0.05, -0.5]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
            </RoundedBox>
            
            {/* Wheels with detailed rims */}
            {[
              [0.7, -0.22, 0.52],
              [0.7, -0.22, -0.52],
              [-0.7, -0.22, 0.52],
              [-0.7, -0.22, -0.52]
            ].map((position, index) => (
              <group key={index} position={position as [number, number, number]}>
                {/* Tire */}
                <Cylinder args={[0.2, 0.2, 0.15]} rotation={[0, 0, Math.PI / 2]}>
                  <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
                </Cylinder>
                {/* Rim */}
                <Cylinder args={[0.17, 0.17, 0.08]} rotation={[0, 0, Math.PI / 2]} position={[0.04, 0, 0]}>
                  <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
                </Cylinder>
                {/* Brake Disc */}
                <Cylinder args={[0.12, 0.12, 0.02]} rotation={[0, 0, Math.PI / 2]} position={[0.06, 0, 0]}>
                  <meshStandardMaterial color="#ff4500" metalness={0.8} roughness={0.2} />
                </Cylinder>
              </group>
            ))}
            
            {/* Headlights */}
            <Sphere args={[0.08]} position={[1.15, 0.05, 0.35]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
            </Sphere>
            <Sphere args={[0.08]} position={[1.15, 0.05, -0.35]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
            </Sphere>
            
            {/* Taillights */}
            <RoundedBox args={[0.1, 0.06, 0.15]} radius={0.01} position={[-1.1, 0.05, 0.3]}>
              <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
            </RoundedBox>
            <RoundedBox args={[0.1, 0.06, 0.15]} radius={0.01} position={[-1.1, 0.05, -0.3]}>
              <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.3} />
            </RoundedBox>
            
            {/* Door handles */}
            <Cylinder args={[0.02, 0.02, 0.08]} rotation={[Math.PI / 2, 0, 0]} position={[0.2, 0.1, 0.46]}>
              <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
            </Cylinder>
            <Cylinder args={[0.02, 0.02, 0.08]} rotation={[Math.PI / 2, 0, 0]} position={[0.2, 0.1, -0.46]}>
              <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
            </Cylinder>
          </group>
        );
      case 'lamborghini':
        return (
          <group ref={meshRef}>
            {/* Main Body - Angular Lamborghini design */}
            <Box args={[2.2, 0.28, 0.95]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.98} roughness={0.02} />
            </Box>
            
            {/* Angular Hood */}
            <Box args={[0.7, 0.08, 0.6]} position={[0.75, 0.18, 0]} rotation={[0, 0, 0.15]}>
              <meshStandardMaterial color={color} metalness={0.98} roughness={0.02} />
            </Box>
            
            {/* Windshield - Angular */}
            <Box args={[0.5, 0.35, 0.6]} position={[0.05, 0.32, 0]} rotation={[0, 0, 0.2]}>
              <meshPhysicalMaterial color="#2a2a2a" transparent opacity={0.2} roughness={0} metalness={0} transmission={0.95} />
            </Box>
            
            {/* Aggressive Front Splitter */}
            <Box args={[0.4, 0.04, 1.1]} position={[1.1, -0.16, 0]}>
              <meshStandardMaterial color={color} metalness={0.98} roughness={0.02} />
            </Box>
            
            {/* Rear Wing - More aggressive */}
            <Box args={[0.5, 0.05, 1.2]} position={[-0.9, 0.5, 0]} rotation={[0, 0, -0.1]}>
              <meshStandardMaterial color="#000000" metalness={0.95} roughness={0.05} />
            </Box>
            
            {/* Side Vents */}
            <Box args={[0.4, 0.15, 0.2]} position={[0.3, 0.08, 0.55]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            <Box args={[0.4, 0.15, 0.2]} position={[0.3, 0.08, -0.55]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
            </Box>
            
            {/* Performance Wheels */}
            {[
              [0.7, -0.18, 0.58],
              [0.7, -0.18, -0.58],
              [-0.7, -0.18, 0.58],
              [-0.7, -0.18, -0.58]
            ].map((position, index) => (
              <group key={index} position={position as [number, number, number]}>
                <Cylinder args={[0.22, 0.22, 0.18]} rotation={[0, 0, Math.PI / 2]}>
                  <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
                </Cylinder>
                <Cylinder args={[0.19, 0.19, 0.09]} rotation={[0, 0, Math.PI / 2]} position={[0.045, 0, 0]}>
                  <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.05} />
                </Cylinder>
              </group>
            ))}
            
            {/* LED Headlights */}
            <Box args={[0.15, 0.04, 0.25]} position={[1.05, 0.1, 0.35]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
            </Box>
            <Box args={[0.15, 0.04, 0.25]} position={[1.05, 0.1, -0.35]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.6} />
            </Box>
          </group>
        );
      case 'porsche':
        return (
          <group ref={meshRef}>
            {/* Main Body - Porsche 911 curves */}
            <Sphere args={[1.1, 32, 16]} scale={[1.9, 0.32, 0.8]} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.75} roughness={0.15} />
            </Sphere>
            
            {/* Front Section */}
            <Sphere args={[0.4, 16, 8]} position={[0.85, 0, 0]} scale={[1.4, 0.6, 0.9]}>
              <meshStandardMaterial color={color} metalness={0.75} roughness={0.15} />
            </Sphere>
            
            {/* Windshield */}
            <Sphere args={[0.35, 16, 8]} position={[0.15, 0.28, 0]} scale={[1.1, 0.7, 0.85]}>
              <meshPhysicalMaterial color="#87ceeb" transparent opacity={0.25} roughness={0} metalness={0} transmission={0.9} />
            </Sphere>
            
            {/* Rear Engine Deck */}
            <RoundedBox args={[0.8, 0.15, 0.65]} radius={0.05} position={[-0.6, 0.08, 0]}>
              <meshStandardMaterial color={color} metalness={0.75} roughness={0.15} />
            </RoundedBox>
            
            {/* Classic Porsche Wheels */}
            {[
              [0.55, -0.22, 0.42],
              [0.55, -0.22, -0.42],
              [-0.55, -0.22, 0.42],
              [-0.55, -0.22, -0.42]
            ].map((position, index) => (
              <group key={index} position={position as [number, number, number]}>
                <Cylinder args={[0.18, 0.18, 0.12]} rotation={[0, 0, Math.PI / 2]}>
                  <meshStandardMaterial color="#2a2a2a" roughness={0.7} />
                </Cylinder>
                <Cylinder args={[0.15, 0.15, 0.06]} rotation={[0, 0, Math.PI / 2]} position={[0.03, 0, 0]}>
                  <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
                </Cylinder>
                {/* Porsche crest on center */}
                <Cylinder args={[0.05, 0.05, 0.02]} rotation={[0, 0, Math.PI / 2]} position={[0.04, 0, 0]}>
                  <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.2} />
                </Cylinder>
              </group>
            ))}
            
            {/* Round Headlights */}
            <Sphere args={[0.09]} position={[0.85, 0.08, 0.28]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
            </Sphere>
            <Sphere args={[0.09]} position={[0.85, 0.08, -0.28]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
            </Sphere>
          </group>
        );
      case 'mclaren':
        return (
          <group ref={meshRef}>
            {/* Main Body - McLaren aerodynamic */}
            <RoundedBox args={[2.5, 0.25, 0.8]} radius={0.03} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.98} roughness={0.02} />
            </RoundedBox>
            
            {/* Aerodynamic Front */}
            <RoundedBox args={[0.4, 0.08, 0.9]} radius={0.02} position={[1.25, -0.12, 0]}>
              <meshStandardMaterial color={color} metalness={0.98} roughness={0.02} />
            </RoundedBox>
            
            {/* Cockpit */}
            <RoundedBox args={[0.7, 0.18, 0.55]} radius={0.05} position={[0.1, 0.22, 0]} rotation={[0, 0, 0.02]}>
              <meshPhysicalMaterial color="#1a1a1a" transparent opacity={0.15} roughness={0} metalness={0} transmission={0.95} />
            </RoundedBox>
            
            {/* Active Aero Wing */}
            <RoundedBox args={[0.6, 0.06, 0.85]} radius={0.01} position={[-1.0, 0.6, 0]} rotation={[0, 0, -0.05]}>
              <meshStandardMaterial color="#ff6600" metalness={0.9} roughness={0.1} />
            </RoundedBox>
            
            {/* Side Vents */}
            <RoundedBox args={[0.35, 0.1, 0.12]} radius={0.02} position={[0.4, 0.06, 0.48]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.25} />
            </RoundedBox>
            <RoundedBox args={[0.35, 0.1, 0.12]} radius={0.02} position={[0.4, 0.06, -0.48]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.25} />
            </RoundedBox>
            
            {/* Performance Wheels */}
            {[
              [0.8, -0.16, 0.48],
              [0.8, -0.16, -0.48],
              [-0.8, -0.16, 0.48],
              [-0.8, -0.16, -0.48]
            ].map((position, index) => (
              <group key={index} position={position as [number, number, number]}>
                <Cylinder args={[0.21, 0.21, 0.14]} rotation={[0, 0, Math.PI / 2]}>
                  <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
                </Cylinder>
                <Cylinder args={[0.18, 0.18, 0.07]} rotation={[0, 0, Math.PI / 2]} position={[0.035, 0, 0]}>
                  <meshStandardMaterial color="#ff6600" metalness={0.95} roughness={0.05} />
                </Cylinder>
              </group>
            ))}
            
            {/* LED Strip Lights */}
            <RoundedBox args={[0.25, 0.02, 0.3]} radius={0.01} position={[1.15, 0.08, 0.28]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.7} />
            </RoundedBox>
            <RoundedBox args={[0.25, 0.02, 0.3]} radius={0.01} position={[1.15, 0.08, -0.28]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.7} />
            </RoundedBox>
          </group>
        );
      case 'bugatti':
        return (
          <group ref={meshRef}>
            {/* Main Body - Elegant curves */}
            <RoundedBox args={[2.3, 0.35, 0.92]} radius={0.08} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.85} roughness={0.1} />
            </RoundedBox>
            
            {/* Hood */}
            <RoundedBox args={[0.8, 0.12, 0.7]} radius={0.05} position={[0.75, 0.24, 0]}>
              <meshStandardMaterial color={color} metalness={0.85} roughness={0.1} />
            </RoundedBox>
            
            {/* Distinctive Grille */}
            <RoundedBox args={[0.25, 0.25, 0.5]} radius={0.05} position={[1.15, 0, 0]}>
              <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.05} />
            </RoundedBox>
            
            {/* Luxury Cockpit */}
            <Sphere args={[0.4, 16, 8]} position={[0.05, 0.32, 0]} scale={[1.4, 0.65, 0.75]}>
              <meshPhysicalMaterial color="#0a0a0a" transparent opacity={0.2} roughness={0} metalness={0} transmission={0.9} />
            </Sphere>
            
            {/* Luxury Wheels */}
            {[
              [0.65, -0.25, 0.48],
              [0.65, -0.25, -0.48],
              [-0.65, -0.25, 0.48],
              [-0.65, -0.25, -0.48]
            ].map((position, index) => (
              <group key={index} position={position as [number, number, number]}>
                <Cylinder args={[0.19, 0.19, 0.13]} rotation={[0, 0, Math.PI / 2]}>
                  <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
                </Cylinder>
                <Cylinder args={[0.16, 0.16, 0.06]} rotation={[0, 0, Math.PI / 2]} position={[0.035, 0, 0]}>
                  <meshStandardMaterial color="#e8e8e8" metalness={0.95} roughness={0.03} />
                </Cylinder>
                {/* Bugatti logo on center */}
                <RoundedBox args={[0.08, 0.06, 0.01]} radius={0.01} rotation={[0, 0, Math.PI / 2]} position={[0.04, 0, 0]}>
                  <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} />
                </RoundedBox>
              </group>
            ))}
            
            {/* Elegant Headlights */}
            <Sphere args={[0.1]} position={[1.0, 0.12, 0.3]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.35} />
            </Sphere>
            <Sphere args={[0.1]} position={[1.0, 0.12, -0.3]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.35} />
            </Sphere>
          </group>
        );
      case 'aston_martin':
        return (
          <group ref={meshRef}>
            {/* Main Body - British elegance */}
            <RoundedBox args={[2.1, 0.3, 0.85]} radius={0.06} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.88} roughness={0.08} />
            </RoundedBox>
            
            {/* Hood */}
            <RoundedBox args={[0.7, 0.1, 0.65]} radius={0.04} position={[0.7, 0.2, 0]}>
              <meshStandardMaterial color={color} metalness={0.88} roughness={0.08} />
            </RoundedBox>
            
            {/* Distinctive Grille */}
            <RoundedBox args={[0.2, 0.2, 0.45]} radius={0.05} position={[1.05, 0, 0]}>
              <meshStandardMaterial color="#2a2a2a" metalness={0.95} roughness={0.05} />
            </RoundedBox>
            
            {/* Elegant Cockpit */}
            <Sphere args={[0.35, 16, 8]} position={[0.05, 0.28, 0]} scale={[1.25, 0.7, 0.8]}>
              <meshPhysicalMaterial color="#1a1a1a" transparent opacity={0.25} roughness={0} metalness={0} transmission={0.85} />
            </Sphere>
            
            {/* Side Vents */}
            <RoundedBox args={[0.25, 0.06, 0.1]} radius={0.02} position={[0.45, 0.08, 0.48]}>
              <meshStandardMaterial color="#333333" metalness={0.85} roughness={0.2} />
            </RoundedBox>
            <RoundedBox args={[0.25, 0.06, 0.1]} radius={0.02} position={[0.45, 0.08, -0.48]}>
              <meshStandardMaterial color="#333333" metalness={0.85} roughness={0.2} />
            </RoundedBox>
            
            {/* Elegant Wheels */}
            {[
              [0.6, -0.23, 0.44],
              [0.6, -0.23, -0.44],
              [-0.6, -0.23, 0.44],
              [-0.6, -0.23, -0.44]
            ].map((position, index) => (
              <group key={index} position={position as [number, number, number]}>
                <Cylinder args={[0.17, 0.17, 0.11]} rotation={[0, 0, Math.PI / 2]}>
                  <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
                </Cylinder>
                <Cylinder args={[0.14, 0.14, 0.05]} rotation={[0, 0, Math.PI / 2]} position={[0.03, 0, 0]}>
                  <meshStandardMaterial color="#b8b8b8" metalness={0.92} roughness={0.08} />
                </Cylinder>
              </group>
            ))}
            
            {/* Distinctive Headlights */}
            <Sphere args={[0.08]} position={[0.95, 0.1, 0.28]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
            </Sphere>
            <Sphere args={[0.08]} position={[0.95, 0.1, -0.28]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} />
            </Sphere>
          </group>
        );
      default:
        return (
          <group ref={meshRef}>
            {/* Enhanced generic sports car */}
            <RoundedBox args={[2.0, 0.32, 0.75]} radius={0.05} position={[0, 0, 0]}>
              <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
            </RoundedBox>
            <RoundedBox args={[0.6, 0.18, 0.55]} radius={0.03} position={[0.1, 0.25, 0]}>
              <meshPhysicalMaterial color="#1a1a1a" transparent opacity={0.3} roughness={0} metalness={0} transmission={0.8} />
            </RoundedBox>
            {[
              [0.5, -0.25, 0.4],
              [0.5, -0.25, -0.4],
              [-0.5, -0.25, 0.4],
              [-0.5, -0.25, -0.4]
            ].map((position, index) => (
              <Cylinder key={index} args={[0.16, 0.16, 0.1]} position={position as [number, number, number]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial color="#222" roughness={0.8} />
              </Cylinder>
            ))}
          </group>
        );
    }
  };

  return getRealisticCarGeometry();
}

export const RealisticCar3DModel: React.FC<RealisticCar3DModelProps> = ({ 
  brand, 
  size = 80, 
  color = '#ff6b6b' 
}) => {
  return (
    <div style={{ width: size, height: size }}>
      <Canvas
        camera={{ position: [2.5, 1.5, 2.5], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} castShadow />
        <directionalLight position={[-5, 5, 5]} intensity={0.6} />
        <pointLight position={[0, 3, 0]} intensity={0.8} color="#ffffff" />
        <spotLight position={[5, 5, 0]} intensity={0.5} angle={0.3} penumbra={0.2} />
        
        <RealisticCarMesh brand={brand} color={color} />
      </Canvas>
    </div>
  );
};

export default RealisticCar3DModel;